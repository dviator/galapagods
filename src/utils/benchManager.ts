import type { Unit } from '../types/unit';
import type { BenchState, BenchConfig, ValidationResult } from '../types/bench';
import { DEFAULT_BENCH_CONFIG } from '../types/bench';

/**
 * BenchManager handles all business logic for the bench system
 */
export class BenchManager {
  private config: BenchConfig;

  constructor(config: BenchConfig = DEFAULT_BENCH_CONFIG) {
    this.config = config;
  }

  /**
   * Add a unit to the bench
   */
  addToBench(state: BenchState, unit: Unit): BenchState {
    // Check if unit already exists
    if (this.findUnit(state, unit.id)) {
      throw new Error(`Unit ${unit.id} already exists in the system`);
    }

    // Check bench capacity
    if (this.config.maxBench !== null && state.bench.length >= this.config.maxBench) {
      throw new Error(`Bench is full (max ${this.config.maxBench} units)`);
    }

    return {
      ...state,
      bench: [...state.bench, unit],
    };
  }

  /**
   * Remove a unit from the bench
   */
  removeFromBench(state: BenchState, unitId: string): BenchState {
    const benchIndex = state.bench.findIndex(u => u.id === unitId);
    if (benchIndex === -1) {
      throw new Error(`Unit ${unitId} not found on bench`);
    }

    return {
      ...state,
      bench: state.bench.filter(u => u.id !== unitId),
      lockedUnits: state.lockedUnits.filter(id => id !== unitId),
    };
  }

  /**
   * Move a unit from bench to active team
   */
  moveToTeam(state: BenchState, unitId: string, position?: number): BenchState {
    // Validate the move
    const validation = this.validateMoveToTeam(state, unitId);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const benchIndex = state.bench.findIndex(u => u.id === unitId);
    if (benchIndex === -1) {
      throw new Error(`Unit ${unitId} not found on bench`);
    }

    const unit = state.bench[benchIndex];
    const newBench = state.bench.filter(u => u.id !== unitId);

    // Add to active team at specified position or at the end
    let newActiveTeam: Unit[];
    if (position !== undefined && position >= 0 && position <= state.activeTeam.length) {
      newActiveTeam = [
        ...state.activeTeam.slice(0, position),
        unit,
        ...state.activeTeam.slice(position),
      ];
    } else {
      newActiveTeam = [...state.activeTeam, unit];
    }

    return {
      ...state,
      activeTeam: newActiveTeam,
      bench: newBench,
    };
  }

  /**
   * Move a unit from active team to bench
   */
  moveToBench(state: BenchState, unitId: string): BenchState {
    // Validate the move
    const validation = this.validateMoveToBench(state, unitId);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const teamIndex = state.activeTeam.findIndex(u => u.id === unitId);
    if (teamIndex === -1) {
      throw new Error(`Unit ${unitId} not found on active team`);
    }

    const unit = state.activeTeam[teamIndex];
    const newActiveTeam = state.activeTeam.filter(u => u.id !== unitId);
    const newBench = [...state.bench, unit];

    return {
      ...state,
      activeTeam: newActiveTeam,
      bench: newBench,
    };
  }

  /**
   * Swap positions of two units within the active team
   */
  swapPositions(state: BenchState, unitId1: string, unitId2: string): BenchState {
    const index1 = state.activeTeam.findIndex(u => u.id === unitId1);
    const index2 = state.activeTeam.findIndex(u => u.id === unitId2);

    if (index1 === -1 || index2 === -1) {
      throw new Error('One or both units not found on active team');
    }

    // Check if either unit is locked
    if (this.isUnitLocked(state, unitId1) || this.isUnitLocked(state, unitId2)) {
      throw new Error('Cannot swap locked units');
    }

    const newActiveTeam = [...state.activeTeam];
    [newActiveTeam[index1], newActiveTeam[index2]] = [newActiveTeam[index2], newActiveTeam[index1]];

    return {
      ...state,
      activeTeam: newActiveTeam,
    };
  }

