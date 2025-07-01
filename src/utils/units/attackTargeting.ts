import type { TargetingRule } from '../../types';

export const frontTargetingRule: TargetingRule = {
  name: "Front",
  // Targets the enemy in the same position as the attacker; if not alive, moves right and wraps
  getTargets: (attacker, attackingTeam, defendingTeam) => {
    const attackerIndex = attackingTeam.findIndex(u => u.id === attacker.id);
    if (attackerIndex === -1 || defendingTeam.length === 0) return [];
    for (let offset = 0; offset < defendingTeam.length; offset++) {
      const targetIndex = (attackerIndex + offset) % defendingTeam.length;
      if (defendingTeam[targetIndex]?.combatStatus.alive) {
        return [targetIndex];
      }
    }
    return [];
  }
};

export const rightTargetingRule: TargetingRule = {
  name: "Right",
  // Targets the enemy in the defending team whose index matches the attacker's index in the attacking team, +1 to the right (wrapping)
  getTargets: (attacker, attackingTeam, defendingTeam) => {
    const attackerIndex = attackingTeam.findIndex(u => u.id === attacker.id);
    if (attackerIndex === -1 || defendingTeam.length === 0) return [];
    let offset = 1;
    while (offset <= defendingTeam.length) {
      const targetIndex = (attackerIndex + offset) % defendingTeam.length;
      if (defendingTeam[targetIndex]?.combatStatus.alive) {
        return [targetIndex];
      }
      offset++;
    }
    return [];
  }
};

export const aoeTargetingRule: TargetingRule = {
  name: "AOE",
  // Targets all alive units in the defending team
  getTargets: (_attacker, _attackingTeam, defendingTeam) => {
    return defendingTeam
      .map((unit, i) => (unit.combatStatus.alive ? i : -1))
      .filter(i => i !== -1);
  }
};