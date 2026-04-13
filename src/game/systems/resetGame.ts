
import { Faction, Country } from '../types';

export function resetGame(this: any, faction: Faction, country: Country, mapId: string = 'RIVER_DIVIDE') {
  this.playerFaction = faction;
  this.playerCountry = country;
  this.initGame(mapId);
}
