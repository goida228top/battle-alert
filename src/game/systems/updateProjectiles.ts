import { GameEngine } from '../GameEngine';
import { Entity, Vector2, BuildingType, UnitType } from '../types';

export function updateProjectiles(this: GameEngine, dt: number, timestamp: number): void {
for (let i = this.state.projectiles.length - 1; i >= 0; i--) {
  const proj = this.state.projectiles[i];
  let targetPos = proj.targetPosition;

  if (proj.targetId) {
    const targetEntity = this.state.entities.find(e => e.id === proj.targetId);
    if (targetEntity) {
      targetPos = { ...targetEntity.position };
    }
  }

  if (!targetPos) {
    this.state.projectiles.splice(i, 1);
    continue;
  }

  const dx = targetPos.x - proj.position.x;
  const dy = targetPos.y - proj.position.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < proj.speed * dt) {
    // Hit
    if (proj.targetId) {
      const targetEntity = this.state.entities.find(e => e.id === proj.targetId);
      if (targetEntity && (!targetEntity.invulnerableUntil || timestamp > targetEntity.invulnerableUntil)) {
        targetEntity.health -= proj.damage;
        
        // Check for kill and apply veterancy to source
        if (targetEntity.health <= 0) {
          const sourceEntity = this.state.entities.find(e => e.id === proj.sourceId);
          if (sourceEntity) {
            sourceEntity.kills = (sourceEntity.kills || 0) + 1;
            if (sourceEntity.kills >= 7 && sourceEntity.rank !== 'ELITE') {
              sourceEntity.rank = 'ELITE';
              sourceEntity.maxHealth *= 1.5;
              sourceEntity.health = sourceEntity.maxHealth;
            } else if (sourceEntity.kills >= 3 && sourceEntity.rank !== 'VETERAN' && sourceEntity.rank !== 'ELITE') {
              sourceEntity.rank = 'VETERAN';
              sourceEntity.maxHealth *= 1.2;
              sourceEntity.health = sourceEntity.maxHealth;
            }
          }
        }
      }
    }

    // Splash damage for missiles/cannonballs
    if (proj.type === 'MISSILE' || proj.type === 'CANNONBALL') {
      this.state.effects.push({
        id: `proj-exp-${timestamp}-${Math.random()}`,
        type: 'EXPLOSION',
        position: { ...targetPos },
        startTime: timestamp,
        duration: 500,
      });

      if (proj.type === 'MISSILE') {
        const splashRadius = 60;
        this.state.entities.forEach(e => {
          if (e.id !== proj.targetId && Math.hypot(e.position.x - targetPos!.x, e.position.y - targetPos!.y) < splashRadius) {
            if (!e.invulnerableUntil || timestamp > e.invulnerableUntil) {
              e.health -= proj.damage * 0.5;
            }
          }
        });
      }
    }

    this.state.projectiles.splice(i, 1);
  } else {
    // Move
    proj.position.x += (dx / dist) * proj.speed * dt;
    proj.position.y += (dy / dist) * proj.speed * dt;
  }
}
}
