import React from 'react';
import { GameState } from '../../game/types';
import { GameEngine } from '../../game/GameEngine';
import { BuildButton } from '../BuildButton';
import { Zap, Shield, Factory, Coins, Radar, Wrench, Activity, Layers, Anchor, Users, Crosshair, Target, Skull, Bomb, Wind, Truck, Waves, Car, Square, ShieldAlert, User } from 'lucide-react';

interface InfantryTabProps {
  gameState: GameState;
  engineRef: React.MutableRefObject<GameEngine>;
}

export const InfantryTab: React.FC<InfantryTabProps> = ({ gameState, engineRef }) => {
  const isAllied = engineRef.current.playerFaction === 'COALITION';

  return (
    <>
            <div className="grid grid-cols-2 gap-2">
              {!isAllied ? (
                <>
                  <BuildButton 
                    label="Призывник" 
                    icon={<User className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('SOLDIER')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'SOLDIER')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'SOLDIER').length}
                    locked={!engineRef.current.isUnlocked('SOLDIER', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('SOLDIER')}
                    title="Призывник: Базовая пехота."
                  />
                  <BuildButton 
                    label="Инженер" 
                    icon={<Wrench className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('ENGINEER')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'ENGINEER')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'ENGINEER').length}
                    locked={!engineRef.current.isUnlocked('ENGINEER', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('ENGINEER')}
                    title="Инженер: Захватывает вражеские здания или чинит свои."
                  />
                  <BuildButton 
                    label="Собака" 
                    icon={<Target className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('ATTACK_DOG')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'ATTACK_DOG')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'ATTACK_DOG').length}
                    locked={!engineRef.current.isUnlocked('ATTACK_DOG', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('ATTACK_DOG')}
                    title="Боевой пес: Быстрый разведчик, мгновенно убивает пехоту."
                  />
                  <BuildButton 
                    label="Зенитчик" 
                    icon={<Crosshair className="w-5 h-5 text-zinc-400" />} 
                    cost={engineRef.current.getCost('FLAK_TROOPER')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'FLAK_TROOPER')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'FLAK_TROOPER').length}
                    locked={!engineRef.current.isUnlocked('FLAK_TROOPER', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('FLAK_TROOPER')}
                    title="Зенитчик: Эффективен против авиации и техники."
                  />
                  <BuildButton 
                    label="Тесла-пехотинец" 
                    icon={<Zap className="w-5 h-5 text-blue-400" />} 
                    cost={engineRef.current.getCost('TESLA_TROOPER')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'TESLA_TROOPER')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'TESLA_TROOPER').length}
                    locked={!engineRef.current.isUnlocked('TESLA_TROOPER', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('TESLA_TROOPER')}
                    title="Тесла-пехотинец: Эффективен против техники, нельзя раздавить."
                  />
                  <BuildButton 
                    label="Безумный Иван" 
                    icon={<Bomb className="w-5 h-5 text-red-500" />} 
                    cost={engineRef.current.getCost('CRAZY_IVAN')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'CRAZY_IVAN')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'CRAZY_IVAN').length}
                    locked={!engineRef.current.isUnlocked('CRAZY_IVAN', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('CRAZY_IVAN')}
                    title="Безумный Иван: Минирует всё вокруг."
                  />
                  <BuildButton 
                    label="Юрий" 
                    icon={<Activity className="w-5 h-5 text-purple-500" />} 
                    cost={engineRef.current.getCost('YURI')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'YURI')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'YURI').length}
                    locked={!engineRef.current.isUnlocked('YURI', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('YURI')}
                    title="Юрий: Обладает способностью контролировать разум врагов."
                  />
                  <BuildButton 
                    label="Борис" 
                    icon={<Crosshair className="w-5 h-5 text-red-600" />} 
                    cost={engineRef.current.getCost('BORIS')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'BORIS')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'BORIS').length}
                    locked={!engineRef.current.isUnlocked('BORIS', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('BORIS')}
                    title="Борис: Элитный спецназ. Вызывает авиаудар по зданиям."
                  />
                  {engineRef.current.playerCountry === 'IRAQ' && (
                    <BuildButton 
                      label="Дезолятор" 
                      icon={<Activity className="w-5 h-5 text-green-600" />} 
                      cost={engineRef.current.getCost('DESOLATOR')} 
                      progress={gameState.productionQueue.find(q => q.subType === 'DESOLATOR')?.progress}
                      count={gameState.productionQueue.filter(q => q.subType === 'DESOLATOR').length}
                      locked={!engineRef.current.isUnlocked('DESOLATOR', 'PLAYER')}
                      onClick={() => engineRef.current.startProduction('DESOLATOR')}
                      title="Дезолятор: Уникальный юнит Ирака. Создает зону радиации."
                    />
                  )}
                  {engineRef.current.playerCountry === 'CUBA' && (
                    <BuildButton 
                      label="Террорист" 
                      icon={<Bomb className="w-5 h-5 text-red-500" />} 
                      cost={engineRef.current.getCost('TERRORIST')} 
                      progress={gameState.productionQueue.find(q => q.subType === 'TERRORIST')?.progress}
                      count={gameState.productionQueue.filter(q => q.subType === 'TERRORIST').length}
                      locked={!engineRef.current.isUnlocked('TERRORIST', 'PLAYER')}
                      onClick={() => engineRef.current.startProduction('TERRORIST')}
                      title="Террорист: Уникальный юнит Кубы. Смертник с взрывчаткой."
                    />
                  )}
                </>
              ) : (
                <>
                  <BuildButton 
                    label="Морпех" 
                    icon={<User className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('GI')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'GI')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'GI').length}
                    locked={!engineRef.current.isUnlocked('GI', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('GI')}
                    title="Морпех (G.I.): Базовая пехота Коалиции. Может окапываться для защиты."
                  />
                  {engineRef.current.playerCountry === 'BRITAIN' && (
                    <BuildButton 
                      label="Снайпер" 
                      icon={<Target className="w-5 h-5 text-zinc-400" />} 
                      cost={engineRef.current.getCost('SNIPER')} 
                      progress={gameState.productionQueue.find(q => q.subType === 'SNIPER')?.progress}
                      count={gameState.productionQueue.filter(q => q.subType === 'SNIPER').length}
                      locked={!engineRef.current.isUnlocked('SNIPER', 'PLAYER')}
                      onClick={() => engineRef.current.startProduction('SNIPER')}
                      title="Снайпер: Уникальный юнит Британии. Уничтожает пехоту с огромной дистанции."
                    />
                  )}
                  <BuildButton 
                    label="Инженер" 
                    icon={<Wrench className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('ENGINEER')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'ENGINEER')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'ENGINEER').length}
                    locked={!engineRef.current.isUnlocked('ENGINEER', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('ENGINEER')}
                    title="Инженер: Захватывает вражеские здания или чинит свои."
                  />
                  <BuildButton 
                    label="Собака" 
                    icon={<Target className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('ATTACK_DOG')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'ATTACK_DOG')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'ATTACK_DOG').length}
                    locked={!engineRef.current.isUnlocked('ATTACK_DOG', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('ATTACK_DOG')}
                    title="Боевой пес: Быстрый разведчик, мгновенно убивает пехоту."
                  />
                  <BuildButton 
                    label="Ракетчик" 
                    icon={<Wind className="w-5 h-5 text-blue-400" />} 
                    cost={engineRef.current.getCost('ROCKETEER')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'ROCKETEER')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'ROCKETEER').length}
                    locked={!engineRef.current.isUnlocked('ROCKETEER', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('ROCKETEER')}
                    title="Ракетчик: Летающий пехотинец."
                  />
                  <BuildButton 
                    label="Морпех" 
                    icon={<Target className="w-5 h-5 text-zinc-400" />} 
                    cost={engineRef.current.getCost('NAVY_SEAL')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'NAVY_SEAL')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'NAVY_SEAL').length}
                    locked={!engineRef.current.isUnlocked('NAVY_SEAL', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('NAVY_SEAL')}
                    title="Морской котик: Элитный спецназ. Силен против пехоты и зданий."
                  />
                  <BuildButton 
                    label="Таня" 
                    icon={<Crosshair className="w-5 h-5 text-red-600" />} 
                    cost={engineRef.current.getCost('TANYA')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'TANYA')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'TANYA').length}
                    locked={!engineRef.current.isUnlocked('TANYA', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('TANYA')}
                    title="Таня: Элитный спецназ. Мгновенно убивает пехоту и взрывает здания."
                  />
                  <BuildButton 
                    label="Шпион" 
                    icon={<Users className="w-5 h-5 text-zinc-500" />} 
                    cost={engineRef.current.getCost('SPY')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'SPY')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'SPY').length}
                    locked={!engineRef.current.isUnlocked('SPY', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('SPY')}
                    title="Шпион: Проникает во вражеские здания для кражи технологий или саботажа."
                  />
                  <BuildButton 
                    label="Хроно-легионер" 
                    icon={<Zap className="w-5 h-5 text-blue-200" />} 
                    cost={engineRef.current.getCost('CHRONO_LEGIONNAIRE')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'CHRONO_LEGIONNAIRE')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'CHRONO_LEGIONNAIRE').length}
                    locked={!engineRef.current.isUnlocked('CHRONO_LEGIONNAIRE', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('CHRONO_LEGIONNAIRE')}
                    title="Хроно-легионер: Стирает врагов из времени. Телепортируется по карте."
                  />
                </>
              )}
            </div>
    </>
  );
};
