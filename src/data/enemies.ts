import { goobSlapAttack, goobSlamAttack, superAoeAttack } from './attacks';
import { createUnit } from '../utils/units/createCharacter';
import type { Unit } from '../types/unit';
import { GeneGrade } from '../types/stats';
import { level1Progression } from '../types/character';

export function createGoober(id?: string): Unit {
  return createUnit({
    id,
    name: 'Goob',
    type: 'enemy',
    maxHealth: 8,
    baseInitiative: 5,
    attack: goobSlapAttack,
    character: {
      levelProgression: level1Progression(),
      characterSheet: { ferocity: 0, survival: 0, alacrity: 0, instinct: 0 },
      statModifiers: { ferocity: 0, survival: 0, alacrity: 0, instinct: 0 },
      genome: { ferocity: GeneGrade.F, survival: GeneGrade.F, alacrity: GeneGrade.F, instinct: GeneGrade.F },
    },
  });
}

export function createGoobLvl2(id?: string): Unit {
  return createUnit({
    id,
    name: 'Goob',
    type: 'enemy',
    maxHealth: 12,
    baseInitiative: 7,
    attack: goobSlamAttack,
    character: {
      levelProgression: level1Progression(),
      characterSheet: { ferocity: 0, survival: 0, alacrity: 0, instinct: 0 },
      statModifiers: { ferocity: 0, survival: 0, alacrity: 0, instinct: 0 },
      genome: { ferocity: GeneGrade.F, survival: GeneGrade.F, alacrity: GeneGrade.F, instinct: GeneGrade.F },
    },
  });
}

export function createSuperGoober(id?: string): Unit {
  return createUnit({
    id,
    name: 'Supergoob',
    type: 'enemy',
    maxHealth: 18,
    baseInitiative: 5,
    attack: superAoeAttack,
    character: {
      levelProgression: level1Progression(),
      characterSheet: { ferocity: 0, survival: 0, alacrity: 0, instinct: 0 },
      statModifiers: { ferocity: 0, survival: 0, alacrity: 0, instinct: 0 },
      genome: { ferocity: GeneGrade.F, survival: GeneGrade.F, alacrity: GeneGrade.F, instinct: GeneGrade.F },
    },
  });
}