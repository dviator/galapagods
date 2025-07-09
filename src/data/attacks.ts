import type { Attack } from '../types';
import { frontTargetingRule, rightTargetingRule, aoeTargetingRule } from '../utils/units/attackTargeting';
import { AttackDirection } from '../types';
import type { Unit } from '../types/unit';

export function ferocityBonusDmg(unit: Unit) {
  return Math.ceil(unit.character.characterSheet.ferocity * 0.33);
}

export const slashAttack: Attack = {
  name: "Slash",
  baseDmg: 1,
  bonusAbilityDmg: ferocityBonusDmg,
  direction: AttackDirection.Forward,
  targetingRule: aoeTargetingRule,
};
export const pounceAttack: Attack = {
  name: "Pounce",
  baseDmg: 3,
  bonusAbilityDmg: ferocityBonusDmg,
  direction: AttackDirection.Forward,
  targetingRule: frontTargetingRule,
};
export const swoopAttack: Attack = {
  name: "Swoop",
  baseDmg: 2,
  bonusAbilityDmg: ferocityBonusDmg,
  direction: AttackDirection.Side,
  targetingRule: rightTargetingRule,
};
export const slamAttack: Attack = {
  name: "Slam",
  baseDmg: 2,
  bonusAbilityDmg: ferocityBonusDmg,
  direction: AttackDirection.Forward,
  targetingRule: frontTargetingRule,
};

export const goobSlapAttack: Attack = {
  name: "Goob Slap",
  baseDmg: 3,
  bonusAbilityDmg: () => 0,
  direction: AttackDirection.Forward,
  targetingRule: frontTargetingRule,
};

export const goobSlamAttack: Attack = {
  name: "Goob Slam",
  baseDmg: 5,
  bonusAbilityDmg: () => 0,
  direction: AttackDirection.Forward,
  targetingRule: frontTargetingRule,
};

export const superAoeAttack: Attack = {
  name: "Super AOE",
  baseDmg: 3,
  bonusAbilityDmg: () => 0,
  direction: AttackDirection.AOE,
  targetingRule: aoeTargetingRule,
};