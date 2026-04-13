
import { Vector2 } from '../types';

export function useIronCurtain(this: any, targetPos: Vector2) {
  const ic = this.state.specialAbilities.IRON_CURTAIN;
  if (!ic.ready) return;

  // Apply invulnerability to units in radius
  const radius = 150;
  const timestamp = performance.now();
  this.state.entities.forEach((e: any) => {
    if (e.type === 'UNIT' && Math.hypot(e.position.x - targetPos.x, e.position.y - targetPos.y) < radius) {
      if (['SOLDIER', 'ENGINEER', 'ATTACK_DOG', 'FLAK_TROOPER', 'TESLA_TROOPER', 'CRAZY_IVAN', 'BORIS', 'DESOLATOR', 'TERRORIST', 'YURI', 'GI', 'ROCKETEER', 'NAVY_SEAL', 'CHRONO_LEGIONNAIRE', 'TANYA', 'SNIPER', 'CHRONO_IVAN'].includes(e.subType || '')) {
        e.health = 0; // Iron Curtain kills infantry instantly
      } else {
        e.invulnerableUntil = timestamp + 45000; // 45 seconds invulnerability for vehicles
      }
    }
  });

  this.state.effects.push({
    id: `ic-${Date.now()}`,
    type: 'TRACER', // Use tracer as a visual for now
    position: { ...targetPos },
    targetPosition: { ...targetPos },
    startTime: timestamp,
    duration: 1000,
    color: '#ef4444',
  });

  ic.ready = false;
  ic.lastUsed = timestamp;
}
