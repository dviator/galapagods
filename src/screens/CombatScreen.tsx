import React, { useEffect, useState, useContext } from "react";
import type { Character } from "../types";
import { usePhaseContext } from "../usePhaseContext";
import cloneDeep from 'lodash.clonedeep';
import { ControlPanelContext } from '../components/ControlPanelContext';

type Team = Character[];

interface InitiativeEntry {
  team: "A" | "B"; // 'A' for playerTeam, 'B' for enemyTeam
  index: number;
  initiative: number;
}

interface BattleState {
  initiativeOrder: InitiativeEntry[];
  currentTurn: number;
}

type CombatScreenProps = {
  playerTeam: Team;
  setPlayerTeam: React.Dispatch<React.SetStateAction<Team>>;
  enemyTeam: Team;
  setEnemyTeam: React.Dispatch<React.SetStateAction<Team>>;
  round: number;
  combatLog: string[];
  setCombatLog: React.Dispatch<React.SetStateAction<string[]>>;
};

const HealthBar: React.FC<{ hp: number; maxHp: number }> = ({ hp, maxHp }) => {
  const frac = Math.max(0, hp) / maxHp;
  const color = frac > 0.3 ? "bg-green-700" : "bg-red-500";
  const barBg = frac === 0 ? "bg-gray-700" : "bg-gray-200";
  return (
    <div className={`w-full h-10 ${barBg} rounded flex items-center relative`} style={{ minHeight: '2.5rem' }}>
      <div
        className={`h-10 rounded transition-all duration-300 ${color}`}
        style={{ width: `${Math.round(frac * 100)}%`, minWidth: frac > 0 ? '2.5rem' : 0 }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="w-full text-center font-bold text-white drop-shadow-sm">{hp} / {maxHp}</span>
      </div>
    </div>
  );
};

const CharacterCard: React.FC<{ entity: Character & { baseInitiative?: number; initiative?: number; alive?: boolean; image?: string }; highlight?: boolean }> = ({
  entity,
  highlight,
}) => (
  <div
    className={`w-[32rem] h-32 ${
      highlight
        ? "border-8 border-yellow-400 shadow-xl"
        : "border-2 border-black"
    } rounded-lg bg-white flex overflow-hidden relative`}
  >
    <div className="w-32 h-full flex items-center justify-center bg-gray-200">
      {entity.image ? (
        <img src={entity.image} alt={entity.name} className="object-cover w-full h-full" />
      ) : (
        <span className="text-4xl font-bold text-gray-700">{entity.name}</span>
      )}
    </div>
    <div className="h-full w-1 bg-black" />
    <div className="flex-[3] h-full flex flex-col items-center justify-center gap-2 bg-white relative">
      <div className="absolute top-0 left-0 w-full" style={{ height: '33%' }}>
        <HealthBar hp={entity.health} maxHp={entity.maxHealth} />
      </div>
      <div className="flex-1 flex flex-col justify-end gap-2 w-full pb-3 pl-4" style={{ height: '67%' }}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-600">ATK</span>
            <span className="text-base font-bold text-black">{entity.attack}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-600">INIT</span>
            <span className="text-base font-bold text-black">{entity.baseInitiative}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function rollInitiative(teamA: Team, teamB: Team): InitiativeEntry[] {
  const entries: InitiativeEntry[] = [];
  teamA.forEach((e, i) => {
    if (e.alive) {
      e.initiative = Math.floor(Math.random() * 100) + 1 + e.baseInitiative;
      entries.push({ team: "A", index: i, initiative: e.initiative });
    }
  });
  teamB.forEach((e, i) => {
    if (e.alive) {
      e.initiative = Math.floor(Math.random() * 100) + 1 + e.baseInitiative;
      entries.push({ team: "B", index: i, initiative: e.initiative });
    }
  });
  entries.sort((a, b) => b.initiative - a.initiative);
  return entries;
}

function findTarget(attackerIndex: number, opposingTeam: Team): number | null {
  if (opposingTeam[attackerIndex]?.alive) return attackerIndex;
  for (let offset = 1; offset < opposingTeam.length; offset++) {
    if (
      attackerIndex - offset >= 0 &&
      opposingTeam[attackerIndex - offset]?.alive
    )
      return attackerIndex - offset;
    if (
      attackerIndex + offset < opposingTeam.length &&
      opposingTeam[attackerIndex + offset]?.alive
    )
      return attackerIndex + offset;
  }
  return null;
}

function attack(
  attacker: Character & { alive?: boolean; attack: number },
  target: Character & { alive?: boolean; health: number }
): string {
  if (!attacker.alive || !target.alive) return "";
  target.health -= attacker.attack;
  if (target.health <= 0) {
    target.health = 0;
    target.alive = false;
    return `${attacker.name} attacks ${target.name} for ${attacker.attack} and defeats them!`;
  }
  return `${attacker.name} attacks ${target.name} for ${attacker.attack}. (${target.health} HP left)`;
}

// Extracted CombatControlPanel component
const CombatControlPanel: React.FC<{
  allEnemiesDead: boolean;
  onShop: () => void;
  onNextAttack: () => void;
  onNextRound: () => void;
  onReset: () => void;
}> = ({ allEnemiesDead, onShop, onNextAttack, onNextRound, onReset }) => (
  <div className="flex flex-col gap-3 w-full h-full justify-start items-stretch">
    {allEnemiesDead ? (
      <button
        className="flex-1 min-h-[56px] px-4 py-2 bg-yellow-400 text-white font-bold rounded hover:bg-yellow-500 w-full text-lg shadow-none"
        onClick={onShop}
      >
        SHOP
      </button>
    ) : (
      <>
        <button
          className="flex-1 min-h-[56px] px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full text-lg shadow-none"
          onClick={onNextAttack}
        >
          Next Attack
        </button>
        <button
          className="flex-1 min-h-[56px] px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full text-lg shadow-none"
          onClick={onNextRound}
        >
          Next Round
        </button>
        <button
          className="flex-1 min-h-[56px] px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 w-full text-lg shadow-none"
          onClick={onReset}
        >
          Reset
        </button>
      </>
    )}
  </div>
);

const CombatScreen: React.FC<CombatScreenProps> = ({ playerTeam, setPlayerTeam, enemyTeam, setEnemyTeam, round, combatLog, setCombatLog }) => {
  const { currentPhase, transitionToShop, transitionToDeath } = usePhaseContext();
  const ctx = useContext(ControlPanelContext);
  const setControlPanel = ctx?.setControlPanel;
  const clearControlPanel = ctx?.clearControlPanel;

  const [state, setState] = useState<BattleState>({
    initiativeOrder: [],
    currentTurn: 0,
  });

  useEffect(() => {
    const initiativeOrder = rollInitiative(playerTeam, enemyTeam);
    setState({
      initiativeOrder,
      currentTurn: 0,
    });
    setCombatLog([`--- Round ${round} (Initiative rolled) ---`]);
  }, [playerTeam, enemyTeam, round, setCombatLog]);

  // Helper: Start next round
  const startNextRound = React.useCallback(
    (teamA: Team, teamB: Team, prevLog: string[], prevRound: number) => {
      const newInitiativeOrder = rollInitiative(teamA, teamB);
      setState({
        initiativeOrder: newInitiativeOrder,
        currentTurn: 0,
      });
      setCombatLog([
        ...prevLog,
        `--- Round ${prevRound + 1} (Initiative rolled) ---`,
      ]);
    },
    [setState, setCombatLog]
  );

  // Next Attack
  const handleNextAttack = React.useCallback(() => {
    if (state.currentTurn >= state.initiativeOrder.length) {
      // If round is over, start next round
      const newPlayerTeam = cloneDeep(playerTeam);
      const newEnemyTeam = cloneDeep(enemyTeam);
      startNextRound(newPlayerTeam, newEnemyTeam, combatLog, round);
      setPlayerTeam(newPlayerTeam);
      setEnemyTeam(newEnemyTeam);
      return;
    }
    const entry = state.initiativeOrder[state.currentTurn];
    const attackerTeam = entry.team === "A" ? playerTeam : enemyTeam;
    const defenderTeam = entry.team === "A" ? enemyTeam : playerTeam;
    const attacker = attackerTeam[entry.index];
    if (!attacker.alive) {
      setState((prev) => ({
        ...prev,
        currentTurn: prev.currentTurn + 1,
      }));
      return;
    }
    const targetIndex = findTarget(entry.index, defenderTeam);
    let logMsg = "";
    if (targetIndex !== null) {
      const target = defenderTeam[targetIndex];
      logMsg = attack(attacker, target);
    } else {
      logMsg = `${attacker.name} has no valid targets.`;
    }
    setState((prev: BattleState) => ({
      ...prev,
      currentTurn: prev.currentTurn + 1,
    }));
    setCombatLog(prev => [...prev, logMsg]);
  }, [state, playerTeam, enemyTeam, startNextRound, combatLog, round, setPlayerTeam, setEnemyTeam, setCombatLog]);

  // Next Round
  const handleNextRound = React.useCallback(() => {
    const { initiativeOrder, currentTurn } = cloneDeep(state);
    // Finish all remaining attacks
    let turn = currentTurn;
    const logCopy = [...combatLog];
    while (turn < initiativeOrder.length) {
      const entry = initiativeOrder[turn];
      const attackerTeam = entry.team === "A" ? playerTeam : enemyTeam;
      const defenderTeam = entry.team === "A" ? enemyTeam : playerTeam;
      const attacker = attackerTeam[entry.index];
      if (attacker.alive) {
        const targetIndex = findTarget(entry.index, defenderTeam);
        let logMsg = "";
        if (targetIndex !== null) {
          const target = defenderTeam[targetIndex];
          logMsg = attack(attacker, target);
        } else {
          logMsg = `${attacker.name} has no valid targets.`;
        }
        logCopy.push(logMsg);
      }
      turn++;
    }
    // Start new round
    startNextRound(playerTeam, enemyTeam, logCopy, round);
  }, [state, playerTeam, enemyTeam, combatLog, round, startNextRound]);

  // Reset
  const handleReset = React.useCallback(() => {
    const newPlayerTeam = cloneDeep(playerTeam);
    const newEnemyTeam = cloneDeep(enemyTeam);
    const newInitiativeOrder = rollInitiative(newPlayerTeam, newEnemyTeam);
    setState({
      initiativeOrder: newInitiativeOrder,
      currentTurn: 0,
    });
    setCombatLog([`--- Round ${round} (Initiative rolled) ---`]);
    setPlayerTeam(newPlayerTeam);
    setEnemyTeam(newEnemyTeam);
  }, [playerTeam, enemyTeam, round, setPlayerTeam, setEnemyTeam, setCombatLog]);

  // Initiative order display
  const initiativeDisplay = state.initiativeOrder.map((entry: InitiativeEntry, i: number) => {
    const team = entry.team === "A" ? playerTeam : enemyTeam;
    const char = team[entry.index];
    const isActive = i === state.currentTurn;
    return (
      <div
        key={i}
        className={`grid grid-cols-2 items-center px-2 py-1 rounded w-full ${
          isActive
            ? "bg-yellow-100 font-bold border-4 border-yellow-400 shadow-lg"
            : "bg-gray-100 border border-transparent"
        }`}
        style={{ minWidth: '10rem' }}
      >
        <span className="text-left text-lg font-extrabold text-gray-800 pl-1">{char.name}</span>
        <span className="text-right text-xl font-bold text-blue-700 pr-1">{char.initiative}</span>
      </div>
    );
  });

  const allEnemiesDead = enemyTeam.every((e: Character) => !e.alive);
  const allPlayersDead = playerTeam.every((e: Character) => !e.alive);

  // Automatic phase transitions
  useEffect(() => {
    if (currentPhase === 'combat' && allPlayersDead) {
      transitionToDeath();
    }
  }, [currentPhase, allPlayersDead, transitionToDeath]);

  React.useEffect(() => {
    if (setControlPanel) {
      setControlPanel(
        <CombatControlPanel
          allEnemiesDead={allEnemiesDead}
          onShop={transitionToShop}
          onNextAttack={handleNextAttack}
          onNextRound={handleNextRound}
          onReset={handleReset}
        />
      );
    }
    return () => {
      if (clearControlPanel) clearControlPanel();
    };
  }, [allEnemiesDead, transitionToShop, handleNextAttack, handleNextRound, handleReset, setControlPanel, clearControlPanel]);

  return (
    <div className="p-4 font-mono">
      <h1 className="text-xl font-bold mb-2 text-center">Combat Simulator</h1>
      <div className="flex justify-center items-start gap-8 mt-2">
        {/* Player Team */}
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-center mb-2 text-blue-700">Player Team</h2>
          {playerTeam.map((e, i) => (
            <CharacterCard
              key={e.id}
              entity={e}
              highlight={
                state.initiativeOrder[state.currentTurn]?.team === "A" &&
                state.initiativeOrder[state.currentTurn]?.index === i
              }
            />
          ))}
        </div>
        {/* Initiative Order and Round Indicator */}
        <div className="flex flex-col items-center w-64">
          <div className="text-lg font-bold mb-2">Round {round}</div>
          <div className="text-2xl font-bold mb-2">Initiative</div>
          <div className="flex flex-col gap-1 mb-4 w-full border-2 border-blue-400 rounded-xl p-3 items-center bg-white shadow-sm">
            {initiativeDisplay}
          </div>
        </div>
        {/* Enemy Team */}
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-center mb-2 text-red-700">Enemy Team</h2>
          {enemyTeam.map((e, i) => (
            <CharacterCard
              key={e.id}
              entity={e}
              highlight={
                state.initiativeOrder[state.currentTurn]?.team === "B" &&
                state.initiativeOrder[state.currentTurn]?.index === i
              }
            />
          ))}
        </div>
      </div>
      {/* Control Panel handled by context, combat log handled by parent */}
    </div>
  );
};

export default CombatScreen;