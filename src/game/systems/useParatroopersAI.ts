import { GameEngine } from '../GameEngine';
import { Entity, Vector2, BuildingType, UnitType } from '../types';

export function useParatroopersAI(this: GameEngine, targetPos: Vector2): void {
const pt = this.state.aiSpecialAbilities.PARATROOPERS;
if (!pt || !pt.ready) return;

const timestamp = performance.now();

for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    const entity: Entity = {
      id: `SOLDIER-AI-${Date.now()}-${Math.random()}`,
      type: 'UNIT',
      subType: 'SOLDIER',
      position: { x: targetPos.x + (Math.random() - 0.5) * 100, y: targetPos.y + (Math.random() - 0.5) * 100 },
      health: 100,
      maxHealth: 100,
      owner: 'AI',
      size: 10,
      speed: 1.5,
      rotation: 0,
    };
    this.state.entities.push(entity);
  }, i * 500);
}

pt.ready = false;
pt.lastUsed = timestamp;
}
