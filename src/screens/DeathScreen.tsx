import React, { useEffect, useRef } from 'react';

interface DeathScreenProps {
  onContinue: () => void;
}

const DeathScreen: React.FC<DeathScreenProps> = ({ onContinue }) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onContinue();
    }, 3000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onContinue]);

  const handleContinue = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onContinue();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Your team has fallen...</h1>
      <p className="mb-8">You will be taken to the Lab in a moment.</p>
      <button
        className="px-6 py-3 bg-white text-red-900 font-semibold rounded shadow hover:bg-gray-200 transition"
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
};

export default DeathScreen;