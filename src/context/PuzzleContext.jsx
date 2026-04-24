import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

const PuzzleContext = createContext();

export const usePuzzles = () => useContext(PuzzleContext);

export const PuzzleProvider = ({ children }) => {
  const { userProfile, updatePoints } = useAuth();
  const [activePuzzle, setActivePuzzle] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [dailyCooldown, setDailyCooldown] = useState(0);

  // Psychologically engaging feedback messages
  const nearMissMessages = [
    "You're very close!",
    "Most people miss this detail",
    "Try one more time, you've got this",
    "Almost correct, look closer"
  ];

  const retryMessages = [
    "Don't give up now!",
    "You've invested time, keep going",
    "Just a small twist left to solve"
  ];

  const submitAnswer = async (answer) => {
    if (isSolved) return;

    setAttempts(prev => prev + 1);
    
    const isCorrect = answer.toLowerCase().trim() === activePuzzle.answer.toLowerCase().trim();

    if (isCorrect) {
      setIsSolved(true);
      setFeedback({ type: 'success', message: 'Incredible! You solved it!' });
      
      // Micro-rewards: Confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Award points
      const basePoints = activePuzzle.difficulty === 'Easy' ? 5 : activePuzzle.difficulty === 'Medium' ? 10 : 25;
      
      // Variable Reward System (Dopamine loop)
      const bonus = Math.random() > 0.8 ? 10 : 0;
      const totalAward = basePoints + bonus;
      
      await updatePoints(totalAward);
      
      if (bonus > 0) {
        setFeedback(prev => ({ 
          ...prev, 
          bonusMessage: `Lucky bonus +${bonus} points!` 
        }));
      }
    } else {
      // Near-Miss Effect & Engaging Feedback
      let message = attempts < 2 
        ? nearMissMessages[Math.floor(Math.random() * nearMissMessages.length)]
        : retryMessages[Math.floor(Math.random() * retryMessages.length)];
      
      setFeedback({ type: 'error', message });

      // Daily Challenge Cooldown Logic (Simulated)
      if (activePuzzle.isDaily && attempts >= 1) {
        // After 2 free attempts, trigger cooldown or ad requirement
        // For now, just a message
      }
    }
  };

  const startPuzzle = (puzzle) => {
    setActivePuzzle(puzzle);
    setAttempts(0);
    setIsSolved(false);
    setFeedback(null);
  };

  const value = {
    activePuzzle,
    attempts,
    isSolved,
    feedback,
    dailyCooldown,
    submitAnswer,
    startPuzzle
  };

  return (
    <PuzzleContext.Provider value={value}>
      {children}
    </PuzzleContext.Provider>
  );
};
