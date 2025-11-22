import React from 'react';
import { useGameState } from '../contexts/useGameState';
import { ShopControlPanelButton } from '../screens/ShopScreen';
import { LabControlPanelButton } from '../screens/LabScreen';
import NewRunButton from './NewRunButton';
import { Phase } from '../types';

const NextRoundButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    className="flex-1 min-h-0 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full text-sm shadow-none"
    onClick={onClick}
  >
    Next Round
  </button>
);

const NextActionButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    className="flex-1 min-h-0 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full text-sm shadow-none"
    onClick={onClick}
  >
    Next Action
  </button>
);

const ResetButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    className="flex-1 min-h-0 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 w-full text-sm shadow-none"
    onClick={onClick}
  >
    Reset
  </button>
);

const CombatControlPanel: React.FC = () => {
  const {
    handleNextRound,
    handleSkipToNextAction,
    handleReset,
    enemyTeam,
    transitionToShop
  } = useGameState();
  const allEnemiesDead = enemyTeam.every(e => !e.combatStatus.alive);
  if (allEnemiesDead) {
    return (
      <button
        className="flex-1 min-h-0 px-4 py-2 bg-yellow-400 text-white font-bold rounded hover:bg-yellow-500 w-full text-sm shadow-none"
        onClick={transitionToShop}
      >
        SHOP
      </button>
    );
  }
  return (
    <div className="flex flex-col h-full w-full gap-1">
      <NextRoundButton onClick={handleNextRound} />
      <NextActionButton onClick={handleSkipToNextAction} />
      <ResetButton onClick={handleReset} />
    </div>
  );
};

const ControlPanel: React.FC = () => {
  const {
    phase,
    transitionToCombat,
    handleNewRun
  } = useGameState();

  const panelContent = (() => {
    if (phase === Phase.Combat) {
      return <CombatControlPanel />;
    }
    if (phase === Phase.Shop) {
      return <ShopControlPanelButton onStartNextCombat={transitionToCombat} />;
    }
    if (phase === Phase.Lab) {
      return <LabControlPanelButton onStartNewRun={handleNewRun} />;
    }
    if (phase === Phase.Death) {
      return (
        <NewRunButton onClick={handleNewRun} />
      );
    }
    return null;
  })();

  return (
    <div className="flex flex-col h-full w-full p-1 gap-1 overflow-hidden">
      {panelContent}
    </div>
  );
};

export default ControlPanel;