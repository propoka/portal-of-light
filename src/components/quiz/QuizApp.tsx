import { useState, useCallback, useRef, useEffect } from 'react';
import { quizQuestions, calculateResult, PersonalityResult, doorVoiceMessages } from '@/data/quizData';
import LandingScreen from './LandingScreen';
import QuizScreen from './QuizScreen';
import ResultScreen from './ResultScreen';
import DoorVideoBackground from './DoorVideoBackground';
import { useSoundEffects } from '@/hooks/useSoundEffects';

type QuizState = 'landing' | 'quiz' | 'result';

// Timeline: Landing=0, Start→1.0, Q1→1.5, Q2→2.0, Q3→2.5, Q4→3.0, Q5→END
const QUESTION_TIMES = [1.0, 1.5, 2.0, 2.5, 3.0]; // Time to pause at for each question

// Floating particles configuration
const PARTICLES = [
  { size: 4, left: '10%', top: '20%', delay: 0 },
  { size: 6, left: '85%', top: '15%', delay: 1.5 },
  { size: 3, left: '75%', top: '70%', delay: 0.8 },
  { size: 5, left: '20%', top: '80%', delay: 2.2 },
  { size: 4, left: '50%', top: '10%', delay: 3 },
  { size: 3, left: '90%', top: '50%', delay: 1.2 },
  { size: 5, left: '5%', top: '55%', delay: 2.8 },
];

// Door Voice Component
const DoorVoice = ({ message, show }: { message: string; show: boolean }) => {
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    if (show) {
      setKey(prev => prev + 1);
    }
  }, [message, show]);

  if (!show) return null;

  return (
    <div 
      key={key}
      className="absolute bottom-24 left-0 right-0 z-40 px-8"
    >
      <p className="door-voice max-w-lg mx-auto">
        "{message}"
      </p>
    </div>
  );
};

// Floating Particles Component
const FloatingParticles = () => (
  <>
    {PARTICLES.map((particle, index) => (
      <div
        key={index}
        className="particle"
        style={{
          width: particle.size,
          height: particle.size,
          left: particle.left,
          top: particle.top,
          animationDelay: `${particle.delay}s`,
        }}
      />
    ))}
  </>
);

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
  const [showDoorVoice, setShowDoorVoice] = useState(true);
  
  const resultRef = useRef<PersonalityResult | null>(null);
  
  // Sound effects
  const { playWhoosh, playDing, playReveal, startAmbient, stopAmbient, preloadSounds } = useSoundEffects();
  
  // Preload sounds on mount
  useEffect(() => {
    preloadSounds();
  }, [preloadSounds]);

  // Get current door voice message
  const getDoorVoiceMessage = () => {
    if (state === 'landing') return doorVoiceMessages.landing;
    if (state === 'quiz') return doorVoiceMessages[`q${currentQuestion + 1}`];
    return '';
  };

  // Calculate progressive glow based on question
  const getProgressiveGlow = () => {
    if (state === 'landing') return { brightness: 0.75, goldOpacity: 0 };
    const progress = currentQuestion / (quizQuestions.length - 1);
    return {
      brightness: 0.8 + progress * 0.2,
      goldOpacity: progress * 0.15,
    };
  };

  const handleStart = useCallback(() => {
    setShowUI(false);
    setShowDoorVoice(false);
    setVideoTargetTime(1.0); // Play to 1.0s
    setShouldPlayVideo(true);
    
    // Start ambient music and play whoosh
    startAmbient();
    playWhoosh();
  }, [startAmbient, playWhoosh]);

  const handleVideoReachTarget = useCallback(() => {
    setShouldPlayVideo(false);
    
    if (state === 'landing') {
      // Video reached 1.0s, show Q1
      setState('quiz');
      setCurrentQuestion(0);
      setTimeout(() => {
        setShowUI(true);
        setShowDoorVoice(true);
      }, 50);
    } else if (state === 'quiz') {
      // Video reached next timestamp, show next question
      setCurrentQuestion(prev => prev + 1);
      setTimeout(() => {
        setShowUI(true);
        setShowDoorVoice(true);
      }, 50);
    }
  }, [state]);

  const handleVideoEnd = useCallback(() => {
    setShouldPlayVideo(false);
    setPlayToEnd(false);
    setResult(resultRef.current);
    setState('result');
    
    // Play reveal fanfare when showing result
    playReveal();
  }, [playReveal]);

  const handleAnswer = useCallback((answerId: 'A' | 'B' | 'C' | 'D') => {
    const questionId = quizQuestions[currentQuestion].id;
    const newAnswers = { ...answers, [questionId]: answerId };
    setAnswers(newAnswers);

    // Play ding sound on answer selection
    playDing();

    // Fade UI out first
    setShowUI(false);
    setShowDoorVoice(false);

    setTimeout(() => {
      const isLastQuestion = currentQuestion >= quizQuestions.length - 1;
      
      if (isLastQuestion) {
        // Calculate result before final burst
        resultRef.current = calculateResult(newAnswers);
        setPlayToEnd(true);
        setShouldPlayVideo(true);
        stopAmbient(); // Stop ambient when quiz ends
      } else {
        // Play whoosh for transition
        playWhoosh();
        // Set next target time
        setVideoTargetTime(QUESTION_TIMES[currentQuestion + 1]);
        setShouldPlayVideo(true);
      }
    }, 200);
  }, [currentQuestion, answers, playDing, playWhoosh, stopAmbient]);

  const handleRestart = useCallback(() => {
    setState('landing');
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setVideoTargetTime(0);
    setShouldPlayVideo(false);
    setPlayToEnd(false);
    setShowUI(true);
    setShowDoorVoice(true);
    resultRef.current = null;
    stopAmbient();
  }, [stopAmbient]);

  // Result screen has its own background
  if (state === 'result' && result) {
    return <ResultScreen result={result} onRestart={handleRestart} />;
  }

  const { brightness, goldOpacity } = getProgressiveGlow();

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
      
      {/* Progressive glow overlay */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle at center, hsl(40 50% 50% / ${goldOpacity}) 0%, transparent 70%)`,
          filter: `brightness(${brightness})`,
        }}
      />
      
      {/* Minimal overlay for text readability */}
      <div className="absolute inset-0 bg-black/10 z-10" />
      
      {/* Floating Particles */}
      <FloatingParticles />
      
      {/* Door Voice */}
      <DoorVoice message={getDoorVoiceMessage()} show={showUI && showDoorVoice} />
      
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