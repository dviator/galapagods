import type { Attack } from '../types';
import { frontTargetingRule, rightTargetingRule, aoeTargetingRule } from '../utils/units/attackTargeting';
import { AttackDirection } from '../types';
import type { Unit } from '../types/unit';
import { getEffectiveStat } from '../utils/units/leveling';
import { GenomeStat } from '../types/stats';

export function ferocityBonusDmg(unit: Unit) {
  return Math.ceil(getEffectiveStat(unit, GenomeStat.FEROCITY) * 0.33);
}

export const slashAttack: Attack = {
  name: "Slash",
  baseDmg: 1,
  bonusAbilityDmg: ferocityBonusDmg,
  direction: AttackDirection.Forward,
  targetingRule: aoeTargetingRule,
  countdown: 8, // Slow attack
};

export const pounceAttack: Attack = {
  name: "Pounce",
  baseDmg: 3,
  bonusAbilityDmg: ferocityBonusDmg,
  direction: AttackDirection.Forward,
  targetingRule: frontTargetingRule,
  countdown: 6, // Medium-fast attack
};

export const swoopAttack: Attack = {
  name: "Swoop",
  baseDmg: 2,
  bonusAbilityDmg: ferocityBonusDmg,
  direction: AttackDirection.Side,
  targetingRule: rightTargetingRule,
  countdown: 5, // Fast attack
};

export const slamAttack: Attack = {
  name: "Slam",
  baseDmg: 2,
  bonusAbilityDmg: ferocityBonusDmg,
  direction: AttackDirection.Forward,
  targetingRule: frontTargetingRule,
  countdown: 7, // Medium-slow attack
};

export const goobSlapAttack: Attack = {
  name: "Goob Slap",
  baseDmg: 3,
  bonusAbilityDmg: () => 0,
  direction: AttackDirection.Forward,
  targetingRule: frontTargetingRule,
  countdown: 6, // Enemy attack
};

export const goobSlamAttack: Attack = {
  name: "Goob Slam",
  baseDmg: 5,
  bonusAbilityDmg: () => 0,
  direction: AttackDirection.Forward,
  targetingRule: frontTargetingRule,
  countdown: 8, // Enemy attack
};

export const superAoeAttack: Attack = {
  name: "Super AOE",
  baseDmg: 3,
  bonusAbilityDmg: () => 0,
  direction: AttackDirection.AOE,
  targetingRule: aoeTargetingRule,
  countdown: 7, // Enemy AOE attack
};