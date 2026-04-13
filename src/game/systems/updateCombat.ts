import { GameEngine } from '../GameEngine';
import { Entity, Vector2, BuildingType, UnitType } from '../types';

export function updateCombat(this: GameEngine, entity: Entity, dt: number, timestamp: number): void {
// Elite self-healing
if (entity.rank === 'ELITE' && entity.health < entity.maxHealth) {
  if (timestamp % 1000 < 16) { // roughly once per second
    entity.health = Math.min(entity.maxHealth, entity.health + 2);
  }
}

if (entity.subType === 'ENGINEER' && !entity.targetId) {
  // Engineers don't auto-attack
  return;
}

if (entity.subType === 'SPY' && !entity.targetId) {
  // Spies don't auto-attack
  return;
}

if (entity.subType === 'DEMOLITION_TRUCK' && !entity.targetId) {
  // Demolition trucks don't auto-attack
  return;
}

// Mirage Tank Disguise Logic
if (entity.subType === 'MIRAGE_TANK') {
  if (!entity.targetPosition && !entity.targetId && timestamp - (entity.lastAttackTime || 0) > 3000) {
    entity.isDisguised = true;
  } else {
    entity.isDisguised = false;
  }
}

// Deployed Desolator Logic
if (entity.subType === 'DESOLATOR' && entity.isDeployed) {
  if (timestamp % 1000 < 32) { // roughly once per second
    this.state.effects.push({
      id: `radiation-deploy-${timestamp}-${Math.random()}`,
      type: 'RADIATION',
      position: { ...entity.position },
      startTime: timestamp,
      duration: 1500,
      color: '#22c55e', // green
    });
    // Area of effect damage to infantry
    this.state.entities.forEach(e => {
      if (e.id !== entity.id && e.health > 0 && Math.hypot(e.position.x - entity.position.x, e.position.y - entity.position.y) < 150) {
        if (e.type === 'UNIT' && ['SOLDIER', 'ENGINEER', 'ATTACK_DOG', 'FLAK_TROOPER', 'TESLA_TROOPER', 'CRAZY_IVAN', 'BORIS', 'TERRORIST', 'YURI', 'GI', 'ROCKETEER', 'NAVY_SEAL', 'CHRONO_LEGIONNAIRE', 'TANYA', 'SNIPER', 'CHRONO_IVAN'].includes(e.subType || '')) {
          e.health -= 20; // Splash damage to infantry
        }
      }
    });
  }
  return; // Deployed desolators don't shoot normally
}

if (!entity.targetId) {
  // Look for nearest enemy within range
  const searchRange = entity.isAttackMoving ? 500 : 400;
  let nearestEnemy: Entity | null = null;
  let minDist = searchRange;

  for (const e of this.state.entities) {
    if (e.owner !== entity.owner && e.health > 0 && !e.isDisguised) {
      // Basic anti-air check
      if (e.isAir && !['ROCKETEER', 'IFV', 'PATRIOT_MISSILE', 'FLAK_TROOPER', 'FLAK_TRACK', 'FLAK_CANNON', 'SEA_SCORPION', 'AEGIS_CRUISER', 'APOCALYPSE_TANK'].includes(entity.subType || '')) {
        continue; // Cannot attack air
      }
      // Anti-sub check
      if (e.subType === 'TYPHOON_SUB' && !['DESTROYER', 'GIANT_SQUID', 'DOLPHIN'].includes(entity.subType || '')) {
        continue; // Cannot attack subs
      }

      const dist = Math.hypot(entity.position.x - e.position.x, entity.position.y - e.position.y);
      if (dist < minDist) {
        // Prioritize units over buildings slightly
        const priorityBonus = e.type === 'UNIT' ? 50 : 0;
        if (dist - priorityBonus < minDist) {
          minDist = dist - priorityBonus;
          nearestEnemy = e;
        }
      }
    }
  }

  if (nearestEnemy) {
    entity.targetId = nearestEnemy.id;
  } else if (entity.isAttackMoving && entity.attackMoveTarget && !entity.targetPosition) {
    entity.path = this.calculatePath(entity.position, entity.attackMoveTarget);
    entity.targetPosition = entity.path[0];
  }
}

if (entity.targetId) {
  const target = this.state.entities.find(e => e.id === entity.targetId);
  if (!target || target.health <= 0) {
    if (target && target.health <= 0) {
      this.state.effects.push({
        id: `exp-${timestamp}-${Math.random()}`,
        type: 'EXPLOSION',
        position: { ...target.position },
        startTime: timestamp,
        duration: 500,
      });
    }
    entity.targetId = undefined;
    return;
  }

  const dx = target.position.x - entity.position.x;
  const dy = target.position.y - entity.position.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  let range = 150;
  if (entity.subType === 'TANK') range = 250;
  if (entity.subType === 'RHINO_TANK') range = 280;
  if (entity.subType === 'SENTRY_GUN') range = 350;
  if (entity.subType === 'TESLA_COIL') range = 400;
  if (entity.subType === 'APOCALYPSE_TANK') range = 350;
  if (entity.subType === 'TESLA_TROOPER') range = 200;
  if (entity.subType === 'V3_LAUNCHER') range = 600;
  if (entity.subType === 'KIROV_AIRSHIP') range = 100;
  if (entity.subType === 'BORIS') range = 450;
  if (entity.subType === 'FLAK_CANNON') range = 450;
  if (entity.subType === 'FLAK_TROOPER') range = 300;
  if (entity.subType === 'FLAK_TRACK') range = 350;
  if (entity.subType === 'DESOLATOR') range = 150;
  if (entity.subType === 'TESLA_TANK') range = 300;
  if (entity.subType === 'TYPHOON_SUB') range = 300;
  if (entity.subType === 'SEA_SCORPION') range = 350;
  if (entity.subType === 'GIANT_SQUID') range = 50;
  if (entity.subType === 'DREADNOUGHT') range = 800;
  if (entity.subType === 'SIEGE_CHOPPER') {
    range = entity.isDeployed ? 600 : 200; 
  }
  if (entity.subType === 'YURI') range = 350;
  if (entity.subType === 'YURI_PRIME') range = 450;
  if (entity.subType === 'BATTLE_BUNKER') range = 300;
  if (entity.subType === 'ENGINEER') range = 30; // Needs to be very close to capture
  
  // Allied Ranges
  if (entity.subType === 'GI') range = entity.isDeployed ? 350 : 180;
  if (entity.subType === 'ROCKETEER') range = 250;
  if (entity.subType === 'NAVY_SEAL') range = target.type === 'BUILDING' ? 30 : 200;
  if (entity.subType === 'CHRONO_LEGIONNAIRE') range = 250;
  if (entity.subType === 'TANYA') range = target.type === 'BUILDING' ? 30 : 250;
  if (entity.subType === 'SNIPER') range = 500;
  if (entity.subType === 'CHRONO_IVAN') range = 30;
  if (entity.subType === 'CHRONO_COMMANDO') range = target.type === 'BUILDING' ? 30 : 250;
  if (entity.subType === 'PSI_COMMANDO') range = target.type === 'BUILDING' ? 30 : 350;
  if (entity.subType === 'GRIZZLY_TANK') range = 220;
  if (entity.subType === 'IFV') range = 300;
  if (entity.subType === 'MIRAGE_TANK') range = 250;
  if (entity.subType === 'PRISM_TANK') range = 450;
  if (entity.subType === 'ROBOT_TANK') range = 250;
  if (entity.subType === 'BATTLE_FORTRESS') range = 300;
  if (entity.subType === 'DESTROYER') range = 350;
  if (entity.subType === 'AEGIS_CRUISER') range = 400;
  if (entity.subType === 'AIRCRAFT_CARRIER') range = 800;
  if (entity.subType === 'DOLPHIN') range = 100;
  if (entity.subType === 'PILLBOX') range = 250;
  if (entity.subType === 'PATRIOT_MISSILE') range = 450;
  if (entity.subType === 'PRISM_TOWER') range = 350;
  if (entity.subType === 'GRAND_CANNON') range = 700;
  if (entity.subType === 'TANK_DESTROYER') range = 300;
  if (entity.subType === 'SPY') range = 30; // Needs to be very close to infiltrate
  if (entity.subType === 'DEMOLITION_TRUCK') range = 30; // Needs to be very close to explode

  if (dist > range) {
    if (entity.type === 'UNIT') {
      entity.path = this.calculatePath(entity.position, target.position);
      entity.targetPosition = entity.path[0];
      if (entity.subType === 'MIRAGE_TANK') entity.isDisguised = false; // Reveal when moving
    }
  } else {
    // Spy logic
    if (entity.subType === 'SPY' && target.type === 'BUILDING') {
      if (target.owner !== entity.owner) {
        if (target.subType === 'ORE_REFINERY' || target.subType === 'ALLIED_ORE_REFINERY') {
          // Steal money
          this.state.credits += 2000;
          this.state.effects.push({
            id: `spy-steal-${timestamp}-${Math.random()}`,
            type: 'EXPLOSION', // Reusing explosion for visual effect
            position: { ...target.position },
            startTime: timestamp,
            duration: 1000,
          });
        } else if (target.subType === 'POWER_PLANT' || target.subType === 'ALLIED_POWER_PLANT' || target.subType === 'NUCLEAR_REACTOR') {
          // Disable power (simplified: just visual effect for now, could add actual power logic later)
          this.state.effects.push({
            id: `spy-power-${timestamp}-${Math.random()}`,
            type: 'EXPLOSION',
            position: { ...target.position },
            startTime: timestamp,
            duration: 1000,
          });
        } else if (target.subType === 'RADAR' || target.subType === 'AIR_FORCE_COMMAND') {
           // Disable radar
           this.state.effects.push({
            id: `spy-radar-${timestamp}-${Math.random()}`,
            type: 'EXPLOSION',
            position: { ...target.position },
            startTime: timestamp,
            duration: 1000,
          });
        }
        entity.health = 0; // Spy is consumed
        return;
      }
    }

    // Engineer capture/repair logic
    if (entity.subType === 'ENGINEER' && target.type === 'BUILDING') {
      if (target.owner !== entity.owner) {
        target.owner = entity.owner; // Capture
        this.state.effects.push({
          id: `capture-${timestamp}-${Math.random()}`,
          type: 'MIND_CONTROL', // Reuse visual effect for capture
          position: { ...target.position },
          startTime: timestamp,
          duration: 1000,
          color: '#3b82f6', // blue
        });
      } else {
        target.health = target.maxHealth; // Full repair
      }
      entity.health = 0; // Engineer is consumed
      return;
    }

    // Tanya/SEAL C4 Logic
    if ((entity.subType === 'TANYA' || entity.subType === 'NAVY_SEAL') && target.type === 'BUILDING') {
      this.state.effects.push({
        id: `c4-${timestamp}-${Math.random()}`,
        type: 'EXPLOSION',
        position: { ...target.position },
        startTime: timestamp,
        duration: 1000,
      });
      target.health = 0; // Instant kill
      entity.targetId = undefined;
      return;
    }

    entity.targetPosition = undefined;
    entity.path = undefined;
    entity.rotation = Math.atan2(dy, dx);
    
    let cooldown = 800;
    if (entity.subType === 'TANK') cooldown = 2000;
    if (entity.subType === 'RHINO_TANK') cooldown = 2200;
    if (entity.subType === 'SENTRY_GUN') cooldown = 600;
    if (entity.subType === 'TESLA_COIL') cooldown = 3000;
    if (entity.subType === 'APOCALYPSE_TANK') cooldown = 2500;
    if (entity.subType === 'TESLA_TROOPER') cooldown = 1500;
    if (entity.subType === 'V3_LAUNCHER') cooldown = 6000;
    if (entity.subType === 'KIROV_AIRSHIP') cooldown = 3500;
    if (entity.subType === 'BORIS') cooldown = 1000;
    if (entity.subType === 'CRAZY_IVAN') cooldown = 2000;
    if (entity.subType === 'DESOLATOR') cooldown = 1000;
    if (entity.subType === 'TESLA_TANK') cooldown = 2500;
    if (entity.subType === 'DREADNOUGHT') cooldown = 8000;
    if (entity.subType === 'YURI') cooldown = 5000;
    if (entity.subType === 'YURI_PRIME') cooldown = 4000;
    if (entity.subType === 'BATTLE_BUNKER') cooldown = 1000;
    
    // Allied Cooldowns
    if (entity.subType === 'GI') cooldown = 800;
    if (entity.subType === 'ROCKETEER') cooldown = 600;
    if (entity.subType === 'NAVY_SEAL') cooldown = 400;
    if (entity.subType === 'CHRONO_LEGIONNAIRE') cooldown = 100; // Continuous beam
    if (entity.subType === 'TANYA') cooldown = 400;
    if (entity.subType === 'SNIPER') cooldown = 3000;
    if (entity.subType === 'CHRONO_IVAN') cooldown = 2000;
    if (entity.subType === 'CHRONO_COMMANDO') cooldown = 400;
    if (entity.subType === 'PSI_COMMANDO') cooldown = 5000;
    if (entity.subType === 'GRIZZLY_TANK') cooldown = 1800;
    if (entity.subType === 'IFV') cooldown = 1200;
    if (entity.subType === 'MIRAGE_TANK') cooldown = 1500;
    if (entity.subType === 'PRISM_TANK') cooldown = 3500;
    if (entity.subType === 'ROBOT_TANK') cooldown = 1500;
    if (entity.subType === 'BATTLE_FORTRESS') cooldown = 1000;
    if (entity.subType === 'DESTROYER') cooldown = 2000;
    if (entity.subType === 'AEGIS_CRUISER') cooldown = 1000;
    if (entity.subType === 'AIRCRAFT_CARRIER') cooldown = 8000;
    if (entity.subType === 'DOLPHIN') cooldown = 1500;
    if (entity.subType === 'PILLBOX') cooldown = 500;
    if (entity.subType === 'PATRIOT_MISSILE') cooldown = 1500;
    if (entity.subType === 'PRISM_TOWER') cooldown = 2500;
    if (entity.subType === 'GRAND_CANNON') cooldown = 4000;
    if (entity.subType === 'TANK_DESTROYER') cooldown = 2000;

    if (timestamp - (entity.lastAttackTime || 0) > cooldown) {
      if (entity.subType === 'MIRAGE_TANK') entity.isDisguised = false; // Reveal when attacking
      
      // Tank Destroyer can only attack vehicles
      if (entity.subType === 'TANK_DESTROYER' && target.type !== 'UNIT') {
         return; // Cannot attack buildings or infantry (simplified: assuming all units are vehicles for now, would need a 'isVehicle' flag for true accuracy)
      }

      let damage = 10;
      if (entity.subType === 'TANK') damage = 50;
      if (entity.subType === 'RHINO_TANK') damage = 70;
      if (entity.subType === 'SENTRY_GUN') damage = 15;
      if (entity.subType === 'TESLA_COIL') damage = 250;
      if (entity.subType === 'APOCALYPSE_TANK') damage = 150;
      if (entity.subType === 'TESLA_TROOPER') damage = 60;
      if (entity.subType === 'BATTLE_BUNKER') damage = 30;
      if (entity.subType === 'V3_LAUNCHER') damage = 200;
      if (entity.subType === 'KIROV_AIRSHIP') damage = 300;
      if (entity.subType === 'BORIS') damage = 40;
      if (entity.subType === 'FLAK_TROOPER') damage = 25;
      if (entity.subType === 'FLAK_TRACK') damage = 20;
      if (entity.subType === 'CRAZY_IVAN') damage = 400;
      if (entity.subType === 'ATTACK_DOG') damage = 100;
      if (entity.subType === 'DESOLATOR') damage = 80;
      if (entity.subType === 'TESLA_TANK') damage = 100;
      if (entity.subType === 'TYPHOON_SUB') damage = 100;
      if (entity.subType === 'SEA_SCORPION') damage = 30;
      if (entity.subType === 'GIANT_SQUID') damage = 50;
      if (entity.subType === 'DREADNOUGHT') damage = 400;
      if (entity.subType === 'SIEGE_CHOPPER') damage = entity.isDeployed ? 150 : 60;
      if (entity.subType === 'TERRORIST') damage = 500;
      if (entity.subType === 'DEMOLITION_TRUCK') damage = 1000;

      // Allied Damage
      if (entity.subType === 'GI') damage = entity.isDeployed ? 40 : 15;
      if (entity.subType === 'ROCKETEER') damage = 15;
      if (entity.subType === 'NAVY_SEAL') damage = 50;
      if (entity.subType === 'CHRONO_LEGIONNAIRE') damage = 5; // Erases over time
      if (entity.subType === 'TANYA') damage = 50;
      if (entity.subType === 'SNIPER') damage = 100;
      if (entity.subType === 'CHRONO_IVAN') damage = 400;
      if (entity.subType === 'GRIZZLY_TANK') damage = 45;
      if (entity.subType === 'IFV') damage = 25;
      if (entity.subType === 'MIRAGE_TANK') damage = 100;
      if (entity.subType === 'PRISM_TANK') damage = 120;
      if (entity.subType === 'ROBOT_TANK') damage = 40;
      if (entity.subType === 'BATTLE_FORTRESS') damage = 80;
      if (entity.subType === 'DESTROYER') damage = 60;
      if (entity.subType === 'AEGIS_CRUISER') damage = 150;
      if (entity.subType === 'AIRCRAFT_CARRIER') damage = 300;
      if (entity.subType === 'DOLPHIN') damage = 40;
      if (entity.subType === 'PILLBOX') damage = 20;
      if (entity.subType === 'PATRIOT_MISSILE') damage = 40;
      if (entity.subType === 'PRISM_TOWER') damage = 150;
      if (entity.subType === 'GRAND_CANNON') damage = 250;
      if (entity.subType === 'TANK_DESTROYER') damage = 150;
      if (entity.subType === 'CHRONO_COMMANDO') damage = target.type === 'BUILDING' ? 10000 : 50;
      if (entity.subType === 'PSI_COMMANDO') damage = target.type === 'BUILDING' ? 10000 : 0; // 0 damage to units, relies on mind control

      // Demolition Truck logic
      if (entity.subType === 'DEMOLITION_TRUCK') {
        this.state.effects.push({
          id: `nuke-${timestamp}-${Math.random()}`,
          type: 'EXPLOSION',
          position: { ...entity.position },
          startTime: timestamp,
          duration: 2000,
        });
        
        // Area damage
        this.state.entities.forEach(e => {
          if (e.id !== entity.id) {
            const dist = Math.hypot(e.position.x - entity.position.x, e.position.y - entity.position.y);
            if (dist < 200) {
              e.health -= damage * (1 - dist / 200);
            }
          }
        });
        
        entity.health = 0; // Self destruct
        return;
      }

      // Apply veterancy buffs
      if (entity.rank === 'VETERAN') {
        damage *= 1.2;
        cooldown *= 0.8;
      } else if (entity.rank === 'ELITE') {
        damage *= 1.5;
        cooldown *= 0.6;
      }

      // Yuri Mind Control Logic
      if ((entity.subType === 'YURI' || entity.subType === 'YURI_PRIME' || entity.subType === 'PSI_COMMANDO') && !target.mindControlledBy && target.owner !== entity.owner) {
        // Yuri Prime can mind control buildings, others only units
        if (target.type === 'UNIT' || (entity.subType === 'YURI_PRIME' && target.type === 'BUILDING')) {
          target.owner = entity.owner;
          target.mindControlledBy = entity.id;
          target.targetId = undefined;
          target.path = undefined;
          target.targetPosition = undefined;
          
          this.state.effects.push({
            id: `mindcontrol-${timestamp}-${Math.random()}`,
            type: 'MIND_CONTROL',
            position: { ...target.position },
            startTime: timestamp,
            duration: 2000,
            color: entity.subType === 'PSI_COMMANDO' ? '#a855f7' : '#c084fc', // purple
          });
          entity.lastAttackTime = timestamp;
          return; // Skip normal damage
        }
      }

      // Crazy Ivan Logic
      if (entity.subType === 'CRAZY_IVAN' || entity.subType === 'CHRONO_IVAN') {
        // Plant bomb
        this.state.effects.push({
          id: `bomb-${timestamp}-${Math.random()}`,
          type: 'EXPLOSION', // We can use explosion as a visual indicator for now
          position: { ...target.position },
          startTime: timestamp + 3000, // Explode after 3 seconds
          duration: 500,
        });
        setTimeout(() => {
          const currentTarget = this.state.entities.find(e => e.id === target.id);
          if (currentTarget) {
            currentTarget.health -= damage;
          }
        }, 3000);
        entity.lastAttackTime = timestamp;
        return; // Don't apply immediate damage
      }

      const isMissile = ['V3_LAUNCHER', 'DREADNOUGHT', 'SEA_SCORPION', 'PATRIOT_MISSILE', 'IFV', 'AEGIS_CRUISER'].includes(entity.subType);
      const isCannon = ['TANK', 'RHINO_TANK', 'APOCALYPSE_TANK', 'FLAK_TRACK', 'FLAK_CANNON', 'SIEGE_CHOPPER', 'KIROV_AIRSHIP', 'GRIZZLY_TANK', 'DESTROYER', 'BATTLE_FORTRESS'].includes(entity.subType);
      const isLaser = ['PRISM_TANK', 'PRISM_TOWER'].includes(entity.subType);
      
      if (isMissile || isCannon || isLaser) {
        this.state.projectiles.push({
          id: `proj-${timestamp}-${Math.random()}`,
          type: isLaser ? 'LASER' : (isMissile ? 'MISSILE' : 'CANNONBALL'),
          position: { ...entity.position },
          targetId: target.id,
          targetPosition: { ...target.position },
          speed: isLaser ? 15 : (isMissile ? 3 : 5),
          damage: damage,
          owner: entity.owner,
          sourceId: entity.id
        });
      } else {
        // Apply instant damage for bullets, tesla, etc.
        if (!target.invulnerableUntil || timestamp > target.invulnerableUntil) {
          target.health -= damage;
          
          // Check for kill and apply veterancy
          if (target.health <= 0) {
            entity.kills = (entity.kills || 0) + 1;
            
            if (entity.kills >= 7 && entity.rank !== 'ELITE') {
              entity.rank = 'ELITE';
              entity.maxHealth *= 1.5;
              entity.health = entity.maxHealth;
            } else if (entity.kills >= 3 && entity.rank !== 'VETERAN' && entity.rank !== 'ELITE') {
              entity.rank = 'VETERAN';
              entity.maxHealth *= 1.2;
              entity.health = entity.maxHealth;
            }
          }
        }
      }

      entity.lastAttackTime = timestamp;

      const isTesla = entity.subType === 'TESLA_COIL' || entity.subType === 'TESLA_TROOPER';
      const isExplosive = entity.subType === 'V3_LAUNCHER' || entity.subType === 'KIROV_AIRSHIP';
      const isLaserAttack = ['PRISM_TANK', 'PRISM_TOWER'].includes(entity.subType);
      const isChrono = entity.subType === 'CHRONO_LEGIONNAIRE';

      if (!isTesla && !isExplosive && !isLaserAttack && !isChrono && !isMissile && !isCannon) {
        this.state.effects.push({
          id: `flash-${timestamp}-${Math.random()}`,
          type: 'MUZZLE_FLASH',
          position: { ...entity.position },
          startTime: timestamp,
          duration: 100,
        });
      }

      if (isExplosive) {
        this.state.effects.push({
          id: `exp-${timestamp}-${Math.random()}`,
          type: 'EXPLOSION',
          position: { ...target.position },
          startTime: timestamp,
          duration: 500,
        });
      }

      if (!isMissile && !isCannon) {
        this.state.effects.push({
          id: `tracer-${timestamp}-${Math.random()}`,
          type: 'TRACER',
          position: { ...entity.position },
          targetPosition: { ...target.position },
          startTime: timestamp,
          duration: isTesla ? 300 : (isExplosive ? 1000 : (isChrono ? 100 : 150)),
          color: isTesla ? '#60a5fa' : (isExplosive ? '#ef4444' : (isChrono ? '#a855f7' : '#f87171')),
        });
      }

      // Boris Air Strike Logic
      if (entity.subType === 'BORIS') {
        const targetId = target.id;
        setTimeout(() => {
          const currentTarget = this.state.entities.find(e => e.id === targetId);
          if (currentTarget) {
            this.state.effects.push({
              id: `airstrike-${Date.now()}`,
              type: 'EXPLOSION',
              position: { ...currentTarget.position },
              startTime: performance.now(),
              duration: 1000,
            });
            currentTarget.health -= 500;
          }
        }, 3000);
      }

      // Terror Drone Logic
      if (entity.subType === 'TERROR_DRONE' && target.type === 'UNIT' && !['SOLDIER', 'ATTACK_DOG', 'ENGINEER', 'FLAK_TROOPER', 'TESLA_TROOPER', 'CRAZY_IVAN', 'BORIS', 'DESOLATOR', 'TERRORIST', 'YURI', 'GI', 'ROCKETEER', 'NAVY_SEAL', 'CHRONO_LEGIONNAIRE', 'TANYA', 'SNIPER', 'CHRONO_IVAN'].includes(target.subType || '')) {
        // Infect vehicle
        target.health -= 50; // Initial damage
        entity.health = 0; // Terror drone is consumed
        // We would need a way to track infection over time, but for now just deal massive damage
        target.health -= 200; 
        return;
      }

      // Desolator Radiation Logic
      if (entity.subType === 'DESOLATOR') {
        this.state.effects.push({
          id: `radiation-${timestamp}-${Math.random()}`,
          type: 'RADIATION',
          position: { ...target.position },
          startTime: timestamp,
          duration: 2000,
          color: '#22c55e', // green
        });
        // Area of effect damage to infantry
        this.state.entities.forEach(e => {
          if (e.id !== entity.id && e.health > 0 && Math.hypot(e.position.x - target.position.x, e.position.y - target.position.y) < 80) {
            if (e.type === 'UNIT' && ['SOLDIER', 'ENGINEER', 'ATTACK_DOG', 'FLAK_TROOPER', 'TESLA_TROOPER', 'CRAZY_IVAN', 'BORIS', 'TERRORIST', 'YURI', 'GI', 'ROCKETEER', 'NAVY_SEAL', 'CHRONO_LEGIONNAIRE', 'TANYA', 'SNIPER', 'CHRONO_IVAN'].includes(e.subType || '')) {
              e.health -= damage * 0.5; // Splash damage to infantry
            }
          }
        });
      }

      // Siege Chopper Deploy Logic (simplified: just increase range and damage when not moving)
      if (entity.subType === 'SIEGE_CHOPPER' && !entity.targetPosition) {
        damage = 150; // Artillery damage
        // We'd need to adjust range dynamically, but for now we just increase damage when stationary
      }
      
      // Chrono Legionnaire Logic
      if (entity.subType === 'CHRONO_LEGIONNAIRE') {
        // Chrono legionnaires erase units from time. The longer they shoot, the faster it erases.
        // For simplicity, we just deal damage over time, but we could add a "frozen" state.
        target.health -= damage;
        // Add a visual effect to show the target is being erased
        this.state.effects.push({
          id: `erase-${timestamp}-${Math.random()}`,
          type: 'RADIATION', // Reuse radiation effect for now, maybe change color
          position: { ...target.position },
          startTime: timestamp,
          duration: 500,
          color: '#a855f7', // purple
        });
      }

      if (!target.targetId && target.type === 'UNIT' && target.subType !== 'HARVESTER' && target.subType !== 'MCV' && target.subType !== 'CHRONO_MINER') {
        target.targetId = entity.id;
      }
    }
  }
}
}
