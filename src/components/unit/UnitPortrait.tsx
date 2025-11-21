import React from 'react';
import type { Unit } from '../../types';

export interface UnitPortraitProps {
  unit: Unit;
  size?: 'normal' | 'large' | 'small';
}

const UnitPortrait: React.FC<UnitPortraitProps> = ({ unit, size = 'normal' }) => {
  const sizeClasses = {
    small: 'w-24 h-24',
    normal: 'w-32 h-full',
    large: 'w-48 h-48',
  };

  return (
    <div className={`${sizeClasses[size]} flex flex-col items-center justify-center bg-gray-200`}>
      <div className="relative w-full h-full flex items-center justify-center">
        {unit.image ? (
          <>
            <img src={unit.image} alt={unit.name} className="object-cover w-full h-full" />
            {!unit.combatStatus.alive && (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0 }}>
                  <line x1="10" y1="10" x2="90" y2="90" stroke="#dc2626" strokeWidth="12" strokeLinecap="square" />
                  <line x1="90" y1="10" x2="10" y2="90" stroke="#dc2626" strokeWidth="12" strokeLinecap="square" />
                </svg>
              </div>
            )}
          </>
        ) : (
          <>
            <span className="text-4xl font-bold text-gray-700">{unit.name}</span>
            {!unit.combatStatus.alive && (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0 }}>
                  <line x1="10" y1="10" x2="90" y2="90" stroke="#dc2626" strokeWidth="12" strokeLinecap="square" />
                  <line x1="90" y1="10" x2="10" y2="90" stroke="#dc2626" strokeWidth="12" strokeLinecap="square" />
                </svg>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UnitPortrait;
