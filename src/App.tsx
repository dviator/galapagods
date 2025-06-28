import React, { useState } from "react";
import { usePhaseContext } from "./usePhaseContext";
import CombatScreen from "./screens/CombatScreen";
import ShopScreen from "./screens/ShopScreen";
import DeathScreen from "./screens/DeathScreen";
import LabScreen from "./screens/LabScreen";
import type { Character } from "./types";
import cloneDeep from "lodash.clonedeep";
import { createCharacter } from './utils/units/createCharacter';
import GameLayout from './components/GameLayout';
import bearImg from './assets/units/bear.png';
import eagleImg from './assets/units/eagle.png';
import tigerImg from './assets/units/tiger.png';

const initialPlayerTeam: Character[] = [
  createCharacter("A1", 3, 10, 5, eagleImg),
  createCharacter("A2", 2, 8, 3, bearImg),
  createCharacter("A3", 4, 6, 7, tigerImg),
];
const initialEnemyTeam: Character[] = [
  createCharacter("B1", 2, 12, 4),
  createCharacter("B2", 3, 9, 6),
  createCharacter("B3", 1, 6, 2),
];

const App: React.FC = () => {
  const { currentPhase, transitionToCombat, transitionToLab } = usePhaseContext();
  const [playerTeam, setPlayerTeam] = useState<Character[]>(cloneDeep(initialPlayerTeam));
  const [enemyTeam, setEnemyTeam] = useState<Character[]>(cloneDeep(initialEnemyTeam));
  const [round, setRound] = useState(1);
  const [runNumber, setRunNumber] = useState(1);
  // Local state for combat log
  const [combatLog, setCombatLog] = useState<string[]>([]);

  // Handler to start next combat (from shop)
  const handleStartNextCombat = () => {
    setEnemyTeam(cloneDeep(initialEnemyTeam));
    setRound(r => r + 1);
    transitionToCombat();
  };

  // Handler to start a new run from Lab
  const handleStartNewRun = () => {
    setPlayerTeam(cloneDeep(initialPlayerTeam));
    setRound(1);
    setRunNumber(n => n + 1);
    transitionToCombat();
  };

  return (
    <GameLayout runNumber={runNumber} roundNumber={round} logArea={currentPhase === 'combat' ? (
      <div className="w-full">
        <h2 className="font-semibold mb-2">Combat Log</h2>
        <pre className="bg-gray-100 p-4 h-64 overflow-auto rounded-lg border">
          {combatLog.join("\n")}
        </pre>
      </div>
    ) : null}>
      {currentPhase === "combat" && (
        <CombatScreen
          playerTeam={playerTeam}
          setPlayerTeam={setPlayerTeam}
          enemyTeam={enemyTeam}
          setEnemyTeam={setEnemyTeam}
          round={round}
          combatLog={combatLog}
          setCombatLog={setCombatLog}
        />
      )}
      {currentPhase === "shop" && (
        <ShopScreen
          onStartNextCombat={handleStartNextCombat}
        />
      )}
      {currentPhase === "death" && <DeathScreen onGoToLab={transitionToLab} />}
      {currentPhase === "lab" && (
        <LabScreen onStartNewRun={handleStartNewRun} />
      )}
    </GameLayout>
  );
};

export default App;
