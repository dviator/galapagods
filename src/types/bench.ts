import type { Unit } from './unit';

/**
 * Represents the complete state of the bench system
 */
export interface BenchState {
  /** Units currently on the active team (max 4) */
  activeTeam: Unit[];
  /** Units stored on the bench (unlimited) */
  bench: Unit[];
  /** IDs of units that are locked and cannot be moved */
  lockedUnits: string[];
}

/**
 * Actions available for bench management
 */
export interface BenchActions {
  moveToTeam: (unitId: string, position?: number) => void;
  moveToBench: (unitId: string) => void;
  lockUnit: (unitId: string) => void;
  unlockUnit: (unitId: string) => void;
  swapPositions: (unitId1: string, unitId2: string) => void;
  addToBench: (unit: Unit) => void;
  removeUnit: (unitId: string) => void;
  syncActiveTeam: (newActiveTeam: Unit[]) => void;
}

/**
 * Drag and drop operation types
 */
export enum DragDropType {
  ACTIVE_TO_BENCH = 'active_to_bench',
  BENCH_TO_ACTIVE = 'bench_to_active',
  ACTIVE_TO_ACTIVE = 'active_to_active',
}

/**
 * Data transferred during drag operations
 */
export interface DragData {
  unitId: string;
  sourceType: 'active' | 'bench';
  sourceIndex: number;
}

/**
 * Validation result for team operations
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Configuration constraints for the bench system
 */
export interface BenchConfig {
  /** Maximum number of units on active team */
  maxActiveTeam: number;
  /** Minimum number of units on active team */
  minActiveTeam: number;
  /** Maximum number of units on bench (null = unlimited) */
  maxBench: number | null;
}

/**
 * Default bench configuration
 */
export const DEFAULT_BENCH_CONFIG: BenchConfig = {
  maxActiveTeam: 4,
  minActiveTeam: 1,
  maxBench: null, // unlimited
};
