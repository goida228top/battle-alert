import { GameEngine } from '../GameEngine';
import { Entity, Vector2, BuildingType, UnitType } from '../types';

export function updateEffects(this: GameEngine, timestamp: number): void {
this.state.effects = this.state.effects.filter(e => timestamp - e.startTime < e.duration);
}
