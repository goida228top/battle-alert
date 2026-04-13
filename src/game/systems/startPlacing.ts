
import { BuildingType } from '../types';

export function startPlacing(this: any, type: BuildingType) {
  this.state.placingBuilding = type;
}
