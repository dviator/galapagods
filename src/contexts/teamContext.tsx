import React, { createContext, useState, useCallback, useContext } from 'react';
import type { Unit } from '../types/unit';
import type { BenchState, BenchActions, BenchConfig } from '../types/bench';
import { BenchManager, createBenchState } from '../utils/benchManager';
import { DEFAULT_BENCH_CONFIG } from '../types/bench';

interface TeamContextValue {
  activeTeam: Unit[];
  bench: Unit[];
  lockedUnits: string[];
  actions: BenchActions;
  isUnitLocked: (unitId: string) => boolean;
  validateTeamSize: () => { valid: boolean; error?: string };
  updateActiveTeam: (updater: (team: Unit[]) => Unit[]) => void;
}

const TeamContext = createContext<TeamContextValue | undefined>(undefined);

interface TeamProviderProps {
  children: React.ReactNode;
  initialActiveTeam?: Unit[];
  initialBench?: Unit[];
  config?: BenchConfig;
}

export const TeamProvider: React.FC<TeamProviderProps> = ({
  children,
  initialActiveTeam = [],
  initialBench = [],
  config = DEFAULT_BENCH_CONFIG,
}) => {
  const [manager] = useState(() => new BenchManager(config));

  const [teamState, setTeamState] = useState<BenchState>(() =>
    createBenchState(initialActiveTeam, initialBench)
  );

  const moveToTeam = useCallback((unitId: string, position?: number) => {
    setTeamState(prev => {
      try {
        return manager.moveToTeam(prev, unitId, position);
      } catch (error) {
        console.error('Failed to move unit to team:', error);
        return prev;
      }
    });
  }, [manager]);

  const moveToBench = useCallback((unitId: string) => {
    setTeamState(prev => {
      try {
        return manager.moveToBench(prev, unitId);
      } catch (error) {
        console.error('Failed to move unit to bench:', error);
        return prev;
      }
    });
  }, [manager]);

  const lockUnit = useCallback((unitId: string) => {
    setTeamState(prev => {
      try {
        return manager.lockUnit(prev, unitId);
      } catch (error) {
        console.error('Failed to lock unit:', error);
        return prev;
      }
    });
  }, [manager]);

  const unlockUnit = useCallback((unitId: string) => {
    setTeamState(prev => {
      try {
        return manager.unlockUnit(prev, unitId);
      } catch (error) {
        console.error('Failed to unlock unit:', error);
        return prev;
      }
    });
  }, [manager]);

  const swapPositions = useCallback((unitId1: string, unitId2: string) => {
    setTeamState(prev => {
      try {
        return manager.swapPositions(prev, unitId1, unitId2);
      } catch (error) {
        console.error('Failed to swap positions:', error);
        return prev;
      }
    });
  }, [manager]);

  const addToBench = useCallback((unit: Unit) => {
    setTeamState(prev => {
      try {
        return manager.addToBench(prev, unit);
      } catch (error) {
        console.error('Failed to add unit to bench:', error);
        return prev;
      }
    });
  }, [manager]);

  const removeUnit = useCallback((unitId: string) => {
    setTeamState(prev => {
      try {
        return manager.removeUnit(prev, unitId);
      } catch (error) {
        console.error('Failed to remove unit:', error);
        return prev;
      }
    });
  }, [manager]);

  const syncActiveTeam = useCallback((newActiveTeam: Unit[]) => {
    setTeamState(prev => ({
      ...prev,
      activeTeam: newActiveTeam,
    }));
  }, []);

  const updateActiveTeam = useCallback((updater: (team: Unit[]) => Unit[]) => {
    setTeamState(prev => ({
      ...prev,
      activeTeam: updater(prev.activeTeam),
    }));
  }, []);

  const isUnitLocked = useCallback((unitId: string) => {
    return manager.isUnitLocked(teamState, unitId);
  }, [manager, teamState]);

  const validateTeamSize = useCallback(() => {
    return manager.validateTeamSize(teamState);
  }, [manager, teamState]);

  const actions: BenchActions = {
    moveToTeam,
    moveToBench,
    lockUnit,
    unlockUnit,
    swapPositions,
    addToBench,
    removeUnit,
    syncActiveTeam,
  };

  return (
    <TeamContext.Provider
      value={{
        activeTeam: teamState.activeTeam,
        bench: teamState.bench,
        lockedUnits: teamState.lockedUnits,
        actions,
        isUnitLocked,
        validateTeamSize,
        updateActiveTeam,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useTeam(): TeamContextValue {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useActiveTeam(): Unit[] {
  const { activeTeam } = useTeam();
  return activeTeam;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBench(): Unit[] {
  const { bench } = useTeam();
  return bench;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTeamActions(): BenchActions {
  const { actions } = useTeam();
  return actions;
}
