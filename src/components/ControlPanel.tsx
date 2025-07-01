import React from 'react';
import { useGameState } from '../contexts/useGameState';
import { ShopControlPanelButton } from '../screens/ShopScreen';
import { LabControlPanelButton } from '../screens/LabScreen';

const ControlPanel: React.FC = () => {
  const {
    phase,
    transitionToShop,
    transitionToCombat,
    enemyTeam,
    handleNextAttack,
    handleNextRound,
    handleReset
  } = useGameState();

  const allEnemiesDead = enemyTeam.every(e => !e.combatStatus.alive);

  if (phase === 'combat') {
    if (allEnemiesDead) {
      return (
        <button
          className="flex-1 min-h-[56px] px-4 py-2 bg-yellow-400 text-white font-bold rounded hover:bg-yellow-500 w-full text-lg shadow-none"
          onClick={transitionToShop}
        >
          SHOP
        </button>
      );
    }
    return (
      <>
        <button
          className="flex-1 min-h-[56px] px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full text-lg shadow-none"
          onClick={handleNextAttack}
        >
          Next Attack
        </button>
        <button
          className="flex-1 min-h-[56px] px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full text-lg shadow-none"
          onClick={handleNextRound}
        >
          Next Round
        </button>
        <button
          className="flex-1 min-h-[56px] px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 w-full text-lg shadow-none"
          onClick={handleReset}
        >
          Reset
        </button>
      </>
    );
  }
  if (phase === 'shop') {
    return <ShopControlPanelButton onStartNextCombat={transitionToCombat} />;
  }
  if (phase === 'lab') {
    return <LabControlPanelButton onStartNewRun={() => {
      // TODO: Add logic to set up new player team if needed
      transitionToCombat();
    }} />;
  }
  if (phase === 'death') {
    return (
      <button
        className="flex-1 min-h-[56px] px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full text-lg shadow-none"
        onClick={handleReset}
      >
        Restart Run
      </button>
    );
  }
  return null;
};

export default ControlPanel;