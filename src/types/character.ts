import type { Genome } from './stats';
import { GeneGrade } from './stats';

export interface CharacterSheet {
  ferocity: number;
  alacrity: number;
  survival: number;
  instinct: number;
}

export interface LevelProgression {
  level: number;
  xp: number;
  xpToNext: number;
}

export interface StatModifiers {
  ferocity: number;
  alacrity: number;
  survival: number;
  instinct: number;
}

export const StatModifiersDefault: StatModifiers = {
  ferocity: 0,
  alacrity: 0,
  survival: 0,
  instinct: 0,
};

export const CharacterSheetDefault: CharacterSheet = {
  ferocity: 1,
  alacrity: 1,
  survival: 1,
  instinct: 1,
};

export const LevelProgressionDefault: LevelProgression = {
  level: 1,
  xp: 0,
  xpToNext: 10,
};

// Roll a random gene grade for a stat (S impossible, A 1/10, others 2/9 each)
function rollRandomGeneGrade(): GeneGrade {
  const r = Math.random();
  if (r < 0.05) return GeneGrade.F;         // 0.00 - 0.05
  if (r < 0.20) return GeneGrade.D;         // 0.05 - 0.20
  if (r < 0.65) return GeneGrade.C;         // 0.20 - 0.65
  if (r < 0.95) return GeneGrade.B;         // 0.65 - 0.95
  return GeneGrade.A;                       // 0.95 - 1.00
}

export function rollRandomGenome(): Genome {
  return {
    ferocity: rollRandomGeneGrade(),
    alacrity: rollRandomGeneGrade(),
    survival: rollRandomGeneGrade(),
    instinct: rollRandomGeneGrade(),
  };
}

export const GenomeDefault: Genome = rollRandomGenome();

export function level1Progression(): LevelProgression {
  return { level: 1, xp: 0, xpToNext: 10 };
}

export interface Character {
  characterSheet: CharacterSheet;
  statModifiers: StatModifiers;
  genome: Genome;
  levelProgression: LevelProgression;
}