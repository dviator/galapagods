import React from 'react';
import type { ReactNode } from 'react';
import { ControlPanelProvider, useControlPanel } from './ControlPanelContext';

interface GameLayoutProps {
  children: ReactNode;
  runNumber: number;
  roundNumber: number;
  logArea?: ReactNode; // Optional log area to render to the right of the control panel
}

const FOOTER_HEIGHT = 320;

const ControlPanelArea: React.FC = () => {
  const { controlPanel } = useControlPanel();
  return (
    <div className="flex flex-col justify-between items-stretch bg-gray-100 border-r border-gray-300 h-full w-[340px] max-w-[400px]">
      {controlPanel}
    </div>
  );
};

const LogArea: React.FC<{ children?: ReactNode }> = ({ children }) => (
  <div className="flex-1 flex items-start h-full">
    <div className="w-full h-full overflow-y-auto">{children}</div>
  </div>
);

const GameLayout: React.FC<GameLayoutProps> = ({ children, runNumber, roundNumber, logArea }) => {
  return (
    <ControlPanelProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 font-mono">
        {/* Persistent Phase Tracker Header */}
        <header className="w-full bg-gray-200 px-4 py-2 flex justify-center items-center shadow">
          <div className="text-lg font-bold text-gray-700">
            Run #{runNumber} &nbsp;|&nbsp; Round {roundNumber}
          </div>
        </header>
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-0 m-0">
          {children}
        </main>
        {/* Footer: Control Panel (left) and Log Area (right) */}
        <footer
          className="flex w-full border-t border-gray-200 bg-white"
          style={{ height: `${FOOTER_HEIGHT}px`, minHeight: `${FOOTER_HEIGHT}px`, maxHeight: `${FOOTER_HEIGHT}px` }}
        >
          <ControlPanelArea />
          <LogArea>{logArea}</LogArea>
        </footer>
      </div>
    </ControlPanelProvider>
  );
};

export default GameLayout;