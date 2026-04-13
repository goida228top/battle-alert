
import { Vector2 } from '../types';

export function useSpyPlane(this: any, targetPos: Vector2) {
  const sp = this.state.specialAbilities.SPY_PLANE;
  if (!sp || !sp.ready) return;

  const timestamp = performance.now();
  
  this.state.effects.push({
    id: `spy-plane-${Date.now()}`,
    type: 'EXPLOSION', // Reusing explosion effect for visual feedback
    position: { ...targetPos },
    startTime: timestamp,
    duration: 3000,
  });

  sp.ready = false;
  sp.lastUsed = timestamp;
}
