
export type EntityType = 'UNIT' | 'BUILDING';
export type Faction = 'FEDERATION' | 'COALITION';
export type Country = 'RUSSIA' | 'CUBA' | 'LIBYA' | 'IRAQ' | 'AMERICA' | 'BRITAIN' | 'FRANCE' | 'GERMANY' | 'KOREA';
export type UnitType = 'TANK' | 'SOLDIER' | 'HARVESTER' | 'MCV' | 'ALLIED_MCV' | 'APOCALYPSE_TANK' | 'TESLA_TROOPER' | 'ENGINEER' | 'ATTACK_DOG' | 'FLAK_TROOPER' | 'V3_LAUNCHER' | 'TERROR_DRONE' | 'RHINO_TANK' | 'FLAK_TRACK' | 'BORIS' | 'CRAZY_IVAN' | 'KIROV_AIRSHIP' | 'TYPHOON_SUB' | 'ATTACK_SUB' | 'SEA_SCORPION' | 'GIANT_SQUID' | 'DREADNOUGHT' | 'DESOLATOR' | 'TESLA_TANK' | 'TERRORIST' | 'SIEGE_CHOPPER' | 'YURI' | 'YURI_PRIME' | 'HOVER_TRANSPORT' | 'DEMOLITION_TRUCK' | 'GI' | 'ROCKETEER' | 'NAVY_SEAL' | 'CHRONO_LEGIONNAIRE' | 'TANYA' | 'SNIPER' | 'CHRONO_IVAN' | 'CHRONO_COMMANDO' | 'PSI_COMMANDO' | 'SPY' | 'GRIZZLY_TANK' | 'IFV' | 'MIRAGE_TANK' | 'PRISM_TANK' | 'ROBOT_TANK' | 'BATTLE_FORTRESS' | 'CHRONO_MINER' | 'TANK_DESTROYER' | 'AMPHIBIOUS_TRANSPORT' | 'DESTROYER' | 'AEGIS_CRUISER' | 'AIRCRAFT_CARRIER' | 'DOLPHIN' | 'HARRIER' | 'BLACK_EAGLE' | 'NIGHT_HAWK_TRANSPORT';
export type BuildingType = 'CONSTRUCTION_YARD' | 'POWER_PLANT' | 'BARRACKS' | 'ORE_REFINERY' | 'WAR_FACTORY' | 'SENTRY_GUN' | 'BATTLE_LAB' | 'TESLA_COIL' | 'RADAR' | 'SERVICE_DEPOT' | 'ORE_PURIFIER' | 'FLAK_CANNON' | 'INDUSTRIAL_PLANT' | 'NUCLEAR_REACTOR' | 'PSYCHIC_SENSOR' | 'CLONING_VATS' | 'IRON_CURTAIN' | 'NUCLEAR_SILO' | 'NAVAL_YARD' | 'SOVIET_WALL' | 'BATTLE_BUNKER' | 'ALLIED_CONSTRUCTION_YARD' | 'ALLIED_POWER_PLANT' | 'ALLIED_ORE_REFINERY' | 'ALLIED_BARRACKS' | 'ALLIED_WAR_FACTORY' | 'ALLIED_NAVAL_YARD' | 'AIR_FORCE_COMMAND' | 'ALLIED_BATTLE_LAB' | 'ALLIED_ORE_PURIFIER' | 'PATRIOT_MISSILE' | 'PILLBOX' | 'PRISM_TOWER' | 'GRAND_CANNON' | 'GAP_GENERATOR' | 'CHRONOSPHERE' | 'WEATHER_DEVICE' | 'ALLIED_WALL' | 'OIL_DERRICK' | 'SPY_SATELLITE' | 'ROBOT_CONTROL_CENTER';

export interface Vector2 {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  type: EntityType;
  subType: UnitType | BuildingType;
  position: Vector2;
  targetPosition?: Vector2;
  health: number;
  maxHealth: number;
  owner: 'PLAYER' | 'AI' | 'NEUTRAL';
  selected?: boolean;
  size: number; // radius or square size
  speed?: number;
  rotation?: number; // in radians
  targetId?: string;
  harvestState?: 'IDLE' | 'MOVING_TO_ORE' | 'MINING' | 'RETURNING' | 'WAITING_IN_QUEUE' | 'UNLOADING';
  harvestAmount?: number;
  unloadStartTime?: number;
  occupiedBy?: string | null;
  lastAttackTime?: number;
  constructionStartTime?: number;
  isAttackMoving?: boolean;
  attackMoveTarget?: Vector2;
  path?: Vector2[];
  isAir?: boolean;
  invulnerableUntil?: number;
  mindControlledBy?: string;
  kills?: number;
  rank?: 'ROOKIE' | 'VETERAN' | 'ELITE';
  isDisguised?: boolean;
  selectionResponse?: string;
  selectionResponseTime?: number;
  isDeployed?: boolean;
  rallyPoint?: Vector2;
}

