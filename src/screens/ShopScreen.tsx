import React, { useState, useEffect } from 'react';
import UnitCard from '../components/UnitCard';
import { useGameState } from '../contexts/useGameState';
import { applyEffect, EffectName } from '../utils/units/effects';
import { SHOP_ITEMS, getTemporaryStatBoostItem } from '../data/shopItems';
import type { ShopItem } from '../types/shop';

export const ShopControlPanelButton: React.FC<{ onStartNextCombat: () => void }> = ({ onStartNextCombat }) => (
  <button
    className="flex-1 w-full text-2xl px-4 py-8 bg-green-600 text-white rounded-lg font-bold shadow hover:bg-green-700 transition-all duration-200"
    onClick={onStartNextCombat}
    style={{ minHeight: '4rem' }}
  >
    Continue to Next Combat
  </button>
);

// GeneticPopup component for stat/grade popup
const GeneticPopup: React.FC<{ stat: string; grade: string }> = ({ stat, grade }) => (
  <div
    className="absolute left-1/2 top-2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl font-extrabold text-2xl text-white bg-gradient-to-br from-pink-500 to-yellow-400 shadow-2xl animate-bounce border-4 border-white drop-shadow-lg"
    style={{ pointerEvents: 'none', minWidth: '12rem', textShadow: '0 2px 8px #000' }}
  >
    +{stat.toUpperCase()} {grade}
  </div>
);

const ShopScreen: React.FC = () => {
  const { gold, setGold, playerTeam, setPlayerTeam, geneticPopup, showGeneticPopup } = useGameState();
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [shopItems, setShopItems] = useState<ShopItem[]>(SHOP_ITEMS);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [flashUnitId, setFlashUnitId] = useState<string | null>(null);
  const [healedUnitId, setHealedUnitId] = useState<string | null>(null);

  // On mount (or when shop phase starts), generate a new temp stat boost item
  useEffect(() => {
    const items = [...SHOP_ITEMS];
    // Add a temporary stat boost item to the end of the list
    items.push(getTemporaryStatBoostItem());
    setShopItems(items);
  }, []);

  const handleItemClick = (idx: number) => {
    const item = shopItems[idx];
    if (!item.name || typeof item.price !== 'number') return;
    if (gold < item.price) {
      setErrorMsg('Not enough gold!');
      setSelectedItemIndex(null);
      return;
    }
    setSelectedItemIndex(idx);
    setErrorMsg(null);
  };

  const handleUnitClick = (unitId: string) => {
    if (selectedItemIndex === null) return;
    const item = shopItems[selectedItemIndex];
    if (!item.name || !item.target || item.target !== 'character' || typeof item.price !== 'number') return;
    // Prepare context for effect UI triggers
    const context = {
      ...item.config,
      setFlashUnitId,
      setHealedUnitId,
      showGeneticPopup,
      unitId,
    };
    // Apply effect and update team
    const updatedTeam = playerTeam.map((u) => u.id === unitId ? applyEffect(u, item.effect, context) : u);
    setPlayerTeam(updatedTeam);
    setGold((g: number) => g - item.price);
    setSelectedItemIndex(null);
    setErrorMsg(null);
  };

  return (
    <div className="flex flex-row items-start justify-center w-full h-full p-8 gap-12">
      {/* Left: Player Team */}
      <div className="flex flex-col gap-4 min-w-[32rem]">
        {playerTeam.map((e) => {
          // Show dashed border if a character-targeting item is selected and not yet applied
          const isTempBoost = selectedItemIndex !== null && shopItems[selectedItemIndex]?.effectName === EffectName.TemporaryStatBoost;
          const showDashed = selectedItemIndex !== null && shopItems[selectedItemIndex]?.target === 'character';
          const highlightClass = healedUnitId === e.id
            ? 'border-8 border-green-400'
            : flashUnitId === e.id
              ? 'border-8 border-yellow-400'
              : isTempBoost
                ? 'border-4 border-blue-400 border-dashed'
                : showDashed
                  ? 'border-4 border-blue-400 border-dashed'
                  : '';
          const showGeneticPopup = geneticPopup && geneticPopup.unitId === e.id;
          return (
            <div
              key={e.id}
              onClick={() => handleUnitClick(e.id)}
              className={["cursor-pointer", highlightClass].join(' ')}
              style={{ borderRadius: '0.5rem', marginBottom: '0.5rem', position: 'relative' }}
            >
              <UnitCard entity={e} highlight={flashUnitId === e.id} healed={healedUnitId === e.id} />
              {showGeneticPopup && geneticPopup && (
                <GeneticPopup stat={geneticPopup.stat} grade={geneticPopup.grade} />
              )}
            </div>
          );
        })}
      </div>
      {/* Right: Item Grid */}
      <div className="flex flex-col items-center flex-1">
        <h2 className="text-2xl font-bold mb-4">Shop</h2>
        {errorMsg && <div className="text-red-600 font-bold mb-2">{errorMsg}</div>}
        <div className="grid grid-cols-4 grid-rows-2 gap-6 w-[50rem]">
          {shopItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleItemClick(idx)}
              className={
                [
                  'bg-white',
                  'border-4',
                  selectedItemIndex === idx ? 'border-yellow-400' : 'border-blue-600',
                  'rounded-lg',
                  'shadow-md',
                  'flex',
                  'flex-col',
                  'items-center',
                  'justify-center',
                  'p-4',
                  'min-h-[8rem]',
                  'min-w-[10rem]',
                  'hover:shadow-[0_0_0_4px_#2563eb]',
                  'transition-all',
                  'duration-150',
                  'cursor-pointer',
                ].join(' ')
              }
            >
              {item.name ? (
                <>
                  <div className="text-lg font-extrabold mb-2 text-center tracking-wide border-b-4 border-blue-600 w-full pb-1">
                    {item.name}
                  </div>
                  <div className="text-gray-700 text-sm mb-2 w-full text-left font-medium" style={{ minHeight: '2.5rem' }}>
                    {item.description}
                  </div>
                  <div className="font-bold text-yellow-500 text-lg mt-2">{item.price} Gold</div>
                </>
              ) : (
                <div className="text-gray-300">Empty</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopScreen;