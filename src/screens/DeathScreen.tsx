import React, { useEffect, useContext } from 'react';
import { ControlPanelContext } from '../components/ControlPanelContext';

type DeathScreenProps = {
  onGoToLab: () => void;
};

const DeathScreen: React.FC<DeathScreenProps> = ({ onGoToLab }) => {
  const ctx = useContext(ControlPanelContext);
  const setControlPanel = ctx?.setControlPanel;
  const clearControlPanel = ctx?.clearControlPanel;

  useEffect(() => {
    if (setControlPanel) {
      setControlPanel(
        <button
          className="flex-1 w-full text-2xl px-4 py-8 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-blue-700 transition-all duration-200"
          onClick={onGoToLab}
          style={{ minHeight: '4rem' }}
        >
          Go to Lab
        </button>
      );
    }
    return () => {
      if (clearControlPanel) clearControlPanel();
    };
  }, [setControlPanel, clearControlPanel, onGoToLab]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8">
      <h2 className="text-2xl font-bold mb-4">You Died</h2>
      <p>Death screen UI goes here.</p>
    </div>
  );
};

export default DeathScreen;