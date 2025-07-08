// Shared types for the shop system
import { StatEnum } from './stats';
import type { Effect } from '../utils/units/effects';
import { EffectName } from '../utils/units/effects';

export type ShopItemTarget = 'character' | 'team' | 'global';

export interface ShopItemConfig {
  amount?: number;
  stat?: StatEnum;
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