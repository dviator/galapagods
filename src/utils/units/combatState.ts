// combatState.ts
// Handles core combat mechanics and state updates for units (damage, defeat, etc). Not UI or targeting.
import type { Unit } from '../../types';

export function assignDamage(attacker: Unit, target: Unit): string {
  if (!attacker.combatStatus.alive || !target.combatStatus.alive) return '';
  const damage = attacker.attack?.baseDmg ?? 1;
  target.combatStatus.health -= damage;
  if (target.combatStatus.health <= 0) {
    target.combatStatus.health = 0;
    target.combatStatus.alive = false;
    return `${attacker.name} attacks ${target.name} for ${damage} and defeats them!`;
  }
  return `${attacker.name} attacks ${target.name} for ${damage}. (${target.combatStatus.health} HP left)`;
}