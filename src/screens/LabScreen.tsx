import React, { useState } from 'react';
import { useGameState } from '../contexts/useGameState';
import BenchSystem from '../components/bench/BenchSystem';

export const LabControlPanelButton: React.FC<{ onStartNewRun: () => void }> = ({ onStartNewRun }) => (
  <button
    className="flex-1 w-full text-2xl px-4 py-8 bg-purple-600 text-white rounded-lg font-bold shadow hover:bg-purple-700 transition-all duration-200"
    onClick={onStartNewRun}
    style={{ minHeight: '4rem' }}
  >
    Start New Run
  </button>
);

enum LabStation {
  Cloning = 'Cloning',
  Combining = 'Combining',
  Bench = 'Bench',
  Reposition = 'Team Repositioning',
}

const STATION_ICON: Record<LabStation, string> = {
  [LabStation.Cloning]: '🔬',
  [LabStation.Combining]: '🧬',
  [LabStation.Bench]: '🧰',
  [LabStation.Reposition]: '🎯',
};

const LabScreen: React.FC = () => {
  const { handleNewRun } = useGameState();
  const [station, setStation] = useState<LabStation>(LabStation.Cloning);

  const StationNode: React.FC<{
    value: LabStation;
    style: React.CSSProperties;
  }> = ({ value, style }) => (
    <button
      aria-label={value}
      className={`absolute flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full border-2 shadow-lg select-none transition
      ${station === value ? 'bg-purple-600/90 text-white border-purple-300 ring-4 ring-purple-400/40' : 'bg-white/90 text-purple-800 border-purple-300 hover:bg-purple-50'}`}
      style={style}
      onClick={() => setStation(value)}
    >
      <span className="text-3xl md:text-4xl mr-1">{STATION_ICON[value]}</span>
    </button>
  );

  const renderStation = () => {
    switch (station) {
      case LabStation.Cloning:
        return (
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Cloning Station</h3>
            <p className="text-gray-700">Generate new units and add them to your bench. (Placeholder UI)</p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded shadow opacity-60 cursor-not-allowed" disabled>
              Clone Creature (coming soon)
            </button>
          </div>
        );
      case LabStation.Combining:
        return (
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Combining Station</h3>
            <p className="text-gray-700">Combine two creatures into a new one; originals become locked for next run. (Placeholder UI)</p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded shadow opacity-60 cursor-not-allowed" disabled>
              Combine Selected (coming soon)
            </button>
          </div>
        );
      case LabStation.Bench:
        return (
          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
            <BenchSystem />
          </div>
        );
      case LabStation.Reposition:
        return (
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Team Repositioning</h3>
            <p className="text-gray-700">Adjust team positions before combat. (Placeholder UI)</p>
            <div className="rounded border border-dashed p-4 text-gray-500">Drag-and-drop/click-based UI coming soon.</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white">
      {/* Decorative glowing blobs */}
      <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 md:p-8">
        {/* Lab Map */}
        <div className="relative rounded-2xl border border-purple-500/30 bg-white/5 backdrop-blur-sm shadow-xl min-h-[60vh]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.15),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(99,102,241,0.12),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.12),transparent_40%)]" />

          {/* Station Nodes (absolute positions) */}
          <StationNode value={LabStation.Cloning} style={{ top: '14%', left: '12%' }} />
          <StationNode value={LabStation.Combining} style={{ top: '22%', right: '12%' }} />
          <StationNode value={LabStation.Bench} style={{ bottom: '18%', left: '18%' }} />
          <StationNode value={LabStation.Reposition} style={{ bottom: '12%', right: '18%' }} />

          {/* Center label */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <h2 className="text-3xl font-extrabold tracking-wide">The Lab</h2>
            <p className="text-purple-200/80">Select a station to manage your squad</p>
          </div>
        </div>

        {/* Details Panel */}
        <div className="rounded-2xl border border-purple-500/30 bg-white/5 backdrop-blur-sm shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{STATION_ICON[station]}</span>
              <h3 className="text-2xl font-bold">{station}</h3>
            </div>
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700"
              onClick={handleNewRun}
            >
              Start New Run
            </button>
          </div>
          <div className="text-white/90">
            {renderStation()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabScreen;