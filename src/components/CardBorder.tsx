import React from 'react';

export type BorderState = 'normal' | 'highlighted' | 'targeted' | 'healed' | 'dashed';

export interface CardBorderProps {
  state?: BorderState;
  dead?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * CardBorder - A wrapper component that handles visual highlighting without affecting internal layout
 * Uses box-shadow for highlights to avoid border overlap issues
 */
const CardBorder: React.FC<CardBorderProps> = ({
  state = 'normal',
  dead = false,
  children,
  className = '',
}) => {
  // Base styles that don't change
  const baseClasses = 'rounded-lg bg-white relative';

  // Border styles using box-shadow (doesn't affect layout)
  const getBorderStyle = (): React.CSSProperties => {
    const deadFilter = dead ? { filter: 'grayscale(1)', opacity: 0.5 } : {};

    switch (state) {
      case 'highlighted':
        return {
          boxShadow: '0 0 0 8px #facc15, 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          ...deadFilter,
        };
      case 'targeted':
        return {
          boxShadow: '0 0 0 8px #ef4444, 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          ...deadFilter,
        };
      case 'healed':
        return {
          boxShadow: '0 0 0 8px #4ade80, 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          ...deadFilter,
        };
      case 'dashed':
        return {
          outline: '4px dashed #60a5fa',
          outlineOffset: '0px',
          ...deadFilter,
        };
      case 'normal':
      default:
        return {
          boxShadow: '0 0 0 2px #000000',
          ...deadFilter,
        };
    }
  };

  return (
    <div
      className={`${baseClasses} ${className}`}
      style={getBorderStyle()}
    >
      {children}
    </div>
  );
};

export default CardBorder;
