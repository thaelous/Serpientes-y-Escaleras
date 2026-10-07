import React from 'react';

interface Dice3DProps {
  value: number;
  rolling: boolean;
  onRoll: () => void;
  disabled?: boolean;
}

export const Dice3D: React.FC<Dice3DProps> = ({ value, rolling, onRoll, disabled }) => {
  // Dot coordinate configurations for dice faces
  const renderDots = (num: number) => {
    switch (num) {
      case 1:
        return <div className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] m-auto" />;
      case 2:
        return (
          <div className="w-full h-full flex justify-between p-1.5">
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <div className="w-3 h-3 rounded-full bg-slate-200 self-end" />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full flex justify-between p-1.5">
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <div className="w-3 h-3 rounded-full bg-slate-200 self-center" />
            <div className="w-3 h-3 rounded-full bg-slate-200 self-end" />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full grid grid-cols-2 p-1.5 place-items-center">
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <div className="w-3 h-3 rounded-full bg-slate-200" />
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full grid grid-cols-3 p-1.5 place-items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div />
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
            <div />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
          </div>
        );
      case 6:
      default:
        return (
          <div className="w-full h-full grid grid-cols-2 grid-rows-3 p-1.5 place-items-center gap-0.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
          </div>
        );
    }
  };

  return (
    <button
      onClick={onRoll}
      disabled={disabled || rolling}
      aria-label="Lanzar dado de la arena"
      className={`group relative flex items-center gap-3.5 px-4 py-2 rounded-xl transition-all duration-200 select-none
        ${disabled
          ? 'opacity-40 cursor-not-allowed bg-slate-800/60 border border-slate-700/40 text-slate-400'
          : 'cursor-pointer bg-gradient-to-b from-rose-950/80 via-neutral-900 to-black hover:from-rose-900/90 border border-rose-500/40 hover:border-rose-400 shadow-[0_4px_20px_rgba(244,63,94,0.25)] hover:shadow-[0_4px_28px_rgba(244,63,94,0.45)] active:scale-95'
        }`}
    >
      {/* 3D Physical Die Display */}
      <div
        className={`w-11 h-11 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-950 border border-neutral-600/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),0_4px_10px_rgba(0,0,0,0.8)] flex items-center justify-center transition-transform duration-300
          ${rolling ? 'animate-spin scale-110 rotate-180 border-rose-500' : 'group-hover:scale-105'}`}
      >
        {renderDots(value || 1)}
      </div>

      {/* Button Text */}
      <div className="text-left">
        <span className="block text-[10px] uppercase font-mono tracking-widest text-rose-400 font-bold">
          {rolling ? 'Calculando...' : 'Lanzar Dado'}
        </span>
        <span className="block text-sm font-display font-bold tracking-wider text-white">
          {rolling ? 'GIRANDO...' : `VALOR: ${value || '-'}`}
        </span>
      </div>
    </button>
  );
};
