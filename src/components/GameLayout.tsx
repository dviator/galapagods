import React from 'react';
import type { ReactNode } from 'react';
import ControlPanel from './ControlPanel';
import GameTracker from './GameTracker';

interface GameLayoutProps {
  children: ReactNode;
  logArea?: ReactNode; // Optional log area to render to the right of the control panel
}

const FOOTER_HEIGHT = 240;

const LogArea: React.FC<{ children?: ReactNode }> = ({ children }) => (
  <div className="flex-1 flex items-start h-full">
    <div className="w-full h-full overflow-y-auto">{children}</div>
  </div>
);

const GameLayout: React.FC<GameLayoutProps> = ({ children, logArea }) => {
  return (
    <div className="h-screen flex flex-col bg-gray-50 font-mono overflow-hidden">
      {/* Persistent Phase Tracker Header */}
      <GameTracker />
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden p-0 m-0">
        {children}
      </main>
      {/* Footer: Control Panel (left) and Log Area (right) */}
      <footer
        className="flex w-full border-t border-gray-200 bg-white flex-shrink-0"
        style={{ height: `${FOOTER_HEIGHT}px`, minHeight: `${FOOTER_HEIGHT}px`, maxHeight: `${FOOTER_HEIGHT}px` }}
      >
        <div className="flex flex-col justify-between items-stretch bg-gray-100 border-r border-gray-300 h-full w-[340px] max-w-[400px] min-w-[340px]">
          <ControlPanel />
        </div>
        <div className="flex-1 min-w-0 h-full">
          <LogArea>{logArea}</LogArea>
        </div>
      </footer>
    </div>
  );
};

export default GameLayout;