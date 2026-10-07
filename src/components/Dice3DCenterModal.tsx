import React, { useEffect, useState } from 'react';
import { sound } from '../audio';
import { ArrowRight, Sparkles } from 'lucide-react';

interface Dice3DCenterModalProps {
  value: number;
  secondValue?: number | null; // in case of Furia de Dados (2 dice)
  onComplete: () => void;
}

export const Dice3DCenterModal: React.FC<Dice3DCenterModalProps> = ({
  value,
  secondValue,
  onComplete
}) => {
  const [phase, setPhase] = useState<'SPINNING' | 'SETTLED' | 'FADING'>('SPINNING');
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    sound.playDiceRoll();

    // Trigger CSS transition on next microtask
    const animTimer = setTimeout(() => {
      setAnimated(true);
    }, 40);

    // 1.25s of rapid volumetric 3D tumble settling precisely on target face
    const t1 = setTimeout(() => {
      setPhase('SETTLED');
      sound.playDiceStop();
    }, 1250);

    return () => {
      clearTimeout(animTimer);
      clearTimeout(t1);
    };
  }, []);

  const handleConfirmAndAdvance = () => {
    if (phase !== 'FADING') {
      setPhase('FADING');
      setTimeout(onComplete, 220);
    }
  };

  // Exact rotation matrix specified by the user:
  // Cara 1: rotateX(0deg) rotateY(0deg)
  // Cara 2: rotateX(-90deg) rotateY(0deg)
  // Cara 3: rotateY(90deg)
  // Cara 4: rotateY(-90deg)
  // Cara 5: rotateX(90deg)
  // Cara 6: rotateX(180deg)
  const getCubeRotation = (targetNum: number, isRolling: boolean) => {
    if (!isRolling) {
      return { x: -180, y: -360, z: -120 };
    }

    const baseX = 720;
    const baseY = 1080;
    const baseZ = 360;

    switch (targetNum) {
      case 1:
        return { x: baseX + 0, y: baseY + 0, z: baseZ };
      case 2:
        return { x: baseX - 90, y: baseY + 0, z: baseZ };
      case 3:
        return { x: baseX + 0, y: baseY + 90, z: baseZ };
      case 4:
        return { x: baseX + 0, y: baseY - 90, z: baseZ };
      case 5:
        return { x: baseX + 90, y: baseY + 0, z: baseZ };
      case 6:
      default:
        return { x: baseX + 180, y: baseY + 0, z: baseZ };
    }
  };

  // Render pips on a face
  const renderFacePips = (num: number) => {
    const pipCommon =
      'w-4 h-4 sm:w-5 sm:h-5 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.7)] transition-all';
    const blackPip = `${pipCommon} bg-[#0f172a]`;
    const redPip = `${pipCommon} bg-[#e11d48] shadow-[0_0_12px_rgba(225,29,72,0.8),inset_0_2px_4px_rgba(0,0,0,0.6)]`;

    switch (num) {
      case 1:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full ${redPip}`} />
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full flex justify-between p-3.5 sm:p-4">
            <div className={blackPip} />
            <div className={`${blackPip} self-end`} />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full flex justify-between p-3 sm:p-3.5">
            <div className={blackPip} />
            <div className={`${blackPip} self-center`} />
            <div className={`${blackPip} self-end`} />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full grid grid-cols-2 p-3 sm:p-4 place-items-center">
            <div className={blackPip} />
            <div className={blackPip} />
            <div className={blackPip} />
            <div className={blackPip} />
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full grid grid-cols-3 p-2.5 sm:p-3 place-items-center">
            <div className={blackPip} />
            <div />
            <div className={blackPip} />
            <div />
            <div className={blackPip} />
            <div />
            <div className={blackPip} />
            <div />
            <div className={blackPip} />
          </div>
        );
      case 6:
      default:
        return (
          <div className="w-full h-full grid grid-cols-2 grid-rows-3 p-2.5 sm:p-3 place-items-center gap-1">
            <div className={blackPip} />
            <div className={blackPip} />
            <div className={blackPip} />
            <div className={blackPip} />
            <div className={blackPip} />
            <div className={blackPip} />
          </div>
        );
    }
  };

  // Render a real 3D volumetric cube with 6 physical faces mapped exactly:
  // Face 1 (Front: rotateY 0)
  // Face 2 (Top: rotateX 90) -> tilts down to front when rotateX(-90)
  // Face 3 (Left: rotateY -90) -> turns to front when rotateY(90)
  // Face 4 (Right: rotateY 90) -> turns to front when rotateY(-90)
  // Face 5 (Bottom: rotateX -90) -> tilts up to front when rotateX(90)
  // Face 6 (Back: rotateX 180) -> flips to front when rotateX(180)
  const renderVolumetricCube = (val: number, label?: string) => {
    const rot = getCubeRotation(val, animated);

    return (
      <div className="flex flex-col items-center">
        {/* 3D Scene Viewport */}
        <div
          className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center select-none"
          style={{ perspective: '1100px' }}
        >
          {/* Volumetric Rotating Cube */}
          <div
            className="w-32 h-32 sm:w-36 sm:h-36 relative transition-transform"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg) rotateZ(${rot.z}deg)`,
              transitionDuration: animated ? '1.25s' : '0s',
              transitionTimingFunction: 'cubic-bezier(0.18, 0.89, 0.32, 1.15)'
            }}
          >
            {/* Cara 1: Front */}
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-[#f8fafc] to-[#e2e8f0] border-2 border-slate-300 shadow-[inset_0_2px_8px_rgba(255,255,255,0.9),inset_0_-2px_6px_rgba(0,0,0,0.15),0_6px_20px_rgba(0,0,0,0.4)] flex items-center justify-center"
              style={{ transform: 'rotateY(0deg) translateZ(64px)' }}
            >
              {renderFacePips(1)}
            </div>

            {/* Cara 2: Top (tilts to front at rotateX -90) */}
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-[#f8fafc] to-[#e2e8f0] border-2 border-slate-300 shadow-[inset_0_2px_8px_rgba(255,255,255,0.9),inset_0_-2px_6px_rgba(0,0,0,0.15),0_6px_20px_rgba(0,0,0,0.4)] flex items-center justify-center"
              style={{ transform: 'rotateX(90deg) translateZ(64px)' }}
            >
              {renderFacePips(2)}
            </div>

            {/* Cara 3: Left (turns to front at rotateY 90) */}
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-[#f8fafc] to-[#e2e8f0] border-2 border-slate-300 shadow-[inset_0_2px_8px_rgba(255,255,255,0.9),inset_0_-2px_6px_rgba(0,0,0,0.15),0_6px_20px_rgba(0,0,0,0.4)] flex items-center justify-center"
              style={{ transform: 'rotateY(-90deg) translateZ(64px)' }}
            >
              {renderFacePips(3)}
            </div>

            {/* Cara 4: Right (turns to front at rotateY -90) */}
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-[#f8fafc] to-[#e2e8f0] border-2 border-slate-300 shadow-[inset_0_2px_8px_rgba(255,255,255,0.9),inset_0_-2px_6px_rgba(0,0,0,0.15),0_6px_20px_rgba(0,0,0,0.4)] flex items-center justify-center"
              style={{ transform: 'rotateY(90deg) translateZ(64px)' }}
            >
              {renderFacePips(4)}
            </div>

            {/* Cara 5: Bottom (tilts to front at rotateX 90) */}
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-[#f8fafc] to-[#e2e8f0] border-2 border-slate-300 shadow-[inset_0_2px_8px_rgba(255,255,255,0.9),inset_0_-2px_6px_rgba(0,0,0,0.15),0_6px_20px_rgba(0,0,0,0.4)] flex items-center justify-center"
              style={{ transform: 'rotateX(-90deg) translateZ(64px)' }}
            >
              {renderFacePips(5)}
            </div>

            {/* Cara 6: Back (flips to front at rotateX 180) */}
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-[#f8fafc] to-[#e2e8f0] border-2 border-slate-300 shadow-[inset_0_2px_8px_rgba(255,255,255,0.9),inset_0_-2px_6px_rgba(0,0,0,0.15),0_6px_20px_rgba(0,0,0,0.4)] flex items-center justify-center"
              style={{ transform: 'rotateX(180deg) translateZ(64px)' }}
            >
              {renderFacePips(6)}
            </div>
          </div>
        </div>

        {label && (
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 mt-3 font-semibold">
            {label}
          </span>
        )}
      </div>
    );
  };

  const total = secondValue ? value + secondValue : value;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity duration-300 ${
        phase === 'FADING' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      {/* Container Card */}
      <div className="relative max-w-xl w-full flex flex-col items-center p-6 sm:p-8 rounded-3xl bg-neutral-950/95 border-2 border-rose-500/70 shadow-[0_0_90px_rgba(244,63,94,0.45)] text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Glow Ambient Floor */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-rose-500/20 blur-3xl pointer-events-none rounded-full" />

        {/* Top Header Label */}
        <div className="mb-6 space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-xs font-mono mb-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-rose-400 font-bold uppercase tracking-widest">
              {phase === 'SPINNING' ? 'CALCULANDO TRAYECTORIA 3D...' : '¡DADO ASENTADO!'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-wider">
            {phase === 'SPINNING'
              ? 'GIRANDO...'
              : secondValue
              ? `TOTAL: ${total}`
              : `VALOR: ${value}`}
          </h2>
        </div>

        {/* 3D Volumetric Dice Arena */}
        <div className="my-4 flex items-center justify-center gap-8 sm:gap-12 min-h-[180px]">
          {renderVolumetricCube(value, secondValue ? 'Dado 1' : undefined)}
          {secondValue && renderVolumetricCube(secondValue, 'Dado 2')}
        </div>

        {/* Action Prompt with Manual Button [ CONTINUAR / AVANZAR ] */}
        <div className="mt-6 flex flex-col items-center gap-3 w-full">
          <div className="px-5 py-2 rounded-full bg-neutral-900 border border-neutral-700 text-xs sm:text-sm font-mono text-slate-300 flex items-center gap-2">
            <Sparkles size={14} className="text-amber-400" />
            <span>
              {phase === 'SPINNING'
                ? 'Física de impacto y rotación volumétrica...'
                : `Resultado verificado: ${total} ${total === 1 ? 'casilla' : 'casillas'}. Pulsa para avanzar.`}
            </span>
          </div>

          {phase === 'SETTLED' && (
            <button
              onClick={handleConfirmAndAdvance}
              className="mt-2 w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-display font-black text-sm uppercase tracking-wider shadow-xl shadow-rose-600/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ring-2 ring-rose-400"
            >
              <span>CONTINUAR / AVANZAR FICHA</span>
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
