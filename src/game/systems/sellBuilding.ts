import { GameEngine } from '../GameEngine';
import { Entity, Vector2, BuildingType, UnitType } from '../types';

export function sellBuilding(this: GameEngine, building: any): void {
const cost = this.getCost(building.subType);
this.state.credits += Math.floor(cost * 0.5);
building.health = 0; // Destroy it
}
