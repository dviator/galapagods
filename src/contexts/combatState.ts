import type { CombatState, InitiativeEntry } from '../types/combat';
import type { Unit } from '../types/unit';
import { TeamEnum } from '../types/unit';
import cloneDeep from 'lodash.clonedeep';
import { getEffectiveInitiative } from '../utils/units/leveling';

function calcDmg(attacker: Unit): number {
  const base = attacker.attack?.baseDmg ?? 1;
  const bonus = attacker.attack?.bonusAbilityDmg ? attacker.attack.bonusAbilityDmg(attacker) : 0;
  return base + bonus;
}

function assignDamage(attacker: Unit, target: Unit): string {
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

function rollRandomInitVal(): number {
  return Math.floor(Math.random() * 8) + 1;
}

// Roll initiative for all living units
export function combatRollInitiative(state: CombatState): CombatState {
  const playerTeam = cloneDeep(state.playerTeam);
  const enemyTeam = cloneDeep(state.enemyTeam);
  const entries: InitiativeEntry[] = [];
  playerTeam.forEach((e, i) => {
    if (e.combatStatus.alive) {
      e.combatStatus.initiative = Math.floor(rollRandomInitVal() + getEffectiveInitiative(e));
      entries.push({ team: TeamEnum.Player, index: i, initiative: e.combatStatus.initiative });
    }
  });
  enemyTeam.forEach((e, i) => {
    if (e.combatStatus.alive) {
      e.combatStatus.initiative = Math.floor(rollRandomInitVal() + getEffectiveInitiative(e));
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

// Advance to the next living unit index after a given index
function advanceToNextLivingUnitIndex(initiativeOrder: InitiativeEntry[], playerTeam: Unit[], enemyTeam: Unit[], startIdx: number): number {
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