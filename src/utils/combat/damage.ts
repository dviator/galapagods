import type { Unit } from '../../types/unit';

/**
 * Calculate the total damage an attacker will deal
 * @param attacker - The attacking unit
 * @returns The total damage amount (base + bonus)
 */
function calcDmg(attacker: Unit): number {
  const base = attacker.attack?.baseDmg ?? 1;
  const bonus = attacker.attack?.bonusAbilityDmg ? attacker.attack.bonusAbilityDmg(attacker) : 0;
  return base + bonus;
}

/**
 * Apply damage from attacker to target and generate combat log message
 * @param attacker - The attacking unit
 * @param target - The target unit receiving damage
 * @returns A formatted combat log message describing the attack
 */
export function assignDamage(attacker: Unit, target: Unit): string {
  if (!attacker.combatStatus.alive || !target.combatStatus.alive) return '';
  const damage = calcDmg(attacker);
  target.combatStatus.health -= damage;
  if (target.combatStatus.health <= 0) {
    target.combatStatus.health = 0;
    target.combatStatus.alive = false;
    return `${attacker.name} attacks ${target.name} for ${damage} and defeats them!`;
  }
  return `${attacker.name} attacks ${target.name} for ${damage}. (${target.combatStatus.health} HP left)`;
}
