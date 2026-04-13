import { GameEngine } from '../GameEngine';
import { Entity, Vector2, BuildingType, UnitType } from '../types';

export function updateResources(this: GameEngine, dt: number): void {
  let p = 0;
  let c = 0;
  let aiP = 0;
  let aiC = 0;

  const timestamp = performance.now();

  this.state.entities.forEach(e => {
    if (e.owner === 'PLAYER') {
      if (e.subType === 'POWER_PLANT') p += 100;
      if (e.subType === 'NUCLEAR_REACTOR') p += 2000;
      if (e.subType === 'ALLIED_POWER_PLANT') p += 150;
      
      if (e.subType === 'CONSTRUCTION_YARD' || e.subType === 'ALLIED_CONSTRUCTION_YARD') c += 10;
      if (e.subType === 'ORE_REFINERY' || e.subType === 'ALLIED_ORE_REFINERY') c += 20;
      if (e.subType === 'BARRACKS' || e.subType === 'ALLIED_BARRACKS') c += 15;
      if (e.subType === 'WAR_FACTORY' || e.subType === 'ALLIED_WAR_FACTORY') c += 25;
      if (e.subType === 'RADAR' || e.subType === 'AIR_FORCE_COMMAND') c += 30;
      if (e.subType === 'SERVICE_DEPOT') c += 20;
      if (e.subType === 'BATTLE_LAB' || e.subType === 'ALLIED_BATTLE_LAB') c += 50;
      if (e.subType === 'ORE_PURIFIER' || e.subType === 'ALLIED_ORE_PURIFIER') c += 40;
      if (e.subType === 'INDUSTRIAL_PLANT') c += 40;
      if (e.subType === 'PSYCHIC_SENSOR') c += 20;
      if (e.subType === 'CLONING_VATS') c += 20;
      if (e.subType === 'SENTRY_GUN' || e.subType === 'PILLBOX') c += 10;
      if (e.subType === 'FLAK_CANNON' || e.subType === 'PATRIOT_MISSILE') c += 15;
      if (e.subType === 'TESLA_COIL' || e.subType === 'PRISM_TOWER') c += 50;
      if (e.subType === 'IRON_CURTAIN' || e.subType === 'CHRONOSPHERE') c += 100;
      if (e.subType === 'NUCLEAR_SILO' || e.subType === 'WEATHER_DEVICE') c += 200;
      if (e.subType === 'GAP_GENERATOR') c += 100;

      // Oil Derrick Passive Income
      if (e.subType === 'OIL_DERRICK') {
        if (Math.floor(timestamp / 2000) !== Math.floor((timestamp - dt) / 2000)) {
          this.state.credits += 20;
        }
      }
    } else if (e.owner === 'AI') {
      if (e.subType === 'POWER_PLANT') aiP += 100;
      if (e.subType === 'NUCLEAR_REACTOR') aiP += 2000;
      if (e.subType === 'ALLIED_POWER_PLANT') aiP += 150;
      
      if (e.subType === 'CONSTRUCTION_YARD' || e.subType === 'ALLIED_CONSTRUCTION_YARD') aiC += 10;
      if (e.subType === 'ORE_REFINERY' || e.subType === 'ALLIED_ORE_REFINERY') aiC += 20;
      if (e.subType === 'BARRACKS' || e.subType === 'ALLIED_BARRACKS') aiC += 15;
      if (e.subType === 'WAR_FACTORY' || e.subType === 'ALLIED_WAR_FACTORY') aiC += 25;
      if (e.subType === 'RADAR' || e.subType === 'AIR_FORCE_COMMAND') aiC += 30;
      if (e.subType === 'SERVICE_DEPOT') aiC += 20;
      if (e.subType === 'BATTLE_LAB' || e.subType === 'ALLIED_BATTLE_LAB') aiC += 50;
      if (e.subType === 'ORE_PURIFIER' || e.subType === 'ALLIED_ORE_PURIFIER') aiC += 40;
      if (e.subType === 'INDUSTRIAL_PLANT') aiC += 40;
      if (e.subType === 'PSYCHIC_SENSOR') aiC += 20;
      if (e.subType === 'CLONING_VATS') aiC += 20;
      if (e.subType === 'SENTRY_GUN' || e.subType === 'PILLBOX') aiC += 10;
      if (e.subType === 'FLAK_CANNON' || e.subType === 'PATRIOT_MISSILE') aiC += 15;
      if (e.subType === 'TESLA_COIL' || e.subType === 'PRISM_TOWER') aiC += 50;
      if (e.subType === 'IRON_CURTAIN' || e.subType === 'CHRONOSPHERE') aiC += 100;
      if (e.subType === 'NUCLEAR_SILO' || e.subType === 'WEATHER_DEVICE') aiC += 200;
      if (e.subType === 'GAP_GENERATOR') aiC += 100;

      // Oil Derrick Passive Income for AI
      if (e.subType === 'OIL_DERRICK') {
        if (Math.floor(timestamp / 2000) !== Math.floor((timestamp - dt) / 2000)) {
          this.state.aiCredits += 20;
        }
      }
    }
  });
  this.state.power = p;
  this.state.powerConsumption = c;
}
