import { createUnit } from '../utils/units/createCharacter';
import { tigerSheet, bearSheet, eagleSheet } from './characterSheets';
import { pounceAttack, slashAttack, swoopAttack } from './attacks';
import type { Unit } from '../types/unit';
import tigerImg from '../assets/units/tiger.png';
import bearImg from '../assets/units/bear.png';
import eagleImg from '../assets/units/eagle.png';
import { GeneGrade } from '../types/stats';
import { level1Progression } from '../types/character';

export function createTiger(id?: string): Unit {
  return createUnit({
    id,
    name: 'Tiger',
    type: 'character',
    image: tigerImg,
    maxHealth: 10,
    baseInitiative: 5,
    attack: pounceAttack,
    character: {
      levelProgression: level1Progression(),
      characterSheet: tigerSheet,
      statModifiers: { ferocity: 0, survival: 0, alacrity: 0, instinct: 0 },
      genome: { ferocity: GeneGrade.B, survival: GeneGrade.C, alacrity: GeneGrade.A, instinct: GeneGrade.C },
    },
  });
}

export function createBear(id?: string): Unit {
  return createUnit({
    id,
    name: 'Bear',
    type: 'character',
    image: bearImg,
    maxHealth: 12,
    baseInitiative: 3,
    attack: slashAttack,
    character: {
      levelProgression: level1Progression(),
      characterSheet: bearSheet,
      statModifiers: { ferocity: 0, survival: 0, alacrity: 0, instinct: 0 },
      genome: { ferocity: GeneGrade.A, survival: GeneGrade.B, alacrity: GeneGrade.D, instinct: GeneGrade.C },
    },
  });
}

export function createEagle(id?: string): Unit {
  return createUnit({
    id,
    name: 'Eagle',
    type: 'character',
    image: eagleImg,
    maxHealth: 7,
    baseInitiative: 8,
    attack: swoopAttack,
    character: {
      levelProgression: level1Progression(),
      characterSheet: eagleSheet,
      statModifiers: { ferocity: 0, survival: 0, alacrity: 0, instinct: 0 },
      genome: { ferocity: GeneGrade.C, survival: GeneGrade.C, alacrity: GeneGrade.B, instinct: GeneGrade.A },
    },
  });
}