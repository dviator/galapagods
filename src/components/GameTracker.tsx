import React from 'react';
import { useGameState } from '../contexts/useGameState';

const GameTracker: React.FC = () => {
  const { round, runNumber } = useGameState();
  return (
    <header className="w-full bg-gray-200 px-4 py-2 flex justify-center items-center shadow">
      <div className="text-lg font-bold text-gray-700">
        Run #{runNumber} &nbsp;|&nbsp; Round {round}
      </div>
    </header>
  );
};

export default GameTracker;