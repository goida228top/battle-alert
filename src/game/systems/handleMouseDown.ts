
import { Vector2, BuildingType } from '../types';

export function handleMouseDown(this: any, pos: Vector2, isRightClick: boolean, isCtrlKey: boolean = false) {
  // RMB: Cancel or Deselect
  if (isRightClick) {
    if (this.state.placingBuilding) {
      const cost = this.getCost(this.state.placingBuilding);
      this.state.credits += cost;
      this.state.placingBuilding = null;
    } else {
      // Deselect all
      this.state.entities.forEach((e: any) => e.selected = false);
    }
    this.state.interactionMode = 'DEFAULT';
    return;
  }

  // LMB Actions
  
  // 1. Building Placement
  if (this.state.placingBuilding) {
    this.placeBuilding(pos);
    return;
  }

  // 2. Special Interaction Modes (SELL, REPAIR, ABILITIES)
  if (this.state.interactionMode !== 'DEFAULT') {
    if (this.state.interactionMode === 'SELL') {
      const building = this.state.entities.find((e: any) => 
        e.owner === 'PLAYER' && e.type === 'BUILDING' && 
        Math.hypot(e.position.x - pos.x, e.position.y - pos.y) < e.size
      );
      if (building) {
        this.sellBuilding(building);
        this.state.interactionMode = 'DEFAULT';
        return;
      }
    }

    if (this.state.interactionMode === 'REPAIR') {
      const building = this.state.entities.find((e: any) => 
        e.owner === 'PLAYER' && e.type === 'BUILDING' && 
        Math.hypot(e.position.x - pos.x, e.position.y - pos.y) < e.size * 1.5
      );
      if (building) {
        if (this.repairBuilding(building)) {
          this.state.effects.push({
            id: `repair-${Date.now()}-${Math.random()}`,
            type: 'MUZZLE_FLASH',
            position: { ...building.position },
            startTime: performance.now(),
            duration: 500,
          });
        }
        if (building.health >= building.maxHealth) {
          this.state.interactionMode = 'DEFAULT';
        }
        return;
      }
    }

    // Ability targeting
    const abilityModes = ['USE_IRON_CURTAIN', 'USE_NUCLEAR_STRIKE', 'USE_SPY_PLANE', 'USE_PARATROOPERS', 'USE_WEATHER_STORM'];
    if (abilityModes.includes(this.state.interactionMode)) {
      if (this.state.interactionMode === 'USE_IRON_CURTAIN') this.useIronCurtain(pos);
      if (this.state.interactionMode === 'USE_NUCLEAR_STRIKE') this.useNuclearStrike(pos);
      if (this.state.interactionMode === 'USE_SPY_PLANE') this.useSpyPlane(pos);
      if (this.state.interactionMode === 'USE_PARATROOPERS') this.useParatroopers(pos);
      if (this.state.interactionMode === 'USE_WEATHER_STORM') this.useWeatherStorm(pos);
      this.state.interactionMode = 'DEFAULT';
      return;
    }

    if (this.state.interactionMode === 'USE_CHRONOSPHERE') {
      if ((this as any).chronosphereSelection) {
        this.executeChronosphereTeleport(pos);
      } else {
        this.useChronosphere(pos);
      }
      return;
    }
  }

  // 3. Selection or Orders
  const clickedEntity = this.state.entities.find((e: any) => 
    Math.hypot(e.position.x - pos.x, e.position.y - pos.y) < e.size
  );

  const selectedUnits = this.state.entities.filter((e: any) => e.selected && e.owner === 'PLAYER' && e.type === 'UNIT');
  const selectedBuildings = this.state.entities.filter((e: any) => e.selected && e.owner === 'PLAYER' && e.type === 'BUILDING');

  // If we have units selected and we click on ground or enemy -> Give Order
  if (selectedUnits.length > 0) {
    const isEnemy = clickedEntity && clickedEntity.owner !== 'PLAYER';
    const isForceAttack = isCtrlKey;
    const isEngineerAction = clickedEntity && clickedEntity.type === 'BUILDING' && selectedUnits.some((u: any) => u.subType === 'ENGINEER');

    if (!clickedEntity || isEnemy || isForceAttack || isEngineerAction) {
      // Give Move/Attack Order
      if (!clickedEntity) {
        this.state.moveMarkers.push({ position: { ...pos }, startTime: performance.now() });
      }

      selectedUnits.forEach((entity: any) => {
        const responses = ['Moving', 'Affirmative', 'Yes, sir!', 'Right away', 'On it', 'Understood'];
        entity.selectionResponse = responses[Math.floor(Math.random() * responses.length)];
        entity.selectionResponseTime = performance.now();

        if (clickedEntity && (isEnemy || isForceAttack || (entity.subType === 'ENGINEER' && clickedEntity.type === 'BUILDING'))) {
          if (entity.subType === 'ENGINEER' && clickedEntity.type === 'BUILDING') {
            entity.targetId = clickedEntity.id;
            entity.path = this.calculatePath(entity.position, clickedEntity.position);
            entity.targetPosition = entity.path[0];
          } else {
            const attackResponses = ['Target acquired', 'Attacking', 'Destroy!', 'Eliminating', 'Firing!', 'Locked on'];
            entity.selectionResponse = attackResponses[Math.floor(Math.random() * attackResponses.length)];
            entity.targetId = clickedEntity.id;
            entity.path = this.calculatePath(entity.position, clickedEntity.position);
            entity.targetPosition = entity.path[0];
          }
        } else {
          entity.path = this.calculatePath(entity.position, pos);
          entity.targetPosition = entity.path[0];
          entity.targetId = undefined;
        }
        entity.isAttackMoving = false;
      });
      return;
    }
  }

  // If we have buildings selected and click on ground -> Set Rally Point
  if (selectedBuildings.length > 0 && !clickedEntity) {
    const prodBuildings = selectedBuildings.filter((b: any) => 
      ['BARRACKS', 'ALLIED_BARRACKS', 'WAR_FACTORY', 'ALLIED_WAR_FACTORY', 'NAVAL_YARD', 'ALLIED_NAVAL_YARD', 'AIR_FORCE_COMMAND'].includes(b.subType || '')
    );
    if (prodBuildings.length > 0) {
      prodBuildings.forEach((b: any) => b.rallyPoint = { ...pos });
      this.state.moveMarkers.push({ position: { ...pos }, startTime: performance.now() });
      return;
    }
  }

  // 4. If we click on a friendly entity -> Select it
  if (clickedEntity && clickedEntity.owner === 'PLAYER') {
    if (!isCtrlKey) {
      this.state.entities.forEach((e: any) => e.selected = false);
    }
    clickedEntity.selected = true;
    return;
  }

  // 5. Otherwise -> Start Selection Box
  this.state.selectionBox = { start: { ...pos }, end: { ...pos } };
}
