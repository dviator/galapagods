import type { Unit } from './unit';

export enum AbilityTrigger {
  OnAttack = 'onAttack',
  OnDefend = 'onDefend',
  EndStep = 'endStep',
  InitiativeRoll = 'initiativeRoll',
}

export interface PassiveAbility {
  name: string; // Name of the passive ability
  description: string; // Description for UI
  trigger: AbilityTrigger; // When the passive activates
  effect: (unit: Unit, context?: unknown) => void; // Effect function
  icon?: string; // Optional icon for UI
}