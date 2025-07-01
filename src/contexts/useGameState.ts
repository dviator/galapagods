import { useContext } from 'react';
import { GameStateContext } from './GameStateContext';

export const useGameState = () => {
  const ctx = useContext(GameStateContext);
  if (!ctx) throw new Error('useGameState must be used within a GameStateProvider');
  return ctx;
};