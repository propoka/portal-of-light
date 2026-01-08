import { useState, useCallback } from 'react';
import { quizQuestions, calculateResult, PersonalityResult } from '@/data/quizData';
import LandingScreen from './LandingScreen';
import QuizScreen from './QuizScreen';
import DoorTransition from './DoorTransition';
import ResultScreen from './ResultScreen';

type QuizState = 'landing' | 'quiz' | 'door-transition' | 'result';

const QuizApp = () => {
  const [state, setState] = useState<QuizState>('landing');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [result, setResult] = useState<PersonalityResult | null>(null);
  const [doorSegment, setDoorSegment] = useState(0);
  const [isUiFading, setIsUiFading] = useState(false);

  const handleStart = useCallback(() => {
    setState('quiz');
    setCurrentQuestion(0);
    setAnswers({});
  }, []);

  const handleAnswer = useCallback((answerId: 'A' | 'B' | 'C' | 'D') => {
    const questionId = quizQuestions[currentQuestion].id;
    const newAnswers = { ...answers, [questionId]: answerId };
    setAnswers(newAnswers);

    // Fade UI out first
    setIsUiFading(true);

    setTimeout(() => {
      // Set door segment based on current question (0-4 for Q1-Q5, 5 for final)
      const isLastQuestion = currentQuestion >= quizQuestions.length - 1;
      
      if (isLastQuestion) {
        // Calculate result before showing final burst
        const calculatedResult = calculateResult(newAnswers);
        setResult(calculatedResult);
        setDoorSegment(5); // Final burst
      } else {
        setDoorSegment(currentQuestion); // Segments 0-4
      }
      
      setState('door-transition');
    }, 200); // Wait for UI fade out
  }, [currentQuestion, answers]);

  const handleDoorComplete = useCallback(() => {
    if (doorSegment === 5) {
      // Final burst complete, show result
      setState('result');
    } else {
      // Move to next question
      setCurrentQuestion(prev => prev + 1);
      setIsUiFading(false);
      setState('quiz');
    }
  }, [doorSegment]);

  const handleRestart = useCallback(() => {
    setState('landing');
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setDoorSegment(0);
    setIsUiFading(false);
  }, []);

  return (
    <div className="w-full min-h-screen">
      {state === 'landing' && (
        <LandingScreen onStart={handleStart} />
      )}
      
      {state === 'quiz' && (
        <QuizScreen
          question={quizQuestions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          totalQuestions={quizQuestions.length}
          onAnswer={handleAnswer}
          isFading={isUiFading}
        />
      )}
      
      {state === 'door-transition' && (
        <div className="quiz-container">
          {/* Keep showing quiz screen behind door */}
          <QuizScreen
            question={quizQuestions[Math.min(currentQuestion, quizQuestions.length - 1)]}
            questionNumber={currentQuestion + 1}
            totalQuestions={quizQuestions.length}
            onAnswer={() => {}}
            isFading={true}
          />
          <DoorTransition 
            segmentIndex={doorSegment}
            onComplete={handleDoorComplete}
            isActive={true}
          />
        </div>
      )}
      
      {state === 'result' && result && (
        <ResultScreen result={result} onRestart={handleRestart} />
      )}
    </div>
  );
};

export default QuizApp;
