import React from 'react';

interface NewRunButtonProps {
  onClick: () => void;
}

const NewRunButton: React.FC<NewRunButtonProps> = ({ onClick }) => (
  <button
    className="flex-1 min-h-[56px] px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full text-lg shadow-none"
    onClick={onClick}
  >
    New Run
  </button>
);

export default NewRunButton;