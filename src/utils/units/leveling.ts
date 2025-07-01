import type { Unit } from '../../types';
import { getStatGrowth } from '../../types';

// Levels up a unit, increasing stats and updating XP/level
export function gainLevel(unit: Unit): Unit {
  const newUnit = { ...unit, characterSheet: { ...unit.characterSheet }, levelProgression: { ...unit.levelProgression } };
  // Increase level and xp
  newUnit.levelProgression.level += 1;
  newUnit.levelProgression.xp -= newUnit.levelProgression.xpToNext;
  newUnit.levelProgression.xpToNext = Math.floor(newUnit.levelProgression.xpToNext * 1.2) + 10;

  // Increase stats based on genome
  newUnit.characterSheet.ferocity += getStatGrowth(newUnit.genome.ferocity);
  newUnit.characterSheet.quickness += getStatGrowth(newUnit.genome.quickness);
  newUnit.characterSheet.survival += getStatGrowth(newUnit.genome.survival);
  newUnit.characterSheet.instinct += getStatGrowth(newUnit.genome.instinct);

  return newUnit;
}

// Awards XP and applies level up as many times as needed
export function awardXPAndLevelUp(unit: Unit, xpAward: number): Unit {
  let updatedUnit = { ...unit, levelProgression: { ...unit.levelProgression } };
  updatedUnit.levelProgression.xp += xpAward;
  while (updatedUnit.levelProgression.xp >= updatedUnit.levelProgression.xpToNext) {
    updatedUnit = gainLevel(updatedUnit);
  }
  return updatedUnit;
}