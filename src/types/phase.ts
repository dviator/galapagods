export type GamePhase = 'combat' | 'shop' | 'death' | 'lab';

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