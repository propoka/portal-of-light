import { useRef, useCallback, useEffect } from 'react';

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

type SoundType = keyof typeof SOUND_PROMPTS;

// Audio cache to avoid regenerating the same sounds
const audioCache: Record<string, string> = {};
// Pending promises to wait for generation
const pendingGenerations: Record<string, Promise<string | null>> = {};

export const useSoundEffects = () => {
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const preloadedRef = useRef(false);

  // Generate sound from ElevenLabs with proper queuing
  const generateSound = useCallback(async (type: SoundType, duration?: number): Promise<string | null> => {
    const cacheKey = `${type}-${duration || 'auto'}`;
    
    // Return cached audio if available
    if (audioCache[cacheKey]) {
      return audioCache[cacheKey];
    }

    // If already generating, wait for that promise
    if (pendingGenerations[cacheKey]) {
      return pendingGenerations[cacheKey];
    }

    // Create new generation promise
    const generationPromise = (async () => {
      try {
        console.log(`Generating sound: ${type}`);
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
              duration: duration || (type === 'ambient' ? 15 : 2)
            }),
          }
        );

        if (!response.ok) {
          console.error(`SFX request failed: ${response.status}`);
          return null;
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        audioCache[cacheKey] = audioUrl;
        console.log(`Sound cached: ${type}`);
        
        return audioUrl;
      } catch (error) {
        console.error("Error generating sound:", error);
        return null;
      } finally {
        delete pendingGenerations[cacheKey];
      }
    })();

    pendingGenerations[cacheKey] = generationPromise;
    return generationPromise;
  }, []);

  // Play a one-shot sound effect
  const playSound = useCallback(async (type: 'whoosh' | 'ding' | 'start' | 'reveal') => {
    try {
      const durations: Record<string, number> = { whoosh: 2, ding: 2, start: 3, reveal: 4 };
      const volumes: Record<string, number> = { whoosh: 0.5, ding: 0.6, start: 0.7, reveal: 0.8 };
      
      const audioUrl = await generateSound(type, durations[type]);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.volume = volumes[type];
        console.log(`Playing sound: ${type}`);
        await audio.play();
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, [generateSound]);

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
      const audioUrl = await generateSound('ambient', 15);
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
  }, [generateSound]);

  // Stop ambient music
  const stopAmbient = useCallback(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
      ambientAudioRef.current = null;
    }
  }, []);

  // Pre-generate sounds sequentially to avoid rate limits
  const preloadSounds = useCallback(async () => {
    if (preloadedRef.current) return;
    preloadedRef.current = true;
    
    // Generate sounds one by one to avoid rate limits
    console.log('Preloading sounds...');
    await generateSound('start', 3);
    await generateSound('ding', 2);
    await generateSound('reveal', 4);
    await generateSound('whoosh', 2);
    console.log('Sounds preloaded!');
  }, [generateSound]);

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
