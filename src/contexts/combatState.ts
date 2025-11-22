import type { CombatState, InitiativeEntry } from '../types/combat';
import type { Unit } from '../types/unit';
import { TeamEnum } from '../types/unit';
import cloneDeep from 'lodash.clonedeep';
import { getEffectiveInitiative } from '../utils/units/leveling';
import { assignDamage } from '../utils/combat/damage';
import { rollD8 } from '../utils/random';
import {
  initializeCountdownTracker,
  decrementCountdowns,
  getReadyActions,
  sortByInitiativeOrder,
  resetCountdown,
  getUnit,
  isCombatOver,
} from '../utils/combat/countdown';

// Roll initiative for all living units (used for tie-breaking in countdown system)
function rollInitiativeOrder(playerTeam: Unit[], enemyTeam: Unit[]): InitiativeEntry[] {
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
  return entries;
}

// Reset combat to initial state with countdown system
export function combatReset(playerTeam: Unit[], enemyTeam: Unit[]): CombatState {
  const clonedPlayerTeam = cloneDeep(playerTeam);
  const clonedEnemyTeam = cloneDeep(enemyTeam);

  return {
    playerTeam: clonedPlayerTeam,
    enemyTeam: clonedEnemyTeam,
    initiativeOrder: rollInitiativeOrder(clonedPlayerTeam, clonedEnemyTeam),
    countdownTracker: {
      activeCountdowns: initializeCountdownTracker(clonedPlayerTeam, clonedEnemyTeam),
    },
    round: 1,
    combatLog: ['--- Combat Start ---'],
  };
}

// Execute a single countdown-based round
export function combatNextRound(state: CombatState): CombatState {
  let updatedPlayerTeam = cloneDeep(state.playerTeam);
  let updatedEnemyTeam = cloneDeep(state.enemyTeam);
  let activeCountdowns = cloneDeep(state.countdownTracker.activeCountdowns);
  const log = [...state.combatLog];

  // Decrement all active countdowns
  activeCountdowns = decrementCountdowns(activeCountdowns);

  // Get all units ready to act (countdown = 0)
  const readyActions = getReadyActions(activeCountdowns);

  // Sort by initiative order for deterministic tie-breaking
  const sortedActions = sortByInitiativeOrder(readyActions, state.initiativeOrder);

  // Execute each ready action in order
  for (const action of sortedActions) {
    const attacker = getUnit(action.team, action.unitIndex, updatedPlayerTeam, updatedEnemyTeam);

    if (!attacker || !attacker.combatStatus.alive) {
      continue; // Skip if dead or not found
    }

    const attackerTeam = action.team === TeamEnum.Player ? updatedPlayerTeam : updatedEnemyTeam;
    const defenderTeam = action.team === TeamEnum.Player ? updatedEnemyTeam : updatedPlayerTeam;

    // Get targets and apply damage
    const targetIndices = attacker.attack.targetingRule.getTargets(
      attacker,
      attackerTeam,
      defenderTeam
    );

    let logMsg = '';
    if (targetIndices.length > 0) {
      const logs: string[] = [];
      targetIndices.forEach((idx) => {
        const target = defenderTeam[idx];
        logs.push(assignDamage(attacker, target));
      });
      logMsg = logs.join(' | ');
    } else {
      logMsg = `${attacker.name} has no valid targets.`;
    }
    log.push(logMsg);

    // Reset this unit's countdown to attack again
    const countdownIndex = activeCountdowns.findIndex(
      (c) => c.team === action.team && c.unitIndex === action.unitIndex
    );
    if (countdownIndex >= 0) {
      activeCountdowns[countdownIndex] = resetCountdown(
        activeCountdowns[countdownIndex],
        attacker
      );
    }
  }

  // Remove dead units from countdown tracking
  const updatedCountdowns = activeCountdowns.filter((countdown) => {
    const unit = getUnit(countdown.team, countdown.unitIndex, updatedPlayerTeam, updatedEnemyTeam);
    return unit && unit.combatStatus.alive;
  });

  return {
    playerTeam: updatedPlayerTeam,
    enemyTeam: updatedEnemyTeam,
    initiativeOrder: state.initiativeOrder,
    countdownTracker: {
      activeCountdowns: updatedCountdowns,
    },
    round: state.round + 1,
    combatLog: log,
  };
}

// Skip to next round where actions will execute
export function skipToNextAction(state: CombatState): CombatState {
  let nextState = state;
  let actionsExecuted = false;

  while (!actionsExecuted && !isCombatOver(nextState.playerTeam, nextState.enemyTeam)) {
    const prevLogLength = nextState.combatLog.length;
    nextState = combatNextRound(nextState);
    // If log entries were added, actions were executed
    if (nextState.combatLog.length > prevLogLength) {
      actionsExecuted = true;
    }
  }

  return nextState;
}

// Auto-play combat until completion
export function combatComplete(state: CombatState): CombatState {
  let nextState = state;
  while (!isCombatOver(nextState.playerTeam, nextState.enemyTeam)) {
    nextState = combatNextRound(nextState);
  }
  return nextState;
}