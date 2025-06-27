import React, { useState, useCallback, createContext } from 'react';

// Internal context, not exported
const ControlPanelContext = createContext<{
  controlPanel: React.ReactNode;
  setControlPanel: (content: React.ReactNode) => void;
  clearControlPanel: () => void;
} | undefined>(undefined);

export const ControlPanelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [controlPanelContent, setPanel] = useState<React.ReactNode>(null);

  const setControlPanel = useCallback((content: React.ReactNode) => setPanel(content), []);
  const clearControlPanel = useCallback(() => setPanel(null), []);

  return (
    <ControlPanelContext.Provider value={{ controlPanel: controlPanelContent, setControlPanel, clearControlPanel }}>
      {children}
    </ControlPanelContext.Provider>
  );
};

export { ControlPanelContext };

// If you need to use the context, use React.useContext(ControlPanelContext) within a child of ControlPanelProvider.