import type { Attack, CombatStatus } from './combat';
import type { PassiveAbility } from './abilities';
import type { Genome, LevelProgression } from './stats';

export interface CharacterSheet {
  ferocity: number; // Affects basic attack damage
  quickness: number; // Affects initiative
  survival: number; // Affects base HP (and possibly HP regen)
  instinct: number; // Reserved for future use
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
  passives?: PassiveAbility[];
  genome: Genome;
  levelProgression: LevelProgression;
}

export enum TeamEnum {
  Player = 'Player',
  Enemy = 'Enemy',
}

export type Team = TeamEnum.Player | TeamEnum.Enemy;