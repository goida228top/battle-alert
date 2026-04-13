
import { UnitType } from '../types';

export function produceUnit(this: any, type: UnitType) {
  let cost = this.getCost(type);

  if (this.state.credits < cost) return;

  const producer = this.state.entities.find((e: any) => e.owner === 'PLAYER' && (
    (['SOLDIER', 'ENGINEER', 'ATTACK_DOG', 'FLAK_TROOPER', 'TESLA_TROOPER', 'CRAZY_IVAN', 'BORIS', 'DESOLATOR', 'TERRORIST', 'YURI', 'GI', 'ROCKETEER', 'NAVY_SEAL', 'CHRONO_LEGIONNAIRE', 'TANYA', 'SNIPER', 'CHRONO_IVAN', 'SPY'].includes(type) && (e.subType === 'BARRACKS' || e.subType === 'ALLIED_BARRACKS')) ||
    (['TANK', 'RHINO_TANK', 'APOCALYPSE_TANK', 'V3_LAUNCHER', 'TERROR_DRONE', 'HARVESTER', 'MCV', 'FLAK_TRACK', 'TESLA_TANK', 'SIEGE_CHOPPER', 'CHRONO_MINER', 'GRIZZLY_TANK', 'IFV', 'MIRAGE_TANK', 'PRISM_TANK', 'ROBOT_TANK', 'BATTLE_FORTRESS', 'DEMOLITION_TRUCK', 'TANK_DESTROYER'].includes(type) && (e.subType === 'WAR_FACTORY' || e.subType === 'ALLIED_WAR_FACTORY')) ||
    (['TYPHOON_SUB', 'SEA_SCORPION', 'GIANT_SQUID', 'DREADNOUGHT', 'HOVER_TRANSPORT', 'DESTROYER', 'AEGIS_CRUISER', 'AIRCRAFT_CARRIER', 'DOLPHIN', 'AMPHIBIOUS_TRANSPORT'].includes(type) && (e.subType === 'NAVAL_YARD' || e.subType === 'ALLIED_NAVAL_YARD')) ||
    (['HARRIER', 'BLACK_EAGLE', 'NIGHT_HAWK_TRANSPORT'].includes(type) && e.subType === 'AIR_FORCE_COMMAND')
  ));

  if (producer) {
    this.produceUnitAt(producer, type, 'PLAYER');
    this.state.credits -= cost;
  }
}
