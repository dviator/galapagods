import React from 'react';
import type { Unit } from '../../types';
import { getEffectiveStat } from '../../utils/units/leveling';
import { GenomeStat } from '../../types/stats';

export interface UnitGenomeDisplayProps {
  unit: Unit;
  compact?: boolean;
}

const UnitGenomeDisplay: React.FC<UnitGenomeDisplayProps> = ({ unit, compact = false }) => {
  const renderStat = (label: string, stat: GenomeStat) => {
    const effective = getEffectiveStat(unit, stat);
    const base = unit.character.characterSheet[stat];
    const modifier = unit.character.statModifiers[stat] || 0;
    const genome = unit.character.genome[stat];

    if (compact) {
      return (
        <span key={label} className="text-xs font-bold text-black">
          {label}: <span className="text-base font-extrabold text-black">{effective}</span>
        </span>
      );
    }

    return (
      <span key={label} className="text-xs font-bold text-black">
        {label}:{' '}
        <span className="text-base font-extrabold text-black align-middle">
          {effective}
          <span className='text-xs text-gray-500 ml-1'>
            ({base}{modifier ? `+${modifier}` : ''})
          </span>{' '}
          <span className='font-extrabold text-black'>({genome})</span>
        </span>
      </span>
    );
  };

  return (
    <div className="w-full flex flex-row items-center justify-start gap-4 pl-4 mt-0">
      {renderStat('FRCT', GenomeStat.FEROCITY)}
      {renderStat('SRVL', GenomeStat.SURVIVAL)}
      {renderStat('ALCY', GenomeStat.ALACRITY)}
      {renderStat('INST', GenomeStat.INSTINCT)}
    </div>
  );
};

export default UnitGenomeDisplay;