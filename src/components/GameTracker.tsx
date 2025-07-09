import React from 'react';
import { useGameState } from '../contexts/useGameState';

const GameTracker: React.FC = () => {
  const { round, runNumber, combatCount, gold, worldState, currentWorld } = useGameState();
  const worldComplete = currentWorld.id === 1 && worldState.currentLevel > currentWorld.levels.length;
  return (
    <header className="w-full bg-gray-200 px-4 py-2 flex flex-col justify-center items-center shadow">
      <div className="text-lg font-bold text-gray-700">
        Run #{runNumber} &nbsp;|&nbsp; Round {round} &nbsp;|&nbsp; Combats {combatCount} &nbsp;|&nbsp; Gold: {gold}
      </div>
      <div className="text-sm text-blue-700 font-semibold mt-1">
        World {worldState.currentWorld} &nbsp;|&nbsp; Level {worldState.currentLevel} / {currentWorld.levels.length}
      </div>
      {worldComplete && (
        <div className="text-green-700 font-bold text-lg mt-1">World 1 Complete! 🎉</div>
      )}
    </header>
  );
};

export default GameTracker;