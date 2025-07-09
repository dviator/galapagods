import type { World, Level, WorldState } from '../types/world';
import { useState, useCallback, useMemo } from 'react';

// Returns the current world object based on worldState
export function getCurrentWorld(worlds: World[], worldState: WorldState): World {
  return worlds.find(w => w.id === worldState.currentWorld) || worlds[0];
}

// Returns the current level object based on worldState
export function getCurrentLevel(worlds: World[], worldState: WorldState): Level {
  const world = getCurrentWorld(worlds, worldState);
  return world.levels.find(l => l.id === worldState.currentLevel) || world.levels[0];
}

// Returns a new WorldState after completing the current world level
export function completeWorldLevel(worlds: World[], worldState: WorldState): WorldState {
  const key = `${worldState.currentWorld}-${worldState.currentLevel}`;
  const newLevelProgress = { ...worldState.levelProgress, [key]: true };
  const world = getCurrentWorld(worlds, worldState);
  let newWorld = worldState.currentWorld;
  let newLevel = worldState.currentLevel;
  const newWorldsUnlocked = [...worldState.worldsUnlocked];

  if (worldState.currentLevel < world.levels.length) {
    newLevel += 1;
  } else {
    // Advance to next world if available
    if (worldState.currentWorld < worlds.length) {
      newWorld += 1;
      newLevel = 1;
      if (!newWorldsUnlocked.includes(newWorld)) {
        newWorldsUnlocked.push(newWorld);
      }
    } else {
      // All worlds complete, stay at last world/level
    }
  }
  return {
    ...worldState,
    currentWorld: newWorld,
    currentLevel: newLevel,
    worldsUnlocked: newWorldsUnlocked,
    levelProgress: newLevelProgress,
  };
}

// Returns a new WorldState reset to the beginning of world progression
export function resetWorldProgression(): WorldState {
  return {
    currentWorld: 1,
    currentLevel: 1,
    worldsUnlocked: [1],
    levelProgress: {},
  };
}

// Checks if a world is unlocked
export function isWorldUnlocked(worldState: WorldState, worldId: number): boolean {
  return worldState.worldsUnlocked.includes(worldId);
}

// Optionally, export a helper to get the current state shape
export function getInitialWorldState(): WorldState {
  return resetWorldProgression();
}

// --- NEW: Encapsulated progression manager hook ---

export function useWorldProgressionManager(worlds: World[]) {
  const [worldState, setWorldState] = useState<WorldState>(() => getInitialWorldState());

  const currentWorld = useMemo(() => getCurrentWorld(worlds, worldState), [worlds, worldState]);

  // Advance to next level/world
  const completeWorldLevelFn = useCallback(() => {
    setWorldState(prev => completeWorldLevel(worlds, prev));
  }, [worlds]);

  // Reset progression
  const resetWorldProgressionFn = useCallback(() => {
    setWorldState(resetWorldProgression());
  }, []);

  // Check if a world is unlocked
  const isWorldUnlockedFn = useCallback((worldId: number) => {
    return isWorldUnlocked(worldState, worldId);
  }, [worldState]);

  return {
    worldState,
    currentWorld,
    completeWorldLevel: completeWorldLevelFn,
    resetWorldProgression: resetWorldProgressionFn,
    isWorldUnlocked: isWorldUnlockedFn,
  };
}
