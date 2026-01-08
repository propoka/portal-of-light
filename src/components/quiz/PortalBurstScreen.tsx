import { useEffect, useRef, useState } from 'react';
import doorVideo from '@/assets/door.webm';

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
      // Seek to final burst segment
      video.currentTime = 1.5;
      video.play().catch(() => {
        setTimeout(onComplete, 2000);
      });
    };

    const handleEnded = () => {
      onComplete();
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleEnded);

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
        style={{ mixBlendMode: 'screen' }}
        muted
        playsInline
        preload="auto"
      >
        <source src={doorVideo} type="video/webm" />
      </video>
      
      {!isVideoLoaded && (
        <div className="absolute inset-0 bg-champagne-light animate-pulse" />
      )}
    </div>
  );
};

export default PortalBurstScreen;
