import React from 'react';
import type { Unit } from '../types';
import HealthBar from './HealthBar';

export interface UnitCardProps {
  entity: Unit;
  highlight?: boolean;
  targeted?: boolean;
  xpGained?: number;
  leveledUp?: boolean;
}

const UnitCard: React.FC<UnitCardProps> = ({
  entity,
  highlight,
  targeted,
  xpGained,
  leveledUp,
}) => (
  <div
    className={`w-[32rem] h-32 ${
      targeted
        ? 'border-8 border-red-500 shadow-2xl'
        : highlight
        ? 'border-8 border-yellow-400 shadow-xl'
        : 'border-2 border-black'
    } rounded-lg bg-white flex overflow-hidden relative`}
  >
    <div className="w-32 h-full flex items-center justify-center bg-gray-200">
      {entity.image ? (
        <img src={entity.image} alt={entity.name} className="object-cover w-full h-full" />
      ) : (
        <span className="text-4xl font-bold text-gray-700">{entity.name}</span>
      )}
    </div>
    <div className="h-full w-1 bg-black" />
    <div className="flex-[3] h-full flex flex-col justify-center gap-2 bg-white relative">
      {/* HealthBar always at the top */}
      <div className="w-full" style={{ height: '33%' }}>
        <HealthBar hp={entity.combatStatus.health} maxHp={entity.maxHealth} />
      </div>
      {/* Top row: LVL/XP left, ATK/INIT right, always below HealthBar */}
      <div className="w-full flex flex-row items-start justify-between px-4 pt-2">
        <div className="flex flex-col items-start">
          <span className="text-lg font-bold text-blue-700">LVL {entity.levelProgression.level}</span>
          {entity.type === 'character' && (
            <span className="text-sm text-gray-600">XP: {entity.levelProgression.xp} / {entity.levelProgression.xpToNext}</span>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-600">ATK</span>
            <span className="text-base font-bold text-black">{entity.attack.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-600">INIT</span>
            <span className="text-base font-bold text-black">{entity.baseInitiative}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-end gap-2 w-full pb-3 pl-4" style={{ height: '67%' }}>
        {/* Additional stats or info can go here */}
        {typeof xpGained === 'number' && (
          <span className="text-green-700 font-bold text-lg">+{xpGained} XP {leveledUp && <span className="ml-2 text-yellow-500">Level Up! 🎉</span>}</span>
        )}
      </div>
    </div>
  </div>
);

export default UnitCard;