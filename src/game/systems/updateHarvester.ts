import { GameEngine } from '../GameEngine';
import { Entity, Vector2, BuildingType, UnitType } from '../types';

export function updateHarvester(this: GameEngine, harvester: Entity): void {
if (harvester.harvestState === 'IDLE' || !harvester.harvestState) {
  if ((harvester.harvestAmount || 0) >= 500) {
    harvester.harvestState = 'RETURNING';
  } else {
    harvester.harvestState = 'MOVING_TO_ORE';
  }
}

if (harvester.harvestState === 'MOVING_TO_ORE') {
  // Find nearest ORE tile
  let nearestOre: Vector2 | null = null;
  let minDist = Infinity;
  
  for (let y = 0; y < this.state.map.height; y++) {
    for (let x = 0; x < this.state.map.width; x++) {
      if (this.state.map.tiles[y][x] === 'ORE') {
        const worldX = x * this.state.map.tileSize + 20;
        const worldY = y * this.state.map.tileSize + 20;
        const d = Math.sqrt(Math.pow(harvester.position.x - worldX, 2) + Math.pow(harvester.position.y - worldY, 2));
        if (d < minDist) {
          minDist = d;
          nearestOre = { x: worldX, y: worldY };
        }
      }
    }
  }

  if (nearestOre) {
    harvester.path = this.calculatePath(harvester.position, nearestOre);
    harvester.targetPosition = harvester.path[0];
    if (minDist < 40) {
      harvester.harvestState = 'MINING';
      harvester.targetPosition = undefined;
      harvester.path = undefined;
    }
  } else {
    harvester.harvestState = 'IDLE';
  }
}

if (harvester.harvestState === 'MINING') {
  harvester.harvestAmount = (harvester.harvestAmount || 0) + 1;
  if (harvester.harvestAmount >= 500) {
    harvester.harvestState = 'RETURNING';
  }
}

if (harvester.harvestState === 'RETURNING') {
  const refineries = this.state.entities.filter(e => (e.subType === 'ORE_REFINERY' || e.subType === 'ALLIED_ORE_REFINERY') && e.owner === harvester.owner && e.health > 0);
  let nearestRefinery: Entity | null = null;
  let minDist = Infinity;
  
  refineries.forEach(r => {
    const d = Math.hypot(r.position.x - harvester.position.x, r.position.y - harvester.position.y);
    if (d < minDist) {
      minDist = d;
      nearestRefinery = r;
    }
  });

  if (nearestRefinery) {
    if (harvester.subType === 'CHRONO_MINER') {
      // Teleport to refinery
      this.state.effects.push({
        id: `chrono-out-${Date.now()}-${Math.random()}`,
        type: 'MIND_CONTROL', // Reuse visual effect
        position: { ...harvester.position },
        startTime: performance.now(),
        duration: 500,
        color: '#a855f7',
      });
      harvester.position = { x: nearestRefinery.position.x, y: nearestRefinery.position.y + 40 };
      this.state.effects.push({
        id: `chrono-in-${Date.now()}-${Math.random()}`,
        type: 'MIND_CONTROL',
        position: { ...harvester.position },
        startTime: performance.now(),
        duration: 500,
        color: '#a855f7',
      });
      
      harvester.harvestState = 'WAITING_IN_QUEUE';
      harvester.targetId = nearestRefinery.id;
      harvester.targetPosition = undefined;
      harvester.path = undefined;
    } else {
      harvester.path = this.calculatePath(harvester.position, nearestRefinery.position);
      harvester.targetPosition = harvester.path[0];
      const dist = Math.sqrt(Math.pow(harvester.position.x - nearestRefinery.position.x, 2) + Math.pow(harvester.position.y - nearestRefinery.position.y, 2));
      if (dist < 60) {
        harvester.harvestState = 'WAITING_IN_QUEUE';
        harvester.targetId = nearestRefinery.id;
        harvester.targetPosition = undefined;
        harvester.path = undefined;
      }
    }
  } else {
    harvester.harvestState = 'IDLE';
    harvester.targetPosition = undefined;
    harvester.path = undefined;
  }
}

if (harvester.harvestState === 'WAITING_IN_QUEUE') {
  const refinery = this.state.entities.find(e => e.id === harvester.targetId);
  if (!refinery || refinery.health <= 0) {
    harvester.harvestState = 'RETURNING'; // Find another refinery
    harvester.targetId = undefined;
  } else {
    if (!refinery.occupiedBy || refinery.occupiedBy === harvester.id) {
      refinery.occupiedBy = harvester.id;
      harvester.harvestState = 'UNLOADING';
      harvester.unloadStartTime = performance.now();
      // Move exactly into the refinery
      harvester.position = { x: refinery.position.x, y: refinery.position.y + 20 };
    }
  }
}

if (harvester.harvestState === 'UNLOADING') {
  const refinery = this.state.entities.find(e => e.id === harvester.targetId);
  if (!refinery || refinery.health <= 0) {
    harvester.harvestState = 'RETURNING';
    harvester.targetId = undefined;
  } else {
    // Unload takes 2 seconds
    if (performance.now() - (harvester.unloadStartTime || 0) > 2000) {
      let income = harvester.harvestAmount || 0;
      if (this.state.entities.some(e => (e.subType === 'ORE_PURIFIER' || e.subType === 'ALLIED_ORE_PURIFIER') && e.owner === harvester.owner && e.health > 0)) {
        income = Math.floor(income * 1.25); // 25% bonus
      }
      if (harvester.owner === 'PLAYER') {
        this.state.credits += income;
        this.state.effects.push({
          id: `money-${Date.now()}-${Math.random()}`,
          type: 'MONEY_FLOAT',
          position: { x: refinery.position.x, y: refinery.position.y - 20 },
          startTime: performance.now(),
          duration: 1500,
          text: `+$${income}`
        });
      } else if (harvester.owner === 'AI') {
        this.state.aiCredits += income;
      }
      harvester.harvestAmount = 0;
      harvester.harvestState = 'MOVING_TO_ORE';
      harvester.targetId = undefined;
      refinery.occupiedBy = null;
    }
  }
}
}
