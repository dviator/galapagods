import React, { useState } from "react";
import { usePhaseContext } from "./contexts/phase";
import CombatScreen from "./screens/CombatScreen";
import ShopScreen from "./screens/ShopScreen";
import DeathScreen from "./screens/DeathScreen";
import LabScreen from "./screens/LabScreen";
import type { Unit } from "./types";
import cloneDeep from "lodash.clonedeep";
import { createUnit } from './utils/units/createCharacter';
import GameLayout from './components/GameLayout';
import bearImg from './assets/units/bear.png';
import eagleImg from './assets/units/eagle.png';
import tigerImg from './assets/units/tiger.png';
import {
  bearSheet,
  tigerSheet,
  eagleSheet,
  gooberSheet
} from './data/characterSheets';
import {
  slashAttack,
  pounceAttack,
  swoopAttack,
  slamAttack
} from './data/attacks';

// --- Initial Teams using new Unit type for both player and enemy ---
const initialPlayerTeam: Unit[] = [
  createUnit("bear-1", "Bear", "character", bearImg, bearSheet, 12, 3, slashAttack),
  createUnit("tiger-1", "Tiger", "character", tigerImg, tigerSheet, 10, 5, pounceAttack),
  createUnit("eagle-1", "Eagle", "character", eagleImg, eagleSheet, 8, 7, swoopAttack),
];
const initialEnemyTeam: Unit[] = [
  createUnit("goober-1", "Goob1", "enemy", undefined, gooberSheet, 10, 2, slamAttack),
  createUnit("goober-2", "Goob2", "enemy", undefined, gooberSheet, 10, 4, slamAttack),
  createUnit("goober-3", "Goob3", "enemy", undefined, gooberSheet, 10, 3, slamAttack),
];

const App: React.FC = () => {
  const { currentPhase, transitionToCombat, transitionToLab } = usePhaseContext();
  const [playerTeam, setPlayerTeam] = useState<Unit[]>(cloneDeep(initialPlayerTeam));
  const [enemyTeam, setEnemyTeam] = useState<Unit[]>(cloneDeep(initialEnemyTeam));
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
