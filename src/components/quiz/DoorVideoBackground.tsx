import { useEffect, useRef, useCallback } from 'react';
import doorVideo from '@/assets/door.webm';

interface DoorVideoBackgroundProps {
  targetTime: number;
  shouldPlay: boolean;
  playToEnd?: boolean;
  onReachTarget: () => void;
  onVideoEnd?: () => void;
}

const DoorVideoBackground = ({ 
  targetTime, 
  shouldPlay, 
  playToEnd = false,
  onReachTarget, 
  onVideoEnd 
}: DoorVideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasReachedTargetRef = useRef(false);
  const isPlayingRef = useRef(false);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || hasReachedTargetRef.current) return;

    // For playToEnd, let video play naturally
    if (playToEnd) return;

    // Check if we've reached target time (with small margin)
    if (video.currentTime >= targetTime - 0.02) {
      video.pause();
      video.currentTime = targetTime;
      hasReachedTargetRef.current = true;
      isPlayingRef.current = false;
      onReachTarget();
    }
  }, [targetTime, playToEnd, onReachTarget]);

  const handleEnded = useCallback(() => {
    hasReachedTargetRef.current = true;
    isPlayingRef.current = false;
    onVideoEnd?.();
  }, [onVideoEnd]);

  // Handle play trigger
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlay && !isPlayingRef.current) {
      hasReachedTargetRef.current = false;
      isPlayingRef.current = true;
      
      video.play().catch(() => {
        // Fallback if autoplay blocked
        setTimeout(() => {
          hasReachedTargetRef.current = true;
          isPlayingRef.current = false;
          if (playToEnd) {
            onVideoEnd?.();
          } else {
            onReachTarget();
          }
        }, 500);
      });
    }
  }, [shouldPlay, playToEnd, onReachTarget, onVideoEnd]);

  // Initial seek on mount
  useEffect(() => {
    const video = videoRef.current;
    if (video && video.readyState >= 1) {
      video.currentTime = 0;
      video.pause();
    }
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover z-0"
      muted
      playsInline
      preload="auto"
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
    >
      <source src={doorVideo} type="video/webm" />
    </video>
  );
};

export default DoorVideoBackground;
