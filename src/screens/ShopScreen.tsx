import React, { useEffect } from 'react';
import { useControlPanel } from '../components/ControlPanelContext';
import type { Character } from '../types';
import { createCharacter } from '../utils/units/createCharacter';

type ShopScreenProps = {
  setEnemyTeam: (enemies: Character[]) => void;
  onStartNextCombat: () => void;
};

const ShopScreen: React.FC<ShopScreenProps> = ({ setEnemyTeam, onStartNextCombat }) => {
  const { setControlPanel, clearControlPanel } = useControlPanel();

  useEffect(() => {
    setControlPanel(
      <button
        className="flex-1 w-full text-2xl px-4 py-8 bg-green-600 text-white rounded-lg font-bold shadow hover:bg-green-700 transition-all duration-200"
        onClick={onStartNextCombat}
        style={{ minHeight: '4rem' }}
      >
        Continue to Next Combat
      </button>
    );
    return () => clearControlPanel();
  }, [setControlPanel, clearControlPanel, onStartNextCombat]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8">
      <h2 className="text-2xl font-bold mb-4">Shop Phase</h2>
      <p>Shop UI goes here.</p>
    </div>
  );
};

export default ShopScreen;