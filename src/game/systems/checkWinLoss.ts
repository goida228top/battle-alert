import { GameEngine } from '../GameEngine';
import { Entity, Vector2, BuildingType, UnitType } from '../types';

export function checkWinLoss(this: GameEngine, ): void {
const playerHasBase = this.state.entities.some(e => e.owner === 'PLAYER');
const aiHasBase = this.state.entities.some(e => e.owner === 'AI');

if (!playerHasBase) this.state.gameOver = 'LOSS';
else if (!aiHasBase) this.state.gameOver = 'WIN';
}
