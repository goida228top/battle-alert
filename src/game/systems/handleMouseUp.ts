
export function handleMouseUp(this: any) {
  if (this.state.selectionBox) {
    const { start, end } = this.state.selectionBox;
    const xMin = Math.min(start.x, end.x);
    const xMax = Math.max(start.x, end.x);
    const yMin = Math.min(start.y, end.y);
    const yMax = Math.max(start.y, end.y);

    const isSingleClick = Math.abs(start.x - end.x) < 5 && Math.abs(start.y - end.y) < 5;
    const timestamp = performance.now();

    this.state.entities.forEach((entity: any) => {
      if (entity.owner === 'PLAYER') {
        let newlySelected = false;
        if (isSingleClick) {
          const dx = entity.position.x - start.x;
          const dy = entity.position.y - start.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          newlySelected = dist < entity.size;
        } else {
          newlySelected = 
            entity.position.x >= xMin && 
            entity.position.x <= xMax && 
            entity.position.y >= yMin && 
            entity.position.y <= yMax;
        }

        if (newlySelected && !entity.selected) {
          const responses = ['Acknowledged', 'Yes, sir!', 'Moving out', 'On my way', 'Ready for action', 'Unit reporting'];
          entity.selectionResponse = responses[Math.floor(Math.random() * responses.length)];
          entity.selectionResponseTime = timestamp;
        }
        entity.selected = newlySelected;
      }
    });

    this.state.selectionBox = null;
  }
}
