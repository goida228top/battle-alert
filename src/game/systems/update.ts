
import { Entity } from '../types';

export function update(this: any, timestamp: number) {
  const dt = (timestamp - this.lastUpdate) / 16.67; // normalize to ~60fps
  this.lastUpdate = timestamp;

  if (dt > 5) return; // Prevent huge jumps

  this.updateProduction(timestamp, dt);

  this.state.entities.forEach((entity: Entity) => {
    // Movement
    if (entity.type === 'UNIT' && entity.targetPosition && entity.speed && !entity.isDeployed) {
      const dx = entity.targetPosition.x - entity.position.x;
      const dy = entity.targetPosition.y - entity.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > entity.speed * dt) {
        entity.position.x += (dx / distance) * entity.speed * dt;
        entity.position.y += (dy / distance) * entity.speed * dt;
        entity.rotation = Math.atan2(dy, dx);
      } else {
        entity.position.x = entity.targetPosition.x;
        entity.position.y = entity.targetPosition.y;
        
        if (entity.path && entity.path.length > 1) {
          entity.path.shift();
          entity.targetPosition = entity.path[0];
        } else {
          entity.targetPosition = undefined;
          entity.path = undefined;
        }
      }
    }

    // Harvester Logic
    if (entity.subType === 'HARVESTER') {
      this.updateHarvester(entity);
    }

    // Combat
    const nonCombatTypes = ['CONSTRUCTION_YARD', 'ALLIED_CONSTRUCTION_YARD', 'POWER_PLANT', 'ALLIED_POWER_PLANT', 'NUCLEAR_REACTOR', 'ORE_REFINERY', 'ALLIED_ORE_REFINERY', 'BARRACKS', 'ALLIED_BARRACKS', 'WAR_FACTORY', 'ALLIED_WAR_FACTORY', 'RADAR', 'AIR_FORCE_COMMAND', 'SERVICE_DEPOT', 'BATTLE_LAB', 'ALLIED_BATTLE_LAB', 'ORE_PURIFIER', 'ALLIED_ORE_PURIFIER', 'INDUSTRIAL_PLANT', 'PSYCHIC_SENSOR', 'CLONING_VATS', 'NAVAL_YARD', 'ALLIED_NAVAL_YARD', 'SOVIET_WALL', 'ALLIED_WALL', 'IRON_CURTAIN', 'NUCLEAR_SILO', 'CHRONOSPHERE', 'WEATHER_DEVICE', 'GAP_GENERATOR', 'MCV', 'ALLIED_MCV', 'HARVESTER', 'CHRONO_MINER', 'OIL_DERRICK'];
    if (!nonCombatTypes.includes(entity.subType || '')) {
      this.updateCombat(entity, dt, timestamp);
    }
  });

  // Remove dead
  const deadEntities = this.state.entities.filter((e: Entity) => e.health <= 0);
  deadEntities.forEach((dead: Entity) => {
    if (dead.subType === 'HARVESTER' || dead.subType === 'CHRONO_MINER') {
      // Free up any refinery it was occupying
      const refinery = this.state.entities.find((e: Entity) => e.occupiedBy === dead.id);
      if (refinery) {
        refinery.occupiedBy = null;
      }
    }
  });
  
  this.state.entities = this.state.entities.filter((e: Entity) => e.health > 0);

  this.updateAI(timestamp);
  this.updateCrates(dt, timestamp);
  this.updateResources(dt);
  this.updateVisibility();
  this.updateProjectiles(dt, timestamp);
  this.updateEffects(timestamp);
  this.updateSpecialAbilities(timestamp);
  this.state.moveMarkers = this.state.moveMarkers.filter((m: any) => timestamp - m.startTime < 500);
  this.checkWinLoss();
}
