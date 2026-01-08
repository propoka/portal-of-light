import { useState, useCallback } from 'react';
import { quizQuestions, calculateResult, PersonalityResult } from '@/data/quizData';
import LandingScreen from './LandingScreen';
import QuizScreen from './QuizScreen';
import PortalBurstScreen from './PortalBurstScreen';
import ResultScreen from './ResultScreen';

type QuizState = 'landing' | 'quiz' | 'portal' | 'result';

const QuizApp = () => {
  const [state, setState] = useState<QuizState>('landing');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [result, setResult] = useState<PersonalityResult | null>(null);

  const handleStart = useCallback(() => {
    setState('quiz');
    setCurrentQuestion(0);
    setAnswers({});
  }, []);

  const handleAnswer = useCallback((answerId: 'A' | 'B' | 'C' | 'D') => {
    const questionId = quizQuestions[currentQuestion].id;
    const newAnswers = { ...answers, [questionId]: answerId };
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      // Move to next question
      setCurrentQuestion(prev => prev + 1);
    } else {
      // All questions answered, show portal burst
      const calculatedResult = calculateResult(newAnswers);
      setResult(calculatedResult);
      setState('portal');
    }
  }, [currentQuestion, answers]);

  const handlePortalComplete = useCallback(() => {
    setState('result');
  }, []);

  const handleRestart = useCallback(() => {
    setState('landing');
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
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
        />
      )}
      
      {state === 'portal' && (
        <PortalBurstScreen onComplete={handlePortalComplete} />
      )}
      
      {state === 'result' && result && (
        <ResultScreen result={result} onRestart={handleRestart} />
      )}
    </div>
  );
};

export default QuizApp;
