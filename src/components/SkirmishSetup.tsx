import React from 'react';
import { Faction, Country } from '../game/types';
import { GameEngine } from '../game/GameEngine';

interface SkirmishSetupProps {
  selectedFaction: Faction;
  setSelectedFaction: (faction: Faction) => void;
  selectedCountry: Country;
  setSelectedCountry: (country: Country) => void;
  selectedMap: string;
  setSelectedMap: (map: string) => void;
  setAppState: (state: 'MENU' | 'SKIRMISH_SETUP' | 'PLAYING') => void;
  engineRef: React.MutableRefObject<GameEngine>;
  setGameState: (state: any) => void;
}

export const SkirmishSetup: React.FC<SkirmishSetupProps> = ({
  selectedFaction,
  setSelectedFaction,
  selectedCountry,
  setSelectedCountry,
  selectedMap,
  setSelectedMap,
  setAppState,
  engineRef,
  setGameState
}) => {
  return (
    <div className="absolute inset-0 z-[200] flex flex-col bg-[url('/assets/soviet_base.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      <div className="relative z-10 flex-1 flex flex-col p-8">
        <h1 className="text-4xl font-black text-red-600 mb-8 uppercase tracking-tighter font-display">
          Настройка Сражения
        </h1>
        
        <div className="flex-1 flex gap-8">
          {/* Left Panel: Player Settings */}
          <div className="flex-1 bg-zinc-900/80 border border-zinc-700 p-6 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-700 pb-2">Настройка игрока</h2>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase tracking-wider">Сторона</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setSelectedFaction('FEDERATION'); setSelectedCountry('RUSSIA'); }}
                    className={`flex-1 py-3 font-black uppercase tracking-widest border-2 transition-all ${selectedFaction === 'FEDERATION' ? 'bg-red-700 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'}`}
                  >
                    Федерация
                  </button>
                  <button 
                    onClick={() => { setSelectedFaction('COALITION'); setSelectedCountry('AMERICA'); }}
                    className={`flex-1 py-3 font-black uppercase tracking-widest border-2 transition-all ${selectedFaction === 'COALITION' ? 'bg-blue-700 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'}`}
                  >
                    Коалиция
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase tracking-wider">Страна</label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedFaction === 'FEDERATION' ? (
                    <>
                      <button onClick={() => setSelectedCountry('RUSSIA')} className={`py-2 text-xs font-bold uppercase border ${selectedCountry === 'RUSSIA' ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}>Россия</button>
                      <button onClick={() => setSelectedCountry('CUBA')} className={`py-2 text-xs font-bold uppercase border ${selectedCountry === 'CUBA' ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}>Куба</button>
                      <button onClick={() => setSelectedCountry('LIBYA')} className={`py-2 text-xs font-bold uppercase border ${selectedCountry === 'LIBYA' ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}>Ливия</button>
                      <button onClick={() => setSelectedCountry('IRAQ')} className={`py-2 text-xs font-bold uppercase border ${selectedCountry === 'IRAQ' ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}>Ирак</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setSelectedCountry('AMERICA')} className={`py-2 text-xs font-bold uppercase border ${selectedCountry === 'AMERICA' ? 'bg-blue-900/50 border-blue-500 text-blue-200' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}>Америка</button>
                      <button onClick={() => setSelectedCountry('BRITAIN')} className={`py-2 text-xs font-bold uppercase border ${selectedCountry === 'BRITAIN' ? 'bg-blue-900/50 border-blue-500 text-blue-200' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}>Британия</button>
                      <button onClick={() => setSelectedCountry('FRANCE')} className={`py-2 text-xs font-bold uppercase border ${selectedCountry === 'FRANCE' ? 'bg-blue-900/50 border-blue-500 text-blue-200' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}>Франция</button>
                      <button onClick={() => setSelectedCountry('GERMANY')} className={`py-2 text-xs font-bold uppercase border ${selectedCountry === 'GERMANY' ? 'bg-blue-900/50 border-blue-500 text-blue-200' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}>Германия</button>
                      <button onClick={() => setSelectedCountry('KOREA')} className={`py-2 text-xs font-bold uppercase border col-span-2 ${selectedCountry === 'KOREA' ? 'bg-blue-900/50 border-blue-500 text-blue-200' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}>Корея</button>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-2 p-3 bg-black/40 border border-zinc-800 rounded">
                <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Особое оружие:</div>
                <div className="text-sm font-bold text-zinc-200 italic">
                  {selectedCountry === 'RUSSIA' && 'Тесла-танк: Эффективен против пехоты и легкой техники.'}
                  {selectedCountry === 'CUBA' && 'Террорист: Пехотинец-смертник с мощным зарядом.'}
                  {selectedCountry === 'LIBYA' && 'Демо-грузовик: Грузовик с ядерным зарядом.'}
                  {selectedCountry === 'IRAQ' && 'Опустошитель: Пехотинец, заражающий местность радиацией.'}
                  {selectedCountry === 'AMERICA' && 'Десант: Бесплатные десантники каждые несколько минут.'}
                  {selectedCountry === 'BRITAIN' && 'Снайпер: Дальнобойная пехота, мгновенно убивающая людей.'}
                  {selectedCountry === 'FRANCE' && 'Пушка: Мощное оборонительное орудие большой дальности.'}
                  {selectedCountry === 'GERMANY' && 'Истребитель танков: Бронетехника для борьбы с танками.'}
                  {selectedCountry === 'KOREA' && 'Черный орел: Улучшенный самолет с мощными ракетами.'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Game Settings */}
          <div className="flex-1 bg-zinc-900/80 border border-zinc-700 p-6 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-700 pb-2">Настройка игры</h2>
            
            <div>
              <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase tracking-wider">Выбор карты</label>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setSelectedMap('RIVER_DIVIDE')}
                  className={`py-3 px-4 text-left font-bold uppercase tracking-widest border-2 transition-all ${selectedMap === 'RIVER_DIVIDE' ? 'bg-zinc-700 text-white border-zinc-400' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'}`}
                >
                  Разделение рекой (Умеренный)
                </button>
                <button 
                  onClick={() => setSelectedMap('DESERT_OASIS')}
                  className={`py-3 px-4 text-left font-bold uppercase tracking-widest border-2 transition-all ${selectedMap === 'DESERT_OASIS' ? 'bg-zinc-700 text-white border-zinc-400' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'}`}
                >
                  Пустынный оазис (Пустыня)
                </button>
                <button 
                  onClick={() => setSelectedMap('SNOWY_PASS')}
                  className={`py-3 px-4 text-left font-bold uppercase tracking-widest border-2 transition-all ${selectedMap === 'SNOWY_PASS' ? 'bg-zinc-700 text-white border-zinc-400' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'}`}
                >
                  Снежный перевал (Снег)
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 text-zinc-500 mt-4">
              <span className="mb-2">Превью карты (Недоступно)</span>
              <span className="text-xs text-zinc-600 text-center">
                {selectedMap === 'RIVER_DIVIDE' && 'Река делит поле боя с двумя стратегическими мостами.'}
                {selectedMap === 'DESERT_OASIS' && 'Открытая пустыня с центральным оазисом и разбросанными ресурсами.'}
                {selectedMap === 'SNOWY_PASS' && 'Замерзший ландшафт с горизонтальной рекой и узкими переправами.'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex justify-between items-center w-full">
          <button 
            onClick={() => setAppState('MENU')}
            className="py-4 px-12 font-black uppercase tracking-widest border-2 bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 transition-all"
          >
            Назад
          </button>
          <button 
            onClick={() => {
              engineRef.current.resetGame(selectedFaction, selectedCountry, selectedMap);
              setGameState(engineRef.current.state);
              setAppState('PLAYING');
            }}
            className={`py-4 px-16 font-black uppercase tracking-widest border-2 transition-all ${selectedFaction === 'FEDERATION' ? 'bg-red-700 hover:bg-red-600 text-white border-red-500/50 hover:border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'bg-blue-700 hover:bg-blue-600 text-white border-blue-500/50 hover:border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.4)]'}`}
          >
            Начать игру
          </button>
        </div>
      </div>
    </div>
  );
};
