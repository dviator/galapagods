import type { Unit } from '../types/unit';

export function isTeamDefeated(team: Unit[]): boolean {
  return team.every(unit => !unit.combatStatus.alive);
}

export function isTeamAlive(team: Unit[]): boolean {
  return team.some(unit => unit.combatStatus.alive);
}
