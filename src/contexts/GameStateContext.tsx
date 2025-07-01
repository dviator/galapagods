import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { Unit, Team } from '../types';
import { createUnit } from '../utils/units/createCharacter';
import bearImg from '../assets/units/bear.png';
import eagleImg from '../assets/units/eagle.png';
import tigerImg from '../assets/units/tiger.png';
import {
  bearSheet,
  tigerSheet,
  eagleSheet,
  gooberSheet,
  gooberLevelProgression
} from '../data/characterSheets';
import {
  slashAttack,
  pounceAttack,
  swoopAttack,
  slamAttack
} from '../data/attacks';
import { TeamEnum } from '../types';
import cloneDeep from 'lodash.clonedeep';
import { assignDamage } from '../utils/units/combatState';

interface InitiativeEntry {
  team: Team;
  index: number;
  initiative: number;
}

interface GameState {
  playerTeam: Unit[];
  setPlayerTeam: React.Dispatch<React.SetStateAction<Unit[]>>;
  enemyTeam: Unit[];
  setEnemyTeam: React.Dispatch<React.SetStateAction<Unit[]>>;
  round: number;
  setRound: React.Dispatch<React.SetStateAction<number>>;
  combatLog: string[];
  setCombatLog: React.Dispatch<React.SetStateAction<string[]>>;
  initiativeOrder: InitiativeEntry[];
  currentTurn: number;
  handleNextAttack: () => void;
  handleNextRound: () => void;
  handleReset: () => void;
  startNextRound: (playerTeam: Unit[], enemyTeam: Unit[], prevLog: string[], round: number) => void;
  transitionToShop: () => void;
  transitionToDeath: () => void;
  spawnNewGooberEnemyTeam: () => Unit[];
  resetInitiativeOrder: () => void;
  transitionToCombat: () => void;
  phase: string;
  setPhase: React.Dispatch<React.SetStateAction<string>>;
}

const initialPlayerTeam: Unit[] = [
  createUnit("tiger-1", "Tiger", "character", tigerImg, tigerSheet, 10, 5, pounceAttack, { level: 1, xp: 0, xpToNext: 10 }),
  createUnit("bear-1", "Bear", "character", bearImg, bearSheet, 12, 3, slashAttack, { level: 1, xp: 0, xpToNext: 10 }),
  createUnit("eagle-1", "Eagle", "character", eagleImg, eagleSheet, 8, 7, swoopAttack, { level: 1, xp: 0, xpToNext: 10 }),
];
const initialEnemyTeam: Unit[] = [
  createUnit("goober-1", "Goob1", "enemy", undefined, gooberSheet, 10, 2, slamAttack, gooberLevelProgression),
  createUnit("goober-2", "Goob2", "enemy", undefined, gooberSheet, 10, 4, slamAttack, gooberLevelProgression),
  createUnit("goober-3", "Goob3", "enemy", undefined, gooberSheet, 10, 3, slamAttack, gooberLevelProgression),
];

const GameStateContext = createContext<GameState | undefined>(undefined);

