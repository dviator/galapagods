import React, { useState } from 'react';
import type { Unit } from '../../types/unit';
import UnitCard from '../unit/UnitCard';
import type { DragData } from '../../types/bench';

interface BenchAreaProps {
  bench: Unit[];
  lockedUnits: string[];
  selectedUnitId: string | null;
  onUnitClick?: (unitId: string) => void;
  onDrop?: (unitId: string) => void;
}

const BenchArea: React.FC<BenchAreaProps> = ({
  bench,
  lockedUnits,
  selectedUnitId,
  onUnitClick,
  onDrop,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e: React.DragEvent, unit: Unit, index: number) => {
    // Prevent drag if unit is locked
    if (lockedUnits.includes(unit.id)) {
      e.preventDefault();
      return;
    }

    const dragData: DragData = {
      unitId: unit.id,
      sourceType: 'bench',
      sourceIndex: index,
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set to false if we're leaving the bench area entirely
    if (e.currentTarget === e.target) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json')) as DragData;

      // Only call onDrop if the unit is coming from active team
      if (data.sourceType === 'active' && onDrop) {
        onDrop(data.unitId);
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Bench</h2>
        <span className="text-sm text-gray-600">
          {bench.length} unit{bench.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div
        className={`
          p-6 bg-gray-50 rounded-lg border-2 min-h-[300px] max-h-[600px] overflow-y-auto
          transition-all duration-200
          ${isDragOver ? 'bg-gray-200 border-gray-400 scale-[1.01]' : 'border-gray-300'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {bench.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[250px]">
            <div className="text-center text-gray-400">
              <svg
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-lg font-medium">Bench is empty</p>
              <p className="text-sm mt-2">Drag units from active team here to store them</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {bench.map((unit, index) => (
              <div
                key={unit.id}
                className={`
                  relative flex items-center justify-center rounded-lg
                  transition-all duration-200
                  ${lockedUnits.includes(unit.id) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}
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
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 text-center">
        {bench.length > 0
          ? 'Drag units to active team or click to select.'
          : 'Units stored here will be saved for future runs.'}
      </p>
    </div>
  );
};

export default BenchArea;
