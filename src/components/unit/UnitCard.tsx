import React from 'react';
import type { Unit } from '../../types';
import HealthBar from '../HealthBar';
import UnitPortrait from './UnitPortrait';
import UnitGenomeDisplay from './UnitGenomeDisplay';
import UnitStatsPanel from './UnitStatsPanel';
import CardBorder, { type BorderState } from '../CardBorder';

export interface UnitCardProps {
  entity: Unit;
  highlight?: boolean;
  targeted?: boolean;
  xpGained?: number;
  leveledUp?: boolean;
  healed?: boolean;
  dashed?: boolean;
  currentCountdown?: number;
  willActThisRound?: boolean;
}

const UnitCard: React.FC<UnitCardProps> = ({
  entity,
  highlight,
  targeted,
  xpGained,
  leveledUp,
  healed,
  dashed,
  currentCountdown,
  willActThisRound,
}) => {
  // Determine border state from props
  const getBorderState = (): BorderState => {
    if (healed) return 'healed';
    if (targeted) return 'targeted';
    if (highlight) return 'highlighted';
    if (dashed) return 'dashed';
    return 'normal';
  };

  return (
    <CardBorder state={getBorderState()} dead={!entity.combatStatus.alive} className="w-[32rem] h-[10.6rem]">
      <div className="w-full h-full flex overflow-hidden">
      <UnitPortrait unit={entity} />
      <div className="h-full w-1 bg-black" />
      <div className="flex-[3] h-full flex flex-col justify-center gap-2 bg-white relative">
        {/* HealthBar always at the top */}
        <div className="w-full" style={{ height: '33%' }}>
          <HealthBar hp={entity.combatStatus.health} maxHp={entity.maxHealth} />
        </div>
        {/* Stats panel: Level, XP progress, and either ATK/INIT or XP notification */}
        <UnitStatsPanel unit={entity} xpGained={xpGained} leveledUp={leveledUp} currentCountdown={currentCountdown} willActThisRound={willActThisRound} />
        {/* Genome stats display */}
        <UnitGenomeDisplay unit={entity} />
      </div>
      </div>
    </CardBorder>
  );
};

export default UnitCard;