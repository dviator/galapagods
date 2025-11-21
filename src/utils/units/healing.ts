import type { Unit } from '../../types/unit';

export function healAndReviveTeam(team: Unit[]): Unit[] {
  return team.map(unit => ({
    ...unit,
    combatStatus: {
      ...unit.combatStatus,
      health: unit.maxHealth,
      alive: true,
      initiative: 0,
    },
  }));
}
