import type { InitiativeEntry } from '../../types/combat';
import type { Unit } from '../../types/unit';
import { TeamEnum } from '../../types/unit';

/**
 * Advance to the next living unit index in the initiative order
 * @param initiativeOrder - The current initiative order
 * @param playerTeam - The player's team
 * @param enemyTeam - The enemy team
 * @param startIdx - The starting index to advance from
 * @returns The index of the next living unit, or the length of the order if none found
 */
export function advanceToNextLivingUnitIndex(
  initiativeOrder: InitiativeEntry[],
  playerTeam: Unit[],
  enemyTeam: Unit[],
  startIdx: number
): number {
  let idx = startIdx + 1;
  while (idx < initiativeOrder.length) {
    const entry = initiativeOrder[idx];
    const team = entry.team === TeamEnum.Player ? playerTeam : enemyTeam;
    const unit = team[entry.index];
    if (unit.combatStatus.alive) break;
    idx++;
  }
  return idx;
}
