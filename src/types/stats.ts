export enum GeneGrade { S = 'S', A = 'A', B = 'B', C = 'C', D = 'D', F = 'F' }

export interface Genome {
  ferocity: GeneGrade; // Grade for ferocity stat
  alacrity: GeneGrade; // Grade for alacrity stat
  survival: GeneGrade; // Grade for survival stat
  instinct: GeneGrade; // Grade for instinct stat
}

// Enum for stat names
export enum StatEnum {
  FEROCITY = 'ferocity',
  ALACRITY = 'alacrity',
  SURVIVAL = 'survival',
  INSTINCT = 'instinct',
}

// Readonly array of all stat enums for iteration
export const ALL_STATS: readonly StatEnum[] = [
  StatEnum.FEROCITY,
  StatEnum.ALACRITY,
  StatEnum.SURVIVAL,
  StatEnum.INSTINCT,
];

// Stat value type for each stat (now based on enum)
export type StatName = StatEnum;
export type StatBlock = Record<StatName, number>;

// Stat scaling coefficients for each stat-to-mechanic relationship
export interface StatScaling {
  healthPerSurvival: number;
  initiativePerAlacrity: number;
  damagePerFerocity: number;
  speedDamageMultiplier: number;
  xpMultiplier: number;
  abilityPowerPerInstinct: number;
}

// Stat calculation function types
export type CalculateMaxHealth = (baseHealth: number, survival: number, scaling: StatScaling) => number;
export type CalculateInitiative = (baseInitiative: number, alacrity: number, scaling: StatScaling) => number;
export type CalculateAttackDamage = (baseDamage: number, ferocity: number, alacrity: number, scaling: StatScaling) => number;
export type CalculateXPGain = (baseXP: number, instinct: number, scaling: StatScaling) => number;
export type CalculateAbilityPower = (basePower: number, instinct: number, scaling: StatScaling) => number;

// Effective stat types (base stat + modifiers)
export type EffectiveFerocity = number;
export type EffectiveAlacrity = number;
export type EffectiveSurvival = number;
export type EffectiveInstinct = number;

export interface EffectiveStatBlock {
  ferocity: EffectiveFerocity;
  alacrity: EffectiveAlacrity;
  survival: EffectiveSurvival;
  instinct: EffectiveInstinct;
}