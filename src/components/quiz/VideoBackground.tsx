import { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  src: string;
  loop?: boolean;
  opacity?: number;
  onEnded?: () => void;
}

const VideoBackground = ({ src, loop = true, opacity = 0.3, onEnded }: VideoBackgroundProps) => {
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
      className="video-overlay"
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
