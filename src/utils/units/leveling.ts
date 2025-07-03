import type { Unit } from '../../types';
import type { Character, CharacterSheet, StatModifiers, LevelProgression } from '../../types/character';
import { StatModifiersDefault, CharacterSheetDefault, LevelProgressionDefault, GenomeDefault } from '../../types/character';
import type { Genome } from '../../types/stats';

// Returns stat growth value based on gene grade
export function getStatGrowth(grade: import('../../types').GeneGrade): number {
  switch (grade) {
    case 'S': return Math.floor(Math.random() * 3) + 8; // 8-10
    case 'A': return Math.floor(Math.random() * 3) + 6; // 6-8
    case 'B': return Math.floor(Math.random() * 2) + 4; // 4-5
    case 'C': return Math.floor(Math.random() * 2) + 3; // 3-4
    case 'D': return 2;
    case 'F': return 1;
    default: return 1;
  }
}

// Levels up a unit, increasing stats and updating XP/level
export function gainLevel(unit: Unit): Unit {
  const newUnit = {
    ...unit,
    character: {
      ...unit.character,
      characterSheet: { ...unit.character.characterSheet },
      levelProgression: { ...unit.character.levelProgression },
      genome: { ...unit.character.genome },
      statModifiers: { ...unit.character.statModifiers },
    },
  };
  // Increase level and xp
  newUnit.character.levelProgression.level += 1;
  newUnit.character.levelProgression.xp -= newUnit.character.levelProgression.xpToNext;
  newUnit.character.levelProgression.xpToNext = Math.floor(newUnit.character.levelProgression.xpToNext * 1.2) + 10;

  // Increase stats based on genome
  newUnit.character.characterSheet.ferocity += getStatGrowth(newUnit.character.genome.ferocity);
  newUnit.character.characterSheet.quickness += getStatGrowth(newUnit.character.genome.quickness);
  newUnit.character.characterSheet.survival += getStatGrowth(newUnit.character.genome.survival);
  newUnit.character.characterSheet.instinct += getStatGrowth(newUnit.character.genome.instinct);

  return newUnit;
}

// Awards XP and applies level up as many times as needed
export function awardXPAndLevelUp(unit: Unit, xpAward: number): Unit {
  let updatedUnit = {
    ...unit,
    character: {
      ...unit.character,
      levelProgression: { ...unit.character.levelProgression },
    },
  };
  updatedUnit.character.levelProgression.xp += xpAward;
  while (updatedUnit.character.levelProgression.xp >= updatedUnit.character.levelProgression.xpToNext) {
    updatedUnit = gainLevel(updatedUnit);
  }
  return updatedUnit;
}

export function getCharacter(
  opts?: {
    characterSheet?: CharacterSheet,
    statModifiers?: StatModifiers,
    genome?: Genome,
    levelProgression?: LevelProgression
  }
): Character {
  return {
    characterSheet: opts?.characterSheet ?? CharacterSheetDefault,
    statModifiers: opts?.statModifiers ?? StatModifiersDefault,
    genome: opts?.genome ?? GenomeDefault,
    levelProgression: opts?.levelProgression ?? LevelProgressionDefault,
  };
}