import { BuildingType } from '../types';

export function getBuildingDimensions(type: BuildingType): { w: number, h: number } {
  switch (type) {
    case 'CONSTRUCTION_YARD':
    case 'ALLIED_CONSTRUCTION_YARD':
      return { w: 3, h: 3 };
    case 'POWER_PLANT':
    case 'ALLIED_POWER_PLANT':
      return { w: 2, h: 2 };
    case 'ORE_REFINERY':
    case 'ALLIED_ORE_REFINERY':
      return { w: 3, h: 2 };
    case 'BARRACKS':
    case 'ALLIED_BARRACKS':
      return { w: 2, h: 2 };
    case 'WAR_FACTORY':
    case 'ALLIED_WAR_FACTORY':
      return { w: 3, h: 2 };
    case 'NAVAL_YARD':
    case 'ALLIED_NAVAL_YARD':
      return { w: 3, h: 3 };
    case 'BATTLE_LAB':
    case 'ALLIED_BATTLE_LAB':
      return { w: 3, h: 3 };
    case 'RADAR':
    case 'AIR_FORCE_COMMAND':
      return { w: 2, h: 2 };
    case 'SERVICE_DEPOT':
      return { w: 2, h: 2 };
    case 'ORE_PURIFIER':
    case 'ALLIED_ORE_PURIFIER':
      return { w: 2, h: 2 };
    case 'INDUSTRIAL_PLANT':
      return { w: 3, h: 3 };
    case 'NUCLEAR_REACTOR':
      return { w: 4, h: 4 };
    case 'IRON_CURTAIN':
    case 'CHRONOSPHERE':
      return { w: 3, h: 3 };
    case 'NUCLEAR_SILO':
    case 'WEATHER_DEVICE':
      return { w: 3, h: 3 };
    case 'CLONING_VATS':
      return { w: 2, h: 2 };
    case 'SPY_SATELLITE':
      return { w: 2, h: 2 };
    case 'ROBOT_CONTROL_CENTER':
      return { w: 2, h: 2 };
    case 'SENTRY_GUN':
    case 'PILLBOX':
    case 'PATRIOT_MISSILE':
    case 'FLAK_CANNON':
    case 'GRAND_CANNON':
      return { w: 2, h: 2 };
    case 'PRISM_TOWER':
    case 'TESLA_COIL':
    case 'GAP_GENERATOR':
    case 'PSYCHIC_SENSOR':
      return { w: 1, h: 1 };
    case 'SOVIET_WALL':
    case 'ALLIED_WALL':
      return { w: 1, h: 1 };
    case 'BATTLE_BUNKER':
      return { w: 2, h: 2 };
    case 'OIL_DERRICK':
      return { w: 2, h: 2 };
    default:
      return { w: 2, h: 2 };
  }
}
