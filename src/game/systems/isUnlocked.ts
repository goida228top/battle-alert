
export function isUnlocked(this: any, type: string, owner: 'PLAYER' | 'AI'): boolean {
  // Construction Yard is always "unlocked" in the sense that it's the starting point,
  // but it's not usually "bought" from the sidebar (MCV is bought).
  if (type === 'CONSTRUCTION_YARD' || type === 'ALLIED_CONSTRUCTION_YARD') return true;

  const prerequisites = this.getPrerequisites(type);
  if (prerequisites.length === 0) return true;

  return prerequisites.every(prereq => {
    const alliedPrereq = prereq.startsWith('ALLIED_') ? prereq : `ALLIED_${prereq}`;
    const sovietPrereq = prereq.replace('ALLIED_', '');
    return this.state.entities.some(e => 
      (e.subType === prereq || e.subType === alliedPrereq || e.subType === sovietPrereq) && 
      e.owner === owner && 
      e.health > 0
    );
  });
}
