export enum GeneGrade { S = 'S', A = 'A', B = 'B', C = 'C', D = 'D', F = 'F' }

export interface Genome {
  ferocity: GeneGrade; // Grade for ferocity stat
  quickness: GeneGrade; // Grade for quickness stat
  survival: GeneGrade; // Grade for survival stat
  instinct: GeneGrade; // Grade for instinct stat
}

// Stat value type for each stat
export type StatName = 'ferocity' | 'quickness' | 'survival' | 'instinct';
export type StatBlock = Record<StatName, number>;

// Stat scaling coefficients for each stat-to-mechanic relationship
export interface StatScaling {
  healthPerSurvival: number;
  initiativePerQuickness: number;
  damagePerFerocity: number;
  speedDamageMultiplier: number;
  xpMultiplier: number;
  abilityPowerPerInstinct: number;
}

// Stat calculation function types
export type CalculateMaxHealth = (baseHealth: number, survival: number, scaling: StatScaling) => number;
export type CalculateInitiative = (baseInitiative: number, quickness: number, scaling: StatScaling) => number;
export type CalculateAttackDamage = (baseDamage: number, ferocity: number, quickness: number, scaling: StatScaling) => number;
export type CalculateXPGain = (baseXP: number, instinct: number, scaling: StatScaling) => number;
export type CalculateAbilityPower = (basePower: number, instinct: number, scaling: StatScaling) => number;

// Effective stat types (base stat + modifiers)
export type EffectiveFerocity = number;
export type EffectiveQuickness = number;
export type EffectiveSurvival = number;
export type EffectiveInstinct = number;

export interface EffectiveStatBlock {
  ferocity: EffectiveFerocity;
  quickness: EffectiveQuickness;
  survival: EffectiveSurvival;
  instinct: EffectiveInstinct;
}