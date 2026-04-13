import { GameEngine } from '../GameEngine';
import { Entity, Vector2, BuildingType, UnitType } from '../types';

export function updateVisibility(this: GameEngine, ): void {
// Reset visible to explored
for (let y = 0; y < this.state.map.height; y++) {
  for (let x = 0; x < this.state.map.width; x++) {
    if (this.state.map.visibility[y][x] === 2) {
      this.state.map.visibility[y][x] = 1;
    }
  }
}

// Set visible based on player entities
this.state.entities.forEach(entity => {
  if (entity.owner === 'PLAYER') {
    const tx = Math.floor(entity.position.x / this.state.map.tileSize);
    const ty = Math.floor(entity.position.y / this.state.map.tileSize);
    let radius = entity.type === 'BUILDING' ? 6 : 4;
    if (entity.subType === 'PSYCHIC_SENSOR') radius = 15;
    if (entity.subType === 'RADAR' || entity.subType === 'AIR_FORCE_COMMAND') radius = 10;
    if (entity.subType === 'GAP_GENERATOR') radius = 10; // Gap generator hides things, but for the player it provides vision

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = tx + dx;
        const ny = ty + dy;
        if (nx >= 0 && nx < this.state.map.width && ny >= 0 && ny < this.state.map.height) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= radius) {
            this.state.map.visibility[ny][nx] = 2;
          }
        }
      }
    }
  }
});

// Apply Gap Generator logic for enemy (hides player vision)
this.state.entities.forEach(entity => {
  if (entity.owner !== 'PLAYER' && entity.subType === 'GAP_GENERATOR') {
    const tx = Math.floor(entity.position.x / this.state.map.tileSize);
    const ty = Math.floor(entity.position.y / this.state.map.tileSize);
    const radius = 10;

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = tx + dx;
        const ny = ty + dy;
        if (nx >= 0 && nx < this.state.map.width && ny >= 0 && ny < this.state.map.height) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= radius) {
            this.state.map.visibility[ny][nx] = 0; // Force hidden
          }
        }
      }
    }
  }
});
}
