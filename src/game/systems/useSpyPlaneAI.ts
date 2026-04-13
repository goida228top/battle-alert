import { GameEngine } from '../GameEngine';
import { Entity, Vector2, BuildingType, UnitType } from '../types';

export function useSpyPlaneAI(this: GameEngine, targetPos: Vector2): void {
const sp = this.state.aiSpecialAbilities.SPY_PLANE;
if (!sp || !sp.ready) return;

const timestamp = performance.now();

this.state.effects.push({
  id: `spy-plane-ai-${Date.now()}`,
  type: 'EXPLOSION',
  position: { ...targetPos },
  startTime: timestamp,
  duration: 3000,
});

sp.ready = false;
sp.lastUsed = timestamp;
}
