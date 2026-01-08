import { useState, useCallback, useRef } from 'react';
import { quizQuestions, calculateResult, PersonalityResult } from '@/data/quizData';
import LandingScreen from './LandingScreen';
import QuizScreen from './QuizScreen';
import ResultScreen from './ResultScreen';
import DoorVideoBackground from './DoorVideoBackground';

type QuizState = 'landing' | 'quiz' | 'result';

// Timeline: Landing=0, Start→1.0, Q1→1.5, Q2→2.0, Q3→2.5, Q4→3.0, Q5→END
const QUESTION_TIMES = [1.0, 1.5, 2.0, 2.5, 3.0]; // Time to pause at for each question

const QuizApp = () => {
  const [state, setState] = useState<QuizState>('landing');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [result, setResult] = useState<PersonalityResult | null>(null);
  
  // Video control state
  const [videoTargetTime, setVideoTargetTime] = useState(0);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);
  const [playToEnd, setPlayToEnd] = useState(false);
  
  // UI visibility state
  const [showUI, setShowUI] = useState(true);
  
  const resultRef = useRef<PersonalityResult | null>(null);

  const handleStart = useCallback(() => {
    setShowUI(false);
    setVideoTargetTime(1.0); // Play to 1.0s
    setShouldPlayVideo(true);
  }, []);

  const handleVideoReachTarget = useCallback(() => {
    setShouldPlayVideo(false);
    
    if (state === 'landing') {
      // Video reached 1.0s, show Q1
      setState('quiz');
      setCurrentQuestion(0);
      setTimeout(() => setShowUI(true), 50);
    } else if (state === 'quiz') {
      // Video reached next timestamp, show next question
      setCurrentQuestion(prev => prev + 1);
      setTimeout(() => setShowUI(true), 50);
    }
  }, [state]);

  const handleVideoEnd = useCallback(() => {
    setShouldPlayVideo(false);
    setPlayToEnd(false);
    setResult(resultRef.current);
    setState('result');
  }, []);

  const handleAnswer = useCallback((answerId: 'A' | 'B' | 'C' | 'D') => {
    const questionId = quizQuestions[currentQuestion].id;
    const newAnswers = { ...answers, [questionId]: answerId };
    setAnswers(newAnswers);

    // Fade UI out first
    setShowUI(false);

    setTimeout(() => {
      const isLastQuestion = currentQuestion >= quizQuestions.length - 1;
      
      if (isLastQuestion) {
        // Calculate result before final burst
        resultRef.current = calculateResult(newAnswers);
        setPlayToEnd(true);
        setShouldPlayVideo(true);
      } else {
        // Set next target time
        setVideoTargetTime(QUESTION_TIMES[currentQuestion + 1]);
        setShouldPlayVideo(true);
      }
    }, 200);
  }, [currentQuestion, answers]);

  const handleRestart = useCallback(() => {
    setState('landing');
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setVideoTargetTime(0);
    setShouldPlayVideo(false);
    setPlayToEnd(false);
    setShowUI(true);
    resultRef.current = null;
  }, []);

  // Result screen has its own background
  if (state === 'result' && result) {
    return <ResultScreen result={result} onRestart={handleRestart} />;
  }

  return (
    <div className="quiz-container">
      {/* Main Door Video Background */}
      <DoorVideoBackground
        targetTime={videoTargetTime}
        shouldPlay={shouldPlayVideo}
        playToEnd={playToEnd}
        onReachTarget={handleVideoReachTarget}
        onVideoEnd={handleVideoEnd}
      />
      
      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-background/20 to-background/30 z-10" />
      
      {/* UI Content Layer */}
      <div className={`relative z-30 transition-opacity duration-200 ${showUI ? 'opacity-100' : 'opacity-0'}`}>
        {state === 'landing' && (
          <LandingScreen onStart={handleStart} />
        )}
        
        {state === 'quiz' && (
          <QuizScreen
            question={quizQuestions[currentQuestion]}
            questionNumber={currentQuestion + 1}
            totalQuestions={quizQuestions.length}
            onAnswer={handleAnswer}
            isFading={false}
          />
        )}
      </div>
    </div>
  );
};

export default QuizApp;
