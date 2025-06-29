// GamePhase type
export type GamePhase = 'combat' | 'shop' | 'death' | 'lab';

// --- NEW COMBAT SYSTEM TYPES ---

export interface CombatStatus {
  alive: boolean;
  health: number;
  initiative: number;
  // Add more combat-only fields as needed (e.g., temporary buffs)
}

export interface CharacterSheet {
  strength: number;
  agility: number;
  toughness: number;
  // Add more base stats as needed
}

export interface TargetingRule {
  name: string;
  // getTargets?: (attacker: Unit, battlefield: Unit[]) => number[];
}

export interface Attack {
  name: string;
  damage: number;
  targetingRule: TargetingRule;
  // Add more fields as needed (e.g., status effects, scaling)
}

export interface Unit {
  id: string;
  name: string;
  type: 'character' | 'enemy';
  image?: string;
  characterSheet: CharacterSheet;
  maxHealth: number;
  baseInitiative: number;
  attack: Attack;
  combatStatus: CombatStatus;
  upgrades?: string[];
  // Add more fields as needed for future features
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
  playerTeam: Unit[];
  enemies: Unit[];
  upgrades: Upgrade[];
  runNumber: number;
  // Add more fields as needed for progress, stats, etc.
}

export enum TeamEnum {
  Player = 'Player',
  Enemy = 'Enemy',
}

export type Team = TeamEnum.Player | TeamEnum.Enemy;