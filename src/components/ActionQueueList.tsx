import React from 'react';
import type { Unit, Team } from '../types/unit';
import { TeamEnum } from '../types/unit';
import type { ActionCountdown } from '../types/combat';

export interface ActionQueueListProps {
  activeCountdowns: ActionCountdown[];
  playerTeam: Unit[];
  enemyTeam: Unit[];
  maxActions?: number;
}

const ActionQueueList: React.FC<ActionQueueListProps> = ({
  activeCountdowns,
  playerTeam,
  enemyTeam,
  maxActions = 5,
}) => {
  const getUnit = (team: Team, unitIndex: number): Unit | undefined => {
    const teamArray = team === TeamEnum.Player ? playerTeam : enemyTeam;
    return teamArray[unitIndex];
  };

  // Sort by countdown to show what's coming up
  const sortedActions = [...activeCountdowns]
    .sort((a, b) => {
      if (a.currentCountdown !== b.currentCountdown) {
        return a.currentCountdown - b.currentCountdown;
      }
      // Secondary sort by team (Player first, then Enemy)
      if (a.team !== b.team) {
        return a.team === TeamEnum.Player ? -1 : 1;
      }
      return a.unitIndex - b.unitIndex;
    })
    .slice(0, maxActions);

  return (
    <div className="border-2 border-purple-400 rounded-lg bg-purple-50 p-3 w-full">
      <div className="text-sm font-bold text-purple-900 mb-2">Next Actions</div>
      <div className="flex flex-col gap-1">
        {sortedActions.length === 0 ? (
          <div className="text-xs text-gray-500">No actions pending</div>
        ) : (
          sortedActions.map((action, idx) => {
            const unit = getUnit(action.team, action.unitIndex);
            if (!unit) return null;

            return (
              <div
                key={`${action.team}-${action.unitIndex}-${idx}`}
                className="flex items-center justify-between text-xs bg-white rounded px-2 py-1 border border-purple-200"
              >
                <span>
                  <span className="font-semibold">{unit.name}</span>
                  <span className="text-gray-500 ml-1">({unit.attack.name})</span>
                </span>
                <span className="font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  {action.currentCountdown}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActionQueueList;
