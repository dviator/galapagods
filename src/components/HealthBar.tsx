import React from 'react';

export interface HealthBarProps {
  hp: number;
  maxHp: number;
}

const HealthBar: React.FC<HealthBarProps> = ({ hp, maxHp }) => {
  const frac = Math.max(0, hp) / maxHp;
  const color = frac > 0.3 ? 'bg-green-700' : 'bg-red-500';
  const barBg = frac === 0 ? 'bg-gray-700' : 'bg-gray-200';
  return (
    <div className={`w-full h-10 ${barBg} rounded flex items-center relative`} style={{ minHeight: '2.5rem' }}>
      <div
        className={`h-10 rounded transition-all duration-300 ${color}`}
        style={{ width: `${Math.round(frac * 100)}%`, minWidth: frac > 0 ? '2.5rem' : 0 }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="w-full text-center font-bold text-white drop-shadow-sm">{hp} / {maxHp}</span>
      </div>
    </div>
  );
};

export default HealthBar;