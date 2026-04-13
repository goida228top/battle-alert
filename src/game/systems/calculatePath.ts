
import { Vector2 } from '../types';

export function calculatePath(this: any, start: Vector2, end: Vector2): Vector2[] {
  if (this.state.map.bridges.length > 0) {
    // Check if crossing vertical river
    const riverX = Math.floor(this.state.map.width / 2) * 40; 
    if (this.state.map.bridges[0]?.width > 2 && ((start.x < riverX && end.x > riverX) || (start.x > riverX && end.x < riverX))) {
      const bridge1 = { x: this.state.map.bridges[0].x * 40, y: this.state.map.bridges[0].y * 40 };
      const bridge2 = { x: this.state.map.bridges[1].x * 40, y: this.state.map.bridges[1].y * 40 };
      
      const dist1 = Math.hypot(start.x - bridge1.x, start.y - bridge1.y);
      const dist2 = Math.hypot(start.x - bridge2.x, start.y - bridge2.y);
      
      const nearestBridge = dist1 < dist2 ? bridge1 : bridge2;
      return [nearestBridge, { ...end }];
    }
    
    // Check if crossing horizontal river
    const riverY = 17 * 40; // 680
    if (this.state.map.bridges[0]?.height > 2 && ((start.y < riverY && end.y > riverY) || (start.y > riverY && end.y < riverY))) {
      const bridge1 = { x: this.state.map.bridges[0].x * 40, y: this.state.map.bridges[0].y * 40 };
      const bridge2 = { x: this.state.map.bridges[1].x * 40, y: this.state.map.bridges[1].y * 40 };
      
      const dist1 = Math.hypot(start.x - bridge1.x, start.y - bridge1.y);
      const dist2 = Math.hypot(start.x - bridge2.x, start.y - bridge2.y);
      
      const nearestBridge = dist1 < dist2 ? bridge1 : bridge2;
      return [nearestBridge, { ...end }];
    }
  }
  return [{ ...end }];
}
