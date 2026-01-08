import { Button } from '@/components/ui/button';
import { PersonalityResult } from '@/data/quizData';
import VideoBackground from './VideoBackground';
import shimmerStars from '@/assets/shimmer-stars.webm';
import bgLight from '@/assets/quiz2.png';

interface ResultScreenProps {
  result: PersonalityResult;
  onRestart: () => void;
}

const ResultScreen = ({ result, onRestart }: ResultScreenProps) => {
  return (
    <div className="quiz-container light-theme flex items-center justify-center py-12">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgLight})` }}
      />
      
      {/* Video Overlay */}
      <VideoBackground src={shimmerStars} opacity={0.3} />
      
      {/* Light overlay */}
      <div className="absolute inset-0 bg-champagne-light/20" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl px-8">
        {/* Result Title */}
        <div className="text-center mb-8">
          <p 
            className="text-sm tracking-widest uppercase text-muted-foreground mb-3 opacity-0 animate-fade-in"
            style={{ animationFillMode: 'forwards' }}
          >
            Kết quả của bạn
          </p>
          <h1 
            className="font-display text-4xl md:text-6xl font-semibold text-foreground mb-2 opacity-0 animate-fade-in-up delay-200"
            style={{ animationFillMode: 'forwards' }}
          >
            {result.title}
          </h1>
          <p 
            className="text-lg text-primary uppercase tracking-wider opacity-0 animate-fade-in delay-300"
            style={{ animationFillMode: 'forwards' }}
          >
            {result.type}
          </p>
        </div>

        {/* Description */}
        <p 
          className="text-center text-foreground/80 text-lg leading-relaxed max-w-2xl mx-auto mb-12 opacity-0 animate-fade-in-up delay-400"
          style={{ animationFillMode: 'forwards' }}
        >
          {result.description}
        </p>

        {/* Perfume Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Male Perfume */}
          <div 
            className="p-6 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 float-animation opacity-0 animate-scale-in delay-500"
            style={{ animationFillMode: 'forwards' }}
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-3xl">🧴</span>
            </div>
            <h3 className="font-display text-xl text-center text-foreground mb-2">
              {result.perfumeMale.name}
            </h3>
            <p className="text-sm text-center text-muted-foreground">
              {result.perfumeMale.description}
            </p>
          </div>

          {/* Female Perfume */}
          <div 
            className="p-6 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 float-animation opacity-0 animate-scale-in delay-600"
            style={{ animationFillMode: 'forwards', animationDelay: '0.7s' }}
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center">
              <span className="text-3xl">💐</span>
            </div>
            <h3 className="font-display text-xl text-center text-foreground mb-2">
              {result.perfumeFemale.name}
            </h3>
            <p className="text-sm text-center text-muted-foreground">
              {result.perfumeFemale.description}
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up delay-700"
          style={{ animationFillMode: 'forwards', animationDelay: '0.9s' }}
        >
          <Button
            className="px-8 py-6 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-full gold-glow"
          >
            Khám phá thêm
          </Button>
          <Button
            variant="outline"
            className="px-8 py-6 text-base font-medium border-primary text-primary hover:bg-primary/10 rounded-full"
          >
            Nhận ưu đãi khai trương
          </Button>
        </div>

        {/* Restart */}
        <div className="text-center mt-8">
          <button
            onClick={onRestart}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
          >
            Làm lại bài test
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
