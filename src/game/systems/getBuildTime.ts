import { GameEngine } from '../GameEngine';
import { Entity, Vector2, BuildingType, UnitType } from '../types';

export function getBuildTime(this: GameEngine, type: string): number {
switch (type) {
  case 'POWER_PLANT': return 5000;
  case 'BARRACKS': return 8000;
  case 'ORE_REFINERY': return 12000;
  case 'WAR_FACTORY': return 15000;
  case 'NAVAL_YARD': return 10000;
  case 'RADAR': return 12000;
  case 'SERVICE_DEPOT': return 10000;
  case 'BATTLE_LAB': return 20000;
  case 'ORE_PURIFIER': return 25000;
  case 'INDUSTRIAL_PLANT': return 20000;
  case 'NUCLEAR_REACTOR': return 15000;
  case 'PSYCHIC_SENSOR': return 10000;
  case 'CLONING_VATS': return 20000;
  case 'SOVIET_WALL': return 1000;
  case 'BATTLE_BUNKER': return 5000;

  case 'SENTRY_GUN': return 6000;
  case 'FLAK_CANNON': return 10000;
  case 'TESLA_COIL': return 10000;
  case 'IRON_CURTAIN': return 30000;
  case 'NUCLEAR_SILO': return 45000;

  case 'SOLDIER': return 3000;
  case 'ENGINEER': return 8000;
  case 'ATTACK_DOG': return 4000;
  case 'FLAK_TROOPER': return 6000;
  case 'TESLA_TROOPER': return 6000;
  case 'CRAZY_IVAN': return 8000;
  case 'BORIS': return 15000;
  case 'DESOLATOR': return 8000;
  case 'TERRORIST': return 4000;
  case 'YURI': return 15000;
  case 'YURI_PRIME': return 20000;

  case 'TANK': return 10000;
  case 'RHINO_TANK': return 15000;
  case 'FLAK_TRACK': return 8000;
  case 'V3_LAUNCHER': return 18000;
  case 'TERROR_DRONE': return 10000;
  case 'APOCALYPSE_TANK': return 15000;
  case 'HARVESTER': return 12000;
  case 'MCV': return 30000;
  case 'ALLIED_MCV': return 30000;
  case 'KIROV_AIRSHIP': return 25000;
  case 'TESLA_TANK': return 15000;
  case 'SIEGE_CHOPPER': return 15000;
  case 'DEMOLITION_TRUCK': return 15000;

  case 'TYPHOON_SUB': return 12000;
  case 'SEA_SCORPION': return 10000;
  case 'GIANT_SQUID': return 15000;
  case 'DREADNOUGHT': return 25000;
  case 'HOVER_TRANSPORT': return 12000;

  // Allied Buildings
  case 'ALLIED_CONSTRUCTION_YARD': return 30000;
  case 'ALLIED_POWER_PLANT': return 5000;
  case 'ALLIED_BARRACKS': return 8000;
  case 'ALLIED_ORE_REFINERY': return 12000;
  case 'ALLIED_WAR_FACTORY': return 15000;
  case 'AIR_FORCE_COMMAND': return 12000;
  case 'ALLIED_BATTLE_LAB': return 20000;
  case 'ALLIED_ORE_PURIFIER': return 25000;
  case 'ALLIED_NAVAL_YARD': return 10000;
  case 'ALLIED_WALL': return 1000;
  case 'PILLBOX': return 6000;
  case 'PATRIOT_MISSILE': return 10000;
  case 'PRISM_TOWER': return 10000;
  case 'GRAND_CANNON': return 15000;
  case 'GAP_GENERATOR': return 10000;
  case 'CHRONOSPHERE': return 30000;
  case 'WEATHER_DEVICE': return 45000;

  // Allied Infantry
  case 'GI': return 3000;
  case 'ROCKETEER': return 6000;
  case 'NAVY_SEAL': return 10000;
  case 'CHRONO_LEGIONNAIRE': return 15000;
  case 'TANYA': return 15000;
  case 'SNIPER': return 6000;
  case 'CHRONO_IVAN': return 10000;
  case 'CHRONO_COMMANDO': return 20000;
  case 'PSI_COMMANDO': return 10000;
  case 'SPY': return 10000;

  // Allied Vehicles
  case 'CHRONO_MINER': return 12000;
  case 'GRIZZLY_TANK': return 10000;
  case 'IFV': return 8000;
  case 'MIRAGE_TANK': return 12000;
  case 'PRISM_TANK': return 15000;
  case 'ROBOT_TANK': return 8000;
  case 'BATTLE_FORTRESS': return 20000;
  case 'TANK_DESTROYER': return 10000;

  // Allied Air/Naval
  case 'HARRIER': return 12000;
  case 'BLACK_EAGLE': return 12000;
  case 'NIGHT_HAWK_TRANSPORT': return 10000;
  case 'AMPHIBIOUS_TRANSPORT': return 10000;
  case 'DESTROYER': return 10000;
  case 'AEGIS_CRUISER': return 12000;
  case 'AIRCRAFT_CARRIER': return 20000;
  case 'DOLPHIN': return 6000;

  default: return 5000;
}
}
