import React from 'react';
import { useGameState } from '../contexts/useGameState';
import { ShopControlPanelButton } from '../screens/ShopScreen';
import { LabControlPanelButton } from '../screens/LabScreen';
import NewRunButton from './NewRunButton';
import { Phase } from '../types';

const NextAttackButton: React.FC<{ onClick: () => void; disabled?: boolean; children?: React.ReactNode }> = ({ onClick, children }) => (
  <button
    className="flex-1 min-h-[56px] px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full text-lg shadow-none disabled:bg-gray-400 disabled:cursor-not-allowed"
    onClick={onClick}
  >
    {children}
  </button>
);

const NextRoundButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    className="flex-1 min-h-[56px] px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full text-lg shadow-none"
    onClick={onClick}
  >
    Next Round
  </button>
);

const ResetButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    className="flex-1 min-h-[56px] px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 w-full text-lg shadow-none"
    onClick={onClick}
  >
    Reset
  </button>
);

const CombatControlPanel: React.FC = () => {
  const {
    handleNextAttack,
    handleNextRound,
    handleReset,
    isRoundComplete,
    enemyTeam,
    transitionToShop
  } = useGameState();
  const allEnemiesDead = enemyTeam.every(e => !e.combatStatus.alive);
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
      {
        isRoundComplete ?
        <NextAttackButton onClick={handleNextRound}>
            Round Complete
          </NextAttackButton> :
          <NextAttackButton onClick={handleNextAttack}>
            Next Attack
          </NextAttackButton>
      }
      <NextRoundButton onClick={handleNextRound} />
      <ResetButton onClick={handleReset} />
    </>
  );
};

const ControlPanel: React.FC = () => {
  const {
    phase,
    transitionToCombat,
    handleNewRun
  } = useGameState();

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
};

export default ControlPanel;