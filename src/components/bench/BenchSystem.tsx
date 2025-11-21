import React, { useState, useCallback } from 'react';
import { useTeam } from '../../contexts/teamContext';
import ActiveTeamArea from './ActiveTeamArea';
import BenchArea from './BenchArea';
import { DEFAULT_BENCH_CONFIG } from '../../types/bench';

interface BenchSystemProps {
  className?: string;
}

const BenchSystem: React.FC<BenchSystemProps> = ({ className = '' }) => {
  const { activeTeam, bench, lockedUnits, actions, isUnitLocked } = useTeam();
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  /**
   * Handle drag and drop from bench to active team
   */
  const handleDropToActiveTeam = useCallback(
    (unitId: string, position: number) => {
      const unit = bench.find((u) => u.id === unitId);
      const existingUnit = activeTeam[position];

      if (existingUnit && unit) {
        const sourceIndex = activeTeam.findIndex((u) => u.id === unitId);
        if (sourceIndex !== -1) {
          actions.swapPositions(unitId, existingUnit.id);
        } else {
          actions.moveToTeam(unitId, position);
          if (activeTeam.length >= DEFAULT_BENCH_CONFIG.maxActiveTeam) {
            actions.moveToBench(existingUnit.id);
          }
        }
      } else {
        actions.moveToTeam(unitId, position);
      }
    },
    [bench, activeTeam, actions]
  );

  /**
   * Handle drag and drop from active team to bench
   */
  const handleDropToBench = useCallback(
    (unitId: string) => {
      actions.moveToBench(unitId);
    },
    [actions]
  );

  /**
   * Handle unit click for point-and-click movement
   */
  const handleUnitClick = useCallback(
    (unitId: string) => {
      if (isUnitLocked(unitId)) {
        return;
      }

      if (!selectedUnitId) {
        setSelectedUnitId(unitId);
        return;
      }

      if (selectedUnitId === unitId) {
        setSelectedUnitId(null);
        return;
      }

      const selectedOnTeam = activeTeam.some((u) => u.id === selectedUnitId);
      const targetOnTeam = activeTeam.some((u) => u.id === unitId);

      if (selectedOnTeam && targetOnTeam) {
        actions.swapPositions(selectedUnitId, unitId);
      }

      setSelectedUnitId(null);
    },
    [selectedUnitId, activeTeam, actions, isUnitLocked]
  );


  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">How to manage your team:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li><strong>Drag & Drop:</strong> Drag units between active team and bench, or reorder within active team</li>
          <li><strong>Click Mode:</strong> Click a unit to select it, then click a destination to move it</li>
          <li><strong>Locked Units:</strong> Units with a lock icon cannot be moved (used in previous combinations)</li>
        </ul>
        {selectedUnitId && (
          <div className="mt-3 p-2 bg-blue-100 rounded border border-blue-300">
            <p className="text-sm font-medium text-blue-900">
              Unit selected! Click a destination to move it, or click the same unit to cancel.
            </p>
          </div>
        )}
      </div>

      {/* Active Team Area */}
      <ActiveTeamArea
        activeTeam={activeTeam}
        maxTeamSize={DEFAULT_BENCH_CONFIG.maxActiveTeam}
        lockedUnits={lockedUnits}
        selectedUnitId={selectedUnitId}
        onUnitClick={handleUnitClick}
        onDrop={handleDropToActiveTeam}
      />

      {/* Bench Area */}
      <BenchArea
        bench={bench}
        lockedUnits={lockedUnits}
        selectedUnitId={selectedUnitId}
        onUnitClick={handleUnitClick}
        onDrop={handleDropToBench}
      />

      {/* Cancel Selection Button */}
      {selectedUnitId && (
        <div className="flex justify-center">
          <button
            onClick={() => setSelectedUnitId(null)}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
          >
            Cancel Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default BenchSystem;
