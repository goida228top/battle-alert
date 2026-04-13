
import { Vector2, Entity } from '../types';

export function executeChronosphereTeleport(this: any, targetPos: Vector2) {
  const units = (this as any).chronosphereSelection as Entity[];
  if (!units || units.length === 0) return;

  const cs = this.state.specialAbilities.CHRONOSPHERE;
  const timestamp = performance.now();

  // Calculate center of selected units
  let cx = 0, cy = 0;
  units.forEach(u => { cx += u.position.x; cy += u.position.y; });
  cx /= units.length;
  cy /= units.length;

  units.forEach(u => {
    if (u.health > 0) {
      const offsetX = u.position.x - cx;
      const offsetY = u.position.y - cy;
      u.position.x = targetPos.x + offsetX;
      u.position.y = targetPos.y + offsetY;
      u.targetPosition = undefined;
      u.path = undefined;
    }
  });

  this.state.effects.push({
    id: `chrono-tele-${Date.now()}`,
    type: 'EXPLOSION',
    position: { ...targetPos },
    startTime: timestamp,
    duration: 1000,
  });

  (this as any).chronosphereSelection = null;
  cs.ready = false;
  cs.lastUsed = timestamp;
  this.state.interactionMode = 'DEFAULT';
}
