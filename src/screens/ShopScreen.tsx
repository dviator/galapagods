import React, { useEffect, useContext } from 'react';
import { ControlPanelContext } from '../components/ControlPanelContext';

type ShopScreenProps = {
  onStartNextCombat: () => void;
};

const ShopScreen: React.FC<ShopScreenProps> = ({ onStartNextCombat }) => {
  const ctx = useContext(ControlPanelContext);
  const setControlPanel = ctx?.setControlPanel;
  const clearControlPanel = ctx?.clearControlPanel;

  useEffect(() => {
    if (setControlPanel) {
      setControlPanel(
        <button
          className="flex-1 w-full text-2xl px-4 py-8 bg-green-600 text-white rounded-lg font-bold shadow hover:bg-green-700 transition-all duration-200"
          onClick={onStartNextCombat}
          style={{ minHeight: '4rem' }}
        >
          Continue to Next Combat
        </button>
      );
    }
    return () => {
      if (clearControlPanel) clearControlPanel();
    };
  }, [setControlPanel, clearControlPanel, onStartNextCombat]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8">
      <h2 className="text-2xl font-bold mb-4">Shop Phase</h2>
      <p>Shop UI goes here.</p>
    </div>
  );
};

export default ShopScreen;