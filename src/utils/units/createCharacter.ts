import type { Unit } from '../../types/unit';
import type { Attack } from '../../types/combat';
import { v4 as uuidv4 } from 'uuid';
import type { PassiveAbility } from '../../types/combat';
import type { Character } from '../../types/character';
import type { CombatStatus } from '../../types/combat';
import { GeneGrade } from '../../types/stats';
import { AttackDirection } from '../../types/combat';

// Type for defining a unit (excluding id, which is optional)
export type UnitDefinition = {
  name: string;
  type: 'character' | 'enemy';
  character: Character;
  maxHealth: number;
  baseInitiative: number;
  attack: Attack;
  // Optional fields
  id?: string;
  image?: string;
  combatStatus?: CombatStatus;
  upgrades?: string[];
  passives?: PassiveAbility[];
};

// Smart defaults for optional fields
const defaultCombatStatus = (maxHealth: number): CombatStatus => ({
  alive: true,
  health: maxHealth,
  initiative: 0,
});

export function createUnit(def: UnitDefinition): Unit {
  return {
    id: def.id || uuidv4(),
    name: def.name,
    type: def.type,
    image: def.image,
    character: def.character,
    maxHealth: def.maxHealth,
    baseInitiative: def.baseInitiative,
    attack: def.attack,
    combatStatus: def.combatStatus || defaultCombatStatus(def.maxHealth),
    upgrades: def.upgrades || [],
    passives: def.passives || [],
  };
}

// Factory for empty/dead slot in a team, with unique id for React key
export function createEmptyUnit(): Unit {
  return createUnit({
    id: `empty-${uuidv4()}`,
    name: '',
    type: 'enemy',
    image: undefined,
    character: {
      levelProgression: { level: 0, xp: 0, xpToNext: 0 },
      characterSheet: { ferocity: 0, survival: 0, alacrity: 0, instinct: 0 },
      statModifiers: { ferocity: 0, survival: 0, alacrity: 0, instinct: 0 },
      genome: { ferocity: GeneGrade.F, survival: GeneGrade.F, alacrity: GeneGrade.F, instinct: GeneGrade.F },
    },
    maxHealth: 0,
    baseInitiative: 0,
    attack: {
      name: '',
      baseDmg: 0,
      bonusAbilityDmg: () => 0,
      targetingRule: { name: '', getTargets: () => [] },
      direction: AttackDirection.AOE,
    },
    combatStatus: {
      alive: false,
      health: 0,
      initiative: 0,
    },
  });
}