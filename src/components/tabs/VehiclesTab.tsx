import React from 'react';
import { GameState } from '../../game/types';
import { GameEngine } from '../../game/GameEngine';
import { BuildButton } from '../BuildButton';
import { Zap, Shield, Factory, Coins, Radar, Wrench, Activity, Layers, Anchor, Users, Crosshair, Target, Skull, Bomb, Wind, Truck, Waves, Car, Square, ShieldAlert, Cpu } from 'lucide-react';

interface VehiclesTabProps {
  gameState: GameState;
  engineRef: React.MutableRefObject<GameEngine>;
}

export const VehiclesTab: React.FC<VehiclesTabProps> = ({ gameState, engineRef }) => {
  const isAllied = engineRef.current.playerFaction === 'COALITION';

  return (
    <>
            <div className="grid grid-cols-2 gap-2">
              {!isAllied ? (
                <>
                  <BuildButton 
                    label="Танк Рино" 
                    icon={<Car className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('RHINO_TANK')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'RHINO_TANK')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'RHINO_TANK').length}
                    locked={!engineRef.current.isUnlocked('RHINO_TANK', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('RHINO_TANK')}
                    title="Тяжелый танк Рино: Стандартный бронированный юнит."
                  />
                  <BuildButton 
                    label="Зенитный БТР" 
                    icon={<Truck className="w-5 h-5 text-zinc-400" />} 
                    cost={engineRef.current.getCost('FLAK_TRACK')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'FLAK_TRACK')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'FLAK_TRACK').length}
                    locked={!engineRef.current.isUnlocked('FLAK_TRACK', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('FLAK_TRACK')}
                    title="Зенитный БТР: Быстрый транспорт, эффективен против авиации."
                  />
                  <BuildButton 
                    label="Пусковая V3" 
                    icon={<Target className="w-5 h-5 text-red-500" />} 
                    cost={engineRef.current.getCost('V3_LAUNCHER')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'V3_LAUNCHER')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'V3_LAUNCHER').length}
                    locked={!engineRef.current.isUnlocked('V3_LAUNCHER', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('V3_LAUNCHER')}
                    title="Ракетная установка V3: Дальнобойная артиллерия."
                  />
                  <BuildButton 
                    label="Дрон-террорист" 
                    icon={<Crosshair className="w-5 h-5 text-zinc-400" />} 
                    cost={engineRef.current.getCost('TERROR_DRONE')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'TERROR_DRONE')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'TERROR_DRONE').length}
                    locked={!engineRef.current.isUnlocked('TERROR_DRONE', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('TERROR_DRONE')}
                    title="Дрон-террорист: Быстрый механический паук. Разбирает технику изнутри."
                  />
                  <BuildButton 
                    label="Апокалипсис" 
                    icon={<Skull className="w-5 h-5 text-red-600" />} 
                    cost={engineRef.current.getCost('APOCALYPSE_TANK')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'APOCALYPSE_TANK')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'APOCALYPSE_TANK').length}
                    locked={!engineRef.current.isUnlocked('APOCALYPSE_TANK', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('APOCALYPSE_TANK')}
                    title="Танк Апокалипсис: Мощнейшая машина наземного штурма."
                  />
                  {engineRef.current.playerCountry === 'RUSSIA' && (
                    <BuildButton 
                      label="Тесла-танк" 
                      icon={<Zap className="w-5 h-5 text-blue-500" />} 
                      cost={engineRef.current.getCost('TESLA_TANK')} 
                      progress={gameState.productionQueue.find(q => q.subType === 'TESLA_TANK')?.progress}
                      count={gameState.productionQueue.filter(q => q.subType === 'TESLA_TANK').length}
                      locked={!engineRef.current.isUnlocked('TESLA_TANK', 'PLAYER')}
                      onClick={() => engineRef.current.startProduction('TESLA_TANK')}
                      title="Тесла-танк: Уникальный танк России. Стреляет электрическими разрядами."
                    />
                  )}
                  {engineRef.current.playerCountry === 'LIBYA' && (
                    <BuildButton 
                      label="Грузовик-бомба" 
                      icon={<Bomb className="w-5 h-5 text-red-500" />} 
                      cost={engineRef.current.getCost('DEMOLITION_TRUCK')} 
                      progress={gameState.productionQueue.find(q => q.subType === 'DEMOLITION_TRUCK')?.progress}
                      count={gameState.productionQueue.filter(q => q.subType === 'DEMOLITION_TRUCK').length}
                      locked={!engineRef.current.isUnlocked('DEMOLITION_TRUCK', 'PLAYER')}
                      onClick={() => engineRef.current.startProduction('DEMOLITION_TRUCK')}
                      title="Грузовик-бомба: Уникальный юнит Ливии. Смертник на колесах."
                    />
                  )}
                  <BuildButton 
                    label="Военный комбайн" 
                    icon={<Truck className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('HARVESTER')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'HARVESTER')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'HARVESTER').length}
                    locked={!engineRef.current.isUnlocked('HARVESTER', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('HARVESTER')}
                    title="Военный комбайн: Собирает руду. Вооружен пулеметом."
                  />
                  <BuildButton 
                    label="МСЦ" 
                    icon={<Truck className="w-5 h-5 text-green-500" />} 
                    cost={engineRef.current.getCost('MCV')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'MCV')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'MCV').length}
                    locked={!engineRef.current.isUnlocked('MCV', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('MCV')}
                    title="Мобильный Сборочный Цех: Развертывается в новый Сборочный Двор."
                  />
                  <BuildButton 
                    label="Дирижабль Киров" 
                    icon={<Wind className="w-5 h-5 text-yellow-500" />} 
                    cost={engineRef.current.getCost('KIROV_AIRSHIP')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'KIROV_AIRSHIP')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'KIROV_AIRSHIP').length}
                    locked={!engineRef.current.isUnlocked('KIROV_AIRSHIP', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('KIROV_AIRSHIP')}
                    title="Дирижабль Киров: Тяжелый бомбардировщик. Медленный, но сокрушительный."
                  />
                  <BuildButton 
                    label="Подлодка" 
                    icon={<Waves className="w-5 h-5 text-blue-500" />} 
                    cost={engineRef.current.getCost('TYPHOON_SUB')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'TYPHOON_SUB')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'TYPHOON_SUB').length}
                    locked={!engineRef.current.isUnlocked('TYPHOON_SUB', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('TYPHOON_SUB')}
                    title="Подлодка Тайфун: Скрытный морской юнит."
                  />
                  <BuildButton 
                    label="Дредноут" 
                    icon={<Anchor className="w-5 h-5 text-red-500" />} 
                    cost={engineRef.current.getCost('DREADNOUGHT')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'DREADNOUGHT')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'DREADNOUGHT').length}
                    locked={!engineRef.current.isUnlocked('DREADNOUGHT', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('DREADNOUGHT')}
                    title="Дредноут: Дальнобойная морская бомбардировка."
                  />
                </>
              ) : (
                <>
                  <BuildButton 
                    label="Танк Гризли" 
                    icon={<Car className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('GRIZZLY_TANK')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'GRIZZLY_TANK')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'GRIZZLY_TANK').length}
                    locked={!engineRef.current.isUnlocked('GRIZZLY_TANK', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('GRIZZLY_TANK')}
                    title="Танк Гризли: Стандартный боевой танк Коалиции."
                  />
                  <BuildButton 
                    label="Хроно-комбайн" 
                    icon={<Truck className="w-5 h-5" />} 
                    cost={engineRef.current.getCost('CHRONO_MINER')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'CHRONO_MINER')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'CHRONO_MINER').length}
                    locked={!engineRef.current.isUnlocked('CHRONO_MINER', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('CHRONO_MINER')}
                    title="Хроно-комбайн: Собирает руду и телепортируется обратно на базу."
                  />
                  <BuildButton 
                    label="БМП" 
                    icon={<Target className="w-5 h-5 text-blue-500" />} 
                    cost={engineRef.current.getCost('IFV')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'IFV')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'IFV').length}
                    locked={!engineRef.current.isUnlocked('IFV', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('IFV')}
                    title="БМП: Многоцелевая машина. Меняет оружие в зависимости от пехоты внутри."
                  />
                  <BuildButton 
                    label="Танк Мираж" 
                    icon={<Wind className="w-5 h-5 text-green-600" />} 
                    cost={engineRef.current.getCost('MIRAGE_TANK')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'MIRAGE_TANK')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'MIRAGE_TANK').length}
                    locked={!engineRef.current.isUnlocked('MIRAGE_TANK', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('MIRAGE_TANK')}
                    title="Танк Мираж: Маскируется под дерево, когда неподвижен."
                  />
                  <BuildButton 
                    label="Призма-танк" 
                    icon={<Zap className="w-5 h-5 text-blue-300" />} 
                    cost={engineRef.current.getCost('PRISM_TANK')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'PRISM_TANK')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'PRISM_TANK').length}
                    locked={!engineRef.current.isUnlocked('PRISM_TANK', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('PRISM_TANK')}
                    title="Призма-танк: Дальнобойное лучевое оружие, поражающее несколько целей."
                  />
                  {engineRef.current.playerCountry === 'GERMANY' && (
                    <BuildButton 
                      label="Истр. танков" 
                      icon={<ShieldAlert className="w-5 h-5 text-zinc-400" />} 
                      cost={engineRef.current.getCost('TANK_DESTROYER')} 
                      progress={gameState.productionQueue.find(q => q.subType === 'TANK_DESTROYER')?.progress}
                      count={gameState.productionQueue.filter(q => q.subType === 'TANK_DESTROYER').length}
                      locked={!engineRef.current.isUnlocked('TANK_DESTROYER', 'PLAYER')}
                      onClick={() => engineRef.current.startProduction('TANK_DESTROYER')}
                      title="Истребитель танков: Уникальный юнит Германии. Эффективен против бронетехники."
                    />
                  )}
                  <BuildButton 
                    label="Робот-танк" 
                    icon={<Cpu className="w-5 h-5 text-blue-400" />} 
                    cost={engineRef.current.getCost('ROBOT_TANK')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'ROBOT_TANK')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'ROBOT_TANK').length}
                    locked={!engineRef.current.isUnlocked('ROBOT_TANK', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('ROBOT_TANK')}
                    title="Робот-танк: Беспилотный танк. Неуязвим для контроля разума."
                  />
                  <BuildButton 
                    label="Крепость" 
                    icon={<Skull className="w-5 h-5 text-zinc-600" />} 
                    cost={engineRef.current.getCost('BATTLE_FORTRESS')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'BATTLE_FORTRESS')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'BATTLE_FORTRESS').length}
                    locked={!engineRef.current.isUnlocked('BATTLE_FORTRESS', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('BATTLE_FORTRESS')}
                    title="Боевая крепость: Огромный транспорт, способный давить другую технику."
                  />
                  <BuildButton 
                    label="МСЦ" 
                    icon={<Truck className="w-5 h-5 text-green-500" />} 
                    cost={engineRef.current.getCost('ALLIED_MCV')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'ALLIED_MCV')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'ALLIED_MCV').length}
                    locked={!engineRef.current.isUnlocked('ALLIED_MCV', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('ALLIED_MCV')}
                    title="Мобильный Сборочный Цех: Развертывается в Сборочный Двор Коалиции."
                  />
                  <BuildButton 
                    label="Эсминец" 
                    icon={<Waves className="w-5 h-5 text-blue-700" />} 
                    cost={engineRef.current.getCost('DESTROYER')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'DESTROYER')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'DESTROYER').length}
                    locked={!engineRef.current.isUnlocked('DESTROYER', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('DESTROYER')}
                    title="Эсминец: Универсальный морской юнит с противолодочным самолетом."
                  />
                  <BuildButton 
                    label="Авианосец" 
                    icon={<Anchor className="w-5 h-5 text-blue-900" />} 
                    cost={engineRef.current.getCost('AIRCRAFT_CARRIER')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'AIRCRAFT_CARRIER')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'AIRCRAFT_CARRIER').length}
                    locked={!engineRef.current.isUnlocked('AIRCRAFT_CARRIER', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('AIRCRAFT_CARRIER')}
                    title="Авианосец: Запускает самолеты для атаки с большой дистанции."
                  />
                  <BuildButton 
                    label="Харриер" 
                    icon={<Wind className="w-5 h-5 text-zinc-400" />} 
                    cost={engineRef.current.getCost('HARRIER')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'HARRIER')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'HARRIER').length}
                    locked={!engineRef.current.isUnlocked('HARRIER', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('HARRIER')}
                    title="Харриер: Реактивный истребитель-бомбардировщик."
                  />
                  {engineRef.current.playerCountry === 'KOREA' && (
                    <BuildButton 
                      label="Черный орел" 
                      icon={<Wind className="w-5 h-5 text-zinc-800" />} 
                      cost={engineRef.current.getCost('BLACK_EAGLE')} 
                      progress={gameState.productionQueue.find(q => q.subType === 'BLACK_EAGLE')?.progress}
                      count={gameState.productionQueue.filter(q => q.subType === 'BLACK_EAGLE').length}
                      locked={!engineRef.current.isUnlocked('BLACK_EAGLE', 'PLAYER')}
                      onClick={() => engineRef.current.startProduction('BLACK_EAGLE')}
                      title="Черный орел: Уникальный самолет Кореи. Мощнее и прочнее Харриера."
                    />
                  )}
                  <BuildButton 
                    label="Ночной ястреб" 
                    icon={<Wind className="w-5 h-5 text-zinc-600" />} 
                    cost={engineRef.current.getCost('NIGHT_HAWK_TRANSPORT')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'NIGHT_HAWK_TRANSPORT')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'NIGHT_HAWK_TRANSPORT').length}
                    locked={!engineRef.current.isUnlocked('NIGHT_HAWK_TRANSPORT', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('NIGHT_HAWK_TRANSPORT')}
                    title="Ночной ястреб: Транспортный вертолет, невидимый для радаров."
                  />
                  <BuildButton 
                    label="Транспорт" 
                    icon={<Waves className="w-5 h-5 text-blue-400" />} 
                    cost={engineRef.current.getCost('AMPHIBIOUS_TRANSPORT')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'AMPHIBIOUS_TRANSPORT')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'AMPHIBIOUS_TRANSPORT').length}
                    locked={!engineRef.current.isUnlocked('AMPHIBIOUS_TRANSPORT', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('AMPHIBIOUS_TRANSPORT')}
                    title="Амфибия: Перевозит пехоту и технику по воде и суше."
                  />
                  <BuildButton 
                    label="Дельфин" 
                    icon={<Waves className="w-5 h-5 text-blue-300" />} 
                    cost={engineRef.current.getCost('DOLPHIN')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'DOLPHIN')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'DOLPHIN').length}
                    locked={!engineRef.current.isUnlocked('DOLPHIN', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('DOLPHIN')}
                    title="Дельфин: Скрытный морской юнит, эффективен против подлодок и гигантских кальмаров."
                  />
                  <BuildButton 
                    label="Крейсер Иджис" 
                    icon={<Shield className="w-5 h-5 text-blue-500" />} 
                    cost={engineRef.current.getCost('AEGIS_CRUISER')} 
                    progress={gameState.productionQueue.find(q => q.subType === 'AEGIS_CRUISER')?.progress}
                    count={gameState.productionQueue.filter(q => q.subType === 'AEGIS_CRUISER').length}
                    locked={!engineRef.current.isUnlocked('AEGIS_CRUISER', 'PLAYER')}
                    onClick={() => engineRef.current.startProduction('AEGIS_CRUISER')}
                    title="Крейсер Иджис: Мощная противовоздушная оборона на море."
                  />
                </>
              )}
            </div>
    </>
  );
};
