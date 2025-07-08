import React, { useEffect } from "react";
import UnitCard from '../components/UnitCard';
import XPSummary from '../components/XPSummary';
import InitiativeDisplay from '../components/InitiativeDisplay';
import { useXPSummary } from '../hooks/useXPSummary';
import { useGameState } from '../contexts/useGameState';
import { TeamEnum } from '../types/unit';

const CombatScreen: React.FC = () => {
  const {
    playerTeam,
    enemyTeam,
    round,
    initiativeOrder,
    currentTurn,
    phase,
    transitionToDeath,
    gold,
  } = useGameState();

  // XP summary state
  const { xpSummary } = useXPSummary();
  const allEnemiesDead = enemyTeam.every(e => !e.combatStatus.alive);
  const allPlayersDead = playerTeam.every(e => !e.combatStatus.alive);

  // Calculate gold earned this level (after combat)
  const goldEarned = enemyTeam
    .filter(e => !e.combatStatus.alive)
    .reduce((sum, enemy) => sum + (enemy.character?.levelProgression?.level || 1), 0);

  // Compute highlight/targeted logic
  let currentTargetIndices: number[] = [];
  let currentTargetTeam: 'player' | 'enemy' | null = null;
  const currentEntry = initiativeOrder[currentTurn];

  // Debug logs for initiative and teams
  console.debug('--- CombatScreen Render ---');
  console.debug('Round:', round);
  console.debug('Current Phase:', phase);
  console.debug('Current Turn:', currentTurn);
  console.debug('Initiative Order:', initiativeOrder);
  console.debug('Current Entry:', currentEntry);
  console.debug('Player Team:', playerTeam);
  console.debug('Enemy Team:', enemyTeam);

  if (currentEntry) {
    const attackerTeam = currentEntry.team === TeamEnum.Player ? playerTeam : enemyTeam;
    const defenderTeam = currentEntry.team === TeamEnum.Player ? enemyTeam : playerTeam;
    const attacker = attackerTeam[currentEntry.index];
    console.debug('Attacker Team:', currentEntry.team, attackerTeam);
    console.debug('Defender Team:', currentEntry.team === TeamEnum.Player ? TeamEnum.Enemy : TeamEnum.Player, defenderTeam);
    console.debug('Attacker:', attacker);
    if (attacker && attacker.attack && attacker.attack.targetingRule) {
      currentTargetIndices = attacker.attack.targetingRule.getTargets(attacker, attackerTeam, defenderTeam);
      console.debug('Targeting Rule:', attacker.attack.targetingRule.name);
      console.debug('Target Indices:', currentTargetIndices);
      console.debug('Defender Team Length:', defenderTeam.length);
      if (currentTargetIndices.some(idx => idx < 0 || idx >= defenderTeam.length)) {
        console.warn('Target index out of bounds:', currentTargetIndices, 'Defender team length:', defenderTeam.length);
      }
    }
    currentTargetTeam = currentEntry.team === TeamEnum.Player ? 'enemy' : 'player';
    console.debug('Current Target Team:', currentTargetTeam);
  }

  // Automatic phase transitions
  useEffect(() => {
    if (phase === 'combat' && allPlayersDead) {
      transitionToDeath();
    }
  }, [phase, allPlayersDead, transitionToDeath]);

  return (
    <div className="p-4 font-mono">
      <h1 className="text-xl font-bold mb-2 text-center">Combat Simulator</h1>
      <div className="flex justify-center items-start gap-8 mt-2">
        {/* Player Team */}
        <div className="flex flex-col gap-4">
          {playerTeam.map((e, i) => (
            <UnitCard
              key={e.id}
              entity={e}
              highlight={initiativeOrder[currentTurn]?.team === TeamEnum.Player && initiativeOrder[currentTurn]?.index === i}
              targeted={currentTargetTeam === 'player' && currentTargetIndices.includes(i)}
              xpGained={xpSummary[e.id]?.xp}
              leveledUp={xpSummary[e.id]?.leveledUp}
            />
          ))}
        </div>
        {/* Initiative Order and Round Indicator or XP Summary */}
        <div className="flex flex-col items-center w-64">
          <div className="text-lg font-bold mb-2">Round {round}</div>
          {allEnemiesDead ? (
            <XPSummary playerTeam={playerTeam} xpSummary={xpSummary} goldEarned={goldEarned} totalGold={gold + goldEarned} />
          ) : (
            <>
              <div className="text-2xl font-bold mb-2">Initiative</div>
              <div className="flex flex-col gap-1 mb-4 w-full border-2 border-blue-400 rounded-xl p-3 items-center bg-white shadow-sm">
                <InitiativeDisplay
                  initiativeOrder={initiativeOrder}
                  playerTeam={playerTeam}
                  enemyTeam={enemyTeam}
                  currentTurn={currentTurn}
                />
              </div>
            </>
          )}
        </div>
        {/* Enemy Team */}
        <div className="flex flex-col gap-4">
          {enemyTeam.map((e, i) => (
            <UnitCard
              key={e.id}
              entity={e}
              highlight={initiativeOrder[currentTurn]?.team === TeamEnum.Enemy && initiativeOrder[currentTurn]?.index === i}
              targeted={currentTargetTeam === 'enemy' && currentTargetIndices.includes(i)}
            />
          ))}
        </div>
      </div>
      {/* Control Panel handled by context, combat log handled by parent */}
    </div>
  );
};

export default CombatScreen;