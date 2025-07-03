import type { CharacterSheet } from '../../types/character';
import type { Unit } from '../../types/unit';
import type { Attack } from '../../types/combat';
import { getCharacter } from './leveling';

// New general unit creation function for both characters and enemies
export function createUnit(
  id: string,
  name: string,
  type: 'character' | 'enemy',
  image: string | undefined,
  maxHealth: number,
  baseInitiative: number,
  attack: Attack,
  characterSheet?: CharacterSheet,
): Unit {
  const unit: Unit = {
    id: id,
    name: name,
    type: type,
    image: image ? image : undefined,
    character: getCharacter({ characterSheet: characterSheet }),
    maxHealth: maxHealth,
    baseInitiative: baseInitiative,
    attack: attack,
    combatStatus: {
      alive: true,
      health: maxHealth,
      initiative: 0,
    },
  }
  return unit;
}