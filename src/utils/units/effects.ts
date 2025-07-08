// Effect utility for units/items/abilities
import type { Unit } from '../../types/unit';
import type { StatName } from '../../types/stats';
import { GeneGrade, ALL_STATS } from '../../types/stats';
// import type { EffectContext } from '../../types/shop';

// Enum for effect names
export enum EffectName {
  Heal = 'Heal',
  GeneticPotential = 'GeneticPotential',
  TemporaryStatBoost = 'TemporaryStatBoost',
}

// Context types for each effect
// The context object may include UI state setters from ShopScreen, e.g.:
// {
//   setHealedUnitId?: (id: string) => void,
//   setFlashUnitId?: (id: string) => void,
//   showGeneticPopup?: (unitId: string, stat: StatName, grade: string) => void,
//   unitId?: string,
//   ...effect-specific config
// }
export type HealEffectContext = { type: EffectName.Heal; amount?: number; setHealedUnitId?: (id: string) => void; unitId?: string };
export type GeneticPotentialEffectContext = { type: EffectName.GeneticPotential; showGeneticPopup?: (unitId: string, stat: StatName, grade: string) => void; unitId?: string };
export type TemporaryStatBoostEffectContext = { type: EffectName.TemporaryStatBoost; stat: StatName; amount: number; setFlashUnitId?: (id: string) => void; unitId?: string };

export type Effect =
  | {
      name: EffectName.Heal;
      description?: string;
      apply: (unit: Unit, context?: HealEffectContext) => Unit;
    }
  | {
      name: EffectName.GeneticPotential;
      description?: string;
      apply: (unit: Unit, context?: GeneticPotentialEffectContext) => Unit;
    }
  | {
      name: EffectName.TemporaryStatBoost;
      description?: string;
      apply: (unit: Unit, context: TemporaryStatBoostEffectContext) => Unit;
    };

// Example: Healing effect
export const HealEffect: Effect = {
  name: EffectName.Heal,
  description: 'Restore HP to a unit (not exceeding maxHealth)',
  apply: (unit, context) => {
    const amount = context?.amount ?? 4;
    if (context?.setHealedUnitId && context.unitId) {
      context.setHealedUnitId(context.unitId);
      setTimeout(() => context.setHealedUnitId && context.setHealedUnitId(null as unknown as string), 500); // allow null
    }
    const healed = Math.min(unit.combatStatus.health + amount, unit.maxHealth);
    return {
      ...unit,
      combatStatus: {
        ...unit.combatStatus,
        health: healed,
      },
    };
  },
};

// Helper: grade order
const GRADE_ORDER = [GeneGrade.F, GeneGrade.D, GeneGrade.C, GeneGrade.B, GeneGrade.A, GeneGrade.S];

// Utility to get a random upgradable stat for genetic potential
export function getRandomUpgradableStat(genome: Record<StatName, GeneGrade>): StatName | null {
  const upgradable = ALL_STATS.filter(stat => genome[stat] !== GeneGrade.S);
  if (upgradable.length === 0) return null;
  return upgradable[Math.floor(Math.random() * upgradable.length)];
}

// Pattern-compatible effect helper for genetic potential
export function applyGeneticPotentialEffect(
  unit: Unit
): { updated: Unit, stat: StatName | null, newGrade: GeneGrade | null } {
  const genome = unit.character.genome;
  const stat = getRandomUpgradableStat(genome);
  if (!stat) return { updated: unit, stat: null, newGrade: null };
  const currentGrade = genome[stat];
  const idx = GRADE_ORDER.indexOf(currentGrade);
  if (idx === -1 || idx === GRADE_ORDER.length - 1) return { updated: unit, stat, newGrade: currentGrade };
  const newGrade = GRADE_ORDER[idx + 1];
  const updated: Unit = {
    ...unit,
    character: {
      ...unit.character,
      genome: {
        ...genome,
        [stat]: newGrade,
      },
    },
  };
  return { updated, stat, newGrade };
}

export const GeneticPotentialEffect: Effect = {
  name: EffectName.GeneticPotential,
  description: 'Increase a random genome stat grade by one (S is max)',
  apply: (unit, context) => {
    const result = applyGeneticPotentialEffect(unit);
    if (context?.showGeneticPopup && context.unitId && result.stat && result.newGrade) {
      context.showGeneticPopup(context.unitId, result.stat, result.newGrade);
    }
    return result.updated;
  },
};

// Pattern-compatible effect helper for temporary stat boost
export function applyTemporaryStatBoostEffect(unit: Unit, context: TemporaryStatBoostEffectContext): { updated: Unit, stat: StatName, amount: number } {
  const { stat, amount } = context;
  const updated: Unit = {
    ...unit,
    character: {
      ...unit.character,
      statModifiers: {
        ...unit.character.statModifiers,
        [stat]: (unit.character.statModifiers[stat] ?? 0) + amount,
      },
    },
  };
  return { updated, stat, amount };
}

export const TemporaryStatBoostEffect: Effect = {
  name: EffectName.TemporaryStatBoost,
  description: 'Temporarily boost a stat for one run',
  apply: (unit, context) => {
    if (!context?.stat || typeof context.amount !== 'number') return unit;
    if (context?.setFlashUnitId && context.unitId) {
      context.setFlashUnitId(context.unitId);
      setTimeout(() => context.setFlashUnitId && context.setFlashUnitId(null as unknown as string), 500); // allow null
    }
    return applyTemporaryStatBoostEffect(unit, context as TemporaryStatBoostEffectContext).updated;
  },
};

// Generic effect applier (could be extended for multi-target, etc)
export function applyEffect(unit: Unit, effect: Effect, context?: unknown): Unit {
  // Type narrowing based on effect.name
  switch (effect.name) {
    case EffectName.Heal:
      return effect.apply(unit, context as HealEffectContext);
    case EffectName.GeneticPotential:
      return effect.apply(unit, context as GeneticPotentialEffectContext);
    case EffectName.TemporaryStatBoost:
      return effect.apply(unit, context as TemporaryStatBoostEffectContext);
    default:
      return unit;
  }
}