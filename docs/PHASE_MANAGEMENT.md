# Phase Management & Transition Pattern

This document describes the centralized phase management system used to control the main game loop (Combat, Shop, Death, Lab, etc.) in this project.

## Overview
- The current phase is stored in the `phase` state (of type `Phase` enum) in `GameStateContext`.
- Transition functions (e.g., `transitionToShop`, `transitionToDeath`, `transitionToLab`, `transitionToCombat`) update the phase in a consistent, centralized way.
- Components (such as `DeathScreen`) receive transition functions as props, allowing them to trigger phase changes without directly mutating state.
- The main app (`App.tsx`) renders the appropriate screen based on the current phase.

## How to Add a New Phase
1. **Add a new value to the `Phase` enum** in `src/types/index.ts`.
2. **Add a transition function** in `GameStateContext` (e.g., `transitionToNewPhase`) that sets the phase.
3. **Update `App.tsx`** to render the new screen/component when the phase matches.
4. **Pass the transition function** as a prop to the relevant component(s) as needed.

## Example
To add a new phase called `Summary`:
1. Add `Summary = 'summary'` to the `Phase` enum.
2. Add `const transitionToSummary = useCallback(() => setPhase(Phase.Summary), []);` in `GameStateContext` and expose it in the context value.
3. In `App.tsx`, add `{phase === Phase.Summary && <SummaryScreen onContinue={...} />}`.
4. Pass `transitionToSummary` to any component that should trigger the transition.

## Why This Pattern?
- **Explicit:** All phase transitions are handled in one place, making the flow easy to follow.
- **Extensible:** Adding new phases or changing transitions is straightforward.
- **Maintainable:** Components do not mutate global state directly; they use provided transition functions.

For more details, see the implementation in `src/contexts/GameStateContext.tsx` and `src/App.tsx`.