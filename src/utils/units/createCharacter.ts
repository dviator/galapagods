import type { Unit, CharacterSheet, CombatStatus, Attack, } from '../../types';

// New general unit creation function for both characters and enemies
export function createUnit(
  id: string,
  name: string,
  type: 'character' | 'enemy',
  image: string | undefined,
  characterSheet: CharacterSheet,
  maxHealth: number,
  baseInitiative: number,
  attack: Attack,
  upgrades?: string[]
): Unit {
  const combatStatus: CombatStatus = {
    alive: true,
    health: maxHealth,
    initiative: 0,
  };
  return {
    id,
    name,
    type,
    image,
    characterSheet,
    maxHealth,
    baseInitiative,
    attack,
    combatStatus,
    ...(type === 'character' && upgrades ? { upgrades } : {}),
  } as Unit;
}