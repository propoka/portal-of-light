import { Button } from '@/components/ui/button';
import VideoBackground from './VideoBackground';
import goldDust from '@/assets/gold-dust.webm';
import bgDark from '@/assets/quiz1.png';

interface LandingScreenProps {
  onStart: () => void;
}

const LandingScreen = ({ onStart }: LandingScreenProps) => {
  return (
    <div className="quiz-container flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgDark})` }}
      />
      
      {/* Video Overlay */}
      <VideoBackground src={goldDust} opacity={0.25} />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-background/40" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-2xl">
        <h1 
          className="font-display text-5xl md:text-7xl font-semibold gold-text mb-6 opacity-0 animate-fade-in-up"
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
                     bg-primary text-primary-foreground hover:bg-primary/90
                     pulse-glow rounded-full transition-all duration-300"
          style={{ animationFillMode: 'forwards' }}
        >
          BẮT ĐẦU
        </Button>
      </div>
    </div>
  );
};

export default LandingScreen;
