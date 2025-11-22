import { describe, it, expect } from 'vitest';
import {
  initializeCountdownTracker,
  decrementCountdowns,
  getReadyActions,
  sortByInitiativeOrder,
  resetCountdown,
  removeCountdown,
  getUnit,
  isCombatOver,
} from './countdown';
import type { Unit } from '../../types/unit';
import { TeamEnum } from '../../types/unit';
import { createUnit } from '../units/createCharacter';
import { pounceAttack, swoopAttack, slashAttack } from '../../data/attacks';
import { GeneGrade } from '../../types/stats';

describe('Countdown System - Unit Tests', () => {
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

  describe('initializeCountdownTracker', () => {
    it('should initialize countdowns for all alive units', () => {
      const playerTeam = [createTestUnit('Player1', 20)];
      const enemyTeam = [createTestUnit('Enemy1', 20)];

      const countdowns = initializeCountdownTracker(playerTeam, enemyTeam);

      expect(countdowns).toHaveLength(2);
      expect(countdowns[0].team).toBe(TeamEnum.Player);
      expect(countdowns[0].unitIndex).toBe(0);
      expect(countdowns[0].currentCountdown).toBe(pounceAttack.countdown);
      expect(countdowns[1].team).toBe(TeamEnum.Enemy);
    });

    it('should skip dead units', () => {
      const playerTeam = [createTestUnit('Player1', 20)];
      playerTeam[0].combatStatus.alive = false;
      const enemyTeam = [createTestUnit('Enemy1', 20)];

      const countdowns = initializeCountdownTracker(playerTeam, enemyTeam);

      expect(countdowns).toHaveLength(1);
      expect(countdowns[0].team).toBe(TeamEnum.Enemy);
    });

    it('should handle multiple units per team', () => {
      const playerTeam = [createTestUnit('P1', 20), createTestUnit('P2', 20), createTestUnit('P3', 20)];
      const enemyTeam = [createTestUnit('E1', 20), createTestUnit('E2', 20)];

      const countdowns = initializeCountdownTracker(playerTeam, enemyTeam);

      expect(countdowns).toHaveLength(5);
      expect(countdowns.filter(c => c.team === TeamEnum.Player)).toHaveLength(3);
      expect(countdowns.filter(c => c.team === TeamEnum.Enemy)).toHaveLength(2);
    });
  });

  describe('decrementCountdowns', () => {
    it('should decrement all countdowns by 1', () => {
      const playerTeam = [createTestUnit('Player1', 20)];
      const enemyTeam = [createTestUnit('Enemy1', 20)];

      let countdowns = initializeCountdownTracker(playerTeam, enemyTeam);
      const originalValues = countdowns.map(c => c.currentCountdown);

      countdowns = decrementCountdowns(countdowns);

      countdowns.forEach((countdown, i) => {
        expect(countdown.currentCountdown).toBe(originalValues[i] - 1);
      });
    });

    it('should not mutate original array', () => {
      const playerTeam = [createTestUnit('Player1', 20)];
      const enemyTeam: Unit[] = [];

      const original = initializeCountdownTracker(playerTeam, enemyTeam);
      const originalCountdown = original[0].currentCountdown;

      decrementCountdowns(original);

      expect(original[0].currentCountdown).toBe(originalCountdown);
    });
  });

  describe('getReadyActions', () => {
    it('should return units with countdown = 0', () => {
      const playerTeam = [createTestUnit('Player1', 20)];
      const enemyTeam = [createTestUnit('Enemy1', 20)];

      const countdowns = initializeCountdownTracker(playerTeam, enemyTeam);
      countdowns[0].currentCountdown = 0;
      countdowns[1].currentCountdown = 3;

      const readyActions = getReadyActions(countdowns);

      expect(readyActions).toHaveLength(1);
      expect(readyActions[0].team).toBe(TeamEnum.Player);
    });

    it('should return multiple ready actions', () => {
      const playerTeam = [createTestUnit('Player1', 20), createTestUnit('Player2', 20)];
      const enemyTeam = [createTestUnit('Enemy1', 20)];

      const countdowns = initializeCountdownTracker(playerTeam, enemyTeam);
      countdowns[0].currentCountdown = 0;
      countdowns[1].currentCountdown = 0;
      countdowns[2].currentCountdown = 3;

      const readyActions = getReadyActions(countdowns);

      expect(readyActions).toHaveLength(2);
    });

    it('should return empty array if no units are ready', () => {
      const playerTeam = [createTestUnit('Player1', 20)];
      const enemyTeam = [createTestUnit('Enemy1', 20)];

      const countdowns = initializeCountdownTracker(playerTeam, enemyTeam);
      const readyActions = getReadyActions(countdowns);

      expect(readyActions).toHaveLength(0);
    });
  });

  describe('sortByInitiativeOrder', () => {
    it('should sort ready actions by initiative order', () => {
      const readyActions = [
        { unitIndex: 0, team: TeamEnum.Enemy, currentCountdown: 0 },
        { unitIndex: 0, team: TeamEnum.Player, currentCountdown: 0 },
      ];

      const initiativeOrder = [
        { team: TeamEnum.Player, index: 0, initiative: 10 },
        { team: TeamEnum.Enemy, index: 0, initiative: 5 },
      ];

      const sorted = sortByInitiativeOrder(readyActions, initiativeOrder);

      expect(sorted[0].team).toBe(TeamEnum.Player);
      expect(sorted[1].team).toBe(TeamEnum.Enemy);
    });

    it('should maintain order for units not in initiative order', () => {
      const readyActions = [
        { unitIndex: 0, team: TeamEnum.Player, currentCountdown: 0 },
        { unitIndex: 0, team: TeamEnum.Enemy, currentCountdown: 0 },
      ];

      const initiativeOrder = [
        { team: TeamEnum.Player, index: 0, initiative: 10 },
        { team: TeamEnum.Enemy, index: 0, initiative: 5 },
      ];

      const sorted = sortByInitiativeOrder(readyActions, initiativeOrder);

      expect(sorted).toHaveLength(2);
    });
  });

  describe('resetCountdown', () => {
    it('should reset countdown to attack base value', () => {
      const playerTeam: Unit[] = [createTestUnit('Player1', 20)];
      const countdown = { unitIndex: 0, team: TeamEnum.Player, currentCountdown: 0 };

      const reset = resetCountdown(countdown, playerTeam[0]);

      expect(reset.currentCountdown).toBe(pounceAttack.countdown);
      expect(reset.team).toBe(TeamEnum.Player);
      expect(reset.unitIndex).toBe(0);
    });

    it('should work with different attack types', () => {
      const unit = createTestUnit('Test', 20);
      unit.attack = swoopAttack;
      const countdown = { unitIndex: 0, team: TeamEnum.Player, currentCountdown: 0 };

      const reset = resetCountdown(countdown, unit);

      expect(reset.currentCountdown).toBe(swoopAttack.countdown);
    });

    it('should not mutate original countdown', () => {
      const playerTeam: Unit[] = [createTestUnit('Player1', 20)];
      const countdown = { unitIndex: 0, team: TeamEnum.Player, currentCountdown: 0 };

      resetCountdown(countdown, playerTeam[0]);

      expect(countdown.currentCountdown).toBe(0);
    });
  });

  describe('removeCountdown', () => {
    it('should remove specific unit from countdowns', () => {
      const playerTeam = [createTestUnit('Player1', 20)];
      const enemyTeam = [createTestUnit('Enemy1', 20)];

      let countdowns = initializeCountdownTracker(playerTeam, enemyTeam);
      expect(countdowns).toHaveLength(2);

      countdowns = removeCountdown(countdowns, TeamEnum.Player, 0);

      expect(countdowns).toHaveLength(1);
      expect(countdowns[0].team).toBe(TeamEnum.Enemy);
    });

    it('should not affect other units', () => {
      const playerTeam = [createTestUnit('Player1', 20), createTestUnit('Player2', 20)];
      const enemyTeam = [createTestUnit('Enemy1', 20)];

      let countdowns = initializeCountdownTracker(playerTeam, enemyTeam);

      countdowns = removeCountdown(countdowns, TeamEnum.Player, 0);

      expect(countdowns).toHaveLength(2);
      expect(countdowns.some(c => c.team === TeamEnum.Player && c.unitIndex === 1)).toBe(true);
      expect(countdowns.some(c => c.team === TeamEnum.Enemy)).toBe(true);
    });
  });

  describe('getUnit', () => {
    it('should retrieve unit from player team', () => {
      const playerTeam = [createTestUnit('Player1', 20)];
      const enemyTeam = [createTestUnit('Enemy1', 20)];

      const unit = getUnit(TeamEnum.Player, 0, playerTeam, enemyTeam);

      expect(unit?.name).toBe('Player1');
    });

    it('should retrieve unit from enemy team', () => {
      const playerTeam = [createTestUnit('Player1', 20)];
      const enemyTeam = [createTestUnit('Enemy1', 20)];

      const unit = getUnit(TeamEnum.Enemy, 0, playerTeam, enemyTeam);

      expect(unit?.name).toBe('Enemy1');
    });

    it('should return undefined for invalid index', () => {
      const playerTeam = [createTestUnit('Player1', 20)];
      const enemyTeam = [createTestUnit('Enemy1', 20)];

      const unit = getUnit(TeamEnum.Player, 5, playerTeam, enemyTeam);

      expect(unit).toBeUndefined();
    });
  });

  describe('isCombatOver', () => {
    it('should return true when all players are dead', () => {
      const playerTeam = [createTestUnit('Player1', 20)];
      playerTeam[0].combatStatus.alive = false;
      const enemyTeam = [createTestUnit('Enemy1', 20)];

      const isOver = isCombatOver(playerTeam, enemyTeam);

      expect(isOver).toBe(true);
    });

    it('should return true when all enemies are dead', () => {
      const playerTeam = [createTestUnit('Player1', 20)];
      const enemyTeam = [createTestUnit('Enemy1', 20)];
      enemyTeam[0].combatStatus.alive = false;

      const isOver = isCombatOver(playerTeam, enemyTeam);

      expect(isOver).toBe(true);
    });

    it('should return false when both teams have alive units', () => {
      const playerTeam = [createTestUnit('Player1', 20)];
      const enemyTeam = [createTestUnit('Enemy1', 20)];

      const isOver = isCombatOver(playerTeam, enemyTeam);

      expect(isOver).toBe(false);
    });

    it('should handle multiple units correctly', () => {
      const playerTeam = [createTestUnit('P1', 20), createTestUnit('P2', 20)];
      playerTeam[0].combatStatus.alive = false;
      const enemyTeam = [createTestUnit('E1', 20)];

      const isOver = isCombatOver(playerTeam, enemyTeam);

      expect(isOver).toBe(false);
    });
  });

  describe('Countdown ordering and tie-breaking', () => {
    it('should order actions by countdown value', () => {
      const playerTeam = [createTestUnit('Fast', 20), createTestUnit('Slow', 20)];
      playerTeam[0].attack = swoopAttack; // countdown: 5
      playerTeam[1].attack = slashAttack; // countdown: 8

      const countdowns = initializeCountdownTracker(playerTeam, []);

      const fast = countdowns.find(c => c.unitIndex === 0);
      const slow = countdowns.find(c => c.unitIndex === 1);

      expect(fast?.currentCountdown).toBe(5);
      expect(slow?.currentCountdown).toBe(8);
    });

    it('should handle countdown progression correctly', () => {
      const playerTeam = [createTestUnit('Unit', 20)];
      playerTeam[0].attack = pounceAttack; // countdown: 6

      let countdowns = initializeCountdownTracker(playerTeam, []);
      expect(countdowns[0].currentCountdown).toBe(6);

      for (let i = 0; i < 6; i++) {
        countdowns = decrementCountdowns(countdowns);
      }

      expect(countdowns[0].currentCountdown).toBe(0);
      const readyActions = getReadyActions(countdowns);
      expect(readyActions).toHaveLength(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle countdown of 1', () => {
      const unit = createTestUnit('Unit', 20);
      unit.attack = { ...pounceAttack, countdown: 1 };

      const countdowns = initializeCountdownTracker([unit], []);

      expect(countdowns[0].currentCountdown).toBe(1);
      const decremented = decrementCountdowns(countdowns);
      expect(decremented[0].currentCountdown).toBe(0);
    });

    it('should handle large countdown values', () => {
      const unit = createTestUnit('Unit', 20);
      unit.attack = { ...pounceAttack, countdown: 100 };

      const countdowns = initializeCountdownTracker([unit], []);

      expect(countdowns[0].currentCountdown).toBe(100);
    });

    it('should handle empty teams', () => {
      const countdowns = initializeCountdownTracker([], []);

      expect(countdowns).toHaveLength(0);
    });

    it('should handle mixed alive and dead units', () => {
      const playerTeam = [createTestUnit('P1', 20), createTestUnit('P2', 20), createTestUnit('P3', 20)];
      playerTeam[0].combatStatus.alive = false;
      playerTeam[2].combatStatus.alive = false;

      const countdowns = initializeCountdownTracker(playerTeam, []);

      expect(countdowns).toHaveLength(1);
      expect(countdowns[0].unitIndex).toBe(1);
    });
  });
});
