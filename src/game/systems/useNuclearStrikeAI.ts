import { GameEngine } from '../GameEngine';
import { Entity, Vector2, BuildingType, UnitType } from '../types';

export function useNuclearStrikeAI(this: GameEngine, targetPos: Vector2): void {
const ns = this.state.aiSpecialAbilities.NUCLEAR_SILO;
if (!ns.ready) return;

const timestamp = performance.now();

this.state.effects.push({
  id: `nuke-warning-ai-${Date.now()}`,
  type: 'TRACER',
  position: { ...targetPos },
  targetPosition: { ...targetPos },
  startTime: timestamp,
  duration: 3000,
  color: '#fbbf24',
});

setTimeout(() => {
  this.state.effects.push({
    id: `nuke-exp-ai-${Date.now()}`,
    type: 'EXPLOSION',
    position: { ...targetPos },
    startTime: performance.now(),
    duration: 2000,
  });

  const radius = 300;
  this.state.entities.forEach(e => {
    const dist = Math.hypot(e.position.x - targetPos.x, e.position.y - targetPos.y);
    if (dist < radius) {
      const damage = 2000 * (1 - dist / radius);
      e.health -= damage;
    }
  });
}, 3000);

ns.ready = false;
ns.lastUsed = timestamp;
}
