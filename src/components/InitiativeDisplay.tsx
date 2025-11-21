import React from 'react';
import type { Unit, Team } from '../types';
import { TeamEnum } from '../types';

export interface InitiativeEntry {
  team: Team;
  index: number;
  initiative: number;
}

export interface InitiativeDisplayProps {
  initiativeOrder: InitiativeEntry[];
  playerTeam: Unit[];
  enemyTeam: Unit[];
  currentTurn: number;
}

const InitiativeDisplay: React.FC<InitiativeDisplayProps> = ({ initiativeOrder, playerTeam, enemyTeam, currentTurn }) => (
  <>
    {initiativeOrder.map((entry, i) => {
      const team = entry.team === TeamEnum.Player ? playerTeam : enemyTeam;
      const char = team[entry.index];

      if (!char) return null;

      const isActive = i === currentTurn;
      const isDead = !char.combatStatus.alive;
      return (
        <div
          key={i}
          className={`grid grid-cols-2 items-center px-2 py-1 rounded w-full relative ${
            isActive
              ? 'bg-yellow-100 font-bold border-4 border-yellow-400 shadow-lg'
              : 'bg-gray-100 border border-transparent'
          }`}
          style={{ minWidth: '10rem', filter: isDead ? 'grayscale(1)' : undefined, opacity: isDead ? 0.5 : 1 }}
        >
          <span className="text-left text-lg font-extrabold text-gray-800 pl-1">{char.name}</span>
          <span className="text-right text-xl font-bold text-blue-700 pr-1">{char.combatStatus.initiative}</span>
        </div>
      );
    })}
  </>
);

export default InitiativeDisplay;