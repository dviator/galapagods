import React, { createContext, useContext, useState, useCallback } from 'react';

type ControlPanelType = {
  controlPanel: React.ReactNode;
  setControlPanel: (content: React.ReactNode) => void;
  clearControlPanel: () => void;
};

const controlPanel = createContext<ControlPanelType | undefined>(undefined);

export const ControlPanelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [controlPanelContent, setPanel] = useState<React.ReactNode>(null);

  const setControlPanel = useCallback((content: React.ReactNode) => setPanel(content), []);
  const clearControlPanel = useCallback(() => setPanel(null), []);

  return (
    <controlPanel.Provider value={{ controlPanel: controlPanelContent, setControlPanel, clearControlPanel }}>
      {children}
    </controlPanel.Provider>
  );
};

export function useControlPanel() {
  const ctx = useContext(controlPanel);
  if (!ctx) throw new Error('useControlPanel must be used within a ControlPanelProvider');
  return ctx;
}