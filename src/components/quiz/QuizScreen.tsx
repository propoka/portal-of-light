import { useState } from 'react';
import { QuizQuestion } from '@/data/quizData';
import VideoBackground from './VideoBackground';
import goldDust from '@/assets/gold-dust.webm';
import bgDark from '@/assets/quiz1.png';
import { cn } from '@/lib/utils';

interface QuizScreenProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answerId: 'A' | 'B' | 'C' | 'D') => void;
}

const QuizScreen = ({ question, questionNumber, totalQuestions, onAnswer }: QuizScreenProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Progressive brightness based on question number
  const brightness = 1 + (questionNumber - 1) * 0.08;

  const handleSelectAnswer = (answerId: 'A' | 'B' | 'C' | 'D') => {
    if (isTransitioning) return;
    
    setSelectedAnswer(answerId);
    setIsTransitioning(true);
    
    // Brief delay before transitioning
    setTimeout(() => {
      onAnswer(answerId);
      setSelectedAnswer(null);
      setIsTransitioning(false);
    }, 400);
  };

  return (
    <div 
      className="quiz-container flex items-center justify-center"
      style={{ filter: `brightness(${brightness})` }}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgDark})` }}
      />
      
      {/* Video Overlay */}
      <VideoBackground src={goldDust} opacity={0.2 + questionNumber * 0.05} />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/30" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl px-8">
        {/* Progress */}
        <div className="text-center mb-8 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
          <span className="text-primary/80 text-sm tracking-widest uppercase">
            Câu {questionNumber}/{totalQuestions}
          </span>
        </div>

        {/* Question */}
        <h2 
          className="font-display text-3xl md:text-4xl text-center gold-text mb-4 opacity-0 animate-fade-in-up delay-100"
          style={{ animationFillMode: 'forwards' }}
        >
          {question.question}
        </h2>

        {/* Micro copy */}
        <p 
          className="text-center text-muted-foreground italic mb-12 opacity-0 animate-fade-in delay-300"
          style={{ animationFillMode: 'forwards' }}
        >
          {question.microCopy}
        </p>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => handleSelectAnswer(option.id)}
              disabled={isTransitioning}
              className={cn(
                "p-6 rounded-lg border text-left transition-all duration-200",
                "opacity-0 animate-scale-in",
                "border-border/50 bg-card/50 backdrop-blur-sm",
                "card-hover",
                selectedAnswer === option.id && "card-selected",
                isTransitioning && selectedAnswer !== option.id && "opacity-50"
              )}
              style={{ 
                animationFillMode: 'forwards',
                animationDelay: `${0.2 + index * 0.1}s`
              }}
            >
              <span className="text-primary font-semibold mr-3">{option.id}.</span>
              <span className="text-foreground/90">{option.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
