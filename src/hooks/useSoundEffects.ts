import { useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Sound prompts for different actions
const SOUND_PROMPTS = {
  whoosh: "magical mystical whoosh transition sound effect, ethereal sweep, short 1 second",
  ding: "soft magical chime ding, gentle bell notification, sparkle sound, very short",
  start: "magical door opening sound, mystical portal activation, deep resonant gong with sparkling chimes, enchanting beginning",
  reveal: "epic magical explosion reveal, triumphant orchestral burst, golden fireworks and sparkles, dramatic unveiling fanfare, cinematic climax moment, powerful and majestic, 4 seconds",
  ambient: "mysterious ambient background music, ethereal dreamy atmosphere, soft golden magical tones, looping",
};

const SOUND_DURATIONS: Record<string, number> = {
  whoosh: 2,
  ding: 2,
  start: 3,
  reveal: 4,
  ambient: 15,
};

type SoundType = keyof typeof SOUND_PROMPTS;

// In-memory cache for current session
const memoryCache: Record<string, string> = {};
// Pending promises to wait for generation
const pendingOperations: Record<string, Promise<string | null>> = {};

export const useSoundEffects = () => {
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const preloadedRef = useRef(false);

  // Get public URL for a sound file
  const getStorageUrl = useCallback((type: SoundType): string => {
    const { data } = supabase.storage
      .from('sounds')
      .getPublicUrl(`${type}.mp3`);
    return data.publicUrl;
  }, []);

  // Check if sound exists in storage
  const checkStorageExists = useCallback(async (type: SoundType): Promise<boolean> => {
    try {
      const { data, error } = await supabase.storage
        .from('sounds')
        .list('', { search: `${type}.mp3` });
      
      if (error) return false;
      return data.some(file => file.name === `${type}.mp3`);
    } catch {
      return false;
    }
  }, []);

  // Generate sound from ElevenLabs
  const generateFromApi = useCallback(async (type: SoundType): Promise<Blob | null> => {
    try {
      console.log(`Generating sound from API: ${type}`);
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/elevenlabs-sfx`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
          body: JSON.stringify({ 
            prompt: SOUND_PROMPTS[type], 
            duration: SOUND_DURATIONS[type]
          }),
        }
      );

      if (!response.ok) {
        console.error(`SFX request failed: ${response.status}`);
        return null;
      }

      return await response.blob();
    } catch (error) {
      console.error("Error generating sound:", error);
      return null;
    }
  }, []);

  // Upload sound to storage
  const uploadToStorage = useCallback(async (type: SoundType, blob: Blob): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from('sounds')
        .upload(`${type}.mp3`, blob, {
          contentType: 'audio/mpeg',
          upsert: true
        });

      if (error) {
        console.error('Upload error:', error);
        return false;
      }
      
      console.log(`Sound uploaded to storage: ${type}`);
      return true;
    } catch (error) {
      console.error('Upload error:', error);
      return false;
    }
  }, []);

  // Get or generate sound - checks storage first, generates if needed
  const getSound = useCallback(async (type: SoundType): Promise<string | null> => {
    const cacheKey = type;
    
    // Return from memory cache if available
    if (memoryCache[cacheKey]) {
      return memoryCache[cacheKey];
    }

    // If already fetching/generating, wait for that promise
    if (pendingOperations[cacheKey]) {
      return pendingOperations[cacheKey];
    }

    // Create new operation promise
    const operationPromise = (async () => {
      try {
        // Check if exists in storage
        const existsInStorage = await checkStorageExists(type);
        
        if (existsInStorage) {
          // Use storage URL directly
          const url = getStorageUrl(type);
          memoryCache[cacheKey] = url;
          console.log(`Sound loaded from storage: ${type}`);
          return url;
        }

        // Generate from API
        const audioBlob = await generateFromApi(type);
        if (!audioBlob) return null;

        // Upload to storage for future use
        await uploadToStorage(type, audioBlob);

        // Create blob URL for immediate playback
        const blobUrl = URL.createObjectURL(audioBlob);
        memoryCache[cacheKey] = blobUrl;
        
        return blobUrl;
      } catch (error) {
        console.error("Error getting sound:", error);
        return null;
      } finally {
        delete pendingOperations[cacheKey];
      }
    })();

    pendingOperations[cacheKey] = operationPromise;
    return operationPromise;
  }, [checkStorageExists, getStorageUrl, generateFromApi, uploadToStorage]);

  // Play a one-shot sound effect
  const playSound = useCallback(async (type: 'whoosh' | 'ding' | 'start' | 'reveal') => {
    try {
      const volumes: Record<string, number> = { whoosh: 0.5, ding: 0.6, start: 0.7, reveal: 0.8 };
      
      const audioUrl = await getSound(type);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.volume = volumes[type];
        console.log(`Playing sound: ${type}`);
        await audio.play();
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, [getSound]);

  // Play transition whoosh
  const playWhoosh = useCallback(() => {
    playSound('whoosh');
  }, [playSound]);

  // Play selection ding
  const playDing = useCallback(() => {
    playSound('ding');
  }, [playSound]);

  // Play start sound for beginning
  const playStart = useCallback(() => {
    playSound('start');
  }, [playSound]);

  // Play epic reveal for result screen
  const playReveal = useCallback(() => {
    playSound('reveal');
  }, [playSound]);

  // Start ambient background music
  const startAmbient = useCallback(async () => {
    if (ambientAudioRef.current) return; // Already playing

    try {
      const audioUrl = await getSound('ambient');
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.volume = 0.15;
        audio.loop = true;
        ambientAudioRef.current = audio;
        await audio.play();
      }
    } catch (error) {
      console.error("Error starting ambient:", error);
    }
  }, [getSound]);

  // Stop ambient music
  const stopAmbient = useCallback(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
      ambientAudioRef.current = null;
    }
  }, []);

  // Pre-load sounds (checks storage first, generates only if needed)
  const preloadSounds = useCallback(async () => {
    if (preloadedRef.current) return;
    preloadedRef.current = true;
    
    console.log('Preloading sounds...');
    // Load sounds sequentially to avoid rate limits
    await getSound('start');
    await getSound('ding');
    await getSound('reveal');
    await getSound('whoosh');
    console.log('Sounds preloaded!');
  }, [getSound]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbient();
    };
  }, [stopAmbient]);

  return {
    playWhoosh,
    playDing,
    playStart,
    playReveal,
    startAmbient,
    stopAmbient,
    preloadSounds,
  };
};
