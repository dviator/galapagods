import React from 'react';
import type { Unit } from '../types';

export interface XPSummaryProps {
  playerTeam: Unit[];
  xpSummary: { [unitId: string]: { xp: number; leveledUp: boolean } };
}

const XPSummary: React.FC<XPSummaryProps> = ({ playerTeam, xpSummary }) => (
  <>
    <div className="text-2xl font-bold mb-2 text-green-700">XP Earned</div>
    <div className="flex flex-col gap-2 mb-4 w-full border-2 border-green-400 rounded-xl p-3 items-center bg-white shadow-sm">
      {playerTeam.map((e) => (
        <div key={e.id} className="w-full flex flex-row items-center justify-between px-2">
          <span className="font-bold text-blue-800">{e.name}</span>
          <span className="font-bold text-green-700">+{xpSummary[e.id]?.xp || 0} XP</span>
          {xpSummary[e.id]?.leveledUp && <span className="ml-2 text-yellow-500 font-bold">Level Up! 🎉</span>}
        </div>
      ))}
    </div>
  </>
);

export default XPSummary;