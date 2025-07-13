import type { Unit } from '../../types';
import type { Character, CharacterSheet, StatModifiers, LevelProgression } from '../../types/character';
import { StatModifiersDefault, CharacterSheetDefault, LevelProgressionDefault, GenomeDefault } from '../../types/character';
import type { GeneGrade, Genome } from '../../types/stats';
import { statScaling } from '../../data/statScaling';
import type { StatName } from '../../types/stats';
import { StatEnum } from '../../types/stats';

// Returns stat growth value based on gene grade
export function getStatGrowth(grade: GeneGrade): number {
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
    combatStatus: { ...unit.combatStatus },
  };
  // Increase level and xp
  newUnit.character.levelProgression.level += 1;
  newUnit.character.levelProgression.xp -= newUnit.character.levelProgression.xpToNext;
  newUnit.character.levelProgression.xpToNext = Math.floor(newUnit.character.levelProgression.xpToNext * 1.2) + 10;

  // Increase stats based on genome
  newUnit.character.characterSheet.ferocity += getStatGrowth(newUnit.character.genome.ferocity);
  newUnit.character.characterSheet.alacrity += getStatGrowth(newUnit.character.genome.alacrity);
  newUnit.character.characterSheet.survival += getStatGrowth(newUnit.character.genome.survival);
  newUnit.character.characterSheet.instinct += getStatGrowth(newUnit.character.genome.instinct);

  // Calc Initiative based on alacrity and statScaling
  newUnit.baseInitiative = Math.floor(getEffectiveStat(newUnit, StatEnum.ALACRITY) * statScaling.initiativePerAlacrity);

  //Calc Health
  const prevMaxHealth = unit.maxHealth ?? statScaling.baseHealth;
  const survival = getEffectiveStat(newUnit, StatEnum.SURVIVAL);
  const newMaxHealth = Math.floor(statScaling.baseHealth + survival * statScaling.healthPerSurvival);
  const healthIncrease = newMaxHealth - prevMaxHealth;
  newUnit.maxHealth = newMaxHealth;
  newUnit.combatStatus.health = Math.min(newUnit.combatStatus.health + healthIncrease, newMaxHealth);

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

// Returns the effective value of a stat (base + modifiers)
export function getEffectiveStat(unit: Unit, stat: StatName): number {
  const base = unit.character.characterSheet[stat] ?? 0;
  const mod = unit.character.statModifiers[stat] ?? 0;
  return base + mod;
}

// Returns the effective initiative for a unit (using effective alacrity)
export function getEffectiveInitiative(unit: Unit): number {
  const alacrity = getEffectiveStat(unit, StatEnum.ALACRITY);
  return unit.baseInitiative + Math.floor(alacrity * statScaling.initiativePerAlacrity);
}

// Returns the initiative bonus due to temporary stat modifiers only
export function getTemporaryInitiativeBonus(unit: Unit): number {
  // Calculate effective initiative with all modifiers
  const effective = getEffectiveInitiative(unit);
  // Calculate initiative with statModifiers set to zero
  const baseStatModifiers = { ferocity: 0, alacrity: 0, survival: 0, instinct: 0 };
  const unitNoTmp = {
    ...unit,
    character: {
      ...unit.character,
      statModifiers: baseStatModifiers,
    },
  };
  const withoutTmp = getEffectiveInitiative(unitNoTmp);
  return effective - withoutTmp;
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