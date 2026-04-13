
export function getPrerequisites(this: any, type: string): string[] {
  switch (type) {
    case 'POWER_PLANT': return ['CONSTRUCTION_YARD'];
    case 'BARRACKS': return ['POWER_PLANT'];
    case 'ORE_REFINERY': return ['POWER_PLANT'];
    case 'WAR_FACTORY': return ['ORE_REFINERY', 'BARRACKS'];
    case 'RADAR': return ['ORE_REFINERY'];
    case 'SERVICE_DEPOT': return ['WAR_FACTORY'];
    case 'BATTLE_LAB': return ['WAR_FACTORY', 'RADAR'];
    case 'ORE_PURIFIER': return ['BATTLE_LAB'];
    case 'INDUSTRIAL_PLANT': return ['WAR_FACTORY', 'BATTLE_LAB'];
    case 'NUCLEAR_REACTOR': return ['BATTLE_LAB'];
    case 'PSYCHIC_SENSOR': return ['BATTLE_LAB'];
    case 'CLONING_VATS': return ['BATTLE_LAB'];
    case 'NAVAL_YARD': return ['ORE_REFINERY'];
    case 'SOVIET_WALL': return ['BARRACKS'];
    case 'BATTLE_BUNKER': return ['CONSTRUCTION_YARD'];
    
    case 'SENTRY_GUN': return ['BARRACKS'];
    case 'FLAK_CANNON': return ['BARRACKS'];
    case 'TESLA_COIL': return ['RADAR'];
    case 'IRON_CURTAIN': return ['BATTLE_LAB'];
    case 'NUCLEAR_SILO': return ['BATTLE_LAB'];

    case 'SOLDIER': return ['BARRACKS'];
    case 'ENGINEER': return ['BARRACKS'];
    case 'ATTACK_DOG': return ['BARRACKS'];
    case 'FLAK_TROOPER': return ['BARRACKS', 'RADAR'];
    case 'TESLA_TROOPER': return ['BARRACKS', 'RADAR'];
    case 'CRAZY_IVAN': return ['BARRACKS', 'RADAR'];
    case 'BORIS': return ['BARRACKS', 'BATTLE_LAB'];
    case 'DESOLATOR': return ['BARRACKS', 'BATTLE_LAB'];
    case 'TERRORIST': return ['BARRACKS', 'RADAR'];
    case 'YURI': return ['BARRACKS', 'BATTLE_LAB'];
    case 'YURI_PRIME': return ['BARRACKS', 'BATTLE_LAB'];

    case 'HARVESTER': return ['WAR_FACTORY', 'ORE_REFINERY'];
    case 'RHINO_TANK': return ['WAR_FACTORY'];
    case 'TANK': return ['WAR_FACTORY'];
    case 'FLAK_TRACK': return ['WAR_FACTORY'];
    case 'V3_LAUNCHER': return ['WAR_FACTORY', 'RADAR'];
    case 'TERROR_DRONE': return ['WAR_FACTORY', 'RADAR'];
    case 'APOCALYPSE_TANK': return ['WAR_FACTORY', 'BATTLE_LAB'];
    case 'MCV': return ['WAR_FACTORY', 'SERVICE_DEPOT'];
    case 'ALLIED_MCV': return ['ALLIED_WAR_FACTORY', 'SERVICE_DEPOT'];
    case 'KIROV_AIRSHIP': return ['WAR_FACTORY', 'BATTLE_LAB'];
    case 'TESLA_TANK': return ['WAR_FACTORY', 'BATTLE_LAB'];
    case 'SIEGE_CHOPPER': return ['WAR_FACTORY', 'BATTLE_LAB'];
    case 'DEMOLITION_TRUCK': return ['WAR_FACTORY', 'RADAR']; // Libyan special

    case 'TYPHOON_SUB': return ['NAVAL_YARD'];
    case 'SEA_SCORPION': return ['NAVAL_YARD', 'RADAR'];
    case 'GIANT_SQUID': return ['NAVAL_YARD', 'BATTLE_LAB'];
    case 'DREADNOUGHT': return ['NAVAL_YARD', 'BATTLE_LAB'];
    case 'HOVER_TRANSPORT': return ['NAVAL_YARD'];

    // Allied Buildings
    case 'ALLIED_POWER_PLANT': return ['ALLIED_CONSTRUCTION_YARD'];
    case 'ALLIED_BARRACKS': return ['ALLIED_POWER_PLANT'];
    case 'ALLIED_ORE_REFINERY': return ['ALLIED_POWER_PLANT'];
    case 'ALLIED_WAR_FACTORY': return ['ALLIED_ORE_REFINERY', 'ALLIED_BARRACKS'];
    case 'AIR_FORCE_COMMAND': return ['ALLIED_ORE_REFINERY'];
    case 'ALLIED_BATTLE_LAB': return ['ALLIED_WAR_FACTORY', 'AIR_FORCE_COMMAND'];
    case 'ALLIED_ORE_PURIFIER': return ['ALLIED_BATTLE_LAB'];
    case 'ALLIED_NAVAL_YARD': return ['ALLIED_ORE_REFINERY'];
    case 'ALLIED_WALL': return ['ALLIED_BARRACKS'];
    case 'PILLBOX': return ['ALLIED_BARRACKS'];
    case 'PATRIOT_MISSILE': return ['ALLIED_BARRACKS'];
    case 'PRISM_TOWER': return ['AIR_FORCE_COMMAND'];
    case 'GAP_GENERATOR': return ['ALLIED_BATTLE_LAB'];
    case 'CHRONOSPHERE': return ['ALLIED_BATTLE_LAB'];
    case 'WEATHER_DEVICE': return ['ALLIED_BATTLE_LAB'];
    case 'SPY_SATELLITE': return ['ALLIED_BATTLE_LAB'];
    case 'ROBOT_CONTROL_CENTER': return ['ALLIED_WAR_FACTORY'];
    case 'GRAND_CANNON': return ['ALLIED_BATTLE_LAB']; // French special

    // Allied Infantry
    case 'GI': return ['ALLIED_BARRACKS'];
    case 'ROCKETEER': return ['ALLIED_BARRACKS', 'AIR_FORCE_COMMAND'];
    case 'NAVY_SEAL': return ['ALLIED_BARRACKS', 'ALLIED_BATTLE_LAB'];
    case 'CHRONO_LEGIONNAIRE': return ['ALLIED_BARRACKS', 'ALLIED_BATTLE_LAB'];
    case 'TANYA': return ['ALLIED_BARRACKS', 'ALLIED_BATTLE_LAB'];
    case 'SNIPER': return ['ALLIED_BARRACKS', 'AIR_FORCE_COMMAND']; // British special
    case 'CHRONO_IVAN': return ['ALLIED_BARRACKS', 'ALLIED_BATTLE_LAB'];
    case 'CHRONO_COMMANDO': return ['ALLIED_BARRACKS', 'ALLIED_BATTLE_LAB'];
    case 'PSI_COMMANDO': return ['ALLIED_BARRACKS', 'ALLIED_BATTLE_LAB'];
    case 'SPY': return ['ALLIED_BARRACKS', 'ALLIED_BATTLE_LAB'];

    // Allied Vehicles
    case 'CHRONO_MINER': return ['ALLIED_WAR_FACTORY', 'ALLIED_ORE_REFINERY'];
    case 'GRIZZLY_TANK': return ['ALLIED_WAR_FACTORY'];
    case 'IFV': return ['ALLIED_WAR_FACTORY'];
    case 'MIRAGE_TANK': return ['ALLIED_WAR_FACTORY', 'ALLIED_BATTLE_LAB'];
    case 'PRISM_TANK': return ['ALLIED_WAR_FACTORY', 'ALLIED_BATTLE_LAB'];
    case 'ROBOT_TANK': return ['ALLIED_WAR_FACTORY', 'ROBOT_CONTROL_CENTER'];
    case 'BATTLE_FORTRESS': return ['ALLIED_WAR_FACTORY', 'ALLIED_BATTLE_LAB'];
    case 'TANK_DESTROYER': return ['ALLIED_WAR_FACTORY', 'AIR_FORCE_COMMAND']; // German special

    // Allied Air/Naval
    case 'HARRIER': return ['AIR_FORCE_COMMAND'];
    case 'BLACK_EAGLE': return ['AIR_FORCE_COMMAND']; // Korean special
    case 'NIGHT_HAWK_TRANSPORT': return ['ALLIED_WAR_FACTORY'];
    case 'AMPHIBIOUS_TRANSPORT': return ['ALLIED_NAVAL_YARD'];
    case 'DESTROYER': return ['ALLIED_NAVAL_YARD'];
    case 'AEGIS_CRUISER': return ['ALLIED_NAVAL_YARD', 'AIR_FORCE_COMMAND'];
    case 'AIRCRAFT_CARRIER': return ['ALLIED_NAVAL_YARD', 'ALLIED_BATTLE_LAB'];
    case 'DOLPHIN': return ['ALLIED_NAVAL_YARD', 'ALLIED_BATTLE_LAB'];

    default: return [];
  }
}
