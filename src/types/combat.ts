import type { Unit, Team } from './unit';

export enum AttackDirection { Forward = 'forward', Side = 'side', AOE = 'aoe' }

export interface TargetingRule {
  name: string;
  /**
   * @param attacker The attacking unit
   * @param attackingTeam The array of units on the attacker's team
   * @param defendingTeam The array of units on the defending team
   * @returns Array of indices in defendingTeam to target
   */
  getTargets: (
    attacker: Unit,
    attackingTeam: Unit[],
    defendingTeam: Unit[],
  ) => number[];
}

export interface Attack {
  name: string;
  baseDmg: number; // Base attack damage (before bonuses)
  bonusAbilityDmg: (unit: Unit) => number; // Bonus ability damage
  dmgRange?: [number, number]; // Optional random total damage range [min, max]
  direction: AttackDirection; // Directional icon for attack targeting
  targetingRule: TargetingRule;
}

export interface CombatStatus {
  alive: boolean;
  health: number;
  initiative: number;
}

export type InitiativeEntry = {
  team: Team;
  index: number;
  initiative: number;
};

export interface BattleState {
  initiativeOrder: InitiativeEntry[];
  currentTurn: number;
}

// Ability types grouped here
export enum AbilityTrigger {
  OnAttack = 'onAttack',
  OnDefend = 'onDefend',
  EndStep = 'endStep',
  InitiativeRoll = 'initiativeRoll',
}

export interface PassiveAbility {
  name: string;
  description: string;
  trigger: AbilityTrigger;
  effect: (unit: Unit, context?: unknown) => void;
  icon?: string;
}

// Represents the full state of a combat encounter
export interface CombatState {
  playerTeam: Unit[];
  enemyTeam: Unit[];
  initiativeOrder: InitiativeEntry[];
  currentTurn: number;
  round: number;
  combatLog: string[];
  isRoundComplete: boolean;
}