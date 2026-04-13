import React from 'react';
import { GameState } from '../game/types';

interface GameOverScreenProps {
  gameState: GameState;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  gameState
}) => {
  if (!gameState.gameOver) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl">
      <div className="text-center p-12 border-2 border-zinc-800 rounded-3xl bg-zinc-950 shadow-2xl">
        <h1 className={`text-6xl font-black uppercase tracking-tighter mb-4 font-display ${gameState.gameOver === 'WIN' ? 'text-green-500' : 'text-red-500'}`}>
          {gameState.gameOver === 'WIN' ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ'}
        </h1>
        <p className="text-zinc-400 mb-8 font-bold tracking-widest uppercase text-xs">Миссия завершена</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-colors"
        >
          Играть снова
        </button>
      </div>
    </div>
  );
};

