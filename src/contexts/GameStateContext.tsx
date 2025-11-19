import React, { createContext, useState, useCallback } from 'react';
import type { Unit, Team } from '../types';
import { Phase } from '../types';
import { createTiger, createBear, createEagle } from '../data/characters';
import { createGoober, } from '../data/enemies';
import cloneDeep from 'lodash.clonedeep';
import {
  combatReset,
  combatNextAttack,
  combatNextRound,
  combatRollInitiative
} from './combatState';
import type { CombatState } from '../types/combat';
import type { StatName } from '../types/stats';
import { worlds } from '../data/worlds';
import { useWorldProgressionManager } from './worldProgressionHooks';
import type { World, WorldState } from '../types/world';

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
}

const initialPlayerTeam: Unit[] = [
  createTiger(),
  createBear(),
  createEagle(),
];
const initialEnemyTeam: Unit[] = [
  createGoober(),
  createGoober(),
  createGoober(),
];

const GameStateContext = createContext<GameState | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Replace individual combat state pieces with a single combatState
  const [combatState, setCombatState] = useState<CombatState>(() =>
    combatReset(initialPlayerTeam, initialEnemyTeam)
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
    setCombatState(combatReset(initialPlayerTeam, initialEnemyTeam));
    setPhase(Phase.Combat);
  }, []);

  // Helper to create enemy team for the current level
  const createEnemyTeamForCurrentLevel = () => {
    const world = currentWorld;
    const level = world.levels.find(l => l.id === worldState.currentLevel);
    if (!level) return [];
    return level.enemies;
  };

  // On new run, reset world progression state in memory (not localStorage)
  const handleNewRun = useCallback(() => {
    setRunNumber(prev => prev + 1);
    resetWorldProgression();
    setCombatState(combatReset(initialPlayerTeam, createEnemyTeamForCurrentLevel()));
    setPhase(Phase.Combat);
    setCombatCount(0);
  }, [resetWorldProgression]);

  // Award gold after combat: 1 gold per level of enemy defeated
  const awardGoldAfterCombat = useCallback(() => {
    const defeatedEnemies = combatState.enemyTeam.filter(e => !e.combatStatus.alive);
    const goldEarned = defeatedEnemies.reduce((sum, enemy) => sum + (enemy.character?.levelProgression?.level || 1), 0);
    setGold(prev => prev + goldEarned);
  }, [combatState.enemyTeam]);

  const transitionToShop = useCallback(() => {
    setCombatCount(prev => prev + 1);
    awardGoldAfterCombat();
    completeWorldLevel();
    setPhase(Phase.Shop);
  }, [awardGoldAfterCombat, completeWorldLevel]);

  const transitionToDeath = useCallback(() => {
    setCombatCount(prev => prev + 1);
    resetWorldProgression();
    setPhase(Phase.Death);
  }, [resetWorldProgression]);

  const transitionToCombat = useCallback(() => {
    const pTeam = cloneDeep(combatState.playerTeam);
    const eTeam = createEnemyTeamForCurrentLevel();
    setCombatState(combatReset(pTeam, eTeam));
    setPhase(Phase.Combat);
  }, [combatState.playerTeam, worldState.currentLevel, currentWorld]);

  const transitionToLab = useCallback(() => {
    setPhase(Phase.Lab);
  }, []);

  // Genetic popup method
  const showGeneticPopup = (unitId: string, stat: StatName, grade: string) => {
    setGeneticPopup({ unitId, stat, grade });
    setTimeout(() => setGeneticPopup(null), 2500);
  };

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