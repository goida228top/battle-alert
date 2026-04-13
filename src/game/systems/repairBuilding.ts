import { GameEngine } from '../GameEngine';
import { Entity, Vector2, BuildingType, UnitType } from '../types';

export function repairBuilding(this: GameEngine, building: any): boolean {
if (building.health < building.maxHealth && this.state.credits > 0) {
  const repairAmount = 200;
  const repairCost = 50;
  if (this.state.credits >= repairCost) {
    building.health = Math.min(building.maxHealth, building.health + repairAmount);
    this.state.credits -= repairCost;
    return true;
  }
}
return false;
}
