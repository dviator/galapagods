// src/main.tsx
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import './main.css';

// Types
interface Entity {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  atk: number;
  baseInitiative: number;
  initiative: number;
  alive: boolean;
}

type Team = Entity[];

interface InitiativeEntry {
  team: "A" | "B";
  index: number;
  initiative: number;
}

interface BattleState {
  teamA: Team;
  teamB: Team;
  initiativeOrder: InitiativeEntry[];
  currentTurn: number;
  round: number;
  log: string[];
}

const createEntity = (
  name: string,
  atk: number,
  hp: number,
  baseInitiative: number
): Entity => ({
  id: crypto.randomUUID(),
  name,
  atk,
  hp,
  maxHp: hp,
  baseInitiative,
  initiative: 0,
  alive: true,
});

// Health bar component
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

// Character Card
const CharacterCard: React.FC<{ entity: Entity; highlight?: boolean }> = ({
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
    {/* Left: Name */}
    <div className="w-32 h-full flex items-center justify-center bg-gray-200">
      <span className="text-4xl font-bold text-gray-700">{entity.name}</span>
    </div>
    {/* Vertical border */}
    <div className="h-full w-1 bg-black" />
    {/* Right: Stats */}
    <div className="flex-[3] h-full flex flex-col items-center justify-center gap-2 bg-white relative">
      <div className="absolute top-0 left-0 w-full" style={{ height: '33%' }}>
        <HealthBar hp={entity.hp} maxHp={entity.maxHp} />
      </div>
      <div className="flex-1 flex flex-col justify-end gap-2 w-full pb-3 pl-4" style={{ height: '67%' }}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-600">ATK</span>
            <span className="text-base font-bold text-black">{entity.atk}</span>
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

// Utility: Roll initiative for all alive characters
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

// Utility: Find target (across, then left/right)
function findTarget(
  attackerIndex: number,
  opposingTeam: Team
): number | null {
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

// Utility: Attack logic
function attack(
  attacker: Entity,
  target: Entity
): string {
  if (!attacker.alive || !target.alive) return "";
  target.hp -= attacker.atk;
  if (target.hp <= 0) {
    target.hp = 0;
    target.alive = false;
    return `${attacker.name} attacks ${target.name} for ${attacker.atk} and defeats them!`;
  }
  return `${attacker.name} attacks ${target.name} for ${attacker.atk}. (${target.hp} HP left)`;
}

export const BattleSim: React.FC = () => {
  // Initial teams
  const initialTeamA: Team = [
    createEntity("A1", 3, 10, 5),
    createEntity("A2", 2, 8, 3),
    createEntity("A3", 4, 6, 7),
  ];
  const initialTeamB: Team = [
    createEntity("B1", 2, 12, 4),
    createEntity("B2", 3, 9, 6),
    createEntity("B3", 1, 6, 2),
  ];

  const [state, setState] = useState<BattleState>(() => {
    const teamA = JSON.parse(JSON.stringify(initialTeamA));
    const teamB = JSON.parse(JSON.stringify(initialTeamB));
    const initiativeOrder = rollInitiative(teamA, teamB);
    return {
      teamA,
      teamB,
      initiativeOrder,
      currentTurn: 0,
      round: 1,
      log: [`--- Round 1 (Initiative rolled) ---`],
    };
  });

  // Helper: Start next round
  const startNextRound = (teamA: Team, teamB: Team, prevLog: string[], prevRound: number) => {
    const newInitiativeOrder = rollInitiative(teamA, teamB);
    setState({
      teamA,
      teamB,
      initiativeOrder: newInitiativeOrder,
      currentTurn: 0,
      round: prevRound + 1,
      log: [
        ...prevLog,
        `--- Round ${prevRound + 1} (Initiative rolled) ---`,
      ],
    });
  };

  // Next Attack
  const handleNextAttack = () => {
    if (state.currentTurn >= state.initiativeOrder.length) {
      // If round is over, start next round
      const teamA = JSON.parse(JSON.stringify(state.teamA));
      const teamB = JSON.parse(JSON.stringify(state.teamB));
      startNextRound(teamA, teamB, state.log, state.round);
      return;
    }
    const entry = state.initiativeOrder[state.currentTurn];
    const attackerTeam = entry.team === "A" ? state.teamA : state.teamB;
    const defenderTeam = entry.team === "A" ? state.teamB : state.teamA;
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
    setState((prev) => ({
      ...prev,
      currentTurn: prev.currentTurn + 1,
      log: [...prev.log, logMsg],
    }));
  };

  // Next Round
  const handleNextRound = () => {
    const { teamA, teamB, initiativeOrder, currentTurn, round, log } = JSON.parse(
      JSON.stringify(state)
    );
    // Finish all remaining attacks
    let turn = currentTurn;
    const logCopy = [...log];
    while (turn < initiativeOrder.length) {
      const entry = initiativeOrder[turn];
      const attackerTeam = entry.team === "A" ? teamA : teamB;
      const defenderTeam = entry.team === "A" ? teamB : teamA;
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
    startNextRound(teamA, teamB, logCopy, round);
  };

  // Reset
  const handleReset = () => {
    const teamA = JSON.parse(JSON.stringify(initialTeamA));
    const teamB = JSON.parse(JSON.stringify(initialTeamB));
    const initiativeOrder = rollInitiative(teamA, teamB);
    setState({
      teamA,
      teamB,
      initiativeOrder,
      currentTurn: 0,
      round: 1,
      log: [`--- Round 1 (Initiative rolled) ---`],
    });
  };

  // Initiative order display
  const initiativeDisplay = state.initiativeOrder.map((entry, i) => {
    const team = entry.team === "A" ? state.teamA : state.teamB;
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

  return (
    <div className="p-4 font-mono">
      <h1 className="text-xl font-bold mb-6 text-center">Combat Simulator</h1>
      <div className="flex justify-center items-start gap-8 mb-6">
        {/* Team A */}
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-center mb-2 text-blue-700">
            Team A
          </h2>
          {state.teamA.map((e, i) => (
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
          <div className="text-lg font-bold mb-2">Round {state.round}</div>
          <div className="text-2xl font-bold mb-2">Initiative</div>
          <div className="flex flex-col gap-1 mb-4 w-full border-2 border-blue-400 rounded-xl p-3 items-center bg-white shadow-sm">
            {initiativeDisplay}
          </div>
        </div>
        {/* Team B */}
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-center mb-2 text-red-700">
            Team B
          </h2>
          {state.teamB.map((e, i) => (
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
      {/* Control Panel moved below combat zone */}
      <div className="w-full flex flex-col items-center my-8">
        <div className="flex flex-col gap-2 bg-gray-100 border border-gray-300 rounded-lg px-8 py-6 shadow-md w-full max-w-md items-center">
          <div className="font-semibold mb-1 text-lg">Control Panel</div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
            onClick={handleNextAttack}
          >
            Next Attack
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
            onClick={handleNextRound}
          >
            Next Round
          </button>
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 w-full"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="font-semibold mb-2">Combat Log</h2>
        <pre className="bg-gray-100 p-4 h-64 overflow-auto rounded-lg border">
          {state.log.join("\n")}
        </pre>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<BattleSim />);