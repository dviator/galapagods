import React from "react";

interface CombatLogProps {
  combatLog: string[];
}

const CombatLog: React.FC<CombatLogProps> = ({ combatLog }) => (
  <div className="w-full h-full">
    <pre className="bg-gray-100 p-4 h-full overflow-auto rounded-lg border whitespace-pre-wrap break-words">
      {combatLog.join("\n")}
    </pre>
  </div>
);

export default CombatLog;