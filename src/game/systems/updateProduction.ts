import { GameEngine } from '../GameEngine';
import { Entity, Vector2, BuildingType, UnitType } from '../types';

export function updateProduction(this: GameEngine, timestamp: number, dt: number): void {
  const categories = ['BUILDINGS', 'DEFENSE', 'INFANTRY', 'VEHICLES'];
  const owners: ('PLAYER' | 'AI')[] = ['PLAYER', 'AI'];

  owners.forEach(owner => {
    const queue = owner === 'PLAYER' ? this.state.productionQueue : this.state.aiProductionQueue;
    if (queue.length === 0) return;

    categories.forEach(category => {
      const item = queue.find(q => this.getCategory(q.subType) === category);
      if (!item) return;

      if (item.progress >= 100) {
        if (category === 'BUILDINGS' || category === 'DEFENSE') {
          if (owner === 'AI') {
            // AI places buildings automatically
            const yard = this.state.entities.find(e => (e.subType === 'CONSTRUCTION_YARD' || e.subType === 'ALLIED_CONSTRUCTION_YARD') && e.owner === 'AI');
            if (yard) {
              const isDefense = ['SENTRY_GUN', 'FLAK_CANNON', 'TESLA_COIL', 'PILLBOX', 'PATRIOT_MISSILE', 'PRISM_TOWER'].includes(item.subType);
              const radius = isDefense ? 600 : 400;
              const pos = { 
                x: yard.position.x + (Math.random() - 0.5) * radius, 
                y: yard.position.y + (Math.random() - 0.5) * radius 
              };
              this.placeBuildingAt(pos, item.subType as BuildingType, 'AI');
              this.state.aiProductionQueue = this.state.aiProductionQueue.filter(q => q.id !== item.id);
            }
          }
          return; // Wait for player to place the building
        } else {
          let factoryTypes: string[] = [];
          if (category === 'INFANTRY') {
            factoryTypes = ['BARRACKS', 'ALLIED_BARRACKS'];
          } else if (category === 'VEHICLES') {
            if (['TYPHOON_SUB', 'SEA_SCORPION', 'GIANT_SQUID', 'DREADNOUGHT', 'HOVER_TRANSPORT', 'AMPHIBIOUS_TRANSPORT', 'DESTROYER', 'AEGIS_CRUISER', 'AIRCRAFT_CARRIER', 'DOLPHIN'].includes(item.subType)) {
              factoryTypes = ['NAVAL_YARD', 'ALLIED_NAVAL_YARD'];
            } else if (['HARRIER', 'BLACK_EAGLE', 'NIGHT_HAWK_TRANSPORT'].includes(item.subType)) {
              factoryTypes = ['AIR_FORCE_COMMAND'];
            } else {
              factoryTypes = ['WAR_FACTORY', 'ALLIED_WAR_FACTORY'];
            }
          }
          
          const factory = this.state.entities.find(e => factoryTypes.includes(e.subType || '') && e.owner === owner);
          
          if (factory) {
            this.produceUnitAt(factory, item.subType as UnitType, owner);
            if (owner === 'PLAYER') {
              this.state.productionQueue = this.state.productionQueue.filter(q => q.id !== item.id);
            } else {
              this.state.aiProductionQueue = this.state.aiProductionQueue.filter(q => q.id !== item.id);
            }
          }
          return;
        }
      }

      // Calculate speed multiplier based on number of factories
      let factoryCount = 1;
      if (category === 'INFANTRY') {
        factoryCount = this.state.entities.filter(e => (e.subType === 'BARRACKS' || e.subType === 'ALLIED_BARRACKS') && e.owner === owner).length;
      } else if (category === 'VEHICLES') {
        if (['TYPHOON_SUB', 'SEA_SCORPION', 'GIANT_SQUID', 'DREADNOUGHT', 'HOVER_TRANSPORT', 'AMPHIBIOUS_TRANSPORT', 'DESTROYER', 'AEGIS_CRUISER', 'AIRCRAFT_CARRIER', 'DOLPHIN'].includes(item.subType)) {
          factoryCount = this.state.entities.filter(e => (e.subType === 'NAVAL_YARD' || e.subType === 'ALLIED_NAVAL_YARD') && e.owner === owner).length;
        } else if (['HARRIER', 'BLACK_EAGLE', 'NIGHT_HAWK_TRANSPORT'].includes(item.subType)) {
          factoryCount = this.state.entities.filter(e => e.subType === 'AIR_FORCE_COMMAND' && e.owner === owner).length;
        } else {
          factoryCount = this.state.entities.filter(e => (e.subType === 'WAR_FACTORY' || e.subType === 'ALLIED_WAR_FACTORY') && e.owner === owner).length;
        }
      } else if (category === 'BUILDINGS' || category === 'DEFENSE') {
        factoryCount = this.state.entities.filter(e => (e.subType === 'CONSTRUCTION_YARD' || e.subType === 'ALLIED_CONSTRUCTION_YARD') && e.owner === owner).length;
      }
      
      let powerMultiplier = 1;
      if (owner === 'PLAYER' && this.state.power < this.state.powerConsumption) {
        powerMultiplier = 0.5; // 50% slower if low power
      }
      
      const speedMultiplier = Math.max(1, factoryCount) * powerMultiplier;
      const timeDelta = dt * 16.67 * speedMultiplier;
      
      item.progress = Math.min(100, item.progress + (timeDelta / item.time) * 100);
    });
  });
}
