import { createUnit } from '../utils/units/createCharacter';
import { pounceAttack, slashAttack, swoopAttack } from './attacks';
import type { Unit } from '../types/unit';
import tigerImg from '../assets/units/tiger.png';
import bearImg from '../assets/units/bear.png';
import eagleImg from '../assets/units/eagle.png';
import { level1Progression, rollRandomGenome } from '../types/character';

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
      characterSheet: { ferocity: 4, alacrity: 4, survival: 3, instinct: 2 },
      statModifiers: { ferocity: 0, survival: 0, alacrity: 0, instinct: 0 },
      genome: rollRandomGenome(),
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
      characterSheet: { ferocity: 2, alacrity: 2, survival: 6, instinct: 3 },
      statModifiers: { ferocity: 0, survival: 0, alacrity: 0, instinct: 0 },
      genome: rollRandomGenome(),
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
      characterSheet: { ferocity: 2, alacrity: 4, survival: 2, instinct: 5 },
      statModifiers: { ferocity: 0, survival: 0, alacrity: 0, instinct: 0 },
      genome: rollRandomGenome(),
    },
  });
}