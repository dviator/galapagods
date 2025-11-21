import { useEffect, useState, useRef } from 'react';
import { awardXPAndLevelUp } from '../utils/units/leveling';
import { useGameState } from '../contexts/useGameState';
import { useTeam } from '../contexts/teamContext';

export function useXPSummary() {
  const [xpSummary, setXpSummary] = useState<{ [unitId: string]: { xp: number; leveledUp: boolean } }>({});
  const [pendingXP, setPendingXP] = useState(false);
  const { playerTeam, enemyTeam }  = useGameState();
  const { updateActiveTeam } = useTeam();
  const playerTeamRef = useRef(playerTeam);
  playerTeamRef.current = playerTeam;

  useEffect(() => {
    if (enemyTeam.every(e => !e.combatStatus.alive) && !pendingXP && Object.keys(xpSummary).length === 0) {
      const defeatedEnemies = enemyTeam;
      const totalXP = defeatedEnemies.reduce((sum, enemy) => sum + (enemy.character.levelProgression.level * 10), 0);
      const livingTeammates = playerTeamRef.current.filter(u => u.combatStatus.alive);
      const xpPerUnit = livingTeammates.length > 0 ? Math.floor(totalXP / livingTeammates.length) + 7 : 0;
      const summary: { [unitId: string]: { xp: number; leveledUp: boolean } } = {};
      const updatedTeam = playerTeamRef.current.map(unit => {
        if (unit.combatStatus.alive) {
          const prevLevel = unit.character.levelProgression.level;
          const newUnit = awardXPAndLevelUp({ ...unit }, xpPerUnit);
          summary[unit.id] = {
            xp: xpPerUnit,
            leveledUp: newUnit.character.levelProgression.level > prevLevel,
          };
          return newUnit;
        }
        return unit;
      });
      updateActiveTeam(() => updatedTeam);
      setXpSummary(summary);
      setPendingXP(true);
    }
    if (!enemyTeam.every(e => !e.combatStatus.alive) && (Object.keys(xpSummary).length > 0 || pendingXP)) {
      setXpSummary({});
      setPendingXP(false);
    }
  }, [enemyTeam, pendingXP, xpSummary, updateActiveTeam]);

  const resetXPSummary = () => {
    setXpSummary({});
    setPendingXP(false);
  };

  return { xpSummary, pendingXP, resetXPSummary };
}