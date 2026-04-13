import { GameEngine } from '../GameEngine';
import { Entity, Vector2, BuildingType, UnitType } from '../types';

export function produceUnitAt(this: GameEngine, producer: Entity, type: UnitType, owner: 'PLAYER' | 'AI'): void {
let health = 100;
let size = 15;
let speed = 1.5;

if (type === 'TANK') { health = 500; size = 25; speed = 2; }
else if (type === 'RHINO_TANK') { health = 700; size = 28; speed = 1.8; }
else if (type === 'APOCALYPSE_TANK') { health = 1200; size = 35; speed = 1.2; }
else if (type === 'V3_LAUNCHER') { health = 400; size = 30; speed = 1.5; }
else if (type === 'TERROR_DRONE') { health = 200; size = 15; speed = 3.5; }
else if (type === 'HARVESTER') { health = 1000; size = 30; speed = 1.2; }
else if (type === 'MCV' || type === 'ALLIED_MCV') { health = 3000; size = 40; speed = 1.5; }
else if (type === 'SOLDIER') { health = 100; size = 12; speed = 1.5; }
else if (type === 'ENGINEER') { health = 100; size = 12; speed = 1.3; }
else if (type === 'ATTACK_DOG') { health = 80; size = 10; speed = 2.5; }
else if (type === 'FLAK_TROOPER') { health = 150; size = 12; speed = 1.4; }
else if (type === 'TESLA_TROOPER') { health = 300; size = 14; speed = 1.2; }
else if (type === 'CRAZY_IVAN') { health = 150; size = 12; speed = 1.6; }
else if (type === 'BORIS') { health = 500; size = 14; speed = 1.7; }
else if (type === 'FLAK_TRACK') { health = 400; size = 25; speed = 2.5; }
else if (type === 'KIROV_AIRSHIP') { health = 2000; size = 50; speed = 0.8; }
else if (type === 'DESOLATOR') { health = 200; size = 14; speed = 1.3; }
else if (type === 'TERRORIST') { health = 100; size = 12; speed = 1.8; }
else if (type === 'TESLA_TANK') { health = 600; size = 25; speed = 2.2; }
else if (type === 'SIEGE_CHOPPER') { health = 500; size = 30; speed = 2.0; }
else if (type === 'TYPHOON_SUB') { health = 600; size = 30; speed = 1.8; }
else if (type === 'SEA_SCORPION') { health = 400; size = 25; speed = 2.5; }
else if (type === 'GIANT_SQUID') { health = 800; size = 20; speed = 2.2; }
else if (type === 'DREADNOUGHT') { health = 1500; size = 50; speed = 1.0; }
else if (type === 'YURI') { health = 150; size = 12; speed = 1.0; }
else if (type === 'YURI_PRIME') { health = 250; size = 12; speed = 1.2; }
else if (type === 'HOVER_TRANSPORT') { health = 500; size = 35; speed = 2.0; }
else if (type === 'DEMOLITION_TRUCK') { health = 400; size = 25; speed = 1.8; }

// Allied Units
else if (type === 'GI') { health = 100; size = 12; speed = 1.5; }
else if (type === 'ROCKETEER') { health = 120; size = 12; speed = 2.5; }
else if (type === 'NAVY_SEAL') { health = 150; size = 12; speed = 1.8; }
else if (type === 'CHRONO_LEGIONNAIRE') { health = 150; size = 12; speed = 1.5; }
else if (type === 'TANYA') { health = 300; size = 14; speed = 2.0; }
else if (type === 'SNIPER') { health = 120; size = 12; speed = 1.4; }
else if (type === 'CHRONO_IVAN') { health = 150; size = 12; speed = 1.6; }
else if (type === 'CHRONO_COMMANDO') { health = 300; size = 14; speed = 2.0; }
else if (type === 'PSI_COMMANDO') { health = 150; size = 12; speed = 1.5; }
else if (type === 'SPY') { health = 100; size = 12; speed = 1.8; }
else if (type === 'CHRONO_MINER') { health = 1000; size = 30; speed = 1.2; }
else if (type === 'GRIZZLY_TANK') { health = 400; size = 25; speed = 2.2; }
else if (type === 'IFV') { health = 300; size = 22; speed = 3.0; }
else if (type === 'MIRAGE_TANK') { health = 400; size = 25; speed = 2.0; }
else if (type === 'PRISM_TANK') { health = 300; size = 28; speed = 1.5; }
else if (type === 'ROBOT_TANK') { health = 300; size = 22; speed = 2.5; }
else if (type === 'BATTLE_FORTRESS') { health = 1200; size = 40; speed = 1.2; }
else if (type === 'TANK_DESTROYER') { health = 500; size = 25; speed = 1.8; }
else if (type === 'HARRIER') { health = 300; size = 25; speed = 4.0; }
else if (type === 'BLACK_EAGLE') { health = 400; size = 25; speed = 4.5; }
else if (type === 'NIGHT_HAWK_TRANSPORT') { health = 400; size = 30; speed = 2.5; }
else if (type === 'AMPHIBIOUS_TRANSPORT') { health = 500; size = 35; speed = 2.0; }
else if (type === 'DESTROYER') { health = 800; size = 40; speed = 1.5; }
else if (type === 'AEGIS_CRUISER') { health = 800; size = 35; speed = 1.8; }
else if (type === 'AIRCRAFT_CARRIER') { health = 1500; size = 50; speed = 1.0; }
else if (type === 'DOLPHIN') { health = 200; size = 15; speed = 3.0; }

const entity: Entity = {
  id: `${type}-${Date.now()}-${Math.random()}`,
  type: 'UNIT',
  subType: type,
  position: { x: producer.position.x, y: producer.position.y + 80 },
  health,
  maxHealth: health,
  owner,
  size,
  speed,
  rotation: 0,
  isAir: type === 'KIROV_AIRSHIP',
};

if (type === 'HARVESTER') {
  entity.harvestState = 'IDLE';
  entity.harvestAmount = 0;
}

this.state.entities.push(entity);

// Handle Rally Point
if (producer.rallyPoint) {
  entity.targetPosition = { ...producer.rallyPoint };
  entity.path = this.calculatePath(entity.position, entity.targetPosition);
}

// Cloning Vats Logic
const isInfantry = ['SOLDIER', 'ENGINEER', 'ATTACK_DOG', 'FLAK_TROOPER', 'TESLA_TROOPER', 'CRAZY_IVAN', 'BORIS', 'DESOLATOR', 'TERRORIST', 'YURI', 'GI', 'ROCKETEER', 'NAVY_SEAL', 'CHRONO_LEGIONNAIRE', 'TANYA', 'SNIPER', 'CHRONO_IVAN'].includes(type);
const hasCloningVats = this.state.entities.some(e => e.owner === owner && e.subType === 'CLONING_VATS');

if (isInfantry && hasCloningVats) {
  const clone: Entity = {
    ...entity,
    id: `${type}-clone-${Date.now()}-${Math.random()}`,
    position: { ...entity.position, x: entity.position.x + 20 },
  };
  if (producer.rallyPoint) {
    clone.targetPosition = { ...producer.rallyPoint };
    clone.path = this.calculatePath(clone.position, clone.targetPosition);
  }
  this.state.entities.push(clone);
}
}