  /**
   * Lock a unit to prevent it from being moved
   */
  lockUnit(state: BenchState, unitId: string): BenchState {
    if (!this.findUnit(state, unitId)) {
      throw new Error(`Unit ${unitId} not found`);
    }

    if (state.lockedUnits.includes(unitId)) {
      return state; // Already locked
    }

    return {
      ...state,
      lockedUnits: [...state.lockedUnits, unitId],
    };
  }

  /**
   * Unlock a unit to allow it to be moved
   */
  unlockUnit(state: BenchState, unitId: string): BenchState {
    return {
      ...state,
      lockedUnits: state.lockedUnits.filter(id => id !== unitId),
    };
  }

  /**
   * Remove a unit entirely from the system
   */
  removeUnit(state: BenchState, unitId: string): BenchState {
    const isOnTeam = state.activeTeam.some(u => u.id === unitId);
    const isOnBench = state.bench.some(u => u.id === unitId);

    if (!isOnTeam && !isOnBench) {
      throw new Error(`Unit ${unitId} not found`);
    }

    // If removing from active team, validate we'll still have minimum units
    if (isOnTeam && state.activeTeam.length <= this.config.minActiveTeam) {
      throw new Error(`Cannot remove unit: active team must have at least ${this.config.minActiveTeam} unit(s)`);
    }

    return {
      ...state,
      activeTeam: state.activeTeam.filter(u => u.id !== unitId),
      bench: state.bench.filter(u => u.id !== unitId),
      lockedUnits: state.lockedUnits.filter(id => id !== unitId),
    };
  }

  /**
   * Check if a unit is locked
   */
  isUnitLocked(state: BenchState, unitId: string): boolean {
    return state.lockedUnits.includes(unitId);
  }

  /**
   * Validate if the active team size is valid
   */
  validateTeamSize(state: BenchState): ValidationResult {
    if (state.activeTeam.length < this.config.minActiveTeam) {
      return {
        valid: false,
        error: `Active team must have at least ${this.config.minActiveTeam} unit(s)`,
      };
    }

    if (state.activeTeam.length > this.config.maxActiveTeam) {
      return {
        valid: false,
        error: `Active team cannot exceed ${this.config.maxActiveTeam} units`,
      };
    }

    return { valid: true };
  }

  /**
   * Validate if a unit can be moved to the active team
   */
  validateMoveToTeam(state: BenchState, unitId: string): ValidationResult {
    if (this.isUnitLocked(state, unitId)) {
      return { valid: false, error: 'Unit is locked and cannot be moved' };
    }

    if (state.activeTeam.length >= this.config.maxActiveTeam) {
      return {
        valid: false,
        error: `Active team is full (max ${this.config.maxActiveTeam} units)`,
      };
    }

    return { valid: true };
  }

  /**
   * Validate if a unit can be moved to the bench
   */
  validateMoveToBench(state: BenchState, unitId: string): ValidationResult {
    if (this.isUnitLocked(state, unitId)) {
      return { valid: false, error: 'Unit is locked and cannot be moved' };
    }

    if (state.activeTeam.length <= this.config.minActiveTeam) {
      return {
        valid: false,
        error: `Active team must have at least ${this.config.minActiveTeam} unit(s)`,
      };
    }

    if (this.config.maxBench !== null && state.bench.length >= this.config.maxBench) {
      return {
        valid: false,
        error: `Bench is full (max ${this.config.maxBench} units)`,
      };
    }

    return { valid: true };
  }

  /**
   * Find a unit in the bench system (active team or bench)
   */
  private findUnit(state: BenchState, unitId: string): Unit | undefined {
    return state.activeTeam.find(u => u.id === unitId) || state.bench.find(u => u.id === unitId);
  }
}

/**
 * Create a default empty bench state
 */
export function createEmptyBenchState(): BenchState {
  return {
    activeTeam: [],
    bench: [],
    lockedUnits: [],
  };
}

/**
 * Create a bench state from existing units
 */
export function createBenchState(activeTeam: Unit[], bench: Unit[] = []): BenchState {
  return {
    activeTeam,
    bench,
    lockedUnits: [],
  };
}
