import React from 'react';
import type { Unit } from '../../types';
import { getEffectiveInitiative, getTemporaryInitiativeBonus } from '../../utils/units/leveling';

export interface UnitStatsPanelProps {
  unit: Unit;
  compact?: boolean;
  xpGained?: number;
  leveledUp?: boolean;
  currentCountdown?: number;
  willActThisRound?: boolean;
}

const UnitStatsPanel: React.FC<UnitStatsPanelProps> = ({ unit, compact = false, xpGained, leveledUp, currentCountdown, willActThisRound }) => {
  const renderAttackInfo = () => {
    const base = unit.attack.baseDmg;
    const bonus = unit.attack.bonusAbilityDmg ? unit.attack.bonusAbilityDmg(unit) : 0;
    const total = base + bonus;

    return (
      <div className="flex items-center gap-2 flex-nowrap">
        <span className="text-base font-semibold text-gray-600 flex-shrink-0">ATK</span>
        <span className="text-base font-bold text-black flex-shrink-0">
          {unit.attack.name}
          {!compact && (
            <span className="text-sm text-gray-500 ml-1">
              {total} ({base} + {bonus})
            </span>
          )}
        </span>
        {currentCountdown !== undefined && (
          <div className={`px-1.5 py-0.5 rounded font-bold text-xs border border-2 flex-shrink-0 whitespace-nowrap ${
            willActThisRound
              ? 'bg-yellow-300 border-yellow-500 text-yellow-900'
              : 'bg-blue-100 border-blue-400 text-blue-900'
          }`}>
            ⏱{currentCountdown}
          </div>
        )}
      </div>
    );
  };

  const renderInitiativeInfo = () => {
    const tmp = getTemporaryInitiativeBonus(unit);
    const effective = getEffectiveInitiative(unit);
    const rolled = typeof unit.combatStatus.initiative === 'number'
      ? unit.combatStatus.initiative - effective
      : null;
    const total = typeof unit.combatStatus.initiative === 'number'
      ? unit.combatStatus.initiative
      : effective;

    return (
      <div className="flex items-center gap-2 flex-nowrap">
        <span className="text-base font-semibold text-gray-600 flex-shrink-0">INIT</span>
        <span className="text-base font-bold text-black flex-shrink-0">
          {effective}
          {tmp !== 0 && <span className="text-green-600"> (+{tmp})</span>}
          {!compact && rolled !== null && (
            <>
              <span className="text-blue-600"> + {rolled}</span>
              <span className="text-gray-500 ml-1">= {total}</span>
            </>
          )}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-row items-start justify-between px-4 pt-2">
      {/* Left side: Level and XP */}
      <div className="flex flex-col items-start">
        <span className="text-lg font-bold text-blue-700">
          LVL {unit.character.levelProgression.level}
        </span>
        {unit.type === 'character' && !compact && (
          <span className="text-sm text-gray-600">
            XP: {unit.character.levelProgression.xp} / {unit.character.levelProgression.xpToNext}
          </span>
        )}
      </div>

      {/* Right side: XP notification during XP phase, or ATK/INIT during combat */}
      <div className="flex flex-col items-end gap-1">
        {typeof xpGained === 'number' ? (
          <>
            <span className="text-green-700 font-bold text-lg whitespace-nowrap">+{xpGained} XP</span>
            {leveledUp && <span className="text-yellow-500 font-bold text-base whitespace-nowrap">Level Up!</span>}
          </>
        ) : (
          <>
            {renderAttackInfo()}
            {renderInitiativeInfo()}
          </>
        )}
      </div>
    </div>
  );
};

export default UnitStatsPanel;
