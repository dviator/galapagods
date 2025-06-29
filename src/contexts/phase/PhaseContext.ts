import { createContext } from 'react';
import type { GamePhase } from '../../types';

export interface PhaseContextType {
  currentPhase: GamePhase;
  transitionToPhase: (phase: GamePhase) => void;
  canTransition: (from: GamePhase, to: GamePhase) => boolean;
  transitionToShop: () => void;
  transitionToDeath: () => void;
  transitionToLab: () => void;
  transitionToCombat: () => void;
  startNewRun: () => void;
}

export const PhaseContext = createContext<PhaseContextType | undefined>(undefined);