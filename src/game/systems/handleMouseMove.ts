
import { Vector2 } from '../types';

export function handleMouseMove(this: any, pos: Vector2) {
  if (this.state.selectionBox) {
    this.state.selectionBox.end = { ...pos };
  }
}
