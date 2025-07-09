import type { World, WorldState } from '../types/world';

// Selector hook for world progression state
export function useWorldProgression(worldState: WorldState, currentWorld: World) {
  return { state: worldState, currentWorld };
}

export function useCurrentWorld(currentWorld: World) {
  return currentWorld;
}

export function useLevelProgress(worldState: WorldState) {
  return worldState;
}
