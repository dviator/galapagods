import type { World, Level, WorldState } from '../types/world';


export class WorldProgressionManager {
  private worlds: World[];
  private state: WorldState;

  constructor(worlds: World[]) {
    this.worlds = worlds;
    this.state = {
      currentWorld: 1,
      currentLevel: 1,
      worldsUnlocked: [1],
      levelProgress: {},
    };
  }

  getCurrentWorld(): World {
    return this.worlds.find(w => w.id === this.state.currentWorld) || this.worlds[0];
  }

  getCurrentLevel(): Level {
    const world = this.getCurrentWorld();
    return world.levels.find(l => l.id === this.state.currentLevel) || world.levels[0];
  }

  completeLevel(): void {
    // Mark current level as complete
    const key = `${this.state.currentWorld}-${this.state.currentLevel}`;
    this.state.levelProgress[key] = true;
    // Advance to next level or world
    const world = this.getCurrentWorld();
    if (this.state.currentLevel < world.levels.length) {
      this.state.currentLevel += 1;
    } else {
      // Advance to next world if available
      if (this.state.currentWorld < this.worlds.length) {
        this.state.currentWorld += 1;
        this.state.currentLevel = 1;
        if (!this.state.worldsUnlocked.includes(this.state.currentWorld)) {
          this.state.worldsUnlocked.push(this.state.currentWorld);
        }
      } else {
        // All worlds complete, stay at last world/level
      }
    }
  }

  advanceWorld(): void {
    // Deprecated: handled in completeLevel
  }

  resetProgression(): void {
    this.state = {
      currentWorld: 1,
      currentLevel: 1,
      worldsUnlocked: [1],
      levelProgress: {},
    };
  }

  isWorldUnlocked(worldId: number): boolean {
    return this.state.worldsUnlocked.includes(worldId);
  }

  getState(): WorldState {
    return this.state;
  }
}

// Singleton for app usage
let _manager: WorldProgressionManager | null = null;
export function getWorldProgressionManager(worlds: World[]): WorldProgressionManager {
  if (!_manager) {
    _manager = new WorldProgressionManager(worlds);
  }
  return _manager;
}