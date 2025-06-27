import React, { useEffect } from 'react';
import { useControlPanel } from '../components/ControlPanelContext';

type LabScreenProps = {
  onStartNewRun: () => void;
};

const LabScreen: React.FC<LabScreenProps> = ({ onStartNewRun }) => {
  const { setControlPanel, clearControlPanel } = useControlPanel();

  useEffect(() => {
    setControlPanel(
      <button
        className="flex-1 w-full text-2xl px-4 py-8 bg-purple-600 text-white rounded-lg font-bold shadow hover:bg-purple-700 transition-all duration-200"
        onClick={onStartNewRun}
        style={{ minHeight: '4rem' }}
      >
        Start New Run
      </button>
    );
    return () => clearControlPanel();
  }, [setControlPanel, clearControlPanel, onStartNewRun]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8">
      <h2 className="text-2xl font-bold mb-4">Lab Phase</h2>
      <p>Lab UI goes here.</p>
    </div>
  );
};

export default LabScreen;