import type { Attack } from '../../types';
import { frontTargetingRule, rightTargetingRule } from '../utils/units/attackTargeting';

export const slashAttack: Attack = {
  name: "Slash",
  damage: 3,
  targetingRule: frontTargetingRule,
};
export const pounceAttack: Attack = {
  name: "Pounce",
  damage: 4,
  targetingRule: frontTargetingRule,
};
export const swoopAttack: Attack = {
  name: "Swoop",
  damage: 2,
  targetingRule: rightTargetingRule,
};
export const slamAttack: Attack = {
  name: "Slam",
  damage: 2,
  targetingRule: frontTargetingRule,
};