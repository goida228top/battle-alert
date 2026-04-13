import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './game/GameEngine';
import { BuildingType, GameState, Vector2 } from './game/types';
import { getBuildingDimensions } from './game/systems/getBuildingDimensions';
import { FogOfWar } from './game/systems/FogOfWar';
import { Zap, Shield, Factory, Coins, MousePointer2, Users, Truck, Wrench, DollarSign, XCircle, Lock, Radar, Activity, Crosshair, Skull, Target, Wind, Layers, ShieldAlert, Bomb, Cpu, Anchor, Waves, Square, User, Car } from 'lucide-react';
import { MainMenu } from './components/MainMenu';
import { SkirmishSetup } from './components/SkirmishSetup';
import { GameOverScreen } from './components/GameOverScreen';
import { BuildButton } from './components/BuildButton';
import { GameHUD } from './components/GameHUD';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine>(new GameEngine());
  const [gameState, setGameState] = useState<GameState>(engineRef.current.state);
  const texturesRef = useRef<Record<string, HTMLImageElement | HTMLCanvasElement>>({});
  const texturesLoadedCountRef = useRef<number>(0);
  const cachedMapCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fogOfWarRef = useRef<FogOfWar>(new FogOfWar());
  const requestRef = useRef<number>(0);
  const [appState, setAppState] = useState<'MENU' | 'SKIRMISH_SETUP' | 'PLAYING'>('MENU');
  const [selectedFaction, setSelectedFaction] = useState<'FEDERATION' | 'COALITION'>('FEDERATION');
  const [selectedCountry, setSelectedCountry] = useState<'RUSSIA' | 'CUBA' | 'LIBYA' | 'IRAQ' | 'AMERICA' | 'BRITAIN' | 'FRANCE' | 'GERMANY' | 'KOREA'>('RUSSIA');
  const [selectedMap, setSelectedMap] = useState<string>('RIVER_DIVIDE');
  const mousePosRef = useRef<Vector2 | null>(null);

  useEffect(() => {
    const loadTexture = (name: string, url: string) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        console.log(`Texture loaded: ${name} from ${url}`);
        texturesRef.current = { ...texturesRef.current, [name]: img };
        texturesLoadedCountRef.current += 1;
      };
      img.onerror = () => {
        console.error(`Failed to load texture: ${name} from ${url}. Make sure the file exists and is a valid image.`);
      };
    };

    // Local textures - Put your .png files in /public/assets/
    loadTexture('GRASS', '/assets/grass.png');
    loadTexture('WATER', '/assets/water.png');
    loadTexture('GRASS_TO_WATER', '/assets/grasstowater.png');
    loadTexture('DESERT_GRASS', '/assets/desert_grass.png');
    loadTexture('DESERT_WATER', '/assets/desert_water.png');
    loadTexture('DESERT_GRASS_TO_WATER', '/assets/desert_grasstowater.png');
    loadTexture('SNOW_GRASS', '/assets/snow_grass.png');
    loadTexture('SNOW_WATER', '/assets/snow_water.png');
    loadTexture('SNOW_GRASS_TO_WATER', '/assets/snow_grasstowater.png');
    loadTexture('BRIDGE', '/assets/most.png');
    loadTexture('BASE_CIRCLE', '/assets/krugpeska.png');
    loadTexture('ROAD', '/assets/sandroad.png');
    loadTexture('ROAD_CORNER', '/assets/sandugol.png');
    loadTexture('ORE', '/assets/goldore.png');
    loadTexture('SOVIET_MCV', '/assets/soviet_mcv.png');
    loadTexture('SOVIET_BASE', '/assets/soviet_base.png');
    loadTexture('POWER_PLANT', '/assets/power_plant.png');
    loadTexture('ORE_REFINERY', '/assets/refinery.png');
    loadTexture('BARRACKS', '/assets/barracks.png');
    loadTexture('WAR_FACTORY', '/assets/war_factory.png');
    loadTexture('TANK', '/assets/tank.png');
    loadTexture('HARVESTER', '/assets/harvester.png');
    loadTexture('SOLDIER', '/assets/soldier.png');
    loadTexture('CRATE', '/assets/crate.png');
    loadTexture('OIL_DERRICK', '/assets/oil_derrick.png');
  }, []);

  const update = (time: number) => {
    engineRef.current.update(time);
    setGameState({ ...engineRef.current.state });
    draw();
    requestRef.current = requestAnimationFrame(update);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { camera, map } = gameState;

    // Clear with water color
    ctx.fillStyle = map.theme === 'DESERT' ? '#4682b4' : map.theme === 'SNOW' ? '#add8e6' : '#00008b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Enable Smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.save();
    // Apply camera transform
    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.zoom, camera.zoom);

    // Render Tiles with Culling
    const { tileSize: mapTileSize, tiles, width: mapWidthVal, height: mapHeightVal, visibility } = map;

    // Draw infinite water background (or at least large enough)
    ctx.fillStyle = map.theme === 'DESERT' ? '#4682b4' : map.theme === 'SNOW' ? '#add8e6' : '#00008b';
    ctx.fillRect(-2000, -2000, mapWidthVal * mapTileSize + 4000, mapHeightVal * mapTileSize + 4000);
    
    // --- MAP CACHING LOGIC ---
    if (!cachedMapCanvasRef.current || 
        cachedMapCanvasRef.current.width !== mapWidthVal * mapTileSize || 
        cachedMapCanvasRef.current.getAttribute('data-textures') !== String(texturesLoadedCountRef.current)) {
      
      const cacheCanvas = document.createElement('canvas');
      cacheCanvas.width = mapWidthVal * mapTileSize;
      cacheCanvas.height = mapHeightVal * mapTileSize;
      const cacheCtx = cacheCanvas.getContext('2d', { alpha: false });
      
      if (cacheCtx) {
        // Fill cache with water color first
        cacheCtx.fillStyle = map.theme === 'DESERT' ? '#4682b4' : map.theme === 'SNOW' ? '#add8e6' : '#00008b';
        cacheCtx.fillRect(0, 0, cacheCanvas.width, cacheCanvas.height);

        for (let y = 0; y < mapHeightVal; y++) {
          for (let x = 0; x < mapWidthVal; x++) {
            const type = tiles[y][x];
            
            let textureName = type === 'WATER_TO_GRASS' ? 'GRASS_TO_WATER' : type;
            if (map.theme === 'DESERT' && type !== 'ORE') {
              textureName = 'DESERT_' + textureName;
            } else if (map.theme === 'SNOW' && type !== 'ORE') {
              textureName = 'SNOW_' + textureName;
            }
            const texture = texturesRef.current[textureName];

            let grassTextureName = 'GRASS';
            if (map.theme === 'DESERT') grassTextureName = 'DESERT_GRASS';
            if (map.theme === 'SNOW') grassTextureName = 'SNOW_GRASS';
            const grassTexture = texturesRef.current[grassTextureName];

            // If it's ORE, draw grass background first
            if (type === 'ORE') {
              if (grassTexture && grassTexture.width > 0) {
                cacheCtx.drawImage(grassTexture, x * mapTileSize, y * mapTileSize, mapTileSize + 0.5, mapTileSize + 0.5);
              } else {
                cacheCtx.fillStyle = map.theme === 'DESERT' ? '#d2b48c' : map.theme === 'SNOW' ? '#ffffff' : '#2d5a27'; // Grass fallback
                cacheCtx.fillRect(x * mapTileSize, y * mapTileSize, mapTileSize + 0.5, mapTileSize + 0.5);
              }

              // Draw a portion of the 3x2 texture for each tile in the patch
              if (texture && texture.width > 0) {
                // Determine horizontal position in 3x2 patch
                let horizontalPos = 0; // 0: Left, 1: Middle, 2: Right
                const hasLeft = x > 0 && tiles[y][x - 1] === 'ORE';
                const hasRight = x < mapWidthVal - 1 && tiles[y][x + 1] === 'ORE';
                
                if (!hasLeft) horizontalPos = 0;
                else if (hasRight) horizontalPos = 1;
                else horizontalPos = 2;

                // Determine vertical position in 3x2 patch
                const isBottom = y > 0 && tiles[y - 1][x] === 'ORE';
                
                const sourceX = (horizontalPos * texture.width) / 3;
                const sourceY = isBottom ? texture.height / 2 : 0;
                
                cacheCtx.drawImage(
                  texture,
                  sourceX, sourceY, texture.width / 3, texture.height / 2, // Source
                  x * mapTileSize, y * mapTileSize, mapTileSize, mapTileSize           // Destination
                );
              }
            }
            
            if (texture && texture.width > 0 && type !== 'ORE') {
              // Use a tiny overlap (0.5px) to prevent seams
              if (type === 'GRASS_TO_WATER' || type === 'WATER_TO_GRASS') {
                cacheCtx.save();
                cacheCtx.translate(x * mapTileSize + mapTileSize / 2, y * mapTileSize + mapTileSize / 2);
                cacheCtx.rotate(type === 'GRASS_TO_WATER' ? -Math.PI / 2 : Math.PI / 2);
                cacheCtx.drawImage(texture, -mapTileSize / 2, -mapTileSize / 2, mapTileSize + 0.5, mapTileSize + 0.5);
                cacheCtx.restore();
              } else {
                cacheCtx.drawImage(texture, x * mapTileSize, y * mapTileSize, mapTileSize + 0.5, mapTileSize + 0.5);
              }
            } else if (type !== 'ORE') {
              // Fallback colors
              if (type === 'GRASS') cacheCtx.fillStyle = map.theme === 'DESERT' ? '#d2b48c' : map.theme === 'SNOW' ? '#ffffff' : '#2d5a27';
              else if (type === 'WATER') cacheCtx.fillStyle = map.theme === 'DESERT' ? '#4682b4' : map.theme === 'SNOW' ? '#add8e6' : '#00008b';
              else if (type === 'GRASS_TO_WATER' || type === 'WATER_TO_GRASS') cacheCtx.fillStyle = map.theme === 'DESERT' ? '#8b7355' : map.theme === 'SNOW' ? '#b0e0e6' : '#1a4a4a';
              cacheCtx.fillRect(x * mapTileSize, y * mapTileSize, mapTileSize + 0.5, mapTileSize + 0.5);
            } else if (type === 'ORE' && (!texture || texture.width === 0)) {
              // Gold fallback for ORE if texture is missing
              cacheCtx.fillStyle = '#ffd700';
              cacheCtx.fillRect(x * mapTileSize, y * mapTileSize, mapTileSize + 0.5, mapTileSize + 0.5);
            }
          }
        }

        // Render Bridges
        const bridgeTexture = texturesRef.current['BRIDGE'];
        if (bridgeTexture && bridgeTexture.width > 0) {
          gameState.map.bridges.forEach(bridge => {
            // Draw bridge as a single image to avoid stretching/tiling issues
            cacheCtx.drawImage(
              bridgeTexture,
              bridge.x * mapTileSize,
              bridge.y * mapTileSize,
              bridge.width * mapTileSize,
              bridge.height * mapTileSize
            );
          });
        }

        // Render Roads (Above grass, below base circles)
        const roadTexture = texturesRef.current['ROAD'];
        const cornerTexture = texturesRef.current['ROAD_CORNER'];
        if (roadTexture && roadTexture.width > 0) {
          // 1. Render Corners FIRST
          if (cornerTexture && cornerTexture.width > 0) {
            // Player corners
            [9, 25].forEach(y => {
              cacheCtx.save();
              cacheCtx.translate(6 * mapTileSize + mapTileSize / 2, y * mapTileSize + mapTileSize / 2);
              cacheCtx.rotate(Math.PI); 
              cacheCtx.drawImage(cornerTexture, -mapTileSize / 2, -mapTileSize / 2, mapTileSize, mapTileSize);
              cacheCtx.restore();
            });

            // AI corners
            [9, 25].forEach(y => {
              cacheCtx.save();
              cacheCtx.translate(52 * mapTileSize + mapTileSize / 2, y * mapTileSize + mapTileSize / 2);
              cacheCtx.rotate(Math.PI / 2); 
              cacheCtx.drawImage(cornerTexture, -mapTileSize / 2, -mapTileSize / 2, mapTileSize, mapTileSize);
              cacheCtx.restore();
            });
          }

          // 2. Render Straight Segments
          
          // Player side road
          // Vertical (from base center down to bottom bridge)
          for (let y = 5; y <= 25; y++) {
            cacheCtx.save();
            cacheCtx.translate(6 * mapTileSize + mapTileSize / 2, y * mapTileSize + mapTileSize / 2);
            cacheCtx.rotate(Math.PI / 2);
            cacheCtx.drawImage(roadTexture, -mapTileSize, -mapTileSize / 2, 2 * mapTileSize, mapTileSize);
            cacheCtx.restore();
          }
          // Horizontal roads to both bridges
          [9, 25].forEach(y => {
            for (let x = 6.5; x < 28; x++) {
              cacheCtx.drawImage(roadTexture, x * mapTileSize, y * mapTileSize, 2 * mapTileSize, mapTileSize);
            }
          });

          // AI side road
          // Vertical (from top bridge down to base center)
          for (let y = 9; y <= 27; y++) {
            cacheCtx.save();
            cacheCtx.translate(52 * mapTileSize + mapTileSize / 2, y * mapTileSize + mapTileSize / 2);
            cacheCtx.rotate(Math.PI / 2);
            cacheCtx.drawImage(roadTexture, -mapTileSize, -mapTileSize / 2, 2 * mapTileSize, mapTileSize);
            cacheCtx.restore();
          }
          // Horizontal roads to both bridges
          [9, 25].forEach(y => {
            for (let x = 32; x <= 51.5; x++) {
              cacheCtx.drawImage(roadTexture, x * mapTileSize, y * mapTileSize, 2 * mapTileSize, mapTileSize);
            }
          });
        }

        // Render Base Circles
        const baseCircleTexture = texturesRef.current['BASE_CIRCLE'];
        if (baseCircleTexture && baseCircleTexture.width > 0) {
          // Player Base (7x7)
          cacheCtx.drawImage(
            baseCircleTexture,
            2.5 * mapTileSize,
            1.5 * mapTileSize,
            7 * mapTileSize,
            7 * mapTileSize
          );

          // AI Base (7x7)
          cacheCtx.drawImage(
            baseCircleTexture,
            48.5 * mapTileSize,
            23.5 * mapTileSize,
            7 * mapTileSize,
            7 * mapTileSize
          );
        }
      }
      
      cacheCanvas.setAttribute('data-textures', String(texturesLoadedCountRef.current));
      cachedMapCanvasRef.current = cacheCanvas;
    }

    // Draw the cached map
    if (cachedMapCanvasRef.current) {
      ctx.drawImage(cachedMapCanvasRef.current, 0, 0);
    }

    // Render highly optimized Fog of War
    fogOfWarRef.current.render(ctx, visibility, map);

    // Crates
    gameState.crates.forEach(crate => {
      const tx = Math.floor(crate.position.x / mapTileSize);
      const ty = Math.floor(crate.position.y / mapTileSize);
      const vis = visibility[ty]?.[tx];
      if (vis === 0) return; // Hide in shroud

      ctx.save();
      ctx.translate(crate.position.x, crate.position.y);
      
      const crateTexture = texturesRef.current['CRATE'];
      if (crateTexture && crateTexture.width > 0) {
        ctx.drawImage(crateTexture, -15, -15, 30, 30);
      } else {
        // Fallback crate drawing
        ctx.fillStyle = '#92400e'; // Brown
        ctx.fillRect(-12, -12, 24, 24);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2;
        ctx.strokeRect(-12, -12, 24, 24);
        // Question mark
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('?', 0, 6);
      }
      
      // Pulsing effect
      const pulse = Math.sin(performance.now() / 200) * 0.2 + 1;
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 20 * pulse, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    });

    // Entities
    gameState.entities.forEach(entity => {
      const tx = Math.floor(entity.position.x / mapTileSize);
      const ty = Math.floor(entity.position.y / mapTileSize);
      const vis = visibility[ty]?.[tx];
      
      if (vis !== 2 && entity.owner !== 'PLAYER') return; // Hide enemies in fog

      ctx.save();
      ctx.translate(entity.position.x, entity.position.y);

      if (entity.type === 'UNIT') {
        // Apply rotation for units
        if (entity.rotation !== undefined) {
          ctx.rotate(entity.rotation + Math.PI / 2); // Adjust for tank facing up by default
        }

        const textureKey = entity.subType === 'MCV' ? 'SOVIET_MCV' : entity.subType;
        const unitTexture = texturesRef.current[textureKey];
        if (unitTexture && unitTexture.width > 0) {
          ctx.drawImage(unitTexture, -entity.size/2, -entity.size/2, entity.size, entity.size);
        } else {
          // Fallback
          ctx.fillStyle = entity.owner === 'PLAYER' ? '#3b82f6' : (entity.owner === 'AI' ? '#ef4444' : '#6b7280');
          ctx.fillRect(-entity.size/2, -entity.size/2, entity.size, entity.size);
          
          if (entity.subType === 'TANK' || entity.subType === 'RHINO_TANK') {
            // Turret/Barrel for tanks
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-2, -entity.size/2 - 5, 4, 12);
          } else if (entity.subType === 'APOCALYPSE_TANK') {
            // Double barrel
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-4, -entity.size/2 - 6, 3, 14);
            ctx.fillRect(1, -entity.size/2 - 6, 3, 14);
          } else if (entity.subType === 'V3_LAUNCHER') {
            // Rocket on top
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(-3, -entity.size/2 - 8, 6, 16);
          } else if (entity.subType === 'TERROR_DRONE') {
            // Spider legs
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 2;
            for (let i = 0; i < 4; i++) {
              ctx.rotate(Math.PI / 2);
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(entity.size/2 + 2, entity.size/2 + 2);
              ctx.stroke();
            }
          } else if (entity.subType === 'TESLA_TROOPER') {
            ctx.fillStyle = '#60a5fa';
            ctx.beginPath();
            ctx.arc(0, 0, entity.size/3, 0, Math.PI * 2);
            ctx.fill();
          } else if (entity.subType === 'ATTACK_DOG') {
            ctx.fillStyle = '#78350f';
            ctx.fillRect(-entity.size/2, -entity.size/4, entity.size, entity.size/2);
          } else if (entity.subType === 'DESOLATOR') {
            ctx.fillStyle = '#4ade80';
            ctx.beginPath();
            ctx.arc(0, 0, entity.size/3, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#166534';
            ctx.stroke();
          } else if (entity.subType === 'TERRORIST') {
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.arc(0, 0, entity.size/3, 0, Math.PI * 2);
            ctx.fill();
          } else if (entity.subType === 'TESLA_TANK') {
            ctx.fillStyle = '#1e3a8a';
            ctx.fillRect(-entity.size/2, -entity.size/2, entity.size, entity.size);
            ctx.fillStyle = '#60a5fa';
            ctx.beginPath();
            ctx.arc(0, 0, entity.size/4, 0, Math.PI * 2);
            ctx.fill();
          } else if (entity.subType === 'SIEGE_CHOPPER') {
            ctx.fillStyle = '#475569';
            ctx.fillRect(-entity.size/2, -entity.size/4, entity.size, entity.size/2);
            // Propeller
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2;
            const angle = (performance.now() / 50) % (Math.PI * 2);
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * entity.size/2, Math.sin(angle) * entity.size/2);
            ctx.lineTo(-Math.cos(angle) * entity.size/2, -Math.sin(angle) * entity.size/2);
            ctx.stroke();
          } else if (entity.subType === 'TYPHOON_SUB') {
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.ellipse(0, 0, entity.size/2, entity.size/4, 0, 0, Math.PI * 2);
            ctx.fill();
          } else if (entity.subType === 'SEA_SCORPION') {
            ctx.fillStyle = '#334155';
            ctx.beginPath();
            ctx.moveTo(-entity.size/2, -entity.size/4);
            ctx.lineTo(entity.size/2, 0);
            ctx.lineTo(-entity.size/2, entity.size/4);
            ctx.closePath();
            ctx.fill();
          } else if (entity.subType === 'GIANT_SQUID') {
            ctx.fillStyle = '#ec4899';
            ctx.beginPath();
            ctx.arc(0, 0, entity.size/3, 0, Math.PI * 2);
            ctx.fill();
            // Tentacles
            ctx.strokeStyle = '#ec4899';
            for (let i = 0; i < 8; i++) {
              ctx.rotate(Math.PI / 4);
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(entity.size/2 + Math.sin(performance.now()/200 + i) * 5, 0);
              ctx.stroke();
            }
          } else if (entity.subType === 'DREADNOUGHT') {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-entity.size/2, -entity.size/4, entity.size, entity.size/2);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(0, -2, entity.size/2, 4); // Missile bay
          } else if (entity.subType === 'YURI' || entity.subType === 'YURI_PRIME') {
            ctx.fillStyle = entity.subType === 'YURI_PRIME' ? '#7e22ce' : '#c084fc'; // Darker Purple for Prime
            ctx.beginPath();
            ctx.arc(0, 0, entity.size/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = '8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(entity.subType === 'YURI_PRIME' ? 'Y+' : 'Y', 0, 3);
          } else if (entity.subType === 'CHRONO_COMMANDO' || entity.subType === 'PSI_COMMANDO') {
            ctx.fillStyle = entity.subType === 'CHRONO_COMMANDO' ? '#3b82f6' : '#a855f7';
            ctx.beginPath();
            ctx.arc(0, 0, entity.size/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = '8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(entity.subType === 'CHRONO_COMMANDO' ? 'CC' : 'PC', 0, 3);
          } else if (entity.subType === 'HOVER_TRANSPORT') {
            ctx.fillStyle = '#52525b';
            ctx.beginPath();
            ctx.ellipse(0, 0, entity.size/2, entity.size/3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#3f3f46';
            ctx.fillRect(-entity.size/4, -entity.size/6, entity.size/2, entity.size/3);
          }

          // Draw Veterancy Rank
          if (entity.rank) {
            ctx.fillStyle = '#fbbf24'; // Gold color for rank
            const rankY = -entity.size/2 - 8;
            if (entity.rank === 'VETERAN') {
              ctx.beginPath();
              ctx.moveTo(-4, rankY);
              ctx.lineTo(0, rankY - 4);
              ctx.lineTo(4, rankY);
              ctx.lineTo(2, rankY);
              ctx.lineTo(0, rankY - 2);
              ctx.lineTo(-2, rankY);
              ctx.fill();
            } else if (entity.rank === 'ELITE') {
              for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(-4, rankY - i*3);
                ctx.lineTo(0, rankY - 4 - i*3);
                ctx.lineTo(4, rankY - i*3);
                ctx.lineTo(2, rankY - i*3);
                ctx.lineTo(0, rankY - 2 - i*3);
                ctx.lineTo(-2, rankY - i*3);
                ctx.fill();
              }
            }
          }

          // Deployed Visuals
          if (entity.isDeployed) {
            if (entity.subType === 'GI') {
              // Draw sandbags around GI
              ctx.save();
              ctx.rotate(-entity.rotation! - Math.PI / 2); // Counter-rotate to keep sandbags static relative to world
              ctx.strokeStyle = '#78350f';
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.arc(0, 0, entity.size / 2 + 5, 0, Math.PI * 2);
              ctx.stroke();
              // Draw some "bags"
              for (let i = 0; i < 8; i++) {
                ctx.rotate(Math.PI / 4);
                ctx.fillStyle = '#92400e';
                ctx.fillRect(entity.size / 2, -5, 6, 10);
              }
              ctx.restore();
            } else if (entity.subType === 'SIEGE_CHOPPER') {
              // Draw landing legs
              ctx.fillStyle = '#334155';
              ctx.fillRect(-entity.size/2 - 5, -5, 5, 10);
              ctx.fillRect(entity.size/2, -5, 5, 10);
            }
          }
        }
      } else {
        // Building
        const dims = getBuildingDimensions(entity.subType as BuildingType);
        const width = dims.w * mapTileSize;
        const height = dims.h * mapTileSize;
        
        const bldgTexture = texturesRef.current[entity.subType === 'CONSTRUCTION_YARD' ? 'SOVIET_BASE' : entity.subType];
        if (bldgTexture && bldgTexture.width > 0) {
          ctx.drawImage(bldgTexture, -width/2, -height/2, width, height);
        } else {
          ctx.fillStyle = entity.owner === 'PLAYER' ? '#1e40af' : (entity.owner === 'AI' ? '#991b1b' : '#4b5563');
          if (entity.subType === 'SOVIET_WALL') ctx.fillStyle = '#4b5563';
          if (entity.subType === 'BATTLE_BUNKER') ctx.fillStyle = '#3f3f46';
          ctx.fillRect(-width/2, -height/2, width, height);
          ctx.strokeStyle = '#60a5fa';
          ctx.lineWidth = 2 / camera.zoom;
          ctx.strokeRect(-width/2, -height/2, width, height);
          
          if (entity.subType === 'TESLA_COIL') {
            ctx.fillStyle = '#60a5fa';
            ctx.beginPath();
            ctx.arc(0, 0, width/4, 0, Math.PI * 2);
            ctx.fill();
            // Rings
            ctx.strokeStyle = '#60a5fa';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, width/2.5, 0, Math.PI * 2);
            ctx.stroke();
          } else if (entity.subType === 'FLAK_CANNON') {
            ctx.fillStyle = '#475569';
            ctx.fillRect(-8, -8, 16, 16);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-2, -12, 4, 12);
          } else if (entity.subType === 'RADAR') {
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, width/3, 0, Math.PI * 2);
            ctx.stroke();
            // Dish
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(width/2, 0);
            ctx.stroke();
          } else if (entity.subType === 'OIL_DERRICK') {
            ctx.fillStyle = '#475569';
            ctx.fillRect(-width/2, -height/2, width, height);
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-width/4, -height/2 - 10, width/2, 10); // Top pump
            // Animated pump handle
            const pumpY = Math.sin(performance.now() / 500) * 5;
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, -height/2);
            ctx.lineTo(0, -height/2 - 15 + pumpY);
            ctx.stroke();
          }

          // Label for building type
          ctx.fillStyle = 'white';
          ctx.font = `${8 / camera.zoom}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText(entity.subType.replace('_', ' '), 0, 5);
        }
      }

      // Selection ring
      if (entity.selected) {
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2 / camera.zoom;
        ctx.setLineDash([2 / camera.zoom, 2 / camera.zoom]);
        ctx.beginPath();
        ctx.arc(0, 0, entity.size * 0.8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Rally Point Line
        if (entity.rallyPoint) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1 / camera.zoom;
          ctx.setLineDash([4 / camera.zoom, 4 / camera.zoom]);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(entity.rallyPoint.x - entity.position.x, entity.rallyPoint.y - entity.position.y);
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Draw Rally Point Marker
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.beginPath();
          ctx.arc(entity.rallyPoint.x - entity.position.x, entity.rallyPoint.y - entity.position.y, 3 / camera.zoom, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Health bar
      const healthWidth = entity.size;
      const currentHealthWidth = (entity.health / entity.maxHealth) * healthWidth;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(-healthWidth/2, -entity.size/2 - 12, healthWidth, 4 / camera.zoom);
      
      // Iron Curtain visual
      const timestamp = performance.now();
      const isInvulnerable = entity.invulnerableUntil && entity.invulnerableUntil > timestamp;
      
      ctx.fillStyle = isInvulnerable ? '#ef4444' : (entity.health / entity.maxHealth > 0.5 ? '#22c55e' : '#eab308');
      if (!isInvulnerable && entity.health / entity.maxHealth < 0.25) ctx.fillStyle = '#ef4444';
      ctx.fillRect(-healthWidth/2, -entity.size/2 - 12, currentHealthWidth, 4 / camera.zoom);

      if (isInvulnerable) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2 / camera.zoom;
        ctx.beginPath();
        ctx.arc(0, 0, entity.size * 0.7, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Selection Response Text
      if (entity.selectionResponse && entity.selectionResponseTime && timestamp - entity.selectionResponseTime < 2000) {
        const age = timestamp - entity.selectionResponseTime;
        const opacity = Math.min(1, 2 - age / 1000);
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform for text
        const screenX = entity.position.x * camera.zoom + camera.x;
        const screenY = entity.position.y * camera.zoom + camera.y;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        ctx.fillText(entity.selectionResponse, screenX, screenY - entity.size * camera.zoom - 20 - (age / 50));
        ctx.restore();
      }

      // Harvester load bar
      if (entity.subType === 'HARVESTER' && entity.harvestAmount !== undefined) {
        const loadWidth = entity.size;
        const currentLoadWidth = (entity.harvestAmount / 500) * loadWidth;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(-loadWidth/2, -entity.size/2 - 18, loadWidth, 3 / camera.zoom);
        ctx.fillStyle = '#eab308'; // Gold color
        ctx.fillRect(-loadWidth/2, -entity.size/2 - 18, currentLoadWidth, 3 / camera.zoom);
      }

      // Construction animation for buildings
      if (entity.type === 'BUILDING' && entity.constructionStartTime) {
        const constructionAge = performance.now() - entity.constructionStartTime;
        if (constructionAge < 2000) {
          const constructionProgress = constructionAge / 2000;
          ctx.fillStyle = 'rgba(50, 50, 50, 0.9)';
          // Draw a gray box that "shrinks" from top to bottom as building is built
          ctx.fillRect(-entity.size/2, -entity.size/2, entity.size, entity.size * (1 - constructionProgress));
          
          // Draw a progress bar on top
          ctx.fillStyle = '#4ade80';
          ctx.fillRect(-entity.size/2, -entity.size/2 - 5, entity.size * constructionProgress, 3);
        }
      }

      ctx.restore();
    });

    // Building Placement Ghost
    if (gameState.placingBuilding && mousePosRef.current) {
      const worldX = (mousePosRef.current.x - camera.x) / camera.zoom;
      const worldY = (mousePosRef.current.y - camera.y) / camera.zoom;
      
      const type = gameState.placingBuilding;
      const dims = getBuildingDimensions(type);
      
      // Calculate top-left tile based on mouse position
      const tx = Math.floor((worldX - (dims.w * mapTileSize) / 2) / mapTileSize);
      const ty = Math.floor((worldY - (dims.h * mapTileSize) / 2) / mapTileSize);

      // Calculate snapped center position
      const snappedX = (tx + dims.w / 2) * mapTileSize;
      const snappedY = (ty + dims.h / 2) * mapTileSize;

      // Draw Grid around placement area
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1 / camera.zoom;
      const gridRange = 8;
      for (let i = -gridRange; i <= gridRange; i++) {
        ctx.beginPath();
        ctx.moveTo(snappedX - gridRange * mapTileSize, snappedY + i * mapTileSize - (dims.h % 2 === 0 ? 0 : mapTileSize/2));
        ctx.lineTo(snappedX + gridRange * mapTileSize, snappedY + i * mapTileSize - (dims.h % 2 === 0 ? 0 : mapTileSize/2));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(snappedX + i * mapTileSize - (dims.w % 2 === 0 ? 0 : mapTileSize/2), snappedY - gridRange * mapTileSize);
        ctx.lineTo(snappedX + i * mapTileSize - (dims.w % 2 === 0 ? 0 : mapTileSize/2), snappedY + gridRange * mapTileSize);
        ctx.stroke();
      }
      ctx.restore();
      
      const width = dims.w * mapTileSize;
      const height = dims.h * mapTileSize;
      
      ctx.save();
      ctx.translate(snappedX, snappedY);
      ctx.globalAlpha = 0.5;
      
      // Check if placement is valid
      let isValid = true;
      
      for (let dy = 0; dy < dims.h; dy++) {
        for (let dx = 0; dx < dims.w; dx++) {
          const curX = tx + dx;
          const curY = ty + dy;
          
          if (curX >= 0 && curX < mapWidthVal && curY >= 0 && curY < mapHeightVal) {
            const tileType = gameState.map.tiles[curY][curX];
            if (tileType === 'WATER' || tileType === 'WATER_TO_GRASS' || tileType === 'GRASS_TO_WATER') {
              isValid = false;
            }
          } else {
            isValid = false;
          }
        }
      }

      if (isValid) {
        // Collision Check
        const collision = gameState.entities.find(e => {
          if (e.type !== 'BUILDING') return false;
          const eDims = getBuildingDimensions(e.subType as BuildingType);
          
          const rect1 = { left: tx, top: ty, right: tx + dims.w, bottom: ty + dims.h };
          const eTx = Math.floor((e.position.x - (eDims.w * mapTileSize) / 2) / mapTileSize);
          const eTy = Math.floor((e.position.y - (eDims.h * mapTileSize) / 2) / mapTileSize);
          const rect2 = { left: eTx, top: eTy, right: eTx + eDims.w, bottom: eTy + eDims.h };

          return !(rect1.right <= rect2.left || rect1.left >= rect2.right || rect1.bottom <= rect2.top || rect1.top >= rect2.bottom);
        });
        if (collision) isValid = false;
      }

      if (isValid) {
        // Proximity Check
        const friendlyBuildings = gameState.entities.filter(e => e.type === 'BUILDING' && e.owner === 'PLAYER');
        if (friendlyBuildings.length > 0) {
          const nearBuilding = friendlyBuildings.find(b => {
            const dist = Math.hypot(b.position.x - snappedX, b.position.y - snappedY);
            return dist < 400; 
          });
          if (!nearBuilding) isValid = false;
        }
      }
      
      ctx.fillStyle = isValid ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)';
      ctx.fillRect(-width/2, -height/2, width, height);
      ctx.strokeStyle = isValid ? '#22c55e' : '#ef4444';
      ctx.lineWidth = 3 / camera.zoom;
      ctx.strokeRect(-width/2, -height/2, width, height);
      
      ctx.restore();
    }

    // Special Ability Targeting Ghost
    if ((gameState.interactionMode === 'USE_IRON_CURTAIN' || gameState.interactionMode === 'USE_NUCLEAR_STRIKE' || gameState.interactionMode === 'USE_SPY_PLANE' || gameState.interactionMode === 'USE_PARATROOPERS' || gameState.interactionMode === 'USE_CHRONOSPHERE' || gameState.interactionMode === 'USE_WEATHER_STORM') && mousePosRef.current) {
      const worldX = (mousePosRef.current.x - camera.x) / camera.zoom;
      const worldY = (mousePosRef.current.y - camera.y) / camera.zoom;
      let radius = 150;
      if (gameState.interactionMode === 'USE_NUCLEAR_STRIKE' || gameState.interactionMode === 'USE_WEATHER_STORM') radius = 300;
      if (gameState.interactionMode === 'USE_SPY_PLANE') radius = 400;
      
      ctx.save();
      ctx.translate(worldX, worldY);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      
      let color = 'rgba(239, 68, 68, 0.2)';
      let strokeColor = '#ef4444';
      if (gameState.interactionMode === 'USE_NUCLEAR_STRIKE') { color = 'rgba(251, 191, 36, 0.2)'; strokeColor = '#fbbf24'; }
      if (gameState.interactionMode === 'USE_SPY_PLANE') { color = 'rgba(56, 189, 248, 0.2)'; strokeColor = '#38bdf8'; }
      if (gameState.interactionMode === 'USE_PARATROOPERS') { color = 'rgba(163, 230, 53, 0.2)'; strokeColor = '#a3e635'; }
      if (gameState.interactionMode === 'USE_CHRONOSPHERE') { color = 'rgba(168, 85, 247, 0.2)'; strokeColor = '#a855f7'; }
      if (gameState.interactionMode === 'USE_WEATHER_STORM') { color = 'rgba(56, 189, 248, 0.2)'; strokeColor = '#38bdf8'; }

      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2 / camera.zoom;
      ctx.stroke();
      
      // Crosshair
      ctx.beginPath();
      ctx.moveTo(-20, 0); ctx.lineTo(20, 0);
      ctx.moveTo(0, -20); ctx.lineTo(0, 20);
      ctx.stroke();
      
      ctx.restore();
    }

    // Projectiles
    gameState.projectiles.forEach(proj => {
      ctx.save();
      ctx.translate(proj.position.x, proj.position.y);
      if (proj.type === 'MISSILE') {
        // Draw missile
        const dx = proj.targetPosition ? proj.targetPosition.x - proj.position.x : 0;
        const dy = proj.targetPosition ? proj.targetPosition.y - proj.position.y : 0;
        const angle = Math.atan2(dy, dx);
        ctx.rotate(angle);
        ctx.fillStyle = '#cbd5e1'; // gray
        ctx.fillRect(-6, -2, 12, 4);
        ctx.fillStyle = '#ef4444'; // red tip
        ctx.fillRect(4, -2, 4, 4);
        // Rocket exhaust
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(-8, 0, 3 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (proj.type === 'CANNONBALL') {
        ctx.fillStyle = '#fcd34d'; // yellow/orange
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // Combat Effects
    gameState.effects.forEach(effect => {
      ctx.save();
      const age = (performance.now() - effect.startTime);
      const progress = Math.min(1, Math.max(0, age / effect.duration));
      
      if (effect.type === 'MUZZLE_FLASH') {
        ctx.translate(effect.position.x, effect.position.y);
        ctx.fillStyle = '#fcd34d';
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(0.1, 5 * (1 - progress)), 0, Math.PI * 2);
        ctx.fill();
      } else if (effect.type === 'TRACER' && effect.targetPosition) {
        ctx.strokeStyle = effect.color || '#fff';
        ctx.lineWidth = Math.max(0.1, 2 * (1 - progress));
        ctx.beginPath();
        ctx.moveTo(effect.position.x, effect.position.y);
        ctx.lineTo(effect.targetPosition.x, effect.targetPosition.y);
        ctx.stroke();
      } else if (effect.type === 'EXPLOSION') {
        ctx.translate(effect.position.x, effect.position.y);
        ctx.fillStyle = `rgba(239, 68, 68, ${0.8 * (1 - progress)})`;
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(0.1, 40 * progress), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(251, 191, 36, ${0.6 * (1 - progress)})`;
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(0.1, 20 * progress), 0, Math.PI * 2);
        ctx.fill();
      } else if (effect.type === 'MONEY_FLOAT') {
        ctx.translate(effect.position.x, effect.position.y - (progress * 40));
        ctx.fillStyle = `rgba(34, 197, 94, ${1 - progress})`;
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(effect.text || '', 0, 0);
      } else if (effect.type === 'SUPERWEAPON_STRIKE') {
        ctx.translate(effect.position.x, effect.position.y);
        // Draw a large warning circle and a beam from the sky
        ctx.strokeStyle = effect.color || '#fff';
        ctx.lineWidth = 2 / camera.zoom;
        ctx.beginPath();
        ctx.arc(0, 0, 300 * (1 - progress), 0, Math.PI * 2);
        ctx.stroke();

        // Beam
        const beamWidth = 20 * (1 - progress);
        const gradient = ctx.createLinearGradient(0, -1000, 0, 0);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, effect.color || '#fff');
        ctx.fillStyle = gradient;
        ctx.fillRect(-beamWidth / 2, -1000, beamWidth, 1000);
      }
      ctx.restore();
    });

    // Move Markers
    gameState.moveMarkers.forEach(marker => {
      ctx.save();
      const age = performance.now() - marker.startTime;
      const progress = age / 500;
      ctx.translate(marker.position.x, marker.position.y);
      ctx.strokeStyle = `rgba(34, 197, 94, ${1 - progress})`;
      ctx.lineWidth = 2;
      const s = 10 * (1 + progress);
      ctx.beginPath();
      ctx.moveTo(-s, 0); ctx.lineTo(s, 0);
      ctx.moveTo(0, -s); ctx.lineTo(0, s);
      ctx.stroke();
      ctx.restore();
    });

    // Selection Box
    if (gameState.selectionBox) {
      const { start, end } = gameState.selectionBox;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1 / camera.zoom;
      ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
      ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
      ctx.fillRect(start.x, start.y, end.x - start.x, end.y - start.y);
    }

    // Hover Tooltip
    if (mousePosRef.current) {
      const worldX = (mousePosRef.current.x - camera.x) / camera.zoom;
      const worldY = (mousePosRef.current.y - camera.y) / camera.zoom;
      
      const hovered = gameState.entities.find(e => 
        Math.hypot(e.position.x - worldX, e.position.y - worldY) < e.size
      );

      if (hovered) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.strokeStyle = '#4b5563';
        ctx.lineWidth = 1;
        
        const typeName = hovered.subType.replace('_', ' ');
        const text = `${typeName} (${Math.ceil(hovered.health)}/${hovered.maxHealth})`;
        const textWidth = ctx.measureText(text).width;
        
        ctx.fillRect(mousePosRef.current.x + 15, mousePosRef.current.y + 15, textWidth + 20, 30);
        ctx.strokeRect(mousePosRef.current.x + 15, mousePosRef.current.y + 15, textWidth + 20, 30);
        
        ctx.fillStyle = hovered.owner === 'PLAYER' ? '#4ade80' : '#f87171';
        ctx.font = '12px sans-serif';
        ctx.fillText(text, mousePosRef.current.x + 25, mousePosRef.current.y + 35);
      }
    }

    ctx.restore();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'a') {
        engineRef.current.state.interactionMode = 'ATTACK_MOVE';
        setGameState({ ...engineRef.current.state });
      }
      if (e.key.toLowerCase() === 's') {
        // Stop command
        engineRef.current.state.entities.forEach(entity => {
          if (entity.selected && entity.owner === 'PLAYER') {
            entity.targetPosition = undefined;
            entity.targetId = undefined;
            entity.path = undefined;
          }
        });
        setGameState({ ...engineRef.current.state });
      }
      if (e.key.toLowerCase() === 'd') {
        // Deploy command
        engineRef.current.state.entities.forEach(entity => {
          if (entity.selected && entity.owner === 'PLAYER') {
            if (entity.subType === 'GI' || entity.subType === 'SIEGE_CHOPPER' || entity.subType === 'DESOLATOR') {
              entity.isDeployed = !entity.isDeployed;
              entity.targetPosition = undefined;
              entity.path = undefined;
            } else if (entity.subType === 'MCV' || entity.subType === 'ALLIED_MCV') {
              engineRef.current.deployMCV(entity.id);
            }
          }
        });
        setGameState({ ...engineRef.current.state });
      }
      if (e.key.toLowerCase() === 'x') {
        // Scatter command
        engineRef.current.state.entities.forEach(entity => {
          if (entity.selected && entity.owner === 'PLAYER' && entity.type === 'UNIT' && !entity.isDeployed) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 30 + Math.random() * 50;
            entity.targetPosition = {
              x: entity.position.x + Math.cos(angle) * distance,
              y: entity.position.y + Math.sin(angle) * distance
            };
            entity.path = [entity.targetPosition];
            entity.targetId = undefined;
          }
        });
        setGameState({ ...engineRef.current.state });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (appState === 'PLAYING') {
      requestRef.current = requestAnimationFrame(update);
      return () => cancelAnimationFrame(requestRef.current);
    }
  }, [appState]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const screenPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    
    if (e.button === 1) { // Middle mouse for panning
      return;
    }

    const worldPos = engineRef.current.screenToWorld(screenPos);
    engineRef.current.handleMouseDown(worldPos, e.button === 2, e.ctrlKey);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const screenPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    
    mousePosRef.current = screenPos;

    if (e.buttons === 4) { // Middle mouse button is held
      engineRef.current.state.camera.x += e.movementX;
      engineRef.current.state.camera.y += e.movementY;
      return;
    }

    const worldPos = engineRef.current.screenToWorld(screenPos);
    engineRef.current.handleMouseMove(worldPos);
  };

  const handleMouseUp = () => {
    engineRef.current.handleMouseUp();
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomSpeed = 0.1;
    const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
    const newZoom = Math.min(Math.max(engineRef.current.state.camera.zoom + delta, 0.2), 3);
    
    // Zoom towards mouse position
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldX = (mouseX - engineRef.current.state.camera.x) / engineRef.current.state.camera.zoom;
    const worldY = (mouseY - engineRef.current.state.camera.y) / engineRef.current.state.camera.zoom;

    engineRef.current.state.camera.zoom = newZoom;
    engineRef.current.state.camera.x = mouseX - worldX * newZoom;
    engineRef.current.state.camera.y = mouseY - worldY * newZoom;
  };

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans text-white select-none">
      {appState === 'MENU' && (
        <MainMenu setAppState={setAppState} />
      )}

      {appState === 'SKIRMISH_SETUP' && (
        <SkirmishSetup 
          selectedFaction={selectedFaction}
          setSelectedFaction={setSelectedFaction}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedMap={selectedMap}
          setSelectedMap={setSelectedMap}
          setAppState={setAppState}
          engineRef={engineRef}
          setGameState={setGameState}
        />
      )}

      {appState === 'PLAYING' && (
        <>
          {/* Main Game Area */}
          <div className="relative flex-1 bg-zinc-900 cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={window.innerWidth - 250}
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          onContextMenu={onContextMenu}
          className="block"
        />
      </div>

      <GameHUD gameState={gameState} engineRef={engineRef} setGameState={setGameState} />

      {/* Emergency Credits */}
      {gameState.credits < 500 && !gameState.entities.some(e => e.owner === 'PLAYER' && e.subType === 'HARVESTER') && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <button 
            onClick={() => {
              engineRef.current.state.credits += 1000;
              setGameState({ ...engineRef.current.state });
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-black shadow-2xl border-2 border-white/20 uppercase tracking-tighter"
          >
            Request Reinforcements ($1000)
          </button>
        </div>
      )}
      <GameOverScreen gameState={gameState} />
        </>
      )}
    </div>
  );
}

