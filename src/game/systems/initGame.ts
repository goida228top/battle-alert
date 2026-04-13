
import { Entity, GameState, TileType, Faction, Country, MapTheme, Bridge, Vector2 } from '../types';

export function initGame(this: any, mapId: string = 'RIVER_DIVIDE') {
  const mapWidth = 100;
  const mapHeight = 60;
  const tiles: TileType[][] = [];
  let theme: MapTheme = 'TEMPERATE';
  let bridges: Bridge[] = [];
  let patches: {x: number, y: number}[] = [];
  let playerStart = { x: 400, y: 400 };
  let aiStart = { x: (mapWidth - 10) * 40, y: (mapHeight - 10) * 40 };
  
  if (mapId === 'RIVER_DIVIDE') {
    theme = 'TEMPERATE';
    for (let y = 0; y < mapHeight; y++) {
      const row: TileType[] = [];
      for (let x = 0; x < mapWidth; x++) {
        const riverX = Math.floor(mapWidth / 2);
        if (x === riverX - 1) {
          row.push('GRASS_TO_WATER');
        } else if (x === riverX || x === riverX + 1) {
          row.push('WATER');
        } else if (x === riverX + 2) {
          row.push('WATER_TO_GRASS');
        } else {
          row.push('GRASS');
        }
      }
      tiles.push(row);
    }
    bridges = [
      { x: Math.floor(mapWidth / 2) - 1, y: Math.floor(mapHeight / 4), width: 4, height: 2 },
      { x: Math.floor(mapWidth / 2) - 1, y: Math.floor(mapHeight * 3 / 4), width: 4, height: 2 }
    ];
    patches = [
      { x: 10, y: 10 }, { x: 20, y: 30 }, { x: 30, y: 15 },
      { x: mapWidth - 20, y: mapHeight - 20 }, { x: mapWidth - 30, y: mapHeight - 40 }, { x: mapWidth - 40, y: mapHeight - 25 },
    ];
  } else if (mapId === 'DESERT_OASIS') {
    theme = 'DESERT';
    for (let y = 0; y < mapHeight; y++) {
      const row: TileType[] = [];
      for (let x = 0; x < mapWidth; x++) {
        // Oasis in the middle
        const distToCenter = Math.hypot(x - mapWidth/2, y - mapHeight/2);
        if (distToCenter < 6) {
          row.push('WATER');
        } else if (distToCenter < 8) {
          row.push('GRASS_TO_WATER'); 
        } else {
          row.push('GRASS');
        }
      }
      tiles.push(row);
    }
    bridges = [];
    patches = [
      { x: 15, y: 15 }, { x: 15, y: mapHeight - 15 }, { x: mapWidth - 15, y: 15 }, { x: mapWidth - 15, y: mapHeight - 15 },
      { x: mapWidth/2 - 10, y: mapHeight/2 }, { x: mapWidth/2 + 10, y: mapHeight/2 }
    ];
    playerStart = { x: 400, y: 400 };
    aiStart = { x: (mapWidth - 10) * 40, y: (mapHeight - 10) * 40 };
  } else if (mapId === 'SNOWY_PASS') {
    theme = 'SNOW';
    for (let y = 0; y < mapHeight; y++) {
      const row: TileType[] = [];
      for (let x = 0; x < mapWidth; x++) {
        const riverY = Math.floor(mapHeight / 2);
        if (y === riverY - 1) {
          row.push('GRASS_TO_WATER');
        } else if (y === riverY || y === riverY + 1) {
          row.push('WATER');
        } else if (y === riverY + 2) {
          row.push('WATER_TO_GRASS');
        } else {
          row.push('GRASS');
        }
      }
      tiles.push(row);
    }
    bridges = [
      { x: Math.floor(mapWidth / 4), y: Math.floor(mapHeight / 2) - 1, width: 2, height: 4 },
      { x: Math.floor(mapWidth * 3 / 4), y: Math.floor(mapHeight / 2) - 1, width: 2, height: 4 }
    ];
    patches = [
      { x: 20, y: 10 }, { x: mapWidth - 20, y: 10 }, { x: mapWidth / 2, y: 15 },
      { x: 20, y: mapHeight - 10 }, { x: mapWidth - 20, y: mapHeight - 10 }, { x: mapWidth / 2, y: mapHeight - 15 },
    ];
    playerStart = { x: (mapWidth / 2) * 40, y: 400 }; // Top middle
    aiStart = { x: (mapWidth / 2) * 40, y: (mapHeight - 10) * 40 }; // Bottom middle
  }

  const visibility: number[][] = [];
  for (let y = 0; y < mapHeight; y++) {
    visibility.push(new Array(mapWidth).fill(0));
  }

  patches.forEach(p => {
    for (let dy = 0; dy < 2; dy++) {
      for (let dx = 0; dx < 3; dx++) {
        const tx = p.x + dx;
        const ty = p.y + dy;
        if (tiles[ty] && tiles[ty][tx] === 'GRASS') {
          tiles[ty][tx] = 'ORE';
        }
      }
    }
  });

  const isPlayerAllied = this.playerFaction === 'COALITION';
  const isAiAllied = Math.random() > 0.5;

  const oilDerricks: Entity[] = [
    {
      id: 'oil-derrick-1',
      type: 'BUILDING',
      subType: 'OIL_DERRICK',
      position: { x: (mapWidth * 40) / 2 - 100, y: (mapHeight * 40) / 2 },
      health: 1000,
      maxHealth: 1000,
      owner: 'NEUTRAL',
      size: 50,
    },
    {
      id: 'oil-derrick-2',
      type: 'BUILDING',
      subType: 'OIL_DERRICK',
      position: { x: (mapWidth * 40) / 2 + 100, y: (mapHeight * 40) / 2 },
      health: 1000,
      maxHealth: 1000,
      owner: 'NEUTRAL',
      size: 50,
    }
  ];

  this.state = {
    entities: [
      {
        id: 'initial-mcv',
        type: 'UNIT',
        subType: isPlayerAllied ? 'ALLIED_MCV' : 'MCV',
        position: playerStart,
        health: 3000,
        maxHealth: 3000,
        owner: 'PLAYER',
        size: 40,
        speed: 1.5,
        rotation: 0,
      },
      {
        id: 'ai-mcv',
        type: 'UNIT',
        subType: isAiAllied ? 'ALLIED_MCV' : 'MCV',
        position: aiStart,
        health: 3000,
        maxHealth: 3000,
        owner: 'AI',
        size: 40,
        speed: 1.5,
        rotation: Math.PI,
      },
      ...oilDerricks
    ],
    projectiles: [],
    credits: 10000,
    aiCredits: 10000,
    effects: [],
    moveMarkers: [],
    crates: [],
    power: 100,
    powerConsumption: 0,
    selectionBox: null,
    placingBuilding: null,
    sidebarTab: 'BUILDINGS',
    interactionMode: 'DEFAULT',
    productionQueue: [],
    aiProductionQueue: [],
    camera: {
      x: -playerStart.x + window.innerWidth / 2,
      y: -playerStart.y + window.innerHeight / 2,
      zoom: 1,
    },
    map: {
      tiles,
      tileSize: 40,
      width: mapWidth,
      height: mapHeight,
      bridges,
      visibility,
      theme,
    },
    specialAbilities: {
      IRON_CURTAIN: { ready: false, lastUsed: 0, cooldown: 180000 },
      NUCLEAR_SILO: { ready: false, lastUsed: 0, cooldown: 300000 },
      SPY_PLANE: { ready: false, lastUsed: 0, cooldown: 120000 },
      PARATROOPERS: { ready: false, lastUsed: 0, cooldown: 150000 },
      CHRONOSPHERE: { ready: false, lastUsed: 0, cooldown: 180000 },
      WEATHER_DEVICE: { ready: false, lastUsed: 0, cooldown: 300000 },
    },
    aiSpecialAbilities: {
      IRON_CURTAIN: { ready: false, lastUsed: 0, cooldown: 180000 },
      NUCLEAR_SILO: { ready: false, lastUsed: 0, cooldown: 300000 },
      SPY_PLANE: { ready: false, lastUsed: 0, cooldown: 120000 },
      PARATROOPERS: { ready: false, lastUsed: 0, cooldown: 150000 },
      CHRONOSPHERE: { ready: false, lastUsed: 0, cooldown: 180000 },
      WEATHER_DEVICE: { ready: false, lastUsed: 0, cooldown: 300000 },
    },
  };
}
