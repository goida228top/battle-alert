
export function deployMCV(this: any, mcvId: string) {
  const mcvIndex = this.state.entities.findIndex((e: any) => e.id === mcvId);
  if (mcvIndex === -1) return;

  const mcv = this.state.entities[mcvIndex];
  if (mcv.subType !== 'MCV' && mcv.subType !== 'ALLIED_MCV') return;

  // Snap to grid (3x3 building)
  const tileSize = this.state.map.tileSize;
  const tx = Math.floor(mcv.position.x / tileSize) - 1;
  const ty = Math.floor(mcv.position.y / tileSize) - 1;
  
  const snappedX = (tx + 1.5) * tileSize;
  const snappedY = (ty + 1.5) * tileSize;

  // Replace MCV with Construction Yard
  this.state.entities.splice(mcvIndex, 1);
  this.state.entities.push({
    id: `base-${Date.now()}`,
    type: 'BUILDING',
    subType: mcv.subType === 'ALLIED_MCV' ? 'ALLIED_CONSTRUCTION_YARD' : 'CONSTRUCTION_YARD',
    position: { x: snappedX, y: snappedY },
    health: 3000,
    maxHealth: 3000,
    owner: mcv.owner,
    size: 120, // 3x3 tiles
  });
}
