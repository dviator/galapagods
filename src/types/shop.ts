// Shared types for the shop system
import { GenomeStat } from './stats';
import type { Effect } from '../utils/units/effects';
import { EffectName } from '../utils/units/effects';

export type ShopItemTarget = 'character' | 'team' | 'global';

export interface ShopItemConfig {
  price: number;
  amount?: number;
  stat?: GenomeStat;
}

export interface ShopItem {
  name: string;
  description: string;
  price: number;
  target: ShopItemTarget;
  effect: Effect;
  effectName: EffectName;
  config?: ShopItemConfig;
}