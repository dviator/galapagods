import React from "react";
import CombatScreen from "./screens/CombatScreen";
import ShopScreen from "./screens/ShopScreen";
import DeathScreen from "./screens/DeathScreen";
import LabScreen from "./screens/LabScreen";
import GameLayout from './components/GameLayout';
import { GameStateProvider } from './contexts/gameStateContext';
import { useGameState } from './contexts/useGameState';
import { TeamProvider } from './contexts/teamContext';
import CombatLog from './components/CombatLog';
import { Phase } from './types';
import { createTiger, createBear, createEagle } from './data/characters';

const GameContent: React.FC = () => {
  const {
    combatLog,
    phase,
    transitionToLab,
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
      {phase === Phase.Death && <DeathScreen onContinue={transitionToLab} />}
      {phase === Phase.Lab && (
        <LabScreen/>
      )}
    </GameLayout>
  );
};

const App: React.FC = () => {
  const initialActiveTeam = [createTiger(), createBear(), createEagle()];

  return (
    <TeamProvider initialActiveTeam={initialActiveTeam}>
      <GameStateProvider>
        <GameContent />
      </GameStateProvider>
    </TeamProvider>
  );
};

export default App;
