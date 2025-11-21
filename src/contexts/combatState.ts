import type { CombatState, InitiativeEntry } from '../types/combat';
import type { Unit } from '../types/unit';
import { TeamEnum } from '../types/unit';
import cloneDeep from 'lodash.clonedeep';
import { getEffectiveInitiative } from '../utils/units/leveling';
import { assignDamage } from '../utils/combat/damage';
import { advanceToNextLivingUnitIndex } from '../utils/combat/initiative';
import { rollD8 } from '../utils/random';

// Roll initiative for all living units
export function combatRollInitiative(state: CombatState): CombatState {
  const playerTeam = cloneDeep(state.playerTeam);
  const enemyTeam = cloneDeep(state.enemyTeam);
  const entries: InitiativeEntry[] = [];
  playerTeam.forEach((e, i) => {
    if (e.combatStatus.alive) {
      e.combatStatus.initiative = Math.floor(rollD8() + getEffectiveInitiative(e));
      entries.push({ team: TeamEnum.Player, index: i, initiative: e.combatStatus.initiative });
    }
  });
  enemyTeam.forEach((e, i) => {
    if (e.combatStatus.alive) {
      e.combatStatus.initiative = Math.floor(rollD8() + getEffectiveInitiative(e));
      entries.push({ team: TeamEnum.Enemy, index: i, initiative: e.combatStatus.initiative });
    }
  });
  entries.sort((a, b) => b.initiative - a.initiative);
  return {
    ...state,
    playerTeam,
    enemyTeam,
    initiativeOrder: entries,
    currentTurn: 0,
    isRoundComplete: false,
    combatLog: [
      ...state.combatLog,
      `--- Round ${state.round} (Initiative rolled) ---`
    ],
  };
}

// Reset combat to initial state
export function combatReset(playerTeam: Unit[], enemyTeam: Unit[]): CombatState {
  const initialState: CombatState = {
    playerTeam: cloneDeep(playerTeam),
    enemyTeam: cloneDeep(enemyTeam),
    initiativeOrder: [],
    currentTurn: 0,
    round: 1,
    combatLog: [],
    isRoundComplete: false,
  };
  return combatRollInitiative(initialState);
}

// Perform the next attack in the initiative order
export function combatNextAttack(state: CombatState): CombatState {
  const { playerTeam, enemyTeam, initiativeOrder, currentTurn, combatLog } = state;
  const updatedPlayerTeam = cloneDeep(playerTeam);
  const updatedEnemyTeam = cloneDeep(enemyTeam);
  const log = [...combatLog];
  let nextTurn = currentTurn;
  if (nextTurn < initiativeOrder.length) {
    const entry = initiativeOrder[nextTurn];
    const attackerTeam = entry.team === TeamEnum.Player ? updatedPlayerTeam : updatedEnemyTeam;
    const defenderTeam = entry.team === TeamEnum.Player ? updatedEnemyTeam : updatedPlayerTeam;
    const attacker = attackerTeam[entry.index];
    if (attacker.combatStatus.alive) {
      const targetIndices = attacker.attack.targetingRule.getTargets(attacker, attackerTeam, defenderTeam);
      let logMsg = '';
      if (targetIndices.length > 0) {
        const logs: string[] = [];
        targetIndices.forEach(idx => {
          const target = defenderTeam[idx];
          logs.push(assignDamage(attacker, target));
        });
        logMsg = logs.join(' | ');
      } else {
        logMsg = `${attacker.name} has no valid targets.`;
      }
      log.push(logMsg);
    }
  }
  // Advance to the next living unit for the next turn, using updated teams
  nextTurn = advanceToNextLivingUnitIndex(initiativeOrder, updatedPlayerTeam, updatedEnemyTeam, nextTurn);
  const isRoundComplete = nextTurn >= initiativeOrder.length;
  return {
    ...state,
    playerTeam: updatedPlayerTeam,
    enemyTeam: updatedEnemyTeam,
    currentTurn: nextTurn,
    isRoundComplete,
    combatLog: log,
  };
}

// Complete the rest of the round (auto-play all remaining attacks)
export function combatNextRound(state: CombatState): CombatState {
  let nextState = state;
  while (!nextState.isRoundComplete) {
    nextState = combatNextAttack(nextState);
  }
  // Start new round
  nextState = {
    ...nextState,
    round: nextState.round + 1,
    currentTurn: 0,
    isRoundComplete: false,
  };
  return combatRollInitiative(nextState);
}