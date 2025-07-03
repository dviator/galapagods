import type { Attack, CombatStatus } from './combat';
import type { PassiveAbility } from './combat';
import type { Character } from './character';

export interface Unit {
  id: string;
  name: string;
  type: 'character' | 'enemy';
  image?: string;
  character: Character;
  maxHealth: number;
  baseInitiative: number;
  attack: Attack;
  combatStatus: CombatStatus;
  upgrades?: string[];
  passives?: PassiveAbility[];
}

export enum TeamEnum {
  Player = 'Player',
  Enemy = 'Enemy',
}

export type Team = TeamEnum.Player | TeamEnum.Enemy;