import React, { createContext, useState, useCallback } from 'react';
import type { Unit } from '../types';
import { Phase } from '../types';
import { createGoober } from '../data/enemies';
import {
  combatReset,
  combatNextAttack,
  combatNextRound,
  combatRollInitiative
} from './combatState';
import type { CombatState, InitiativeEntry } from '../types/combat';
import type { StatName } from '../types/stats';
import { worlds } from '../data/worlds';
import { useWorldProgressionManager } from './worldProgressionHooks';
import type { World, WorldState } from '../types/world';
import { useTeam } from './teamContext';
import { healAndReviveTeam } from '../utils/units/healing';
import { calculateGoldReward } from '../utils/rewards';
import { getEnemiesForLevel } from '../utils/world/spawning';

export interface GameState {
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
  resetInitiativeOrder: () => void;
  transitionToCombat: () => void;
  transitionToLab: () => void;
  phase: Phase;
  setPhase: React.Dispatch<React.SetStateAction<Phase>>;
  combatCount: number;
  gold: number;
  setGold: React.Dispatch<React.SetStateAction<number>>;
  geneticPopup: { unitId: string; stat: StatName; grade: string } | null;
  showGeneticPopup: (unitId: string, stat: StatName, grade: string) => void;
  worldState: WorldState;
  currentWorld: World;
  playerTeam: Unit[];
}

const initialEnemyTeam: Unit[] = [
  createGoober(),
  createGoober(),
  createGoober(),
];

const GameStateContext = createContext<GameState | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeTeam, updateActiveTeam } = useTeam();

  const [combatState, setCombatState] = useState<CombatState>(() =>
    combatReset(activeTeam, initialEnemyTeam)
  );
  const [runNumber, setRunNumber] = useState(1);
  const [phase, setPhase] = useState<Phase>(Phase.Combat);
  const [combatCount, setCombatCount] = useState(0);
  // Gold state management
  const [gold, setGold] = useState(0);
  // Genetic popup state
  const [geneticPopup, setGeneticPopup] = useState<{ unitId: string; stat: StatName; grade: string } | null>(null);
  // World progression state (now managed by hook)
  const {
    worldState,
    currentWorld,
    completeWorldLevel,
    resetWorldProgression,
  } = useWorldProgressionManager(worlds);

  // Handlers using the new combat state helpers
  const handleNextAttack = useCallback(() => {
    setCombatState(prev => combatNextAttack(prev));
  }, []);

  const handleNextRound = useCallback(() => {
    setCombatState(prev => combatNextRound(prev));
  }, []);

  const handleReset = useCallback(() => {
    setCombatState(combatReset(activeTeam, initialEnemyTeam));
    setPhase(Phase.Combat);
  }, [activeTeam]);

  const createEnemyTeamForCurrentLevel = useCallback(() => {
    return getEnemiesForLevel(currentWorld, worldState.currentLevel);
  }, [currentWorld, worldState.currentLevel]);

  const handleNewRun = useCallback(() => {
    const healedTeam = healAndReviveTeam(activeTeam);
    updateActiveTeam(() => healedTeam);
    setRunNumber(prev => prev + 1);
    resetWorldProgression();
    setCombatState(combatReset(healedTeam, createEnemyTeamForCurrentLevel()));
    setPhase(Phase.Combat);
    setCombatCount(0);
  }, [resetWorldProgression, activeTeam, updateActiveTeam, createEnemyTeamForCurrentLevel]);

  // Award gold after combat: 1 gold per level of enemy defeated
  const awardGoldAfterCombat = useCallback(() => {
    const defeatedEnemies = combatState.enemyTeam.filter(e => !e.combatStatus.alive);
    const goldEarned = calculateGoldReward(defeatedEnemies);
    setGold(prev => prev + goldEarned);
  }, [combatState.enemyTeam]);

  const transitionToShop = useCallback(() => {
    setCombatCount(prev => prev + 1);
    awardGoldAfterCombat();
    completeWorldLevel();
    updateActiveTeam(() => combatState.playerTeam);
    setPhase(Phase.Shop);
  }, [awardGoldAfterCombat, completeWorldLevel, updateActiveTeam, combatState.playerTeam]);

  const transitionToDeath = useCallback(() => {
    setCombatCount(prev => prev + 1);
    resetWorldProgression();
    setPhase(Phase.Death);
  }, [resetWorldProgression]);

  const transitionToCombat = useCallback(() => {
    const eTeam = createEnemyTeamForCurrentLevel();
    setCombatState(combatReset(activeTeam, eTeam));
    setPhase(Phase.Combat);
  }, [activeTeam, createEnemyTeamForCurrentLevel]);

  const transitionToLab = useCallback(() => {
    const healedTeam = healAndReviveTeam(activeTeam);
    updateActiveTeam(() => healedTeam);
    setPhase(Phase.Lab);
  }, [activeTeam, updateActiveTeam]);

  // Genetic popup method
  const showGeneticPopup = (unitId: string, stat: StatName, grade: string) => {
    setGeneticPopup({ unitId, stat, grade });
    setTimeout(() => setGeneticPopup(null), 2500);
  };

  return (
    <GameStateContext.Provider value={{
      playerTeam: combatState.playerTeam,
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
      resetInitiativeOrder: () => setCombatState(prev => ({ ...prev, initiativeOrder: [] })),
      transitionToCombat,
      transitionToLab,
      phase, setPhase,
      combatCount,
      gold,
      setGold,
      geneticPopup,
      showGeneticPopup,
      worldState,
      currentWorld,
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

export { GameStateContext };