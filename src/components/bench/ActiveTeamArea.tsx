import React, { useState } from 'react';
import type { Unit } from '../../types/unit';
import UnitCard from '../unit/UnitCard';
import type { DragData } from '../../types/bench';

interface ActiveTeamAreaProps {
  activeTeam: Unit[];
  maxTeamSize: number;
  lockedUnits: string[];
  selectedUnitId: string | null;
  onUnitClick?: (unitId: string) => void;
  onDrop?: (unitId: string, position: number) => void;
}

const ActiveTeamArea: React.FC<ActiveTeamAreaProps> = ({
  activeTeam,
  maxTeamSize,
  lockedUnits,
  selectedUnitId,
  onUnitClick,
  onDrop,
}) => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, unit: Unit, index: number) => {
    // Prevent drag if unit is locked
    if (lockedUnits.includes(unit.id)) {
      e.preventDefault();
      return;
    }

    const dragData: DragData = {
      unitId: unit.id,
      sourceType: 'active',
      sourceIndex: index,
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, position: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json')) as DragData;
      if (onDrop) {
        onDrop(data.unitId, position);
      }
    } catch (error) {
      console.error('Failed to parse drag data:', error);
    }
  };

  const handleUnitClick = (unitId: string) => {
    if (onUnitClick && !lockedUnits.includes(unitId)) {
      onUnitClick(unitId);
    }
  };

  // Create slots for all possible team positions
  const slots = Array.from({ length: maxTeamSize }, (_, index) => {
    const unit = activeTeam[index];
    return { unit, index };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Active Team</h2>
        <span className="text-sm text-gray-600">
          {activeTeam.length} / {maxTeamSize}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 p-6 bg-blue-50 rounded-lg border-2 border-blue-200 min-h-[300px]">
        {slots.map(({ unit, index }) => (
          <div
            key={index}
            className={`
              relative flex items-center justify-center rounded-lg
              transition-all duration-200
              ${dragOverIndex === index ? 'bg-blue-200 scale-105' : 'bg-blue-100'}
              ${!unit ? 'border-2 border-dashed border-blue-300' : ''}
              hover:bg-blue-200
            `}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          >
            {unit ? (
              <div
                className={`
                  cursor-pointer transition-opacity
                  ${lockedUnits.includes(unit.id) ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-80'}
                  ${selectedUnitId === unit.id ? 'ring-4 ring-blue-500 rounded-lg' : ''}
                `}
                draggable={!lockedUnits.includes(unit.id)}
                onDragStart={(e) => handleDragStart(e, unit, index)}
                onDragEnd={handleDragEnd}
                onClick={() => handleUnitClick(unit.id)}
              >
                <UnitCard entity={unit} dashed={lockedUnits.includes(unit.id)} />

                {/* Lock indicator */}
                {lockedUnits.includes(unit.id) && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-lg">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-blue-400 p-8">
                <p className="text-sm">Drop unit here</p>
                <p className="text-xs mt-1">Position {index + 1}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 text-center">
        Drag units to reorder or move to bench. Click to select.
      </p>
    </div>
  );
};

export default ActiveTeamArea;
