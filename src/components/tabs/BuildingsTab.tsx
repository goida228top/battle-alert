import React from 'react';
import { GameState } from '../../game/types';
import { GameEngine } from '../../game/GameEngine';
import { BuildButton } from '../BuildButton';
import { Zap, Shield, Factory, Coins, Radar, Wrench, Activity, Layers, Anchor, Users, Crosshair, Target, Skull, Bomb, Wind, Truck, Waves, Car, Square, ShieldAlert, Cpu } from 'lucide-react';

interface BuildingsTabProps {
  gameState: GameState;
  engineRef: React.MutableRefObject<GameEngine>;
}

export const BuildingsTab: React.FC<BuildingsTabProps> = ({ gameState, engineRef }) => {
  const isAllied = engineRef.current.playerFaction === 'COALITION';

  return (
    <>
            <div className="grid grid-cols-2 gap-2">
              {!isAllied ? (
                <>
                  <BuildButton 
                    label="Тесла-реактор" 
                    icon={<Zap className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('POWER_PLANT')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'POWER_PLANT')?.progress}
                    active={gameState.placingBuilding === 'POWER_PLANT'}
                    locked={!engineRef.current.isUnlocked('POWER_PLANT', 'PLAYER')}
                    onClick={() => {
                      const item = gameState.productionQueue.find(q => q.subType === 'POWER_PLANT');
                      if (item && item.progress >= 100) {
                        engineRef.current.startPlacing('POWER_PLANT');
                        engineRef.current.state.productionQueue = engineRef.current.state.productionQueue.filter(q => q.id !== item.id);
                      } else if (!item) {
                        engineRef.current.startProduction('POWER_PLANT');
                      }
                    }}
                    title="Тесла-реактор: Обеспечивает энергией другие постройки."
                  />
                  <BuildButton 
                    label="Обогатитель" 
                    icon={<Coins className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('ORE_REFINERY')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'ORE_REFINERY')?.progress}
                    active={gameState.placingBuilding === 'ORE_REFINERY'}
                    locked={!engineRef.current.isUnlocked('ORE_REFINERY', 'PLAYER')}
                    onClick={() => {
                      const item = gameState.productionQueue.find(q => q.subType === 'ORE_REFINERY');
                      if (item && item.progress >= 100) {
                        engineRef.current.startPlacing('ORE_REFINERY');
                        engineRef.current.state.productionQueue = engineRef.current.state.productionQueue.filter(q => q.id !== item.id);
                      } else if (!item) {
                        engineRef.current.startProduction('ORE_REFINERY');
                      }
                    }}
                    title="Обогатитель руды: Перерабатывает руду в кредиты. В комплекте идет бесплатный Харвестер."
                  />
                  <BuildButton 
                    label="Казармы" 
                    icon={<Users className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('BARRACKS')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'BARRACKS')?.progress}
                    active={gameState.placingBuilding === 'BARRACKS'}
                    locked={!engineRef.current.isUnlocked('BARRACKS', 'PLAYER')}
                    onClick={() => {
                      const item = gameState.productionQueue.find(q => q.subType === 'BARRACKS');
                      if (item && item.progress >= 100) {
                        engineRef.current.startPlacing('BARRACKS');
                        engineRef.current.state.productionQueue = engineRef.current.state.productionQueue.filter(q => q.id !== item.id);
                      } else if (!item) {
                        engineRef.current.startProduction('BARRACKS');
                      }
                    }}
                    title="Казармы: Обучают пехотные подразделения."
                  />
                  <BuildButton 
                    label="Военный завод" 
                    icon={<Factory className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('WAR_FACTORY')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'WAR_FACTORY')?.progress}
                    active={gameState.placingBuilding === 'WAR_FACTORY'}
                    locked={!engineRef.current.isUnlocked('WAR_FACTORY', 'PLAYER')}
                    onClick={() => {
                      const item = gameState.productionQueue.find(q => q.subType === 'WAR_FACTORY');
                      if (item && item.progress >= 100) {
                        engineRef.current.startPlacing('WAR_FACTORY');
                        engineRef.current.state.productionQueue = engineRef.current.state.productionQueue.filter(q => q.id !== item.id);
                      } else if (!item) {
                        engineRef.current.startProduction('WAR_FACTORY');
                      }
                    }}
                    title="Военный завод: Строит технику и танки."
                  />
                  <BuildButton 
                    label="Верфь" 
                    icon={<Anchor className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('NAVAL_YARD')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'NAVAL_YARD')?.progress}
                    active={gameState.placingBuilding === 'NAVAL_YARD'}
                    locked={!engineRef.current.isUnlocked('NAVAL_YARD', 'PLAYER')}
                    onClick={() => {
                      const item = gameState.productionQueue.find(q => q.subType === 'NAVAL_YARD');
                      if (item && item.progress >= 100) {
                        engineRef.current.startPlacing('NAVAL_YARD');
                        engineRef.current.state.productionQueue = engineRef.current.state.productionQueue.filter(q => q.id !== item.id);
                      } else if (!item) {
                        engineRef.current.startProduction('NAVAL_YARD');
                      }
                    }}
                    title="Морская верфь: Строит корабли. Должна быть размещена на воде."
                  />
                  <BuildButton 
                    label="Радар" 
                    icon={<Radar className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('RADAR')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'RADAR')?.progress}
                    active={gameState.placingBuilding === 'RADAR'}
                    locked={!engineRef.current.isUnlocked('RADAR', 'PLAYER')}
                    onClick={() => {
                      const item = gameState.productionQueue.find(q => q.subType === 'RADAR');
                      if (item && item.progress >= 100) {
                        engineRef.current.startPlacing('RADAR');
                        engineRef.current.state.productionQueue = engineRef.current.state.productionQueue.filter(q => q.id !== item.id);
                      } else if (!item) {
                        engineRef.current.startProduction('RADAR');
                      }
                    }}
                    title="Радар: Включает миникарту и открывает доступ к продвинутым постройкам."
                  />
                  <BuildButton 
                    label="Ремонтный цех" 
                    icon={<Wrench className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('SERVICE_DEPOT')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'SERVICE_DEPOT')?.progress}
                    active={gameState.placingBuilding === 'SERVICE_DEPOT'}
                    locked={!engineRef.current.isUnlocked('SERVICE_DEPOT', 'PLAYER')}
                    onClick={() => {
                      const item = gameState.productionQueue.find(q => q.subType === 'SERVICE_DEPOT');
                      if (item && item.progress >= 100) {
                        engineRef.current.startPlacing('SERVICE_DEPOT');
                        engineRef.current.state.productionQueue = engineRef.current.state.productionQueue.filter(q => q.id !== item.id);
                      } else if (!item) {
                        engineRef.current.startProduction('SERVICE_DEPOT');
                      }
                    }}
                    title="Ремонтный цех: Ремонтирует поврежденную технику."
                  />
                  <BuildButton 
                    label="Техцентр" 
                    icon={<Cpu className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('BATTLE_LAB')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'BATTLE_LAB')?.progress}
                    active={gameState.placingBuilding === 'BATTLE_LAB'}
                    locked={!engineRef.current.isUnlocked('BATTLE_LAB', 'PLAYER')}
                    onClick={() => {
                      const item = gameState.productionQueue.find(q => q.subType === 'BATTLE_LAB');
                      if (item && item.progress >= 100) {
                        engineRef.current.startPlacing('BATTLE_LAB');
                        engineRef.current.state.productionQueue = engineRef.current.state.productionQueue.filter(q => q.id !== item.id);
                      } else if (!item) {
                        engineRef.current.startProduction('BATTLE_LAB');
                      }
                    }}
                    title="Боевая лаборатория: Открывает доступ к элитным юнитам и супероружию."
                  />
                  <BuildButton 
                    label="Ядерный реактор" 
                    icon={<Zap className="w-5 h-5 text-yellow-500" />} 
                    cost={engineRef.current.getCost('NUCLEAR_REACTOR')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'NUCLEAR_REACTOR')?.progress}
                    active={gameState.placingBuilding === 'NUCLEAR_REACTOR'}
                    locked={!engineRef.current.isUnlocked('NUCLEAR_REACTOR', 'PLAYER')}
                    onClick={() => {
                      const item = gameState.productionQueue.find(q => q.subType === 'NUCLEAR_REACTOR');
                      if (item && item.progress >= 100) {
                        engineRef.current.startPlacing('NUCLEAR_REACTOR');
                        engineRef.current.state.productionQueue = engineRef.current.state.productionQueue.filter(q => q.id !== item.id);
                      } else if (!item) {
                        engineRef.current.startProduction('NUCLEAR_REACTOR');
                      }
                    }}
                    title="Ядерный реактор: Производит огромное количество энергии."
                  />
                  <BuildButton 
                    label="Чаны клонир." 
                    icon={<Layers className="w-5 h-5 text-pink-500" />} 
                    cost={engineRef.current.getCost('CLONING_VATS')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'CLONING_VATS')?.progress}
                    active={gameState.placingBuilding === 'CLONING_VATS'}
                    locked={!engineRef.current.isUnlocked('CLONING_VATS', 'PLAYER')}
                    onClick={() => {
                      const item = gameState.productionQueue.find(q => q.subType === 'CLONING_VATS');
                      if (item && item.progress >= 100) {
                        engineRef.current.startPlacing('CLONING_VATS');
                        engineRef.current.state.productionQueue = engineRef.current.state.productionQueue.filter(q => q.id !== item.id);
                      } else if (!item) {
                        engineRef.current.startProduction('CLONING_VATS');
                      }
                    }}
                    title="Чаны клонирования: Создает бесплатного клона для каждого обученного пехотинца."
                  />
                </>
              ) : (
                <>
                  <BuildButton 
                    label="Электростанция" 
                    icon={<Zap className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('ALLIED_POWER_PLANT')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'ALLIED_POWER_PLANT')?.progress}
                    active={gameState.placingBuilding === 'ALLIED_POWER_PLANT'}
                    locked={!engineRef.current.isUnlocked('ALLIED_POWER_PLANT', 'PLAYER')}
                    onClick={() => {
                      const item = gameState.productionQueue.find(q => q.subType === 'ALLIED_POWER_PLANT');
                      if (item && item.progress >= 100) {
                        engineRef.current.startPlacing('ALLIED_POWER_PLANT');
                        engineRef.current.state.productionQueue = engineRef.current.state.productionQueue.filter(q => q.id !== item.id);
                      } else if (!item) {
                        engineRef.current.startProduction('ALLIED_POWER_PLANT');
                      }
                    }}
                    title="Электростанция: Обеспечивает энергией другие постройки."
                  />
                  <BuildButton 
                    label="Обогатитель" 
                    icon={<Coins className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('ALLIED_ORE_REFINERY')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'ALLIED_ORE_REFINERY')?.progress}
                    active={gameState.placingBuilding === 'ALLIED_ORE_REFINERY'}
                    locked={!engineRef.current.isUnlocked('ALLIED_ORE_REFINERY', 'PLAYER')}
                    onClick={() => {
                      const item = gameState.productionQueue.find(q => q.subType === 'ALLIED_ORE_REFINERY');
                      if (item && item.progress >= 100) {
                        engineRef.current.startPlacing('ALLIED_ORE_REFINERY');
                        engineRef.current.state.productionQueue = engineRef.current.state.productionQueue.filter(q => q.id !== item.id);
                      } else if (!item) {
                        engineRef.current.startProduction('ALLIED_ORE_REFINERY');
                      }
                    }}
                    title="Обогатитель руды: Перерабатывает руду в кредиты. В комплекте идет бесплатный Харвестер."
                  />
                  <BuildButton 
                    label="Казармы" 
                    icon={<Users className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('ALLIED_BARRACKS')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'ALLIED_BARRACKS')?.progress}
                    active={gameState.placingBuilding === 'ALLIED_BARRACKS'}
                    locked={!engineRef.current.isUnlocked('ALLIED_BARRACKS', 'PLAYER')}
                    onClick={() => {
                      const item = gameState.productionQueue.find(q => q.subType === 'ALLIED_BARRACKS');
                      if (item && item.progress >= 100) {
                        engineRef.current.startPlacing('ALLIED_BARRACKS');
                        engineRef.current.state.productionQueue = engineRef.current.state.productionQueue.filter(q => q.id !== item.id);
                      } else if (!item) {
                        engineRef.current.startProduction('ALLIED_BARRACKS');
                      }
                    }}
                    title="Казармы: Обучают пехотные подразделения."
                  />
                  <BuildButton 
                    label="Военный завод" 
                    icon={<Factory className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('ALLIED_WAR_FACTORY')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'ALLIED_WAR_FACTORY')?.progress}
                    active={gameState.placingBuilding === 'ALLIED_WAR_FACTORY'}
                    locked={!engineRef.current.isUnlocked('ALLIED_WAR_FACTORY', 'PLAYER')}
                    onClick={() => {
                      const item = gameState.productionQueue.find(q => q.subType === 'ALLIED_WAR_FACTORY');
                      if (item && item.progress >= 100) {
                        engineRef.current.startPlacing('ALLIED_WAR_FACTORY');
                        engineRef.current.state.productionQueue = engineRef.current.state.productionQueue.filter(q => q.id !== item.id);
                      } else if (!item) {
                        engineRef.current.startProduction('ALLIED_WAR_FACTORY');
                      }
                    }}
                    title="Военный завод: Строит технику и танки."
                  />
                  <BuildButton 
                    label="ВВС" 
                    icon={<Wind className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('AIR_FORCE_COMMAND')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'AIR_FORCE_COMMAND')?.progress}
                    active={gameState.placingBuilding === 'AIR_FORCE_COMMAND'}
                    locked={!engineRef.current.isUnlocked('AIR_FORCE_COMMAND', 'PLAYER')}
                    onClick={() => {
                      const item = gameState.productionQueue.find(q => q.subType === 'AIR_FORCE_COMMAND');
                      if (item && item.progress >= 100) {
                        engineRef.current.startPlacing('AIR_FORCE_COMMAND');
                        engineRef.current.state.productionQueue = engineRef.current.state.productionQueue.filter(q => q.id !== item.id);
                      } else if (!item) {
                        engineRef.current.startProduction('AIR_FORCE_COMMAND');
                      }
                    }}
                    title="Штаб ВВС: Открывает доступ к авиации и обеспечивает радар."
                  />
                  <BuildButton 
                    label="Техцентр" 
                    icon={<Cpu className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('ALLIED_BATTLE_LAB')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'ALLIED_BATTLE_LAB')?.progress}
                    active={gameState.placingBuilding === 'ALLIED_BATTLE_LAB'}
                    locked={!engineRef.current.isUnlocked('ALLIED_BATTLE_LAB', 'PLAYER')}
                    onClick={() => {
                      const item = gameState.productionQueue.find(q => q.subType === 'ALLIED_BATTLE_LAB');
                      if (item && item.progress >= 100) {
                        engineRef.current.startPlacing('ALLIED_BATTLE_LAB');
                        engineRef.current.state.productionQueue = engineRef.current.state.productionQueue.filter(q => q.id !== item.id);
                      } else if (!item) {
                        engineRef.current.startProduction('ALLIED_BATTLE_LAB');
                      }
                    }}
                    title="Боевая лаборатория: Открывает доступ к элитным юнитам и супероружию."
                  />
                  <BuildButton 
                    label="Ремонтный цех" 
                    icon={<Wrench className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('SERVICE_DEPOT')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'SERVICE_DEPOT')?.progress}
                    active={gameState.placingBuilding === 'SERVICE_DEPOT'}
                    locked={!engineRef.current.isUnlocked('SERVICE_DEPOT', 'PLAYER')}
                    onClick={() => {
                      const item = gameState.productionQueue.find(q => q.subType === 'SERVICE_DEPOT');
                      if (item && item.progress >= 100) {
                        engineRef.current.startPlacing('SERVICE_DEPOT');
                        engineRef.current.state.productionQueue = engineRef.current.state.productionQueue.filter(q => q.id !== item.id);
                      } else if (!item) {
                        engineRef.current.startProduction('SERVICE_DEPOT');
                      }
                    }}
                    title="Ремонтный цех: Ремонтирует поврежденную технику."
                  />
                  <BuildButton 
                    label="Очиститель руды" 
                    icon={<Activity className="w-5 h-5 text-green-400" />} 
                    cost={engineRef.current.getCost('ALLIED_ORE_PURIFIER')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'ALLIED_ORE_PURIFIER')?.progress}
                    active={gameState.placingBuilding === 'ALLIED_ORE_PURIFIER'}
                    locked={!engineRef.current.isUnlocked('ALLIED_ORE_PURIFIER', 'PLAYER')}
                    onClick={() => {
                      const item = gameState.productionQueue.find(q => q.subType === 'ALLIED_ORE_PURIFIER');
                      if (item && item.progress >= 100) {
                        engineRef.current.startPlacing('ALLIED_ORE_PURIFIER');
                        engineRef.current.state.productionQueue = engineRef.current.state.productionQueue.filter(q => q.id !== item.id);
                      } else if (!item) {
                        engineRef.current.startProduction('ALLIED_ORE_PURIFIER');
                      }
                    }}
                    title="Очиститель руды: Повышает ценность собираемой руды на 25%."
                  />
                  <BuildButton 
                    label="Центр роботов" 
                    icon={<Cpu className="w-5 h-5 text-blue-400" />} 
                    cost={engineRef.current.getCost('ROBOT_CONTROL_CENTER')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'ROBOT_CONTROL_CENTER')?.progress}
                    active={gameState.placingBuilding === 'ROBOT_CONTROL_CENTER'}
                    locked={!engineRef.current.isUnlocked('ROBOT_CONTROL_CENTER', 'PLAYER')}
                    onClick={() => {
                      const item = gameState.productionQueue.find(q => q.subType === 'ROBOT_CONTROL_CENTER');
                      if (item && item.progress >= 100) {
                        engineRef.current.startPlacing('ROBOT_CONTROL_CENTER');
                        engineRef.current.state.productionQueue = engineRef.current.state.productionQueue.filter(q => q.id !== item.id);
                      } else if (!item) {
                        engineRef.current.startProduction('ROBOT_CONTROL_CENTER');
                      }
                    }}
                    title="Центр управления роботами: Позволяет строить роботов-танков."
                  />
                  <BuildButton 
                    label="Верфь" 
                    icon={<Anchor className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('ALLIED_NAVAL_YARD')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'ALLIED_NAVAL_YARD')?.progress}
                    active={gameState.placingBuilding === 'ALLIED_NAVAL_YARD'}
                    locked={!engineRef.current.isUnlocked('ALLIED_NAVAL_YARD', 'PLAYER')}
                    onClick={() => {
                      const item = gameState.productionQueue.find(q => q.subType === 'ALLIED_NAVAL_YARD');
                      if (item && item.progress >= 100) {
                        engineRef.current.startPlacing('ALLIED_NAVAL_YARD');
                        engineRef.current.state.productionQueue = engineRef.current.state.productionQueue.filter(q => q.id !== item.id);
                      } else if (!item) {
                        engineRef.current.startProduction('ALLIED_NAVAL_YARD');
                      }
                    }}
                    title="Верфь: Строит корабли. Должна быть размещена на воде."
                  />
                </>
              )}
            </div>
    </>
  );
};
