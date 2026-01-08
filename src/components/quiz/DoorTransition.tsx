import { useEffect, useRef } from 'react';
import doorVideo from '@/assets/door.webm';

// Timestamp segments for progressive door opening
const DOOR_SEGMENTS = [
  { start: 0.0, end: 0.3 },   // After Q1
  { start: 0.3, end: 0.6 },   // After Q2
  { start: 0.6, end: 0.9 },   // After Q3
  { start: 0.9, end: 1.2 },   // After Q4
  { start: 1.2, end: 1.5 },   // After Q5
  { start: 1.5, end: null },  // Final burst (play to end)
];

interface DoorTransitionProps {
  segmentIndex: number;
  onComplete: () => void;
  isActive: boolean;
}

const DoorTransition = ({ segmentIndex, onComplete, isActive }: DoorTransitionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isActive) return;

    hasCompletedRef.current = false;
    const segment = DOOR_SEGMENTS[segmentIndex] || DOOR_SEGMENTS[0];

    // Seek to segment start
    video.currentTime = segment.start;

    const handleTimeUpdate = () => {
      if (hasCompletedRef.current) return;
      
      // If segment has an end time, pause when reached
      if (segment.end !== null && video.currentTime >= segment.end) {
        video.pause();
        hasCompletedRef.current = true;
        onComplete();
      }
    };

    const handleEnded = () => {
      if (hasCompletedRef.current) return;
      // For final burst (end: null), trigger when video ends
      hasCompletedRef.current = true;
      onComplete();
    };

    const handleCanPlay = () => {
      video.play().catch(() => {
        // If autoplay fails, complete after timeout
        setTimeout(onComplete, 500);
      });
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplay', handleCanPlay, { once: true });

    // If video is already loaded, play immediately
    if (video.readyState >= 3) {
      video.play().catch(() => setTimeout(onComplete, 500));
    }

    // Fallback timeout
    const fallbackTimeout = setTimeout(() => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onComplete();
      }
    }, segment.end === null ? 3000 : 1000);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.pause();
      clearTimeout(fallbackTimeout);
    };
  }, [segmentIndex, onComplete, isActive]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ mixBlendMode: 'screen' }}
        muted
        playsInline
        preload="auto"
      >
        <source src={doorVideo} type="video/webm" />
      </video>
    </div>
  );
};

export default DoorTransition;
