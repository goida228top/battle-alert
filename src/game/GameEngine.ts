
import { Entity, GameState, Vector2, UnitType, BuildingType, Faction, Country } from './types';
import { updateSpecialAbilities } from "./systems/updateSpecialAbilities";
import { useIronCurtainAI } from "./systems/useIronCurtainAI";
import { useSpyPlaneAI } from "./systems/useSpyPlaneAI";
import { useParatroopersAI } from "./systems/useParatroopersAI";
import { useNuclearStrikeAI } from "./systems/useNuclearStrikeAI";
import { updateProjectiles } from "./systems/updateProjectiles";
import { updateEffects } from "./systems/updateEffects";
import { updateProduction } from "./systems/updateProduction";
import { updateVisibility } from "./systems/updateVisibility";
import { updateHarvester } from "./systems/updateHarvester";
import { updateCombat } from "./systems/updateCombat";
import { updateAI } from "./systems/updateAI";
import { placeBuildingAt } from "./systems/placeBuildingAt";
import { produceUnitAt } from "./systems/produceUnitAt";
import { updateResources } from "./systems/updateResources";
import { updateCrates } from "./systems/updateCrates";
import { checkWinLoss } from "./systems/checkWinLoss";
import { sellBuilding } from "./systems/sellBuilding";
import { repairBuilding } from "./systems/repairBuilding";
import { placeBuilding } from "./systems/placeBuilding";
import { getCategory } from "./systems/getCategory";
import { getCost } from "./systems/getCost";
import { getBuildTime } from "./systems/getBuildTime";

// New system imports
import { initGame } from "./systems/initGame";
import { calculatePath } from "./systems/calculatePath";
import { update } from "./systems/update";
import { useIronCurtain } from "./systems/useIronCurtain";
import { useChronosphere } from "./systems/useChronosphere";
import { executeChronosphereTeleport } from "./systems/executeChronosphereTeleport";
import { useWeatherStorm } from "./systems/useWeatherStorm";
import { useSpyPlane } from "./systems/useSpyPlane";
import { useParatroopers } from "./systems/useParatroopers";
import { useNuclearStrike } from "./systems/useNuclearStrike";
import { getPrerequisites } from "./systems/getPrerequisites";
import { isUnlocked } from "./systems/isUnlocked";
import { startProduction } from "./systems/startProduction";
import { handleMouseDown } from "./systems/handleMouseDown";
import { handleMouseMove } from "./systems/handleMouseMove";
import { handleMouseUp } from "./systems/handleMouseUp";
import { startPlacing } from "./systems/startPlacing";
import { deployMCV } from "./systems/deployMCV";
import { produceUnit } from "./systems/produceUnit";
import { screenToWorld } from "./systems/screenToWorld";
import { resetGame } from "./systems/resetGame";

export class GameEngine {
  state!: GameState;
  private lastUpdate: number = 0;
  private aiBuildOrder: BuildingType[] = [
    'POWER_PLANT', 'ORE_REFINERY', 'BARRACKS', 'SENTRY_GUN', 
    'WAR_FACTORY', 'NAVAL_YARD', 'RADAR', 'TESLA_COIL', 'SERVICE_DEPOT', 
    'BATTLE_LAB', 'ORE_PURIFIER', 'FLAK_CANNON', 'INDUSTRIAL_PLANT',
    'PSYCHIC_SENSOR', 'CLONING_VATS', 'NUCLEAR_REACTOR', 'IRON_CURTAIN', 'NUCLEAR_SILO',
    'SOVIET_WALL', 'BATTLE_BUNKER'
  ];
  public aiNextBuildTime: number = 0;
  public aiAttackTime: number = 0;

  public aiKnownPlayerBase: Vector2 | null = null;
  public aiScoutTime: number = 0;

  public playerFaction: Faction = 'FEDERATION';
  public playerCountry: Country = 'RUSSIA';

  constructor(faction: Faction = 'FEDERATION', country: Country = 'RUSSIA') {
    this.playerFaction = faction;
    this.playerCountry = country;
    this.initGame();
  }

  public resetGame(faction: Faction, country: Country, mapId: string = 'RIVER_DIVIDE') {
    return resetGame.call(this, faction, country, mapId);
  }

  public initGame(mapId: string = 'RIVER_DIVIDE') {
    return initGame.call(this, mapId);
  }

  public screenToWorld(pos: Vector2): Vector2 {
    return screenToWorld.call(this, pos);
  }

  public calculatePath(start: Vector2, end: Vector2): Vector2[] {
    return calculatePath.call(this, start, end);
  }

