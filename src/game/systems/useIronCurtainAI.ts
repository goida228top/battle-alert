import { GameEngine } from '../GameEngine';
import { Entity, Vector2, BuildingType, UnitType } from '../types';

export function useIronCurtainAI(this: GameEngine, targetPos: Vector2): void {
const ic = this.state.aiSpecialAbilities.IRON_CURTAIN;
if (!ic.ready) return;

const radius = 150;
const timestamp = performance.now();
this.state.entities.forEach(e => {
  if (e.owner === 'AI' && e.type === 'UNIT' && Math.hypot(e.position.x - targetPos.x, e.position.y - targetPos.y) < radius) {
    e.invulnerableUntil = timestamp + 15000;
  }
});

this.state.effects.push({
  id: `ic-ai-${Date.now()}`,
  type: 'TRACER',
  position: { ...targetPos },
  targetPosition: { ...targetPos },
  startTime: timestamp,
  duration: 1000,
  color: '#ef4444',
});

ic.ready = false;
ic.lastUsed = timestamp;
}
