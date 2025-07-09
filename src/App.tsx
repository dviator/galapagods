import React from "react";
import CombatScreen from "./screens/CombatScreen";
import ShopScreen from "./screens/ShopScreen";
import DeathScreen from "./screens/DeathScreen";
import LabScreen from "./screens/LabScreen";
import GameLayout from './components/GameLayout';
import { GameStateProvider } from './contexts/GameStateContext';
import { useGameState } from './contexts/useGameState';
import CombatLog from './components/CombatLog';
import { Phase } from './types';

const AppContent: React.FC = () => {
  const {
    combatLog,
    phase,
  } = useGameState();

  return (
    <GameLayout logArea={phase === Phase.Combat ? (
      <CombatLog combatLog={combatLog} />
    ) : null}>
      {phase === Phase.Combat && (
        <CombatScreen />
      )}
      {phase === Phase.Shop && (
        <ShopScreen/>
      )}
      {phase === Phase.Death && <DeathScreen />}
      {phase === Phase.Lab && (
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
