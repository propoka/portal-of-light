import { useEffect, useRef, useState } from 'react';
import lightBurst from '@/assets/light-burst.webm';

interface PortalBurstScreenProps {
  onComplete: () => void;
}

const PortalBurstScreen = ({ onComplete }: PortalBurstScreenProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
      video.play().catch(() => {
        // If autoplay fails, complete after timeout
        setTimeout(onComplete, 2000);
      });
    };

    const handleEnded = () => {
      onComplete();
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleEnded);

    // Fallback timeout in case video doesn't play
    const fallbackTimeout = setTimeout(() => {
      if (!isVideoLoaded) {
        onComplete();
      }
    }, 4000);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
      clearTimeout(fallbackTimeout);
    };
  }, [onComplete, isVideoLoaded]);

  return (
    <div className="quiz-container flex items-center justify-center bg-background">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
      >
        <source src={lightBurst} type="video/webm" />
      </video>
      
      {/* Fallback white flash if video not loaded */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 bg-champagne-light animate-pulse" />
      )}
    </div>
  );
};

export default PortalBurstScreen;
