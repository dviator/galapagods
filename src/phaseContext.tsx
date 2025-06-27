import React, { useState } from 'react';
import type { ReactNode } from 'react';
import type { GamePhase } from './types';
import { PhaseContext } from './phaseContextBase';

export const PhaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('combat');

  // Only allow valid phase transitions in the game loop
  const canTransition = (from: GamePhase, to: GamePhase) => {
    if (from === to) return false;
    // Valid transitions:
    // combat -> shop
    if (from === 'combat' && to === 'shop') return true;
    // shop -> combat
    if (from === 'shop' && to === 'combat') return true;
    // combat -> death
    if (from === 'combat' && to === 'death') return true;
    // death -> lab
    if (from === 'death' && to === 'lab') return true;
    // lab -> combat (start new run)
    if (from === 'lab' && to === 'combat') return true;
    // Optionally allow lab -> shop if needed in future
    return false;
  };

  const transitionToPhase = (phase: GamePhase) => {
    setCurrentPhase(phase);
  };

  // Named transition helpers
  const transitionToShop = () => setCurrentPhase('shop');
  const transitionToDeath = () => setCurrentPhase('death');
  const transitionToLab = () => setCurrentPhase('lab');
  const startNewRun = () => setCurrentPhase('combat');
  const transitionToCombat = () => setCurrentPhase('combat');

  return (
    <PhaseContext.Provider value={{
      currentPhase,
      transitionToPhase,
      canTransition,
      transitionToShop,
      transitionToDeath,
      transitionToLab,
      transitionToCombat,
      startNewRun
    }}>
      {children}
    </PhaseContext.Provider>
  );
};