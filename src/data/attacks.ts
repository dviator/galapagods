import type { Attack } from '../types';
import { frontTargetingRule, rightTargetingRule, aoeTargetingRule } from '../utils/units/attackTargeting';
import { AttackDirection } from '../types';

export const slashAttack: Attack = {
  name: "Slash",
  baseDmg: 1,
  bonusAbilityDmg: () => 0,
  direction: AttackDirection.Forward,
  targetingRule: aoeTargetingRule,
};
export const pounceAttack: Attack = {
  name: "Pounce",
  baseDmg: 4,
  bonusAbilityDmg: () => 0,
  direction: AttackDirection.Forward,
  targetingRule: frontTargetingRule,
};
export const swoopAttack: Attack = {
  name: "Swoop",
  baseDmg: 2,
  bonusAbilityDmg: () => 0,
  direction: AttackDirection.Side,
  targetingRule: rightTargetingRule,
};
export const slamAttack: Attack = {
  name: "Slam",
  baseDmg: 2,
  bonusAbilityDmg: () => 0,
  direction: AttackDirection.Forward,
  targetingRule: frontTargetingRule,
};