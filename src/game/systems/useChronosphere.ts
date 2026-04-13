
import { Vector2 } from '../types';

export function useChronosphere(this: any, targetPos: Vector2) {
  const cs = this.state.specialAbilities.CHRONOSPHERE;
  if (!cs.ready) return;

  const radius = 150;
  const timestamp = performance.now();
  
  // Select units to teleport
  const unitsToTeleport = this.state.entities.filter((e: any) => 
    e.type === 'UNIT' && 
    !['SOLDIER', 'ENGINEER', 'ATTACK_DOG', 'FLAK_TROOPER', 'TESLA_TROOPER', 'CRAZY_IVAN', 'BORIS', 'DESOLATOR', 'TERRORIST', 'YURI', 'GI', 'ROCKETEER', 'NAVY_SEAL', 'CHRONO_LEGIONNAIRE', 'TANYA', 'SNIPER', 'CHRONO_IVAN'].includes(e.subType || '') &&
    Math.hypot(e.position.x - targetPos.x, e.position.y - targetPos.y) < radius
  );

  // Infantry dies instantly
  this.state.entities.forEach((e: any) => {
    if (e.type === 'UNIT' && ['SOLDIER', 'ENGINEER', 'ATTACK_DOG', 'FLAK_TROOPER', 'TESLA_TROOPER', 'CRAZY_IVAN', 'BORIS', 'DESOLATOR', 'TERRORIST', 'YURI', 'GI', 'ROCKETEER', 'NAVY_SEAL', 'CHRONO_LEGIONNAIRE', 'TANYA', 'SNIPER', 'CHRONO_IVAN'].includes(e.subType || '') && Math.hypot(e.position.x - targetPos.x, e.position.y - targetPos.y) < radius) {
      e.health = 0;
    }
  });

  if (unitsToTeleport.length > 0) {
    this.state.interactionMode = 'DEFAULT'; // Reset mode, we need a second click for destination
    // We'll store the selected units in a temporary property to wait for the second click
    (this as any).chronosphereSelection = unitsToTeleport;
    // Visual effect for selection
    this.state.effects.push({
      id: `chrono-sel-${Date.now()}`,
      type: 'EXPLOSION',
      position: { ...targetPos },
      startTime: timestamp,
      duration: 1000,
    });
    return; // Don't put on cooldown yet
  } else {
    // If no valid units, just cancel and don't use cooldown
    this.state.interactionMode = 'DEFAULT';
    return;
  }
}
