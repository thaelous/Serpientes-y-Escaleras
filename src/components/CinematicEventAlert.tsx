import React from 'react';
import { Award, Check, Skull, Zap } from 'lucide-react';

interface CinematicEventAlertProps {
  notification: string | null;
  onDismiss: () => void;
}

export const CinematicEventAlert: React.FC<CinematicEventAlertProps> = ({
  notification,
  onDismiss
}) => {
  if (!notification) return null;

  const isHazard =
    notification.includes('serpiente') ||
    notification.includes('Boa') ||
    notification.includes('Cascabel') ||
    notification.includes('Coralillo') ||
    notification.includes('penalización') ||
    notification.includes('retrocede') ||
    notification.includes('congelado') ||
    notification.includes('Maldición');

  const isAchievement =
    notification.includes('sube') ||
    notification.includes('andamio') ||
    notification.includes('escalera') ||
    notification.includes('victoria') ||
    notification.includes('adicional') ||
    notification.includes('avanza') ||
    notification.includes('Pase Dorado') ||
    notification.includes('Escudo') ||
    notification.includes('renovado');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative max-w-2xl w-full p-6 sm:p-8 rounded-3xl border-3 shadow-[0_0_90px_rgba(0,0,0,0.98)] text-center transform animate-in zoom-in-95 duration-200 ${
          isHazard
            ? 'bg-neutral-950/98 border-rose-500/90 shadow-[0_0_70px_rgba(244,63,94,0.5)]'
            : isAchievement
            ? 'bg-neutral-950/98 border-amber-400/90 shadow-[0_0_70px_rgba(251,191,36,0.5)]'
            : 'bg-neutral-950/98 border-cyan-400/90 shadow-[0_0_70px_rgba(34,211,238,0.5)]'
        }`}
      >
        {/* Glow Ambient Effect */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-36 blur-3xl rounded-full pointer-events-none ${
            isHazard ? 'bg-rose-600/30' : isAchievement ? 'bg-amber-500/30' : 'bg-cyan-500/30'
          }`}
        />

        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-700 mb-4 shadow-inner">
          {isHazard ? (
            <>
              <Skull size={18} className="text-rose-400 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-400">
                ¡ALERTA TÁCTICA DE LA ARENA!
              </span>
            </>
          ) : isAchievement ? (
            <>
              <Award size={18} className="text-amber-400 animate-bounce" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                ¡SUCESO DESTACADO!
              </span>
            </>
          ) : (
            <>
              <Zap size={18} className="text-cyan-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                COMUNICADO CENTRAL
              </span>
            </>
          )}
        </div>

        {/* Central High Impact Message */}
        <h3
          className={`text-2xl sm:text-4xl font-display font-black tracking-wide uppercase leading-snug mb-6 ${
            isHazard
              ? 'text-rose-100 drop-shadow-[0_4px_16px_rgba(244,63,94,0.8)]'
              : isAchievement
              ? 'text-amber-200 drop-shadow-[0_4px_16px_rgba(251,191,36,0.8)]'
              : 'text-white drop-shadow-[0_4px_16px_rgba(255,255,255,0.6)]'
          }`}
        >
          {notification}
        </h3>

        {/* Manual Confirm / Dismiss Button [ CONTINUAR ] */}
        <div className="flex justify-center">
          <button
            onClick={onDismiss}
            className={`px-8 py-3.5 rounded-2xl font-display font-black text-sm uppercase tracking-wider text-white shadow-2xl transition-all cursor-pointer flex items-center gap-2.5 active:scale-95 ${
              isHazard
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/50 ring-2 ring-rose-400'
                : isAchievement
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/50 ring-2 ring-amber-400'
                : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/50 ring-2 ring-cyan-400'
            }`}
          >
            <span>CONTINUAR / ACEPTAR</span>
            <Check size={18} className="stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
