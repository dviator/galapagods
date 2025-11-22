import React, { useEffect, useState } from "react";
import UnitCard from '../components/unit/UnitCard';
import XPSummary from '../components/XPSummary';
import InitiativeDisplay from '../components/InitiativeDisplay';
import ActionQueueList from '../components/ActionQueueList';
import { useXPSummary } from '../hooks/useXPSummary';
import { useGameState } from '../contexts/useGameState';
import { useTeam } from '../contexts/teamContext';
import { Phase } from '../types';
import { isTeamDefeated } from '../utils/game';

const CombatScreen: React.FC = () => {
  const {
    playerTeam,
    enemyTeam,
    round,
    initiativeOrder,
    phase,
    transitionToDeath,
    gold,
    activeCountdowns,
  } = useGameState();

  const { updateActiveTeam } = useTeam();

  // Bench swap state
  const [selectedBenchIdx, setSelectedBenchIdx] = useState<number | null>(null);
  // Lock bench during combat
  const benchLocked = phase !== Phase.Combat;

  // XP summary state
  const { xpSummary } = useXPSummary();
  const allEnemiesDead = isTeamDefeated(enemyTeam);
  const allPlayersDead = isTeamDefeated(playerTeam);

  // Calculate gold earned this level (after combat)
  const goldEarned = enemyTeam
    .filter(e => !e.combatStatus.alive)
    .reduce((sum, enemy) => sum + (enemy.character?.levelProgression?.level || 1), 0);

  // Helper to determine which units will act this round (countdown = 0)
  const getUnitsActingThisRound = (): Set<string> => {
    const actingUnitIds = new Set<string>();
    playerTeam.forEach((unit, idx) => {
      const countdown = activeCountdowns.find(c => c.unitIndex === idx && c.team === 'Player');
      if (countdown && countdown.currentCountdown === 0) {
        actingUnitIds.add(unit.id);
      }
    });
    enemyTeam.forEach((unit, idx) => {
      const countdown = activeCountdowns.find(c => c.unitIndex === idx && c.team === 'Enemy');
      if (countdown && countdown.currentCountdown === 0) {
        actingUnitIds.add(unit.id);
      }
    });
    return actingUnitIds;
  };

  const unitsActingThisRound = getUnitsActingThisRound();

  // Compute highlight/targeted logic
  let currentTargetIndices: number[] = [];
  let currentTargetTeam: 'player' | 'enemy' | null = null;

  // Debug logs for initiative and teams
  console.debug('--- CombatScreen Render ---');
  console.debug('Round:', round);
  console.debug('Current Phase:', phase);
  console.debug('Initiative Order:', initiativeOrder);
  console.debug('Player Team:', playerTeam);
  console.debug('Enemy Team:', enemyTeam);

  // Automatic phase transitions
  useEffect(() => {
    if (phase === Phase.Combat && allPlayersDead) {
      transitionToDeath();
    }
  }, [phase, allPlayersDead, transitionToDeath]);

  const handleBenchClick = (idx: number) => {
    if (benchLocked) return;
    if (selectedBenchIdx === null) {
      setSelectedBenchIdx(idx);
    } else if (selectedBenchIdx !== idx) {
      const newTeam = [...playerTeam];
      [newTeam[selectedBenchIdx], newTeam[idx]] = [newTeam[idx], newTeam[selectedBenchIdx]];
      updateActiveTeam(() => newTeam);
      setSelectedBenchIdx(null);
    } else {
      setSelectedBenchIdx(null);
    }
  };

  return (
    <div className="p-4 font-mono">
      <h1 className="text-xl font-bold mb-2 text-center">Combat Simulator</h1>
      <div className="flex justify-center items-start gap-8 mt-2">
        {/* Player Team */}
        <div className="flex flex-col gap-4">
          {playerTeam.map((e, i) => {
            // Bench swap highlight logic
            let benchHighlight = false;
            let benchDashed = false;
            if (!benchLocked) {
              if (selectedBenchIdx === null) {
                // No selection, allow any to be selected
                benchHighlight = false;
                benchDashed = false;
              } else if (selectedBenchIdx === i) {
                benchHighlight = true;
                benchDashed = false;
              } else {
                benchHighlight = false;
                benchDashed = true;
              }
            }
            const countdown = activeCountdowns.find(c => c.unitIndex === i && c.team === 'Player');
            return (
              <div
                key={e.id}
                onClick={() => handleBenchClick(i)}
                style={{ cursor: benchLocked ? 'default' : 'pointer' }}
              >
                <UnitCard
                  entity={e}
                  highlight={benchHighlight}
                  targeted={currentTargetTeam === 'player' && currentTargetIndices.includes(i)}
                  xpGained={xpSummary[e.id]?.xp}
                  leveledUp={xpSummary[e.id]?.leveledUp}
                  dashed={benchDashed}
                  currentCountdown={countdown?.currentCountdown}
                  willActThisRound={unitsActingThisRound.has(e.id)}
                />
              </div>
            );
          })}
        </div>
        {/* Center: Round, Action Queue, and Initiative */}
        <div className="flex flex-col items-center w-80">
          <div className="text-lg font-bold mb-2">Round {round}</div>
          {allEnemiesDead ? (
            <XPSummary playerTeam={playerTeam} xpSummary={xpSummary} goldEarned={goldEarned} totalGold={gold + goldEarned} />
          ) : (
            <>
              <ActionQueueList
                activeCountdowns={activeCountdowns}
                playerTeam={playerTeam}
                enemyTeam={enemyTeam}
                maxActions={5}
              />
              <div className="text-sm font-bold mb-2 mt-3">Initiative (Tiebreak)</div>
              <div className="flex flex-col gap-0.5 w-full border border-gray-300 rounded p-2 items-center bg-white shadow-sm">
                <InitiativeDisplay
                  initiativeOrder={initiativeOrder}
                  playerTeam={playerTeam}
                  enemyTeam={enemyTeam}
                />
              </div>
            </>
          )}
        </div>
        {/* Enemy Team */}
        <div className="flex flex-col gap-4">
          {enemyTeam.map((e, i) => {
            const countdown = activeCountdowns.find(c => c.unitIndex === i && c.team === 'Enemy');
            return (
              <UnitCard
                key={e.id}
                entity={e}
                highlight={false}
                targeted={currentTargetTeam === 'enemy' && currentTargetIndices.includes(i)}
                currentCountdown={countdown?.currentCountdown}
                willActThisRound={unitsActingThisRound.has(e.id)}
              />
            );
          })}
        </div>
      </div>
      {/* Control Panel handled by context, combat log handled by parent */}
    </div>
  );
};

export default CombatScreen;