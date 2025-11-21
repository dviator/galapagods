import React from 'react';
import type { Unit } from '../types';

export interface XPSummaryProps {
  playerTeam: Unit[];
  xpSummary: { [unitId: string]: { xp: number; leveledUp: boolean } };
  goldEarned?: number;
  totalGold?: number;
}

const XPSummary: React.FC<XPSummaryProps> = ({ playerTeam, xpSummary, goldEarned = 0, totalGold = 0 }) => (
  <>
    <div className="text-2xl font-bold mb-2 text-green-700">XP Earned</div>
    <div className="flex flex-col gap-2 mb-4 w-full border-2 border-green-400 rounded-xl p-3 items-center bg-white shadow-sm">
      {playerTeam.map((e) => (
        <div key={e.id} className="w-full grid grid-cols-[1fr_auto_auto] gap-4 items-center px-2">
          <span className="font-bold text-blue-800 text-left">{e.name}</span>
          <span className="font-bold text-green-700 whitespace-nowrap text-right">+{xpSummary[e.id]?.xp || 0} XP</span>
          <span className="text-yellow-500 font-bold whitespace-nowrap text-right">
            {xpSummary[e.id]?.leveledUp ? 'Level Up!' : ''}
          </span>
        </div>
      ))}
    </div>
    <div className="text-xl font-bold mb-1 text-yellow-700">Gold Earned</div>
    <div className="flex flex-col gap-1 mb-2 w-full border-2 border-yellow-400 rounded-xl p-3 items-center bg-white shadow-sm">
      <div className="w-full flex flex-row items-center justify-between px-2">
        <span className="font-bold text-yellow-700">Gold Earned This Level:</span>
        <span className="font-bold text-yellow-700">+{goldEarned}</span>
      </div>
      <div className="w-full flex flex-row items-center justify-between px-2">
        <span className="font-bold text-yellow-800">Total Gold:</span>
        <span className="font-bold text-yellow-800">{totalGold}</span>
      </div>
    </div>
  </>
);

export default XPSummary;