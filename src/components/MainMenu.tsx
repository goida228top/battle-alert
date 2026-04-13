import React from 'react';

interface MainMenuProps {
  setAppState: (state: 'MENU' | 'SKIRMISH_SETUP' | 'PLAYING') => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ setAppState }) => {
  return (
    <div className="absolute inset-0 z-[200] flex bg-[url('/assets/soviet_base.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Left side - Logo */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-12">
        <h1 className="text-[10rem] leading-none font-black text-red-600 mb-2 uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] font-display text-center">
          Battle<br />Alert
        </h1>
      </div>

      {/* Right side - Menu Buttons */}
      <div className="relative z-10 w-96 bg-zinc-950/80 border-l-2 border-red-900/50 p-8 flex flex-col justify-end">
        <div className="flex flex-col gap-4 mb-12">
          <button 
            onClick={() => setAppState('SKIRMISH_SETUP')}
            className="w-full py-4 px-6 text-left font-black uppercase tracking-widest text-xl text-zinc-300 hover:text-white hover:bg-red-900/40 border-l-4 border-transparent hover:border-red-500 transition-all"
          >
            Сражение
          </button>
          <button 
            className="w-full py-4 px-6 text-left font-black uppercase tracking-widest text-xl text-zinc-600 cursor-not-allowed border-l-4 border-transparent"
          >
            Мультиплеер
          </button>
          <button 
            className="w-full py-4 px-6 text-left font-black uppercase tracking-widest text-xl text-zinc-600 cursor-not-allowed border-l-4 border-transparent"
          >
            Настройки
          </button>
        </div>
      </div>
    </div>
  );
};
