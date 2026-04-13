import { GameEngine } from '../GameEngine';
import { Entity, Vector2, BuildingType, UnitType } from '../types';

export function getCost(this: GameEngine, type: string): number {
  let cost = 0;
  switch (type) {
    case 'POWER_PLANT': cost = 600; break;
    case 'BARRACKS': cost = 500; break;
    case 'ORE_REFINERY': cost = 2000; break;
    case 'WAR_FACTORY': cost = 2000; break;
    case 'RADAR': cost = 1000; break;
    case 'SERVICE_DEPOT': cost = 800; break;
    case 'BATTLE_LAB': cost = 2000; break;
    case 'ORE_PURIFIER': cost = 2500; break;
    case 'INDUSTRIAL_PLANT': cost = 2500; break;
    case 'NUCLEAR_REACTOR': cost = 1000; break;
    case 'PSYCHIC_SENSOR': cost = 1000; break;
    case 'CLONING_VATS': cost = 2500; break;
    case 'BATTLE_BUNKER': cost = 500; break;
    
    case 'SENTRY_GUN': cost = 500; break;
    case 'FLAK_CANNON': cost = 1000; break;
    case 'TESLA_COIL': cost = 1500; break;
    case 'IRON_CURTAIN': cost = 2500; break;
    case 'NUCLEAR_SILO': cost = 5000; break;
    case 'NAVAL_YARD': cost = 1000; break;
    case 'SOVIET_WALL': cost = 100; break;

    case 'SOLDIER': cost = 100; break;
    case 'ENGINEER': cost = 500; break;
    case 'ATTACK_DOG': cost = 200; break;
    case 'FLAK_TROOPER': cost = 300; break;
    case 'TESLA_TROOPER': cost = 500; break;
    case 'CRAZY_IVAN': cost = 600; break;
    case 'BORIS': cost = 1500; break;
    case 'DESOLATOR': cost = 600; break;
    case 'TERRORIST': cost = 200; break;
    case 'YURI': cost = 1200; break;
    case 'YURI_PRIME': cost = 2000; break;

    case 'TANK': cost = 700; break;
    case 'RHINO_TANK': cost = 900; break;
    case 'FLAK_TRACK': cost = 500; break;
    case 'V3_LAUNCHER': cost = 800; break;
    case 'TERROR_DRONE': cost = 500; break;
    case 'APOCALYPSE_TANK': cost = 1750; break;
    case 'HARVESTER': cost = 1400; break;
    case 'MCV': cost = 3000; break;
    case 'ALLIED_MCV': cost = 3000; break;
    case 'KIROV_AIRSHIP': cost = 2000; break;
    case 'TESLA_TANK': cost = 1200; break;
    case 'SIEGE_CHOPPER': cost = 1100; break;
    case 'DEMOLITION_TRUCK': cost = 1500; break;

    case 'TYPHOON_SUB': cost = 1000; break;
    case 'SEA_SCORPION': cost = 600; break;
    case 'GIANT_SQUID': cost = 1000; break;
    case 'DREADNOUGHT': cost = 2000; break;
    case 'HOVER_TRANSPORT': cost = 900; break;

    // Allied Buildings
    case 'ALLIED_CONSTRUCTION_YARD': cost = 3000; break;
    case 'ALLIED_POWER_PLANT': cost = 800; break;
    case 'ALLIED_BARRACKS': cost = 500; break;
    case 'ALLIED_ORE_REFINERY': cost = 2000; break;
    case 'ALLIED_WAR_FACTORY': cost = 2000; break;
    case 'AIR_FORCE_COMMAND': cost = 1000; break;
    case 'ALLIED_BATTLE_LAB': cost = 2000; break;
    case 'ALLIED_ORE_PURIFIER': cost = 2500; break;
    case 'ALLIED_NAVAL_YARD': cost = 1000; break;
    case 'ALLIED_WALL': cost = 100; break;
    case 'PILLBOX': cost = 500; break;
    case 'PATRIOT_MISSILE': cost = 1000; break;
    case 'PRISM_TOWER': cost = 1500; break;
    case 'GRAND_CANNON': cost = 2000; break;
    case 'GAP_GENERATOR': cost = 1000; break;
    case 'CHRONOSPHERE': cost = 2500; break;
    case 'WEATHER_DEVICE': cost = 5000; break;
    case 'SPY_SATELLITE': cost = 1500; break;
    case 'ROBOT_CONTROL_CENTER': cost = 600; break;

    // Allied Infantry
    case 'GI': cost = 200; break;
    case 'ROCKETEER': cost = 600; break;
    case 'NAVY_SEAL': cost = 1000; break;
    case 'CHRONO_LEGIONNAIRE': cost = 1500; break;
    case 'TANYA': cost = 1500; break;
    case 'SNIPER': cost = 600; break;
    case 'CHRONO_IVAN': cost = 1000; break;
    case 'CHRONO_COMMANDO': cost = 2000; break;
    case 'PSI_COMMANDO': cost = 1000; break;
    case 'SPY': cost = 1000; break;

    // Allied Vehicles
    case 'CHRONO_MINER': cost = 1400; break;
    case 'GRIZZLY_TANK': cost = 700; break;
    case 'IFV': cost = 600; break;
    case 'MIRAGE_TANK': cost = 1000; break;
    case 'PRISM_TANK': cost = 1200; break;
    case 'ROBOT_TANK': cost = 600; break;
    case 'BATTLE_FORTRESS': cost = 2000; break;
    case 'TANK_DESTROYER': cost = 900; break;

    // Allied Air/Naval
    case 'HARRIER': cost = 1200; break;
    case 'BLACK_EAGLE': cost = 1200; break;
    case 'NIGHT_HAWK_TRANSPORT': cost = 1000; break;
    case 'AMPHIBIOUS_TRANSPORT': cost = 900; break;
    case 'DESTROYER': cost = 1000; break;
    case 'AEGIS_CRUISER': cost = 1200; break;
    case 'AIRCRAFT_CARRIER': cost = 2000; break;
    case 'DOLPHIN': cost = 500; break;

    default: cost = 0; break;
  }

  const isVehicle = ['TANK', 'RHINO_TANK', 'FLAK_TRACK', 'V3_LAUNCHER', 'TERROR_DRONE', 'APOCALYPSE_TANK', 'HARVESTER', 'MCV', 'KIROV_AIRSHIP', 'TESLA_TANK', 'SIEGE_CHOPPER', 'CHRONO_MINER', 'GRIZZLY_TANK', 'IFV', 'MIRAGE_TANK', 'PRISM_TANK', 'ROBOT_TANK', 'BATTLE_FORTRESS'].includes(type);
  const hasIndustrialPlant = this.state.entities.some(e => e.owner === 'PLAYER' && e.subType === 'INDUSTRIAL_PLANT');

  if (isVehicle && hasIndustrialPlant) {
    return Math.floor(cost * 0.75);
  }

  return cost;
}
