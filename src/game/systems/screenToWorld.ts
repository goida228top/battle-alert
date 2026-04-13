
import { Vector2 } from '../types';

export function screenToWorld(this: any, pos: Vector2): Vector2 {
  return {
    x: (pos.x - this.state.camera.x) / this.state.camera.zoom,
    y: (pos.y - this.state.camera.y) / this.state.camera.zoom,
  };
}
