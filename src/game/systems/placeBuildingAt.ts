import { GameEngine } from '../GameEngine';
import { Entity, Vector2, BuildingType, UnitType } from '../types';
import { getBuildingDimensions } from './getBuildingDimensions';

export function placeBuildingAt(this: GameEngine, pos: Vector2, type: BuildingType, owner: 'PLAYER' | 'AI'): void {
  const tileSize = this.state.map.tileSize;
  const dims = getBuildingDimensions(type);

  // Calculate top-left tile based on provided position
  const tx = Math.floor((pos.x - (dims.w * tileSize) / 2) / tileSize);
  const ty = Math.floor((pos.y - (dims.h * tileSize) / 2) / tileSize);

  // Calculate snapped center position
  const snappedX = (tx + dims.w / 2) * tileSize;
  const snappedY = (ty + dims.h / 2) * tileSize;
  const snappedPos = { x: snappedX, y: snappedY };

  let health = 2000;
  let size = dims.w * tileSize;
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

  this.state.entities.push({
    id: `${type}-${Date.now()}-${Math.random()}`,
    type: 'BUILDING',
    subType: type,
    position: snappedPos,
    health,
    maxHealth: health,
    owner,
    size,
  });
}

