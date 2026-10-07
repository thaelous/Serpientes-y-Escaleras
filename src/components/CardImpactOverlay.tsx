import React, { useEffect, useState } from 'react';
import { Card, Player } from '../types';
import { sound } from '../audio';
import { Shield, Snowflake, RotateCcw, Flame, Sparkles, Skull, Check, Clock } from 'lucide-react';

interface CardImpactOverlayProps {
  card: Card;
  targetPlayer: Player;
  onComplete: () => void;
}

export const CardImpactOverlay: React.FC<CardImpactOverlayProps> = ({
  card,
  targetPlayer,
  onComplete
}) => {
  const isAdvantage = card.type === 'ADVANTAGE';
  const isDeferred = card.timing === 'DIFERIDO';
  const [isFading, setIsFading] = useState<boolean>(false);

  useEffect(() => {
    // Sound FX on presentation
    if (card.id.includes('escudo') || card.id.includes('campo') || card.id.includes('pase')) {
      sound.playShieldImpact();
    } else if (card.id.includes('crioturbina') || card.id.includes('presion')) {
      sound.playFreezeImpact();
    } else if (
      card.id.includes('frenado') ||
      card.id.includes('resbalon') ||
      card.id.includes('vortice') ||
      card.id.includes('trampa') ||
      card.id.includes('rebobinado')
    ) {
      sound.playVortexImpact();
    } else {
      sound.playCardReveal();
    }
  }, [card]);

  const handleApplyEffect = () => {
    setIsFading(true);
    sound.playStep();
    setTimeout(() => {
      onComplete();
    }, 250);
  };

  const renderIcon = () => {
    if (card.id === 'escudo_reptil' || card.id === 'campo_fuerza' || card.id === 'pase_dorado') {
      return <Shield size={48} className="text-cyan-400 animate-pulse" />;
    }
    if (card.id === 'crioturbina') {
      return <Snowflake size={48} className="text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />;
    }
    if (
      card.id.includes('frenado') ||
      card.id.includes('resbalon') ||
      card.id.includes('vortice') ||
      card.id.includes('trampa') ||
      card.id.includes('rebobinado')
    ) {
      return <RotateCcw size={48} className="text-rose-400 animate-bounce" />;
    }
    if (card.id === 'furia_dados') {
      return <Flame size={48} className="text-amber-400 animate-pulse" />;
    }
    return isAdvantage ? (
      <Sparkles size={48} className="text-emerald-400" />
    ) : (
      <Skull size={48} className="text-rose-400" />
    );
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-all duration-300 ${
        isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <div
        className={`relative w-full max-w-xl rounded-3xl bg-neutral-950 border-2 p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.98)] overflow-hidden text-center transition-all ${
          isAdvantage
            ? 'border-emerald-500/80 shadow-[0_0_50px_rgba(16,185,129,0.35)]'
            : 'border-rose-500/80 shadow-[0_0_50px_rgba(244,63,94,0.35)]'
        }`}
      >
        {/* Glow Ambient Floor */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 blur-3xl pointer-events-none rounded-full ${
            isAdvantage ? 'bg-emerald-500/20' : 'bg-rose-500/20'
          }`}
        />

        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border ${
              isAdvantage
                ? 'bg-emerald-950/90 text-emerald-400 border-emerald-800'
                : 'bg-rose-950/90 text-rose-400 border-rose-800'
            }`}
          >
            {isAdvantage ? '★ TARJETA DE VENTAJA' : '⚠️ TARJETA DE DESVENTAJA'}
          </span>

          <span
            className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border flex items-center gap-1.5 ${
              isDeferred
                ? 'bg-amber-950/90 text-amber-300 border-amber-800'
                : 'bg-blue-950/90 text-blue-300 border-blue-800'
            }`}
          >
            <Clock size={12} />
            {isDeferred ? 'EFECTO DIFERIDO' : 'EFECTO INMEDIATO'}
          </span>
        </div>

        {/* Central Icon */}
        <div
          className={`w-24 h-24 mx-auto rounded-3xl border flex items-center justify-center mb-4 shadow-inner ${
            isAdvantage
              ? 'bg-gradient-to-b from-emerald-950/60 to-neutral-900 border-emerald-500/40'
              : 'bg-gradient-to-b from-rose-950/60 to-neutral-900 border-rose-500/40'
          }`}
        >
          {renderIcon()}
        </div>

        {/* Card Title */}
        <h2 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-wide mb-2">
          {card.title}
        </h2>

        {/* Recipient Target Banner */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700 mb-5 shadow-sm">
          <span className="text-xs font-mono text-neutral-400">Destinatario:</span>
          <div
            className="w-4 h-4 rounded-full border border-white"
            style={{ backgroundColor: targetPlayer.color }}
          />
          <strong className="text-xs sm:text-sm font-display font-bold text-white">
            {targetPlayer.name} (#{targetPlayer.number})
          </strong>
        </div>

        {/* Card Main Explanation Box */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border text-left space-y-3 mb-5 ${
            isAdvantage
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-bold mb-1">
              ¿Qué hace este efecto?
            </span>
            <p className="text-sm sm:text-base font-semibold text-white leading-snug">
              {card.description}
            </p>
          </div>

          <div className="pt-2.5 border-t border-neutral-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 block font-bold mb-0.5">
              Momento de activación:
            </span>
            <p className="text-xs sm:text-sm text-neutral-300 font-medium">
              {card.timingDescription}
            </p>
          </div>
        </div>

        {/* Flavor Quote */}
        <p className="text-xs font-mono italic text-neutral-500 mb-6">
          "{card.flavor}"
        </p>

        {/* MANUAL ACTION BUTTON: [ ENTENDIDO / APLICAR EFECTO ] */}
        <button
          onClick={handleApplyEffect}
          className={`w-full py-4 px-6 rounded-2xl font-display font-black text-sm sm:text-base uppercase tracking-wider text-white shadow-2xl transition-all cursor-pointer flex items-center justify-center gap-3 active:scale-98 ${
            isAdvantage
              ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_4px_30px_rgba(16,185,129,0.5)] ring-2 ring-emerald-400'
              : 'bg-rose-600 hover:bg-rose-500 shadow-[0_4px_30px_rgba(244,63,94,0.5)] ring-2 ring-rose-400'
          }`}
        >
          <span>ENTENDIDO / APLICAR EFECTO</span>
          <Check size={20} className="stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
