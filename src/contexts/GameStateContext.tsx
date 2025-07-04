import React, { createContext, useState, useCallback } from 'react';
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
} from '../data/characterSheets';
import {
  slashAttack,
  pounceAttack,
  swoopAttack,
  slamAttack
} from '../data/attacks';
import cloneDeep from 'lodash.clonedeep';
import {
  combatReset,
  combatNextAttack,
  combatNextRound,
  combatRollInitiative
} from './combatState';
import type { CombatState } from '../types/combat';

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
  runNumber: number;
  setRunNumber: React.Dispatch<React.SetStateAction<number>>;
  combatLog: string[];
  setCombatLog: React.Dispatch<React.SetStateAction<string[]>>;
  initiativeOrder: InitiativeEntry[];
  currentTurn: number;
  isRoundComplete: boolean;
  handleNextAttack: () => void;
  handleNextRound: () => void;
  handleReset: () => void;
  handleNewRun: () => void;
  startNextRound: (playerTeam: Unit[], enemyTeam: Unit[], prevLog: string[], round: number) => void;
  transitionToShop: () => void;
  transitionToDeath: () => void;
  spawnNewGooberEnemyTeam: () => Unit[];
  resetInitiativeOrder: () => void;
  transitionToCombat: () => void;
  phase: string;
  setPhase: React.Dispatch<React.SetStateAction<string>>;
  combatCount: number;
}

const initialPlayerTeam: Unit[] = [
  createUnit("tiger-1", "Tiger", "character", tigerImg, 10, 5, pounceAttack, tigerSheet),
  createUnit("bear-1", "Bear", "character", bearImg, 12, 3, slashAttack, bearSheet),
  createUnit("eagle-1", "Eagle", "character", eagleImg, 6, 8, swoopAttack, eagleSheet),
];
const initialEnemyTeam: Unit[] = [
  createUnit("goober-1", "Goob1", "enemy", undefined, 6, 2, slamAttack, gooberSheet),
  createUnit("goober-2", "Goob2", "enemy", undefined, 6, 4, slamAttack, gooberSheet),
  createUnit("goober-3", "Goob3", "enemy", undefined, 6, 3, slamAttack, gooberSheet),
];

const GameStateContext = createContext<GameState | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Replace individual combat state pieces with a single combatState
  const [combatState, setCombatState] = useState<CombatState>(() =>
    combatReset(initialPlayerTeam, initialEnemyTeam)
  );
  const [runNumber, setRunNumber] = useState(1);
  const [phase, setPhase] = useState('combat');
  const [combatCount, setCombatCount] = useState(0);

  // Handlers using the new combat state helpers
  const handleNextAttack = useCallback(() => {
    setCombatState(prev => combatNextAttack(prev));
  }, []);

  const handleNextRound = useCallback(() => {
    setCombatState(prev => combatNextRound(prev));
  }, []);

  const handleReset = useCallback(() => {
    setCombatState(combatReset(initialPlayerTeam, initialEnemyTeam));
    setPhase('combat');
  }, []);

  const handleNewRun = useCallback(() => {
    setRunNumber(prev => prev + 1);
    handleReset();
    setCombatCount(0);
  }, [handleReset]);

  const transitionToShop = useCallback(() => {
    setCombatCount(prev => prev + 1);
    setPhase('shop');
  }, []);
  const transitionToDeath = useCallback(() => {
    setCombatCount(prev => prev + 1);
    setPhase('death');
  }, []);

  // Helper to create a new goober enemy team (not stateful)
  const createEnemyGooberTeam = () => [1, 2, 3].map(i =>
    createUnit(
      `goober-${Date.now()}-${i}`,
      `Goob${i}`,
      'enemy',
      undefined,
      6,
      2 + i, // Vary initiative a bit
      slamAttack,
      gooberSheet,
    )
  );

  // Centralized enemy team reset helper
  const getOrCreateEnemyTeam = () => {
    const eTeam = cloneDeep(combatState.enemyTeam);
    const allEnemiesDead = !eTeam.length || eTeam.every(e => !e.combatStatus.alive);
    return allEnemiesDead ? createEnemyGooberTeam() : eTeam;
  };

  // Centralized transition to combat phase (no args)
  const transitionToCombat = useCallback(() => {
    const pTeam = cloneDeep(combatState.playerTeam);
    const eTeam = getOrCreateEnemyTeam();
    setCombatState(combatReset(pTeam, eTeam));
    setPhase('combat');
  }, [combatState.playerTeam, combatState.enemyTeam]);

  // Context value now exposes combatState and setCombatState, plus other handlers
  return (
    <GameStateContext.Provider value={{
      playerTeam: combatState.playerTeam,
      setPlayerTeam: (fn) => setCombatState(prev => ({ ...prev, playerTeam: typeof fn === 'function' ? fn(prev.playerTeam) : fn })),
      enemyTeam: combatState.enemyTeam,
      setEnemyTeam: (fn) => setCombatState(prev => ({ ...prev, enemyTeam: typeof fn === 'function' ? fn(prev.enemyTeam) : fn })),
      round: combatState.round,
      setRound: (val) => setCombatState(prev => ({ ...prev, round: typeof val === 'function' ? val(prev.round) : val })),
      runNumber, setRunNumber,
      combatLog: combatState.combatLog,
      setCombatLog: (fn) => setCombatState(prev => ({ ...prev, combatLog: typeof fn === 'function' ? fn(prev.combatLog) : fn })),
      initiativeOrder: combatState.initiativeOrder,
      currentTurn: combatState.currentTurn,
      isRoundComplete: combatState.isRoundComplete,
      handleNextAttack,
      handleNextRound,
      handleReset,
      handleNewRun,
      startNextRound: (playerTeam, enemyTeam, prevLog, round) => {
        // For compatibility, re-roll initiative and update round
        setCombatState(prev => combatRollInitiative({
          ...prev,
          playerTeam,
          enemyTeam,
          combatLog: prevLog,
          round,
        }));
      },
      transitionToShop,
      transitionToDeath,
      spawnNewGooberEnemyTeam: createEnemyGooberTeam,
      resetInitiativeOrder: () => setCombatState(prev => ({ ...prev, initiativeOrder: [] })),
      transitionToCombat,
      phase, setPhase,
      combatCount,
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

export { GameStateContext };