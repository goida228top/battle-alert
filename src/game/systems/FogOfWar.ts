import { GameState } from '../types';

export class FogOfWar {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private imageData: ImageData | null = null;
  private lastWidth: number = 0;
  private lastHeight: number = 0;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { alpha: true })!;
  }

  public render(
    mainCtx: CanvasRenderingContext2D,
    visibility: number[][],
    map: GameState['map']
  ) {
    const { width, height, tileSize } = map;
    
    // Add padding so the fog smoothly bleeds out of the map bounds
    const pad = 2;
    const fW = width + pad * 2;
    const fH = height + pad * 2;

    // Resize internal canvas if map size changes
    if (this.lastWidth !== fW || this.lastHeight !== fH) {
      this.canvas.width = fW;
      this.canvas.height = fH;
      this.lastWidth = fW;
      this.lastHeight = fH;
      this.imageData = this.ctx.createImageData(fW, fH);
    }

    if (!this.imageData) return;

    const data = this.imageData.data;
    
    // 1. Build the low-res fog map
    for (let y = 0; y < fH; y++) {
      for (let x = 0; x < fW; x++) {
        const mapX = x - pad;
        const mapY = y - pad;
        let vis = 0; // Default to unexplored

        if (mapX >= 0 && mapX < width && mapY >= 0 && mapY < height) {
          vis = visibility[mapY]?.[mapX] ?? 0;
        }

        const idx = (y * fW + x) * 4;
        
        if (vis === 0) {
          // Unexplored: Dark gray/black
          data[idx] = 15;
          data[idx + 1] = 15;
          data[idx + 2] = 15;
          data[idx + 3] = 255;
        } else if (vis === 1) {
          // Explored but not in vision: Fully transparent (no fog)
          data[idx] = 0;
          data[idx + 1] = 0;
          data[idx + 2] = 0;
          data[idx + 3] = 0;
        } else {
          // Visible: Fully transparent
          data[idx] = 0;
          data[idx + 1] = 0;
          data[idx + 2] = 0;
          data[idx + 3] = 0;
        }
      }
    }

    this.ctx.putImageData(this.imageData, 0, 0);

    mainCtx.save();
    
    // 2. Draw the low-res canvas scaled up. 
    // imageSmoothingEnabled = true creates the beautiful, soft, smoky edges automatically!
    mainCtx.imageSmoothingEnabled = true;
    mainCtx.imageSmoothingQuality = 'high';

    mainCtx.drawImage(
      this.canvas,
      -pad * tileSize,
      -pad * tileSize,
      fW * tileSize,
      fH * tileSize
    );

    // 3. Draw the infinite abyss outside the padded area
    mainCtx.fillStyle = 'rgba(15, 15, 15, 1)';
    const worldSize = 10000;
    const mapW = width * tileSize;
    const mapH = height * tileSize;
    const pT = pad * tileSize;

    const outTop = -pT;
    const outBottom = mapH + pT;
    const outLeft = -pT;
    const outRight = mapW + pT;

    // Top
    mainCtx.fillRect(-worldSize, -worldSize, worldSize * 2, worldSize + outTop);
    // Bottom
    mainCtx.fillRect(-worldSize, outBottom, worldSize * 2, worldSize);
    // Left
    mainCtx.fillRect(-worldSize, outTop, worldSize + outLeft, outBottom - outTop);
    // Right
    mainCtx.fillRect(outRight, outTop, worldSize, outBottom - outTop);

    mainCtx.restore();
  }
}
