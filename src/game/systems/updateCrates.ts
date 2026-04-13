import { GameEngine } from '../GameEngine';
import { Crate, Vector2 } from '../types';

export function updateCrates(this: GameEngine, dt: number, timestamp: number): void {
  // Spawn a crate every 30 seconds if there are fewer than 5 crates
  if (timestamp % 30000 < 16 && this.state.crates.length < 5) {
    const x = Math.random() * (this.state.map.width * this.state.map.tileSize);
    const y = Math.random() * (this.state.map.height * this.state.map.tileSize);
    
    // Check if position is on land and not on water
    const tileX = Math.floor(x / this.state.map.tileSize);
    const tileY = Math.floor(y / this.state.map.tileSize);
    
    if (tileX >= 0 && tileX < this.state.map.width && tileY >= 0 && tileY < this.state.map.height) {
      const tileType = this.state.map.tiles[tileY][tileX];
      if (tileType === 'GRASS' || tileType === 'ORE') {
        const types: Crate['type'][] = ['MONEY', 'HEAL', 'UNIT', 'ARMOR', 'SPEED'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        this.state.crates.push({
          id: `crate-${timestamp}-${Math.random()}`,
          position: { x, y },
          type
        });
      }
    }
  }

  // Check for units picking up crates
  for (let i = this.state.crates.length - 1; i >= 0; i--) {
    const crate = this.state.crates[i];
    const pickingUnit = this.state.entities.find(e => 
      e.type === 'UNIT' && 
      e.health > 0 &&
      Math.hypot(e.position.x - crate.position.x, e.position.y - crate.position.y) < 30
    );

    if (pickingUnit) {
      // Apply crate effect
      switch (crate.type) {
        case 'MONEY':
          if (pickingUnit.owner === 'PLAYER') {
            this.state.credits += 2000;
          }
          break;
        case 'HEAL':
          pickingUnit.health = pickingUnit.maxHealth;
          // Also heal nearby units
          this.state.entities.forEach(e => {
            if (e.owner === pickingUnit.owner && Math.hypot(e.position.x - pickingUnit.position.x, e.position.y - pickingUnit.position.y) < 150) {
              e.health = e.maxHealth;
            }
          });
          break;
        case 'UNIT':
          // Promote unit to next rank
          if (pickingUnit.rank === 'ROOKIE' || !pickingUnit.rank) {
            pickingUnit.rank = 'VETERAN';
            pickingUnit.maxHealth *= 1.2;
            pickingUnit.health = pickingUnit.maxHealth;
          } else if (pickingUnit.rank === 'VETERAN') {
            pickingUnit.rank = 'ELITE';
            pickingUnit.maxHealth *= 1.5;
            pickingUnit.health = pickingUnit.maxHealth;
          }
          break;
        case 'ARMOR':
          pickingUnit.maxHealth *= 1.5;
          pickingUnit.health = pickingUnit.maxHealth;
          break;
        case 'SPEED':
          if (pickingUnit.speed) {
            pickingUnit.speed *= 1.3;
          }
          break;
      }

      // Visual effect
      this.state.effects.push({
        id: `crate-pickup-${timestamp}-${Math.random()}`,
        type: 'MIND_CONTROL', // Reusing mind control as a "sparkle" effect
        position: { ...crate.position },
        startTime: timestamp,
        duration: 1000,
        color: '#fbbf24' // gold
      });

      // Remove crate
      this.state.crates.splice(i, 1);
    }
  }
}
