export * from './stats';
export * from './combat';
export * from './unit';
export * from './character';

export enum Phase {
  Combat = 'combat',
  Shop = 'shop',
  Death = 'death',
  Lab = 'lab',
}

export type PhaseType = Phase;