  public update(timestamp: number) {
    return update.call(this, timestamp);
  }

  public updateSpecialAbilities(timestamp: number) {
    return updateSpecialAbilities.call(this, timestamp);
  }

  public useIronCurtainAI(targetPos: Vector2) {
    return useIronCurtainAI.call(this, targetPos);
  }

  public useSpyPlaneAI(targetPos: Vector2) {
    return useSpyPlaneAI.call(this, targetPos);
  }

  public useParatroopersAI(targetPos: Vector2) {
    return useParatroopersAI.call(this, targetPos);
  }

  public useNuclearStrikeAI(targetPos: Vector2) {
    return useNuclearStrikeAI.call(this, targetPos);
  }

  public useIronCurtain(targetPos: Vector2) {
    return useIronCurtain.call(this, targetPos);
  }

  public useChronosphere(targetPos: Vector2) {
    return useChronosphere.call(this, targetPos);
  }

  public executeChronosphereTeleport(targetPos: Vector2) {
    return executeChronosphereTeleport.call(this, targetPos);
  }

  public useWeatherStorm(targetPos: Vector2) {
    return useWeatherStorm.call(this, targetPos);
  }

  public useSpyPlane(targetPos: Vector2) {
    return useSpyPlane.call(this, targetPos);
  }

  public useParatroopers(targetPos: Vector2) {
    return useParatroopers.call(this, targetPos);
  }

  public useNuclearStrike(targetPos: Vector2) {
    return useNuclearStrike.call(this, targetPos);
  }

  public getPrerequisites(type: string): string[] {
    return getPrerequisites.call(this, type);
  }

  public isUnlocked(type: string, owner: 'PLAYER' | 'AI'): boolean {
    return isUnlocked.call(this, type, owner);
  }

  public startProduction(subType: UnitType | BuildingType, owner: 'PLAYER' | 'AI' = 'PLAYER') {
    return startProduction.call(this, subType, owner);
  }

  public getCost(type: string): number {
    return getCost.call(this, type);
  }

  public getBuildTime(type: string): number {
    return getBuildTime.call(this, type);
  }

  public updateVisibility() {
    return updateVisibility.call(this);
  }

  public updateHarvester(harvester: Entity) {
    return updateHarvester.call(this, harvester);
  }

  public updateCombat(entity: Entity, dt: number, timestamp: number) {
    return updateCombat.call(this, entity, dt, timestamp);
  }

  public updateAI(timestamp: number) {
    return updateAI.call(this, timestamp);
  }

  public placeBuildingAt(pos: Vector2, type: BuildingType, owner: 'PLAYER' | 'AI') {
    return placeBuildingAt.call(this, pos, type, owner);
  }

  public produceUnitAt(producer: Entity, type: UnitType, owner: 'PLAYER' | 'AI') {
    return produceUnitAt.call(this, producer, type, owner);
  }

  public updateCrates(dt: number, timestamp: number) {
    return updateCrates.call(this, dt, timestamp);
  }

  public updateResources(dt: number) {
    return updateResources.call(this, dt);
  }

  public checkWinLoss() {
    return checkWinLoss.call(this);
  }

  public handleMouseDown(pos: Vector2, isRightClick: boolean, isCtrlKey: boolean = false) {
    return handleMouseDown.call(this, pos, isRightClick, isCtrlKey);
  }

  public sellBuilding(building: any) {
    return sellBuilding.call(this, building);
  }

  public repairBuilding(building: any): boolean {
    return repairBuilding.call(this, building);
  }

  public handleMouseMove(pos: Vector2) {
    return handleMouseMove.call(this, pos);
  }

  public handleMouseUp() {
    return handleMouseUp.call(this);
  }

  public startPlacing(type: BuildingType) {
    return startPlacing.call(this, type);
  }

  public deployMCV(mcvId: string) {
    return deployMCV.call(this, mcvId);
  }

  public produceUnit(type: UnitType) {
    return produceUnit.call(this, type);
  }

  public placeBuilding(pos: Vector2) {
    return placeBuilding.call(this, pos);
  }

  // Helper methods for other systems
  public getCategory(type: string) {
    return getCategory.call(this, type);
  }

  public updateProjectiles(dt: number, timestamp: number) {
    return updateProjectiles.call(this, dt, timestamp);
  }

  public updateEffects(timestamp: number) {
    return updateEffects.call(this, timestamp);
  }

  public updateProduction(timestamp: number, dt: number) {
    return updateProduction.call(this, timestamp, dt);
  }
}