function rollInitiative(teamA: Unit[], teamB: Unit[]): InitiativeEntry[] {
  const entries: InitiativeEntry[] = [];
  teamA.forEach((e, i) => {
    if (e.combatStatus.alive) {
      e.combatStatus.initiative = Math.floor(Math.random() * 10) + 1 + e.baseInitiative;
      entries.push({ team: TeamEnum.Player, index: i, initiative: e.combatStatus.initiative });
    }
  });
  teamB.forEach((e, i) => {
    if (e.combatStatus.alive) {
      e.combatStatus.initiative = Math.floor(Math.random() * 10) + 1 + e.baseInitiative;
      entries.push({ team: TeamEnum.Enemy, index: i, initiative: e.combatStatus.initiative });
    }
  });
  entries.sort((a, b) => b.initiative - a.initiative);
  return entries;
}

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerTeam, setPlayerTeam] = useState<Unit[]>(initialPlayerTeam);
  const [enemyTeam, setEnemyTeam] = useState<Unit[]>(initialEnemyTeam);
  const [round, setRound] = useState(1);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [phase, setPhase] = useState('combat');
  const [initiativeOrder, setInitiativeOrder] = useState<InitiativeEntry[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);

  const startNextRound = useCallback((teamA: Unit[], teamB: Unit[], prevLog: string[], roundNum: number) => {
    setRound(roundNum);
    const newInitiativeOrder = rollInitiative(teamA, teamB);
    setInitiativeOrder(newInitiativeOrder);
    setCurrentTurn(0);
    setCombatLog(prevLog.length > 0 ? [...prevLog, `--- Round ${roundNum} (Initiative rolled) ---`] : [`--- Round ${roundNum} (Initiative rolled) ---`]);
    setPlayerTeam([...teamA]);
    setEnemyTeam([...teamB]);
  }, []);

  const handleNextAttack = useCallback(() => {
    if (currentTurn >= initiativeOrder.length) {
      // If round is over, start next round
      const newPlayerTeam = cloneDeep(playerTeam);
      const newEnemyTeam = cloneDeep(enemyTeam);
      startNextRound(newPlayerTeam, newEnemyTeam, combatLog, round + 1);
      setPlayerTeam(newPlayerTeam);
      setEnemyTeam(newEnemyTeam);
      return;
    }
    const entry = initiativeOrder[currentTurn];
    const attackerTeam = entry.team === TeamEnum.Player ? cloneDeep(playerTeam) : cloneDeep(enemyTeam);
    const defenderTeam = entry.team === TeamEnum.Player ? cloneDeep(enemyTeam) : cloneDeep(playerTeam);
    const attacker = attackerTeam[entry.index];
    if (!attacker.combatStatus.alive) {
      setCurrentTurn(prev => prev + 1);
      return;
    }
    const targetIndices = attacker.attack.targetingRule.getTargets(attacker, attackerTeam, defenderTeam);
    let logMsg = "";
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
    // After attack, update the correct team state with a deep clone
    if (entry.team === TeamEnum.Player) {
      setEnemyTeam(defenderTeam);
      setPlayerTeam(attackerTeam);
    } else {
      setPlayerTeam(defenderTeam);
      setEnemyTeam(attackerTeam);
    }
    setCurrentTurn(prev => prev + 1);
    setCombatLog(prev => [...prev, logMsg]);
  }, [currentTurn, initiativeOrder, playerTeam, enemyTeam, startNextRound, combatLog, round]);

  const handleNextRound = useCallback(() => {
    let turn = currentTurn;
    const logCopy = [...combatLog];
    let newPlayerTeam = cloneDeep(playerTeam);
    let newEnemyTeam = cloneDeep(enemyTeam);
    while (turn < initiativeOrder.length) {
      const entry = initiativeOrder[turn];
      const attackerTeam = entry.team === TeamEnum.Player ? newPlayerTeam : newEnemyTeam;
      const defenderTeam = entry.team === TeamEnum.Player ? newEnemyTeam : newPlayerTeam;
      const attacker = attackerTeam[entry.index];
      if (attacker.combatStatus.alive) {
        const targetIndices = attacker.attack.targetingRule.getTargets(attacker, attackerTeam, defenderTeam);
        let logMsg = "";
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
        logCopy.push(logMsg);
      }
      // After each attack, update both teams with a deep clone
      newPlayerTeam = cloneDeep(newPlayerTeam);
      newEnemyTeam = cloneDeep(newEnemyTeam);
      turn++;
    }
    // Start new round
    startNextRound(newPlayerTeam, newEnemyTeam, logCopy, round + 1);
    setPlayerTeam(newPlayerTeam);
    setEnemyTeam(newEnemyTeam);
  }, [currentTurn, initiativeOrder, playerTeam, enemyTeam, combatLog, round, startNextRound]);

  const handleReset = useCallback(() => {
    setRound(1);
    setPlayerTeam(cloneDeep(initialPlayerTeam));
    setEnemyTeam(cloneDeep(initialEnemyTeam));
    setCombatLog([`--- Round 1 (Initiative rolled) ---`]);
    startNextRound(cloneDeep(initialPlayerTeam), cloneDeep(initialEnemyTeam), [], 1);
    setPhase('combat');
  }, [startNextRound]);

  const transitionToShop = useCallback(() => setPhase('shop'), []);
  const transitionToDeath = useCallback(() => setPhase('death'), []);

  // Helper to create a new goober enemy team (not stateful)
  const createEnemyGooberTeam = () => [1, 2, 3].map(i =>
    createUnit(
      `goober-${Date.now()}-${i}`,
      `Goob${i}`,
      'enemy',
      undefined,
      gooberSheet,
      10,
      2 + i, // Vary initiative a bit
      slamAttack,
      gooberLevelProgression
    )
  );

  // Roll initiative automatically when phase transitions to combat and initiativeOrder is empty
  useEffect(() => {
    if (phase === 'combat' && initiativeOrder.length === 0) {
      // Only roll if there are alive units on both teams
      if (playerTeam.some(u => u.combatStatus.alive) && enemyTeam.some(u => u.combatStatus.alive)) {
        if (round === 0) {
          setRound(1);
          startNextRound(cloneDeep(playerTeam), cloneDeep(enemyTeam), combatLog, 1);
        } else {
          startNextRound(cloneDeep(playerTeam), cloneDeep(enemyTeam), combatLog, round);
        }
      }
    }
  }, [phase, initiativeOrder.length, playerTeam, enemyTeam, startNextRound, combatLog, round]);

  // Function to reset initiative order
  const resetInitiativeOrder = useCallback(() => {
    setInitiativeOrder([]);
  }, []);

  // Centralized transition to combat phase
  const transitionToCombat = useCallback(() => {
    console.log('[transitionToCombat] called', {
      playerTeam,
      round,
      combatLog,
      phaseBefore: phase
    });
    const newEnemyTeam = createEnemyGooberTeam();
    setEnemyTeam(newEnemyTeam);
    // Start next round with the new enemy team and current player team
    startNextRound(cloneDeep(playerTeam), cloneDeep(newEnemyTeam), combatLog, 1);
    setPhase('combat');
    setTimeout(() => {
      console.log('[transitionToCombat] after setPhase, phase:', phase);
    }, 0);
  }, [playerTeam, combatLog, startNextRound, phase]);

  return (
    <GameStateContext.Provider value={{
      playerTeam, setPlayerTeam,
      enemyTeam, setEnemyTeam,
      round, setRound,
      combatLog, setCombatLog,
      initiativeOrder,
      currentTurn,
      handleNextAttack,
      handleNextRound,
      handleReset,
      startNextRound,
      transitionToShop,
      transitionToDeath,
      spawnNewGooberEnemyTeam: createEnemyGooberTeam,
      resetInitiativeOrder,
      transitionToCombat,
      phase, setPhase,
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

export { GameStateContext };