import { GameEngine } from '../GameEngine';
import { Entity, Vector2, BuildingType, UnitType } from '../types';
import { getBuildingDimensions } from './getBuildingDimensions';

export function placeBuilding(this: GameEngine, pos: Vector2): void {
  if (!this.state.placingBuilding) return;

  const type = this.state.placingBuilding;
  const tileSize = this.state.map.tileSize;
  const dims = getBuildingDimensions(type);

  // Calculate top-left tile based on mouse position (aiming for center-ish)
  const tx = Math.floor((pos.x - (dims.w * tileSize) / 2) / tileSize);
  const ty = Math.floor((pos.y - (dims.h * tileSize) / 2) / tileSize);

  // 1. Bounds and Terrain Check for ALL tiles
  for (let dy = 0; dy < dims.h; dy++) {
    for (let dx = 0; dx < dims.w; dx++) {
      const curX = tx + dx;
      const curY = ty + dy;

      if (curX < 0 || curX >= this.state.map.width || curY < 0 || curY >= this.state.map.height) {
        return; // Out of bounds
      }

      const tileType = this.state.map.tiles[curY][curX];
      if (tileType === 'WATER' || tileType === 'WATER_TO_GRASS' || tileType === 'GRASS_TO_WATER') {
        return; // Cannot build on water
      }
    }
  }

  // Calculate snapped center position
  const snappedX = (tx + dims.w / 2) * tileSize;
  const snappedY = (ty + dims.h / 2) * tileSize;
  const snappedPos = { x: snappedX, y: snappedY };

  // 2. Collision Check with other buildings
  const collision = this.state.entities.find(e => {
    if (e.type !== 'BUILDING') return false;
    const eDims = getBuildingDimensions(e.subType as BuildingType);
    
    // Check for overlap between the two rectangles
    const rect1 = {
      left: tx,
      top: ty,
      right: tx + dims.w,
      bottom: ty + dims.h
    };
    
    const eTx = Math.floor((e.position.x - (eDims.w * tileSize) / 2) / tileSize);
    const eTy = Math.floor((e.position.y - (eDims.h * tileSize) / 2) / tileSize);
    
    const rect2 = {
      left: eTx,
      top: eTy,
      right: eTx + eDims.w,
      bottom: eTy + eDims.h
    };

    return !(rect1.right <= rect2.left || 
             rect1.left >= rect2.right || 
             rect1.bottom <= rect2.top || 
             rect1.top >= rect2.bottom);
  });
  
  if (collision) return;

  // 3. Proximity Check (Build range)
  const friendlyBuildings = this.state.entities.filter(e => e.type === 'BUILDING' && e.owner === 'PLAYER');
  if (friendlyBuildings.length > 0) {
    const nearBuilding = friendlyBuildings.find(b => {
      const dist = Math.hypot(b.position.x - snappedPos.x, b.position.y - snappedPos.y);
      return dist < 400; // Increased build range for larger maps
    });
    if (!nearBuilding) return;
  }

  // No cost check here, it was already paid in startProduction

  let health = 2000;
  let size = dims.w * tileSize; // Use visual size based on tiles
  if (type === 'SENTRY_GUN') { health = 800; }
  else if (type === 'FLAK_CANNON') { health = 900; }
  else if (type === 'TESLA_COIL') { health = 1500; }
  else if (type === 'RADAR') { health = 1500; }
  else if (type === 'SERVICE_DEPOT') { health = 1200; }
  else if (type === 'BATTLE_LAB') { health = 3000; }
  else if (type === 'ORE_PURIFIER') { health = 2000; }
  else if (type === 'INDUSTRIAL_PLANT') { health = 2500; }
  else if (type === 'NUCLEAR_REACTOR') { health = 5000; }
  else if (type === 'PSYCHIC_SENSOR') { health = 1000; }
  else if (type === 'CLONING_VATS') { health = 2000; }
  else if (type === 'SPY_SATELLITE') { health = 1500; }
  else if (type === 'IRON_CURTAIN') { health = 5000; }
  else if (type === 'NUCLEAR_SILO') { health = 6000; }
  else if (type === 'NAVAL_YARD') { health = 2000; }
  else if (type === 'SOVIET_WALL') { health = 500; }

  // Allied Buildings
  else if (type === 'ALLIED_CONSTRUCTION_YARD') { health = 2000; }
  else if (type === 'ALLIED_POWER_PLANT') { health = 1000; }
  else if (type === 'ALLIED_BARRACKS') { health = 1000; }
  else if (type === 'ALLIED_ORE_REFINERY') { health = 2000; }
  else if (type === 'ALLIED_WAR_FACTORY') { health = 2000; }
  else if (type === 'AIR_FORCE_COMMAND') { health = 1500; }
  else if (type === 'ALLIED_BATTLE_LAB') { health = 3000; }
  else if (type === 'ALLIED_ORE_PURIFIER') { health = 2000; }
  else if (type === 'ALLIED_NAVAL_YARD') { health = 2000; }
  else if (type === 'ALLIED_WALL') { health = 500; }
  else if (type === 'PILLBOX') { health = 800; }
  else if (type === 'PATRIOT_MISSILE') { health = 900; }
  else if (type === 'PRISM_TOWER') { health = 1500; }
  else if (type === 'GRAND_CANNON') { health = 2000; }
  else if (type === 'GAP_GENERATOR') { health = 1000; }
  else if (type === 'CHRONOSPHERE') { health = 5000; }
  else if (type === 'WEATHER_DEVICE') { health = 6000; }
  else if (type === 'ROBOT_CONTROL_CENTER') { health = 1500; }

  const entity: Entity = {
    id: `${type}-${Date.now()}`,
    type: 'BUILDING',
    subType: type,
    position: snappedPos,
    health,
    maxHealth: health,
    owner: 'PLAYER',
    size,
    constructionStartTime: performance.now(),
  };


this.state.entities.push(entity);
this.state.placingBuilding = null;

// RA2 Mechanic: ORE_REFINERY comes with a HARVESTER
if (type === 'ORE_REFINERY') {
  this.produceUnitAt(entity, 'HARVESTER', 'PLAYER');
} else if (type === 'ALLIED_ORE_REFINERY') {
  this.produceUnitAt(entity, 'CHRONO_MINER', 'PLAYER');
}
}