export interface Crate {
  id: string;
  position: Vector2;
  type: 'MONEY' | 'HEAL' | 'UNIT' | 'ARMOR' | 'SPEED';
}

export type TileType = 'GRASS' | 'WATER' | 'GRASS_TO_WATER' | 'WATER_TO_GRASS' | 'ORE';
export type MapTheme = 'TEMPERATE' | 'SNOW' | 'DESERT';

export interface MapTile {
  type: TileType;
}

export interface Bridge {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ProductionItem {
  id: string;
  subType: UnitType | BuildingType;
  progress: number; // 0 to 100
  cost: number;
  time: number; // total time in ms
  startTime: number;
  owner?: 'PLAYER' | 'AI';
}

export interface CombatEffect {
  id: string;
  type: 'MUZZLE_FLASH' | 'TRACER' | 'EXPLOSION' | 'MIND_CONTROL' | 'RADIATION' | 'SUPERWEAPON_STRIKE' | 'MONEY_FLOAT';
  position: Vector2;
  targetPosition?: Vector2;
  startTime: number;
  duration: number;
  color?: string;
  text?: string;
}

export interface MoveMarker {
  position: Vector2;
  startTime: number;
}

export interface Projectile {
  id: string;
  type: 'BULLET' | 'CANNONBALL' | 'MISSILE' | 'LASER' | 'TESLA_ZAP';
  position: Vector2;
  targetId?: string;
  targetPosition?: Vector2;
  speed: number;
  damage: number;
  owner: 'PLAYER' | 'AI' | 'NEUTRAL';
  sourceId: string;
}

export interface GameState {
  entities: Entity[];
  projectiles: Projectile[];
  effects: CombatEffect[];
  moveMarkers: MoveMarker[];
  crates: Crate[];
  credits: number;
  aiCredits: number;
  power: number;
  powerConsumption: number;
  selectionBox: { start: Vector2; end: Vector2 } | null;
  placingBuilding: BuildingType | null;
  sidebarTab: 'BUILDINGS' | 'INFANTRY' | 'VEHICLES' | 'DEFENSE';
  interactionMode: 'DEFAULT' | 'SELL' | 'REPAIR' | 'ATTACK_MOVE' | 'USE_IRON_CURTAIN' | 'USE_NUCLEAR_STRIKE' | 'USE_SPY_PLANE' | 'USE_PARATROOPERS' | 'USE_CHRONOSPHERE' | 'USE_WEATHER_STORM';
  productionQueue: ProductionItem[];
  aiProductionQueue: ProductionItem[];
  camera: {
    x: number;
    y: number;
    zoom: number;
  };
  map: {
    tiles: TileType[][];
    tileSize: number;
    width: number;
    height: number;
    bridges: Bridge[];
    visibility: number[][]; // 0: hidden, 1: explored, 2: visible
    theme: MapTheme;
  };
  gameOver?: 'WIN' | 'LOSS';
  specialAbilities: {
    IRON_CURTAIN: { ready: boolean; lastUsed: number; cooldown: number };
    NUCLEAR_SILO: { ready: boolean; lastUsed: number; cooldown: number };
    SPY_PLANE: { ready: boolean; lastUsed: number; cooldown: number };
    PARATROOPERS: { ready: boolean; lastUsed: number; cooldown: number };
    CHRONOSPHERE: { ready: boolean; lastUsed: number; cooldown: number };
    WEATHER_DEVICE: { ready: boolean; lastUsed: number; cooldown: number };
  };
  aiSpecialAbilities: {
    IRON_CURTAIN: { ready: boolean; lastUsed: number; cooldown: number };
    NUCLEAR_SILO: { ready: boolean; lastUsed: number; cooldown: number };
    SPY_PLANE: { ready: boolean; lastUsed: number; cooldown: number };
    PARATROOPERS: { ready: boolean; lastUsed: number; cooldown: number };
    CHRONOSPHERE: { ready: boolean; lastUsed: number; cooldown: number };
    WEATHER_DEVICE: { ready: boolean; lastUsed: number; cooldown: number };
  };
}
