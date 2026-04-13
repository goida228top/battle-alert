
import { Vector2 } from '../types';

export function useNuclearStrike(this: any, targetPos: Vector2) {
  const ns = this.state.specialAbilities.NUCLEAR_SILO;
  if (!ns.ready) return;

  const timestamp = performance.now();
  
  // Visual warning
  this.state.effects.push({
    id: `nuke-warning-${Date.now()}`,
    type: 'SUPERWEAPON_STRIKE',
    position: { ...targetPos },
    targetPosition: { ...targetPos },
    startTime: timestamp,
    duration: 3000,
    color: '#fbbf24',
  });

  // Execute strike after delay
  setTimeout(() => {
    this.state.effects.push({
      id: `nuke-explosion-${Date.now()}`,
      type: 'EXPLOSION',
      position: { ...targetPos },
      startTime: performance.now(),
      duration: 2000,
    });

    // Damage in radius
    const radius = 250;
    this.state.entities.forEach((e: any) => {
      const dist = Math.hypot(e.position.x - targetPos.x, e.position.y - targetPos.y);
      if (dist < radius) {
        e.health -= 2000;
      }
    });
  }, 3000);

  ns.ready = false;
  ns.lastUsed = timestamp;
}
