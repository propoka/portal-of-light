import { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  src: string;
  loop?: boolean;
  opacity?: number;
  onEnded?: () => void;
  className?: string;
}

const VideoBackground = ({ src, loop = true, opacity = 0.3, onEnded, className = '' }: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked, that's okay
      });
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={`video-overlay ${className}`}
      style={{ opacity }}
      autoPlay
      muted
      loop={loop}
      playsInline
      onEnded={onEnded}
    >
      <source src={src} type="video/webm" />
    </video>
  );
};

export default VideoBackground;
