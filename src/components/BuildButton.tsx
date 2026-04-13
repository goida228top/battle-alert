import React from 'react';
import { Lock, Factory } from 'lucide-react';

interface BuildButtonProps {
  label: string; 
  icon?: React.ReactNode; 
  cost: number; 
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  locked?: boolean;
  title?: string;
  progress?: number;
  stuck?: boolean;
  count?: number;
}

export const BuildButton: React.FC<BuildButtonProps> = ({ 
  label, icon, cost, onClick, active, disabled, locked, title, progress, stuck, count 
}) => {
  return (
    <button 
      onClick={onClick}
      disabled={(disabled || locked) && !progress}
      title={title}
      className={`
        relative aspect-[4/3] flex flex-col items-center justify-center border transition-all overflow-hidden group
        ${(disabled || locked) && !progress ? 'opacity-30 cursor-not-allowed border-zinc-800 bg-zinc-950' : 
          active ? 'border-zinc-400 bg-zinc-800 shadow-inner' : 
          'border-zinc-800 bg-zinc-900/80 hover:border-zinc-700 hover:bg-zinc-800'}
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:8px_8px]" />

      {/* Progress Overlay (Top to Bottom) */}
      {progress !== undefined && progress < 100 && (
        <div 
          className="absolute inset-0 bg-black/80 pointer-events-none z-20"
          style={{ height: `${100 - progress}%` }}
        />
      )}
      
      {/* Ready State Overlay */}
      {progress !== undefined && progress >= 100 && (
        <div className="absolute inset-0 bg-zinc-700/30 pointer-events-none z-20" />
      )}

      {/* Locked Overlay */}
      {locked && !progress && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
          <Lock className="w-6 h-6 text-zinc-600" />
        </div>
      )}

      {/* Icon/Image Area */}
      <div className={`text-zinc-500 group-hover:text-zinc-300 transition-colors relative z-10 scale-125 mb-1 ${locked ? 'grayscale' : ''}`}>
        {icon || <Factory className="w-6 h-6" />}
      </div>

      {/* Label Bar (Bottom) */}
      <div className="absolute bottom-0 left-0 w-full bg-black/95 py-0.5 border-t border-zinc-800 z-30">
        <span className="text-[8px] font-black uppercase tracking-tighter text-zinc-400 block text-center truncate px-1">
          {label}
        </span>
      </div>

      {/* Cost (Top Right) */}
      <div className="absolute top-0.5 right-1 z-30">
        <span className="text-[7px] font-mono font-bold text-zinc-400 tracking-tighter">
          ${cost}
        </span>
      </div>

      {/* Queue Count Badge */}
      {count !== undefined && count > 1 && (
        <div className="absolute top-0 left-0 bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-br z-40">
          {count}
        </div>
      )}
      
      {/* Progress Percentage (Center) */}
      {progress !== undefined && progress < 100 && (
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
          <span className="text-[10px] font-mono font-black text-zinc-400">
            {Math.floor(progress)}%
          </span>
        </div>
      )}

      {/* Ready Text (Center) */}
      {progress !== undefined && progress >= 100 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-40 pointer-events-none animate-pulse">
          <span className="text-[10px] font-black text-zinc-100 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
            ГОТОВО
          </span>
          {onClick && active === undefined && !stuck && (
            <span className="text-[6px] font-bold text-zinc-400 uppercase mt-0.5">
              ВЫХОД...
            </span>
          )}
          {stuck && (
            <span className="text-[6px] font-bold text-red-500 uppercase mt-0.5 animate-pulse">
              НУЖНО ЗДАНИЕ
            </span>
          )}
          {onClick && active !== undefined && (
            <span className="text-[6px] font-bold text-red-500 uppercase mt-0.5 animate-bounce">
              РАЗМЕСТИТЬ
            </span>
          )}
        </div>
      )}

      {/* Active Selection Indicator */}
      {active && (
        <div className="absolute inset-0 border-2 border-zinc-600 z-50 pointer-events-none" />
      )}
    </button>
  );
};
