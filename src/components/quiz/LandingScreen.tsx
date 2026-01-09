import { Button } from '@/components/ui/button';

interface LandingScreenProps {
  onStart: () => void;
}

const LandingScreen = ({ onStart }: LandingScreenProps) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      {/* Content - no background, parent handles it */}
      <div className="relative z-10 text-center px-8 max-w-2xl">
        <h1 
          className="font-display text-5xl md:text-7xl font-semibold shimmer-text mb-6 opacity-0 animate-fade-in-up"
        >
          UNLOCK YOUR 2026
        </h1>
        
        <p 
          className="text-lg md:text-xl text-foreground/80 mb-12 opacity-0 animate-fade-in-up delay-300"
          style={{ animationFillMode: 'forwards' }}
        >
          Nếu có một cánh cửa dẫn tới năm rực rỡ, bạn có mở không?
        </p>
        
        <Button
          onClick={onStart}
          className="opacity-0 animate-fade-in-up delay-600 px-10 py-6 text-lg font-medium 
                     bg-primary text-primary-foreground 
                     pulse-glow glow-button rounded-full"
          style={{ animationFillMode: 'forwards' }}
        >
          BẮT ĐẦU
        </Button>
      </div>
    </div>
  );
};

export default LandingScreen;