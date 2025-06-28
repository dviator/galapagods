import type { Character } from '../../types';

export function createCharacter(
  name: string,
  attack: number,
  health: number,
  baseInitiative: number,
  image?: string
): Character {
  return {
    id: crypto.randomUUID(),
    name,
    health,
    maxHealth: health,
    attack,
    defense: 0,
    abilities: [],
    upgrades: [],
    baseInitiative,
    initiative: 0,
    alive: true,
    image,
  };
}