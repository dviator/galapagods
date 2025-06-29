import { useContext } from 'react';
import { PhaseContext } from './PhaseContext';

export function usePhaseContext() {
  const ctx = useContext(PhaseContext);
  if (!ctx) throw new Error('usePhaseContext must be used within a PhaseProvider');
  return ctx;
}