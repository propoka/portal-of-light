import { useState } from 'react';
import { QuizQuestion } from '@/data/quizData';
import { cn } from '@/lib/utils';

interface QuizScreenProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answerId: 'A' | 'B' | 'C' | 'D') => void;
  isFading?: boolean;
}

const QuizScreen = ({ question, questionNumber, totalQuestions, onAnswer, isFading = false }: QuizScreenProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    <div className="min-h-screen w-full flex items-center justify-center">
      {/* Content - no background, parent handles video + overlays */}
      <div 
        className={cn(
          "relative z-10 w-full max-w-4xl px-8 transition-opacity duration-200",
          isFading && "opacity-0"
        )}
      >
        {/* Progress */}
        <div className="text-center mb-8 opacity-0 animate-slide-down-enter" style={{ animationFillMode: 'forwards' }}>
          <span className="text-primary/80 text-sm tracking-widest uppercase">
            Câu {questionNumber}/{totalQuestions}
          </span>
        </div>

        {/* Question with shimmer */}
        <h2 
          className="font-display text-3xl md:text-4xl text-center shimmer-text mb-4 opacity-0 animate-slide-down-enter delay-100"
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

        {/* Answer Options with staggered animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => handleSelectAnswer(option.id)}
              disabled={isTransitioning}
              className={cn(
                "group p-6 rounded-lg border text-left transition-all duration-300",
                "opacity-0 animate-scale-in",
                "border-border/50 bg-card/50 backdrop-blur-sm",
                "card-hover",
                selectedAnswer === option.id && "card-selected",
                isTransitioning && selectedAnswer !== option.id && "opacity-50 scale-98"
              )}
              style={{ 
                animationFillMode: 'forwards',
                animationDelay: `${0.2 + index * 0.08}s`
              }}
            >
              <div className="flex items-center">
                <span className={cn(
                  "text-primary font-semibold mr-3 transition-transform duration-300",
                  "group-hover:scale-110"
                )}>
                  {option.id}.
                </span>
                <span className="text-foreground/90">{option.text}</span>
                
                {/* Checkmark for selected */}
                {selectedAnswer === option.id && (
                  <span className="ml-auto text-primary animate-scale-in">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;