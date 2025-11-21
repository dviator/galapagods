import React from 'react';

export interface UnitNotificationsProps {
  xpGained?: number;
  leveledUp?: boolean;
}

const UnitNotifications: React.FC<UnitNotificationsProps> = ({ xpGained, leveledUp }) => {
  if (typeof xpGained !== 'number') {
    return null;
  }

  return (
    <div className="w-full pb-3 pl-4">
      <span className="text-green-700 font-bold text-lg">
        +{xpGained} XP
        {leveledUp && <span className="ml-2 text-yellow-500">Level Up! 🎉</span>}
      </span>
    </div>
  );
};

export default UnitNotifications;
