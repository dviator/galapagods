import type { Unit } from './unit';

export type LevelType = 'normal' | 'miniboss' | 'boss';

export interface Level {
  id: number;
  type: LevelType;
  enemies: Unit[];
  completed: boolean;
}

export interface World {
  id: number;
  name: string;
  levels: Level[];
  unlocked: boolean;
}

export interface WorldState {
  currentWorld: number;
  currentLevel: number;
  worldsUnlocked: number[];
  levelProgress: Record<string, boolean>; // key: `${worldId}-${levelId}`
}