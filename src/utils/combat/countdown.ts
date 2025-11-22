import type { ActionCountdown, InitiativeEntry } from '../../types/combat';
import type { Unit, Team } from '../../types/unit';
import { TeamEnum } from '../../types/unit';

/**
 * Initialize countdown tracker with all living units
 * Each unit starts with their attack's countdown value
 */
export function initializeCountdownTracker(
  playerTeam: Unit[],
  enemyTeam: Unit[]
): ActionCountdown[] {
  const activeCountdowns: ActionCountdown[] = [];

  playerTeam.forEach((unit, index) => {
    if (unit.combatStatus.alive) {
      activeCountdowns.push({
        unitIndex: index,
        team: TeamEnum.Player,
        currentCountdown: unit.attack.countdown,
      });
    }
  });

  enemyTeam.forEach((unit, index) => {
    if (unit.combatStatus.alive) {
      activeCountdowns.push({
        unitIndex: index,
        team: TeamEnum.Enemy,
        currentCountdown: unit.attack.countdown,
      });
    }
  });

  return activeCountdowns;
}

/**
 * Decrement all active countdowns by 1
 */
export function decrementCountdowns(activeCountdowns: ActionCountdown[]): ActionCountdown[] {
  return activeCountdowns.map((countdown) => ({
    ...countdown,
    currentCountdown: countdown.currentCountdown - 1,
  }));
}

/**
 * Find all units whose countdown has reached 0
 */
export function getReadyActions(activeCountdowns: ActionCountdown[]): ActionCountdown[] {
  return activeCountdowns.filter((countdown) => countdown.currentCountdown === 0);
}

/**
 * Sort ready actions by initiative order for deterministic tie-breaking
 */
export function sortByInitiativeOrder(
  readyActions: ActionCountdown[],
  initiativeOrder: InitiativeEntry[]
): ActionCountdown[] {
  return readyActions.sort((a, b) => {
    const aInitIndex = initiativeOrder.findIndex(
      (entry) => entry.team === a.team && entry.index === a.unitIndex
    );
    const bInitIndex = initiativeOrder.findIndex(
      (entry) => entry.team === b.team && entry.index === b.unitIndex
    );
    // Earlier in initiative order comes first
    return aInitIndex - bInitIndex;
  });
}

/**
 * Reset a unit's countdown to its base attack countdown value
 */
export function resetCountdown(
  countdown: ActionCountdown,
  unit: Unit
): ActionCountdown {
  return {
    ...countdown,
    currentCountdown: unit.attack.countdown,
  };
}

/**
 * Remove a unit from active countdowns (e.g., when it dies)
 */
export function removeCountdown(
  activeCountdowns: ActionCountdown[],
  team: Team,
  unitIndex: number
): ActionCountdown[] {
  return activeCountdowns.filter(
    (countdown) => !(countdown.team === team && countdown.unitIndex === unitIndex)
  );
}

/**
 * Get unit from team by index
 */
export function getUnit(
  team: Team,
  unitIndex: number,
  playerTeam: Unit[],
  enemyTeam: Unit[]
): Unit | undefined {
  const teamArray = team === TeamEnum.Player ? playerTeam : enemyTeam;
  return teamArray[unitIndex];
}

/**
 * Check if combat is over (all units on one team are dead)
 */
export function isCombatOver(playerTeam: Unit[], enemyTeam: Unit[]): boolean {
  const playersAlive = playerTeam.some((unit) => unit.combatStatus.alive);
  const enemiesAlive = enemyTeam.some((unit) => unit.combatStatus.alive);
  return !playersAlive || !enemiesAlive;
}
