import { goobSlapAttack, goobSlamAttack, superAoeAttack } from './attacks';
import { createUnit } from '../utils/units/createCharacter';
import type { Unit } from '../types/unit';
import { GeneGrade } from '../types/stats';

const enemyDefaultLvlProg = { level: 1, xp: 0, xpToNext: 10 }

const enemyDefaultCharSheet = {
  levelProgression: enemyDefaultLvlProg,
  characterSheet: { ferocity: 3, alacrity: 3, survival: 3, instinct: 1 },
  statModifiers: { ferocity: 0, survival: 0, alacrity: 0, instinct: 0 },
  genome: { ferocity: GeneGrade.D, survival: GeneGrade.D, alacrity: GeneGrade.D, instinct: GeneGrade.D },
}

export function createGoober(id?: string): Unit {
  return createUnit({
    id,
    name: 'Goob',
    type: 'enemy',
    maxHealth: 8,
    baseInitiative: 5,
    attack: goobSlapAttack,
    character: enemyDefaultCharSheet
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
    character: enemyDefaultCharSheet
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
    character: enemyDefaultCharSheet
  });
}