import React from 'react';
import { GameState } from '../game/types';
import { Target, Zap, Coins, Factory, Crosshair, Truck } from 'lucide-react';

interface TutorialOverlayProps {
  gameState: GameState;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ gameState }) => {
  const playerEntities = gameState.entities.filter(e => e.owner === 'PLAYER');
  const hasYard = playerEntities.some(e => e.subType === 'CONSTRUCTION_YARD' || e.subType === 'ALLIED_CONSTRUCTION_YARD');
  const hasPower = playerEntities.some(e => e.subType === 'POWER_PLANT' || e.subType === 'ALLIED_POWER_PLANT');
  const hasRefinery = playerEntities.some(e => e.subType === 'ORE_REFINERY' || e.subType === 'ALLIED_ORE_REFINERY');
  const hasBarracks = playerEntities.some(e => e.subType === 'BARRACKS' || e.subType === 'ALLIED_BARRACKS');
  const hasTroops = playerEntities.some(e => e.type === 'UNIT' && !['MCV', 'ALLIED_MCV', 'HARVESTER', 'CHRONO_MINER'].includes(e.subType || ''));

  let objective = "";
  let icon = <Target className="w-6 h-6 text-blue-400" />;
  let color = "text-blue-400";

  if (!hasYard) {
    objective = "Разверните базу: Выделите MCV (грузовик) и нажмите 'Deploy Base' справа.";
    icon = <Truck className="w-6 h-6 text-yellow-400 animate-pulse" />;
    color = "text-yellow-400";
  } else if (!hasPower) {
    objective = "Энергия: Постройте Электростанцию (Power Plant) в меню справа.";
    icon = <Zap className="w-6 h-6 text-blue-400 animate-pulse" />;
    color = "text-blue-400";
  } else if (!hasRefinery) {
    objective = "Экономика: Постройте Обогатитель (Ore Refinery) для добычи кредитов.";
    icon = <Coins className="w-6 h-6 text-yellow-400 animate-pulse" />;
    color = "text-yellow-400";
  } else if (!hasBarracks) {
    objective = "Армия: Постройте Казармы (Barracks) для найма пехоты.";
    icon = <Factory className="w-6 h-6 text-orange-400 animate-pulse" />;
    color = "text-orange-400";
  } else if (!hasTroops) {
    objective = "Подготовка: Наймите солдат во вкладке с пехотой.";
    icon = <Crosshair className="w-6 h-6 text-red-400 animate-pulse" />;
    color = "text-red-400";
  } else {
    objective = "Цель: Уничтожьте базу противника!";
    icon = <Target className="w-6 h-6 text-red-600" />;
    color = "text-red-600";
  }

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-zinc-950/90 backdrop-blur-md border-2 border-zinc-800 p-3 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-4 max-w-lg w-full">
        <div className={`shrink-0 ${color}`}>
          {icon}
        </div>
        <div>
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">Текущая задача</div>
          <div className="text-sm font-bold text-zinc-200 leading-tight">{objective}</div>
        </div>
      </div>
    </div>
  );
};


