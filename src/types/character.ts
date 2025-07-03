import type { Genome } from './stats';
import { GeneGrade } from './stats';

export interface CharacterSheet {
  ferocity: number;
  quickness: number;
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
  quickness: number;
  survival: number;
  instinct: number;
}

export const StatModifiersDefault: StatModifiers = {
  ferocity: 0,
  quickness: 0,
  survival: 0,
  instinct: 0,
};

export const CharacterSheetDefault: CharacterSheet = {
  ferocity: 1,
  quickness: 1,
  survival: 1,
  instinct: 1,
};

export const LevelProgressionDefault: LevelProgression = {
  level: 1,
  xp: 0,
  xpToNext: 10,
};

export const GenomeDefault: Genome = {
  ferocity: GeneGrade.C,
  quickness: GeneGrade.C,
  survival: GeneGrade.C,
  instinct: GeneGrade.C,
};

export interface Character {
  characterSheet: CharacterSheet;
  statModifiers: StatModifiers;
  genome: Genome;
  levelProgression: LevelProgression;
}