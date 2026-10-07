import React, { useEffect } from 'react';
import { Card, Player } from '../types';
import { sound } from '../audio';
import { ShieldCheck, Skull, ArrowRight } from 'lucide-react';

interface CardRevealModalProps {
  card: Card;
  targetPlayer: Player;
  onConfirm: () => void;
}

export const CardRevealModal: React.FC<CardRevealModalProps> = ({
  card,
  targetPlayer,
  onConfirm
}) => {
  const isAdvantage = card.type === 'ADVANTAGE';

  useEffect(() => {
    sound.playCardReveal();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className={`relative w-full max-w-md rounded-2xl p-6 sm:p-8 border-2 shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden text-center transition-all ${
          isAdvantage
            ? 'bg-neutral-950 border-emerald-500/80 shadow-[0_0_40px_rgba(16,185,129,0.3)]'
            : 'bg-neutral-950 border-rose-500/80 shadow-[0_0_40px_rgba(244,63,94,0.3)]'
        }`}
      >
        {/* Holographic Top Bar */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isAdvantage ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}
          >
            {isAdvantage ? <ShieldCheck size={20} /> : <Skull size={20} />}
          </div>
          <span
            className={`text-xs font-mono font-bold tracking-widest uppercase ${
              isAdvantage ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            TARJETA DE {isAdvantage ? 'VENTAJA' : 'DESVENTAJA'} REVELADA
          </span>
        </div>

        {/* Target Recipient Banner */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-xs font-mono text-slate-300 mb-6">
          <span>Destinatario:</span>
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: targetPlayer.color }}
          />
          <strong className="text-white font-display">{targetPlayer.name} (#{targetPlayer.number})</strong>
        </div>

        {/* Card Title */}
        <h3 className="text-2xl font-display font-black text-white tracking-wide uppercase mb-3">
          {card.title}
        </h3>

        {/* Card Main Action Description */}
        <div
          className={`p-4 rounded-xl border text-sm sm:text-base font-semibold leading-relaxed mb-4 ${
            isAdvantage
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}
        >
          {card.description}
        </div>

        {/* Flavor text */}
        <p className="text-xs font-mono italic text-neutral-400 mb-8 leading-normal px-2">
          "{card.flavor}"
        </p>

        {/* Confirm Action Button */}
        <button
          onClick={onConfirm}
          className={`w-full py-3.5 px-6 rounded-xl font-display font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
            isAdvantage
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)]'
              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_4px_20px_rgba(244,63,94,0.4)]'
          }`}
        >
          <span>Aplicar Efecto en Tablero</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
