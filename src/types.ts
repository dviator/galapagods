// GamePhase type
export type GamePhase = 'combat' | 'shop' | 'death' | 'lab';

// Character interface
export interface Character {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  abilities?: string[];
  upgrades?: Upgrade[];
  baseInitiative: number;
  initiative: number;
  alive: boolean;
  image?: string;
}

// Enemy interface (can extend Character for now, with optional AI/behavior fields)
export interface Enemy extends Character {
  aiType?: string;
  difficulty?: number;
}

// Upgrade interface
export interface Upgrade {
  id: string;
  name: string;
  description: string;
  type: 'character' | 'lab';
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  effects?: Record<string, unknown>; // Placeholder for effect structure
  prerequisites?: string[];
}

// GameState interface
export interface GameState {
  currentPhase: GamePhase;
  playerTeam: Character[];
  enemies: Enemy[];
  upgrades: Upgrade[];
  runNumber: number;
  // Add more fields as needed for progress, stats, etc.
}