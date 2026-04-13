import React, { useEffect, useRef } from 'react';
import { GameState, Vector2 } from '../game/types';

interface MinimapProps {
  gameState: GameState;
  onMinimapClick: (pos: Vector2) => void;
}

export const Minimap: React.FC<MinimapProps> = ({ gameState, onMinimapClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { map, entities, camera } = gameState;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const mapWidth = map.width * map.tileSize;
    const mapHeight = map.height * map.tileSize;

    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Draw Terrain (Simplified)
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const vis = map.visibility[y][x];
        if (vis === 0) continue; // Shroud

        const tile = map.tiles[y][x];
        if (tile === 'WATER') {
          ctx.fillStyle = '#1e3a8a';
        } else if (tile === 'ORE') {
          ctx.fillStyle = '#fbbf24';
        } else {
          ctx.fillStyle = map.theme === 'DESERT' ? '#78350f' : map.theme === 'SNOW' ? '#e2e8f0' : '#14532d';
        }
        
        if (vis === 1) {
          // Explored but not visible: User wants "just normal"
          ctx.globalAlpha = 1;
        } else {
          ctx.globalAlpha = 1;
        }

        ctx.fillRect(
          (x / map.width) * width,
          (y / map.height) * height,
          (1 / map.width) * width + 1,
          (1 / map.height) * height + 1
        );
      }
    }
    ctx.globalAlpha = 1;

    // Draw Entities
    entities.forEach(entity => {
      const tx = Math.floor(entity.position.x / map.tileSize);
      const ty = Math.floor(entity.position.y / map.tileSize);
      if (map.visibility[ty]?.[tx] !== 2 && entity.owner !== 'PLAYER') return;

      ctx.fillStyle = entity.owner === 'PLAYER' ? '#3b82f6' : '#ef4444';
      const size = entity.type === 'BUILDING' ? 4 : 2;
      ctx.fillRect(
        (entity.position.x / mapWidth) * width - size / 2,
        (entity.position.y / mapHeight) * height - size / 2,
        size,
        size
      );
    });

    // Draw Camera Viewport
    const viewWidth = (window.innerWidth / camera.zoom / mapWidth) * width;
    const viewHeight = (window.innerHeight / camera.zoom / mapHeight) * height;
    const viewX = (-camera.x / camera.zoom / mapWidth) * width;
    const viewY = (-camera.y / camera.zoom / mapHeight) * height;

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(viewX, viewY, viewWidth, viewHeight);

  }, [gameState]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvas.width;
    const y = (e.clientY - rect.top) / canvas.height;
    
    const worldX = x * map.width * map.tileSize;
    const worldY = y * map.height * map.tileSize;
    
    onMinimapClick({ x: worldX, y: worldY });
  };

  return (
    <div className="w-full aspect-square bg-black border-2 border-zinc-700 shadow-inner relative overflow-hidden">
      <canvas
        ref={canvasRef}
        width={256}
        height={256}
        className="w-full h-full cursor-crosshair"
        onClick={handleClick}
      />
      <div className="absolute top-0 left-0 right-0 bg-zinc-900/80 text-[10px] font-bold text-zinc-400 px-1 py-0.5 uppercase tracking-tighter border-b border-zinc-800 pointer-events-none">
        Тактическая карта
      </div>
    </div>
  );
};
