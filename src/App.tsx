import React from "react";
import CombatScreen from "./screens/CombatScreen";
import ShopScreen from "./screens/ShopScreen";
import DeathScreen from "./screens/DeathScreen";
import LabScreen from "./screens/LabScreen";
import GameLayout from './components/GameLayout';
import { GameStateProvider } from './contexts/GameStateContext';
import { useGameState } from './contexts/useGameState';

const AppContent: React.FC = () => {
  const {
    round,
    combatLog,
    phase,
  } = useGameState();

  return (
    <GameLayout runNumber={1} roundNumber={round} logArea={phase === 'combat' ? (
      <div className="w-full">
        <h2 className="font-semibold mb-2">Combat Log</h2>
        <pre className="bg-gray-100 p-4 h-64 overflow-auto rounded-lg border whitespace-pre-wrap break-words">
          {combatLog.join("\n")}
        </pre>
      </div>
    ) : null}>
      {phase === "combat" && (
        <CombatScreen />
      )}
      {phase === "shop" && (
        <ShopScreen/>
      )}
      {phase === "death" && <DeathScreen />}
      {phase === "lab" && (
        <LabScreen/>
      )}
    </GameLayout>
  );
};

const App: React.FC = () => (
  <GameStateProvider>
    <AppContent />
  </GameStateProvider>
);

export default App;
