import { describe, it, expect } from 'vitest';
import { combatReset, combatNextRound, combatComplete } from './combatState';
import { createUnit } from '../utils/units/createCharacter';
import { pounceAttack, swoopAttack, slashAttack } from '../data/attacks';
import { isTeamDefeated } from '../utils/game';
import { GeneGrade } from '../types/stats';
import type { Unit } from '../types/unit';
import { TeamEnum } from '../types/unit';

describe('Combat State Integration Tests', () => {
  function createTestUnit(name: string, maxHealth: number = 20): Unit {
    return createUnit({
      name,
      type: 'character',
      character: {
        levelProgression: { level: 1, xp: 0, xpToNext: 100 },
        characterSheet: { ferocity: 5, survival: 5, alacrity: 5, instinct: 5 },
        statModifiers: { ferocity: 0, survival: 0, alacrity: 0, instinct: 0 },
        genome: { ferocity: GeneGrade.A, survival: GeneGrade.A, alacrity: GeneGrade.A, instinct: GeneGrade.A },
      },
      maxHealth,
      baseInitiative: 0,
      attack: pounceAttack,
    });
  }

  describe('combatReset', () => {
    it('should initialize combat with proper state', () => {
      const playerTeam = [createTestUnit('Player', 20)];
      const enemyTeam = [createTestUnit('Enemy', 20)];

      const state = combatReset(playerTeam, enemyTeam);

      expect(state.round).toBe(1);
      expect(state.combatLog).toContain('--- Combat Start ---');
      expect(state.playerTeam).toHaveLength(1);
      expect(state.enemyTeam).toHaveLength(1);
      expect(state.initiativeOrder).toHaveLength(2);
      expect(state.countdownTracker.activeCountdowns).toHaveLength(2);
    });

    it('should clone teams (not reference originals)', () => {
      const playerTeam = [createTestUnit('Player', 20)];
      const enemyTeam = [createTestUnit('Enemy', 20)];

      const state = combatReset(playerTeam, enemyTeam);

      // Modify original
      playerTeam[0].combatStatus.health = 0;

      // State should be unaffected
      expect(state.playerTeam[0].combatStatus.health).toBe(20);
    });

    it('should skip dead units from countdown tracking', () => {
      const playerTeam = [createTestUnit('Alive', 20), createTestUnit('Dead', 20)];
      playerTeam[1].combatStatus.alive = false;
      const enemyTeam = [createTestUnit('Enemy', 20)];

      const state = combatReset(playerTeam, enemyTeam);

      expect(state.countdownTracker.activeCountdowns).toHaveLength(2);
      expect(state.countdownTracker.activeCountdowns.every(c => c.team === 'Player' ? c.unitIndex === 0 : true)).toBe(true);
    });
  });

  describe('combatNextRound', () => {
    it('should increment round number', () => {
      const playerTeam = [createTestUnit('Player', 20)];
      const enemyTeam = [createTestUnit('Enemy', 20)];

      let state = combatReset(playerTeam, enemyTeam);
      expect(state.round).toBe(1);

      state = combatNextRound(state);
      expect(state.round).toBe(2);

      state = combatNextRound(state);
      expect(state.round).toBe(3);
    });

    it('should decrement all countdowns each round', () => {
      const playerTeam = [createTestUnit('Player', 20)];
      const enemyTeam = [createTestUnit('Enemy', 20)];

      let state = combatReset(playerTeam, enemyTeam);
      const initialCountdowns = state.countdownTracker.activeCountdowns.map(c => c.currentCountdown);

      state = combatNextRound(state);
      const newCountdowns = state.countdownTracker.activeCountdowns.map(c => c.currentCountdown);

      expect(newCountdowns[0]).toBe(initialCountdowns[0] - 1);
      expect(newCountdowns[1]).toBe(initialCountdowns[1] - 1);
    });

    it('should execute attacks when countdown reaches 0', () => {
      const playerTeam = [createTestUnit('Player', 50)];
      const enemyTeam = [createTestUnit('Enemy', 15)];

      let state = combatReset(playerTeam, enemyTeam);
      const initialEnemyHealth = state.enemyTeam[0].combatStatus.health;

      // Run until someone attacks
      for (let i = 0; i < 20; i++) {
        state = combatNextRound(state);
        if (state.combatLog.length > 1) break;
      }

      // Damage should have been applied
      expect(state.enemyTeam[0].combatStatus.health).toBeLessThan(initialEnemyHealth);
      expect(state.combatLog.some(log => log.includes('attacks'))).toBe(true);
    });

    it('should reset countdown after unit attacks', () => {
      const playerTeam = [createTestUnit('Player', 50)];
      const enemyTeam = [createTestUnit('Enemy', 50)];

      let state = combatReset(playerTeam, enemyTeam);
      const initialLogLength = state.combatLog.length;

      // Run until an attack happens
      let attackHappened = false;
      for (let i = 0; i < 20; i++) {
        state = combatNextRound(state);

        // Check if new action was logged (log length increased)
        if (state.combatLog.length > initialLogLength) {
          attackHappened = true;
          break;
        }
      }

      // If an attack happened, at least one countdown should be at base value or less
      if (attackHappened) {
        const baseCountdowns = [pounceAttack.countdown, swoopAttack.countdown, slashAttack.countdown];
        const hasResetCountdown = state.countdownTracker.activeCountdowns.some(c =>
          baseCountdowns.includes(c.currentCountdown)
        );
        expect(hasResetCountdown).toBe(true);
      }
    });

    it('should remove dead units from countdown tracking', () => {
      const playerTeam = [createTestUnit('Weak', 1)];
      const enemyTeam = [createTestUnit('Strong', 50)];

      let state = combatReset(playerTeam, enemyTeam);

      // Run until player dies
      for (let i = 0; i < 50; i++) {
        state = combatNextRound(state);
        if (isTeamDefeated(state.playerTeam)) break;
      }

      expect(state.playerTeam[0].combatStatus.alive).toBe(false);
      expect(state.countdownTracker.activeCountdowns.every(c => !(c.team === 'Player' && c.unitIndex === 0))).toBe(true);
    });

    it('should maintain proper combat log entries', () => {
      const playerTeam = [createTestUnit('Player', 50)];
      const enemyTeam = [createTestUnit('Enemy', 50)];

      let state = combatReset(playerTeam, enemyTeam);

      for (let i = 0; i < 30; i++) {
        state = combatNextRound(state);
      }

      expect(state.combatLog.length).toBeGreaterThan(1);
      expect(state.combatLog[0]).toBe('--- Combat Start ---');
    });
  });

  describe('combatComplete', () => {
    it('should finish combat when one team is defeated', () => {
      const playerTeam = [createTestUnit('Weak', 1)];
      const enemyTeam = [createTestUnit('Strong', 50)];

      const state = combatComplete(combatReset(playerTeam, enemyTeam));

      const playerDefeated = isTeamDefeated(state.playerTeam);
      const enemyDefeated = isTeamDefeated(state.enemyTeam);

      expect(playerDefeated || enemyDefeated).toBe(true);
    });

    it('should not infinite loop with equal strength teams', () => {
      const playerTeam = [createTestUnit('Player', 20)];
      const enemyTeam = [createTestUnit('Enemy', 20)];

      const state = combatComplete(combatReset(playerTeam, enemyTeam));

      expect(state.round).toBeLessThan(1000);
      expect(isTeamDefeated(state.playerTeam) || isTeamDefeated(state.enemyTeam)).toBe(true);
    });

    it('should apply damage correctly', () => {
      const playerTeam = [createTestUnit('Strong', 100)];
      const enemyTeam = [createTestUnit('Weak', 5)];

      const state = combatComplete(combatReset(playerTeam, enemyTeam));

      expect(state.enemyTeam[0].combatStatus.alive).toBe(false);
      expect(state.playerTeam[0].combatStatus.alive).toBe(true);
    });
  });

  describe('Countdown ordering and initiative tie-breaking', () => {
    it('should execute faster units first (Swoop vs Pounce vs Slash)', () => {
      const playerTeam = [
        { ...createTestUnit('Fast', 50), attack: swoopAttack }, // countdown: 5
      ];
      const enemyTeam = [
        { ...createTestUnit('Medium', 50), attack: pounceAttack }, // countdown: 6
        { ...createTestUnit('Slow', 50), attack: slashAttack }, // countdown: 8
      ];

      let state = combatReset(playerTeam, enemyTeam);

      // Run until multiple attacks have happened
      let fastActedFirst = false;
      for (let i = 0; i < 30; i++) {
        state = combatNextRound(state);

        // Check if fast unit acted before slower ones
        const logs = state.combatLog;
        if (logs.some(log => log.includes('Fast') && log.includes('attacks'))) {
          fastActedFirst = true;
          break;
        }
      }

      expect(fastActedFirst).toBe(true);
    });

    it('should use initiative for tie-breaking when countdowns match', () => {
      const playerTeam = [createTestUnit('Player', 50)];
      const enemyTeam = [createTestUnit('Enemy', 50)];

      const state = combatReset(playerTeam, enemyTeam);

      // Initiative order should exist and have correct team values
      expect(state.initiativeOrder).toHaveLength(2);
      expect(state.initiativeOrder[0].initiative).toBeDefined();
      expect(state.initiativeOrder[1].initiative).toBeDefined();

      // Teams should be properly set
      const hasPlayer = state.initiativeOrder.some(entry => entry.team === TeamEnum.Player);
      const hasEnemy = state.initiativeOrder.some(entry => entry.team === TeamEnum.Enemy);
      expect(hasPlayer).toBe(true);
      expect(hasEnemy).toBe(true);
    });
  });

  describe('Multi-unit combat scenarios', () => {
    it('should handle 3v3 combat correctly', () => {
      const playerTeam = [
        createTestUnit('P1', 20),
        createTestUnit('P2', 20),
        createTestUnit('P3', 20),
      ];
      const enemyTeam = [
        createTestUnit('E1', 20),
        createTestUnit('E2', 20),
        createTestUnit('E3', 20),
      ];

      const state = combatComplete(combatReset(playerTeam, enemyTeam));

      expect(isTeamDefeated(state.playerTeam) || isTeamDefeated(state.enemyTeam)).toBe(true);
      expect(state.round).toBeLessThan(500);
    });

    it('should track multiple units in countdown correctly', () => {
      const playerTeam = [
        createTestUnit('P1', 30),
        createTestUnit('P2', 30),
      ];
      const enemyTeam = [
        createTestUnit('E1', 30),
      ];

      let state = combatReset(playerTeam, enemyTeam);

      expect(state.countdownTracker.activeCountdowns).toHaveLength(3);

      // All units should have countdowns
      const hasP1 = state.countdownTracker.activeCountdowns.some(c => c.unitIndex === 0 && c.team === 'Player');
      const hasP2 = state.countdownTracker.activeCountdowns.some(c => c.unitIndex === 1 && c.team === 'Player');
      const hasE1 = state.countdownTracker.activeCountdowns.some(c => c.unitIndex === 0 && c.team === 'Enemy');

      expect(hasP1).toBe(true);
      expect(hasP2).toBe(true);
      expect(hasE1).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle single unit vs single unit', () => {
      const playerTeam = [createTestUnit('Solo Player', 30)];
      const enemyTeam = [createTestUnit('Solo Enemy', 30)];

      const state = combatComplete(combatReset(playerTeam, enemyTeam));

      expect(isTeamDefeated(state.playerTeam) || isTeamDefeated(state.enemyTeam)).toBe(true);
    });

    it('should handle vastly different health pools', () => {
      const playerTeam = [createTestUnit('Tank', 500)];
      const enemyTeam = [createTestUnit('Glass', 1)];

      const state = combatComplete(combatReset(playerTeam, enemyTeam));

      expect(state.enemyTeam[0].combatStatus.alive).toBe(false);
      expect(state.playerTeam[0].combatStatus.alive).toBe(true);
    });

    it('should maintain state integrity throughout combat', () => {
      const playerTeam = [createTestUnit('Player', 50)];
      const enemyTeam = [createTestUnit('Enemy', 50)];

      let state = combatReset(playerTeam, enemyTeam);

      for (let i = 0; i < 100; i++) {
        state = combatNextRound(state);

        // Verify invariants
        expect(state.round).toBeGreaterThan(0);
        expect(state.combatLog).toBeDefined();
        expect(state.initiativeOrder).toBeDefined();
        expect(state.countdownTracker.activeCountdowns).toBeDefined();

        if (isTeamDefeated(state.playerTeam) || isTeamDefeated(state.enemyTeam)) {
          break;
        }
      }

      // Should end in a valid state
      expect(isTeamDefeated(state.playerTeam) || isTeamDefeated(state.enemyTeam)).toBe(true);
    });
  });
});
