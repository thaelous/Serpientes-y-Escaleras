import React from 'react';
import { Player, AvatarConfig } from '../types';
import { getDefaultAvatar } from '../utils/avatarUtils';

export type CharacterAction = 'IDLE' | 'WALKING' | 'CLIMBING' | 'SLIDING';

interface CharacterAvatarProps {
  player: Player;
  action?: CharacterAction;
  isActive?: boolean;
  facingDirection?: 'left' | 'right';
  isTeleporting?: boolean;
  isSkidding?: boolean;
  hasVortexEffect?: boolean;
  hasRocketBootsEffect?: boolean;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  player,
  action = 'IDLE',
  isActive = false,
  facingDirection = 'right',
  isTeleporting = false,
  isSkidding = false,
  hasVortexEffect = false,
  hasRocketBootsEffect = false
}) => {
  // Ensure avatar config exists with fallback
  const avatar: AvatarConfig = player.avatar || getDefaultAvatar(player.number);

  // Status check for persistent card transformations
  const isFrozen = player.modifiers.crioturbina > 0;
  const hasOrbitingDice = player.modifiers.furiaDados || player.modifiers.tiroAdicional;
  const hasShieldProtection = player.shields.escudoReptil;
  const hasForceFieldDome = player.shields.campoFuerza;
  const hasPaseDorado = player.shields.paseDorado;
  const hasHeavyWeight = player.modifiers.gravedadPesada || player.modifiers.dadoPlomo;
  const hasPressureBlindfold = player.modifiers.presionExtrema;

  const skin = avatar.skinTone || '#ffd7ba';
  const hair = avatar.hairColor || '#0f172a';
  const hasRebote = player.shields.rebote;

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none transition-all duration-300
        ${action === 'WALKING' ? 'animate-char-walk' : ''}
        ${action === 'CLIMBING' ? 'animate-char-climb' : ''}
        ${action === 'SLIDING' ? 'animate-char-slide' : ''}
        ${action === 'IDLE' ? 'animate-char-idle' : ''}
        ${isFrozen ? 'animate-char-shiver' : ''}
        ${isActive ? 'scale-105 z-20' : 'z-10'}
      `}
      style={{
        width: '38px',
        height: '48px'
      }}
    >
      <style>{`
        @keyframes char-idle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.5px); }
        }
        @keyframes walk-bob {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-3.5px) rotate(1.2deg); }
          50% { transform: translateY(0.5px); }
          75% { transform: translateY(-3.5px) rotate(-1.2deg); }
        }
        .animate-char-walk {
          animation: walk-bob 0.35s ease-in-out infinite;
        }
        @keyframes leg-swing-left {
          0% { transform: rotate(-26deg); }
          50% { transform: rotate(26deg); }
          100% { transform: rotate(-26deg); }
        }
        @keyframes leg-swing-right {
          0% { transform: rotate(26deg); }
          50% { transform: rotate(-26deg); }
          100% { transform: rotate(26deg); }
        }
        @keyframes arm-swing-left {
          0% { transform: rotate(30deg); }
          50% { transform: rotate(-30deg); }
          100% { transform: rotate(30deg); }
        }
        @keyframes arm-swing-right {
          0% { transform: rotate(-30deg); }
          50% { transform: rotate(30deg); }
          100% { transform: rotate(-30deg); }
        }
        .animate-leg-left {
          transform-box: fill-box;
          transform-origin: top center;
          animation: leg-swing-left 0.35s ease-in-out infinite;
        }
        .animate-leg-right {
          transform-box: fill-box;
          transform-origin: top center;
          animation: leg-swing-right 0.35s ease-in-out infinite;
        }
        .animate-arm-left {
          transform-box: fill-box;
          transform-origin: top center;
          animation: arm-swing-left 0.35s ease-in-out infinite;
        }
        .animate-arm-right {
          transform-box: fill-box;
          transform-origin: top center;
          animation: arm-swing-right 0.35s ease-in-out infinite;
        }
        @keyframes char-climb {
          0%, 100% { transform: translateY(-2px) scaleY(0.95); }
          50% { transform: translateY(-7px) scaleY(1.05); }
        }
        @keyframes char-slide {
          0%, 100% { transform: rotate(-16deg) translateY(2px); }
          50% { transform: rotate(-24deg) translateY(5px); }
        }
        @keyframes char-shiver {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-1.5px, 1px); }
          50% { transform: translate(1px, -1px); }
          75% { transform: translate(-1px, -1px); }
        }
        @keyframes orbit-dice-1 {
          0% { transform: rotate(0deg) translateX(20px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
        }
        @keyframes orbit-dice-2 {
          0% { transform: rotate(180deg) translateX(20px) rotate(-180deg); }
          100% { transform: rotate(540deg) translateX(20px) rotate(-540deg); }
        }
        @keyframes rocket-thrust {
          0%, 100% { transform: scaleY(0.9) scaleX(0.9); opacity: 0.8; }
          50% { transform: scaleY(1.3) scaleX(1.1); opacity: 1; }
        }
        @keyframes vortex-spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes beam-ascend {
          0% { opacity: 0.3; transform: scaleY(0.7); }
          50% { opacity: 0.95; transform: scaleY(1.1); }
          100% { opacity: 0.3; transform: scaleY(0.7); }
        }
        @keyframes hourglass-shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-12deg); }
          75% { transform: rotate(12deg); }
        }
        @keyframes forcefield-pulse {
          0%, 100% { box-shadow: 0 0 15px rgba(56, 189, 248, 0.6), inset 0 0 10px rgba(56, 189, 248, 0.4); }
          50% { box-shadow: 0 0 25px rgba(56, 189, 248, 0.95), inset 0 0 18px rgba(56, 189, 248, 0.7); }
        }
      `}</style>

      {/* =========================================================================
          TRANSFORMACIONES VISUALES Y ACCESORIOS DE TARJETAS
          ========================================================================= */}

      {/* 1. VENTAJAS: TIRO ADICIONAL / FURIA DE DADOS (Dos mini dados dorados orbitando) */}
      {hasOrbitingDice && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-12 h-12 pointer-events-none z-30">
          <div
            className="absolute top-1/2 left-1/2 -mt-2 -ml-2 w-4 h-4 rounded bg-amber-400 border border-amber-200 shadow-[0_0_10px_#fbbf24] flex items-center justify-center text-[9px] font-black text-amber-950 font-mono"
            style={{ animation: 'orbit-dice-1 2.2s linear infinite' }}
          >
            ⚅
          </div>
          <div
            className="absolute top-1/2 left-1/2 -mt-2 -ml-2 w-4 h-4 rounded bg-amber-300 border border-amber-100 shadow-[0_0_10px_#fbbf24] flex items-center justify-center text-[9px] font-black text-amber-950 font-mono"
            style={{ animation: 'orbit-dice-2 2.2s linear infinite' }}
          >
            ⚄
          </div>
        </div>
      )}

      {/* 1. VENTAJAS: CAMPO DE FUERZA (Cúpula electromagnética poligonal con destellos) */}
      {hasForceFieldDome && (
        <div
          className="absolute -inset-3 rounded-full pointer-events-none z-30 border-2 border-cyan-400/80 bg-cyan-400/15"
          style={{ animation: 'forcefield-pulse 2s ease-in-out infinite' }}
        >
          <div className="w-full h-full rounded-full opacity-60 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:6px_6px]" />
        </div>
      )}

      {/* 1. VENTAJAS: PASE DORADO (Ticket dorado con estrella VIP) */}
      {hasPaseDorado && (
        <div className="absolute -top-7 -right-2 pointer-events-none z-30 animate-bounce">
          <div className="px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-300 to-yellow-500 border border-yellow-200 shadow-[0_0_10px_#f59e0b] flex items-center gap-0.5 text-[8px] font-black text-amber-950 font-mono">
            <span>★</span>
            <span>VIP</span>
          </div>
        </div>
      )}

      {/* 1. VENTAJAS: REBOTE (Escudo reflector hexagonal espejado) */}
      {hasRebote && (
        <div className="absolute -inset-2 rounded-2xl border-2 border-pink-400/80 bg-pink-500/10 pointer-events-none z-30 shadow-[0_0_15px_rgba(236,72,153,0.6)]">
          <div className="absolute -top-2 -right-1 px-1 py-0.2 rounded-full bg-pink-600 border border-pink-300 text-white text-[8px] font-bold shadow flex items-center gap-0.5">
            <span>🪞</span>
            <span className="text-[7px] font-mono">REBOTE</span>
          </div>
        </div>
      )}

      {/* 1. VENTAJAS: ASCENSOR DIRECTO / TELETRANSPORTE (Haz de luz vertical sci-fi) */}
      {isTeleporting && (
        <div
          className="absolute -inset-x-2 -top-12 -bottom-2 pointer-events-none z-35 flex items-center justify-center"
          style={{ animation: 'beam-ascend 0.8s ease-in-out infinite' }}
        >
          <div className="w-full h-full bg-gradient-to-t from-cyan-400 via-sky-300 to-transparent opacity-80 blur-xs rounded-full shadow-[0_0_30px_#38bdf8]" />
        </div>
      )}

      {/* 2. DESVENTAJAS: CRIOTURBINA / CONGELADO (Bloque de hielo translúcido y temblor) */}
      {isFrozen && (
        <div className="absolute -inset-1 rounded-xl bg-cyan-300/30 border-2 border-cyan-200/90 backdrop-blur-[0.5px] shadow-[0_0_16px_rgba(56,189,248,0.8),inset_0_0_8px_rgba(56,189,248,0.5)] pointer-events-none z-35 flex flex-col items-center justify-between p-0.5">
          <span className="text-[9px] drop-shadow leading-none">❄️</span>
          <span className="text-[8px] font-mono font-black text-cyan-100 tracking-wider bg-cyan-950/70 px-1 rounded">HIELO</span>
          <span className="text-[9px] drop-shadow leading-none">❄️</span>
        </div>
      )}

      {/* 2. DESVENTAJAS: PRESIÓN EXTREMA (Reloj de arena agitándose sobre la cabeza) */}
      {hasPressureBlindfold && (
        <div
          className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          style={{ animation: 'hourglass-shake 0.8s ease-in-out infinite' }}
        >
          <div className="px-1.5 py-0.5 rounded-md bg-rose-950 border border-rose-500 shadow-[0_0_10px_#f43f5e] flex items-center gap-1">
            <span className="text-[10px]">⏳</span>
            <span className="text-[8px] font-mono font-bold text-rose-300">8s</span>
          </div>
        </div>
      )}

      {/* 2. DESVENTAJAS: GRAVEDAD PESADA / DADO PLOMO (Pesada cadena con yunque sobre el avatar) */}
      {hasHeavyWeight && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none z-30 flex flex-col items-center animate-bounce">
          <div className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-500 text-[8px] font-black text-amber-400 font-mono shadow-xl flex items-center gap-0.5">
            <span>⚓</span>
            <span>YUNQUE 500KG</span>
          </div>
          <div className="w-0.5 h-2.5 bg-zinc-400 border-x border-zinc-600" />
        </div>
      )}

      {/* 2. DESVENTAJAS: VÓRTICE / TRAMPA (Remolino oscuro giratorio debajo de los pies) */}
      {hasVortexEffect && (
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-14 h-6 pointer-events-none z-5"
          style={{ animation: 'vortex-spin 1.4s linear infinite' }}
        >
          <ellipse cx="28" cy="12" rx="26" ry="10" fill="rgba(147, 51, 234, 0.4)" />
          <ellipse cx="28" cy="12" rx="18" ry="6" fill="rgba(15, 23, 42, 0.85)" stroke="#a855f7" strokeWidth="1.5" />
        </div>
      )}

      {/* 2. DESVENTAJAS: FRENADO / RESBALÓN (Marcas de aceite y humo de derrape en el suelo) */}
      {isSkidding && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex gap-2">
          <div className="w-4 h-1 bg-stone-900 rounded-full shadow-[0_0_6px_#000]" />
          <div className="w-4 h-1 bg-stone-900 rounded-full shadow-[0_0_6px_#000]" />
        </div>
      )}

      {/* =========================================================================
          SISTEMA MODULAR VECTORIAL DEL PERSONAJE SVG (ORDEN ESTRICTO DE CAPAS)
          ========================================================================= */}
      <div
        className={`w-full h-full flex items-center justify-center transition-transform duration-200 ${
          hasHeavyWeight ? 'origin-bottom -rotate-6' : ''
        }`}
        style={{
          transform: facingDirection === 'left' ? 'scaleX(-1)' : 'scaleX(1)'
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 38 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 overflow-visible drop-shadow-[0_4px_6px_rgba(0,0,0,0.65)]"
        >
          {/* CAPA 1: Sombra base en el suelo */}
          <ellipse cx="19" cy="45" rx="10" ry="3" fill="rgba(0,0,0,0.4)" />

          {/* CAPA 2: Cabello posterior (detrás del cráneo y hombros para afro, melenas largas y coleta) */}
          {avatar.hairType === 'afro' && (
            <ellipse cx="19" cy="14" rx="9.8" ry="8.8" fill={hair} />
          )}
          {avatar.hairType === 'rizado' && (
            <ellipse cx="19" cy="13.5" rx="8.8" ry="7.5" fill={hair} />
          )}
          {avatar.hairType === 'lacio_largo' && (
            <path
              d="M 11.5 15 L 10 27 L 13.5 27 L 13.5 17 L 24.5 17 L 24.5 27 L 28 27 L 26.5 15 Z"
              fill={hair}
            />
          )}
          {avatar.hairType === 'coleta' && (
            <path
              d="M 23 14 C 29 11, 33 18, 29 23 C 30 19, 28 15, 24 14.5 Z"
              fill={hair}
            />
          )}

          {/* CAPA 3: Cuello y Base de Cabeza con Orejas */}
          <rect x="17.5" y="21.5" width="3" height="3.5" fill={skin} />
          {/* Orejas ancladas al contorno del rostro */}
          <circle cx="11.4" cy="16.5" r="1.6" fill={skin} stroke="#78350f" strokeWidth="0.6" />
          <circle cx="26.6" cy="16.5" r="1.6" fill={skin} stroke="#78350f" strokeWidth="0.6" />
          {/* Cráneo Facial */}
          <circle
            cx="19"
            cy="16"
            r={avatar.gender === 'femenino' ? '7.3' : avatar.gender === 'masculino' ? '7.7' : '7.5'}
            fill={skin}
            stroke="#78350f"
            strokeWidth="0.8"
          />

          {/* CAPA 4: Extremidades inferiores (Piernas y calzado) */}
          {action === 'WALKING' ? (
            <>
              {/* Pierna izquierda */}
              <g className="animate-leg-left">
                <line
                  x1="15"
                  y1="36"
                  x2="11"
                  y2="44"
                  stroke={avatar.outfit === 'traje_formal' ? '#1e293b' : avatar.outfit === 'overol_industrial' ? '#0369a1' : player.color}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="11" cy="44" r="2.4" fill={avatar.outfit === 'traje_formal' ? '#0f172a' : '#ffffff'} stroke="#334155" strokeWidth="0.8" />
                
                {hasRocketBootsEffect && (
                  <g transform="translate(11, 44)">
                    <rect x="-3" y="-3" width="6" height="5" rx="1" fill="#ea580c" stroke="#fed7aa" strokeWidth="0.8" />
                    <path d="M -2 2 L 0 7 L 2 2 Z" fill="#facc15" style={{ animation: 'rocket-thrust 0.25s ease-out infinite' }} />
                  </g>
                )}
              </g>

              {/* Pierna derecha */}
              <g className="animate-leg-right">
                <line
                  x1="23"
                  y1="36"
                  x2="27"
                  y2="44"
                  stroke={avatar.outfit === 'traje_formal' ? '#1e293b' : avatar.outfit === 'overol_industrial' ? '#0369a1' : player.color}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="27" cy="44" r="2.4" fill={avatar.outfit === 'traje_formal' ? '#0f172a' : '#ffffff'} stroke="#334155" strokeWidth="0.8" />

                {hasRocketBootsEffect && (
                  <g transform="translate(27, 44)">
                    <rect x="-3" y="-3" width="6" height="5" rx="1" fill="#ea580c" stroke="#fed7aa" strokeWidth="0.8" />
                    <path d="M -2 2 L 0 7 L 2 2 Z" fill="#facc15" style={{ animation: 'rocket-thrust 0.25s ease-out infinite' }} />
                  </g>
                )}
              </g>
            </>
          ) : action === 'CLIMBING' ? (
            <g stroke={avatar.outfit === 'traje_formal' ? '#1e293b' : avatar.outfit === 'overol_industrial' ? '#0369a1' : player.color} strokeWidth="3.5" strokeLinecap="round">
              <line x1="15" y1="36" x2="13" y2="41" />
              <line x1="23" y1="36" x2="25" y2="44" />
              <circle cx="13" cy="41" r="2.2" fill="#ffffff" stroke="#334155" strokeWidth="0.8" />
              <circle cx="25" cy="44" r="2.2" fill="#ffffff" stroke="#334155" strokeWidth="0.8" />
            </g>
          ) : (
            <g stroke={avatar.outfit === 'traje_formal' ? '#1e293b' : avatar.outfit === 'overol_industrial' ? '#0369a1' : player.color} strokeWidth="3.5" strokeLinecap="round">
              <line x1="15" y1="36" x2="14" y2="44" />
              <line x1="23" y1="36" x2="24" y2="44" />
              <circle cx="14" cy="44" r="2.2" fill={avatar.outfit === 'traje_formal' ? '#0f172a' : '#ffffff'} stroke="#334155" strokeWidth="0.8" />
              <circle cx="24" cy="44" r="2.2" fill={avatar.outfit === 'traje_formal' ? '#0f172a' : '#ffffff'} stroke="#334155" strokeWidth="0.8" />
            </g>
          )}

          {/* CAPA 5: Torso, Uniformes y Ropa */}
          {avatar.outfit === 'traje_formal' ? (
            <g>
              <path d="M 11 25 C 11 23, 27 23, 27 25 L 26 36 L 12 36 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1.2" />
              <polygon points="16,24 22,24 19,30" fill="#ffffff" />
              <polygon points="18.3,25 19.7,25 19.4,32 18.6,32" fill="#090a0f" />
              <line x1="13" y1="25" x2="18" y2="33" stroke="#334155" strokeWidth="1" />
              <line x1="25" y1="25" x2="20" y2="33" stroke="#334155" strokeWidth="1" />
            </g>
          ) : avatar.outfit === 'camiseta_chaleco' ? (
            <g>
              <path d="M 11 25 C 11 23, 27 23, 27 25 L 26 36 L 12 36 Z" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.2" />
              <path d="M 11 25 L 15 25 L 16 36 L 12 36 Z" fill="#3f3f46" />
              <path d="M 27 25 L 23 25 L 22 36 L 26 36 Z" fill="#3f3f46" />
              <rect x="13" y="29" width="3" height="3" rx="0.5" fill="#71717a" />
              <rect x="22" y="29" width="3" height="3" rx="0.5" fill="#71717a" />
            </g>
          ) : avatar.outfit === 'overol_industrial' ? (
            <g>
              <path d="M 11 25 C 11 23, 27 23, 27 25 L 26 36 L 12 36 Z" fill="#f59e0b" stroke="#0f172a" strokeWidth="1.2" />
              <rect x="13" y="27" width="12" height="9" fill="#0369a1" />
              <line x1="14" y1="24" x2="14" y2="36" stroke="#0284c7" strokeWidth="1.8" />
              <line x1="24" y1="24" x2="24" y2="36" stroke="#0284c7" strokeWidth="1.8" />
              <rect x="13" y="28" width="2" height="1.5" fill="#e2e8f0" />
              <rect x="23" y="28" width="2" height="1.5" fill="#e2e8f0" />
            </g>
          ) : (
            <g>
              <path
                d="M 11 25 C 11 23, 27 23, 27 25 L 26 36 L 12 36 Z"
                fill={player.color}
                stroke="#0f172a"
                strokeWidth="1.2"
              />
              <line x1="12.5" y1="25" x2="13.5" y2="36" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.85" />
              <line x1="25.5" y1="25" x2="24.5" y2="36" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.85" />
              <rect x="13.5" y="27" width="11" height="6.5" rx="1.5" fill="#ffffff" stroke="#334155" strokeWidth="0.6" />
              <text
                x="19"
                y="32.5"
                fill="#090a0f"
                fontSize="5.2"
                fontWeight="900"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {player.number}
              </text>
            </g>
          )}

          {/* CAPA 6: Brazos */}
          {action === 'WALKING' ? (
            <>
              <g className="animate-arm-left">
                <line x1="11" y1="26" x2="7" y2="33" stroke={skin} strokeWidth="3" strokeLinecap="round" />
                <circle cx="7" cy="33" r="1.5" fill={skin} />
              </g>
              <g className="animate-arm-right">
                <line x1="27" y1="26" x2="31" y2="33" stroke={skin} strokeWidth="3" strokeLinecap="round" />
                <circle cx="31" cy="33" r="1.5" fill={skin} />
                {hasShieldProtection && (
                  <g transform="translate(30, 26)">
                    <rect x="0" y="-4" width="7" height="15" rx="2" fill="rgba(56, 189, 248, 0.45)" stroke="#38bdf8" strokeWidth="1" />
                    <line x1="3.5" y1="-2" x2="3.5" y2="9" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.8" />
                    <circle cx="3.5" cy="3.5" r="1.5" fill="#ffffff" />
                  </g>
                )}
              </g>
            </>
          ) : action === 'IDLE' ? (
            <g stroke={skin} strokeWidth="2.8" strokeLinecap="round">
              <line x1="11" y1="26" x2="8" y2="34" />
              <line x1="27" y1="26" x2="30" y2="34" />
              <circle cx="8" cy="34" r="1.3" fill={skin} stroke="none" />
              <circle cx="30" cy="34" r="1.3" fill={skin} stroke="none" />
              {hasShieldProtection && (
                <g transform="translate(28, 25)">
                  <rect x="0" y="-3" width="7" height="15" rx="2" fill="rgba(56, 189, 248, 0.45)" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="3.5" y1="-1" x2="3.5" y2="10" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.8" />
                  <circle cx="3.5" cy="4.5" r="1.5" fill="#ffffff" />
                </g>
              )}
            </g>
          ) : action === 'SLIDING' ? (
            <g stroke={skin} strokeWidth="3" strokeLinecap="round">
              <line x1="12" y1="26" x2="6" y2="15" />
              <line x1="26" y1="26" x2="32" y2="15" />
            </g>
          ) : action === 'CLIMBING' ? (
            <g stroke={skin} strokeWidth="3" strokeLinecap="round">
              <line x1="12" y1="26" x2="8" y2="14" />
              <line x1="26" y1="26" x2="30" y2="18" />
            </g>
          ) : null}

          {/* CAPA 7: Rasgos Faciales (Boca, Ojos, Gafas, Vello Facial, Venda) */}
          {/* Boca */}
          {action === 'SLIDING' ? (
            <ellipse cx="19" cy="19.5" rx="1.5" ry="2" fill="#b91c1c" />
          ) : (
            <path d="M 17.5 19.5 Q 19 20.8 20.5 19.5" stroke="#9a3412" strokeWidth="0.8" strokeLinecap="round" />
          )}

          {/* Ojos o Gafas */}
          {avatar.glasses === 'lentes_sol' ? (
            <g fill="#090a0f">
              <rect x="14.3" y="15" width="4.4" height="3.2" rx="1" />
              <rect x="19.3" y="15" width="4.4" height="3.2" rx="1" />
              <line x1="18.5" y1="16.2" x2="19.5" y2="16.2" stroke="#090a0f" strokeWidth="1" />
              {/* White specular glare */}
              <line x1="15" y1="15.8" x2="17.5" y2="15.8" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.7" />
              <line x1="20" y1="15.8" x2="22.5" y2="15.8" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.7" />
            </g>
          ) : avatar.glasses === 'lentes_pasta' ? (
            <g stroke="#0f172a" strokeWidth="1.2" fill="none">
              <circle cx="16" cy="16.5" r="2.3" />
              <circle cx="22" cy="16.5" r="2.3" />
              <line x1="18.3" y1="16.5" x2="19.7" y2="16.5" />
              <circle cx="16" cy="16.5" r="0.9" fill="#0f172a" stroke="none" />
              <circle cx="22" cy="16.5" r="0.9" fill="#0f172a" stroke="none" />
            </g>
          ) : (
            <g fill="#0f172a">
              <circle cx="16" cy="16.5" r="1.1" />
              <circle cx="22" cy="16.5" r="1.1" />
            </g>
          )}

          {/* Vello Facial (Bigote / Barba) */}
          {(avatar.facialHair === 'bigote' || avatar.hairType === 'calvo_barba') && (
            <path d="M 16.5 18.5 Q 19 17.5 21.5 18.5 Q 19 20 16.5 18.5 Z" fill={hair} />
          )}
          {avatar.facialHair === 'barba_estilizada' && (
            <g fill={hair}>
              <path d="M 16.5 18.5 Q 19 17.5 21.5 18.5 Q 19 20 16.5 18.5 Z" />
              <path d="M 15 19 C 16 23.5, 22 23.5, 23 19 C 21 21.5, 17 21.5, 15 19 Z" />
            </g>
          )}

          {/* Venda en los ojos si tiene penalización de Presión Extrema */}
          {hasPressureBlindfold && (
            <g>
              <rect x="11.5" y="14.5" width="15" height="4" rx="1" fill="#dc2626" />
              <line x1="12" y1="16.5" x2="26" y2="16.5" stroke="#991b1b" strokeWidth="0.8" />
            </g>
          )}

          {/* CAPA 8: Capa Frontal de Cabello (Ajuste estricto a coronilla y frente sin solapar ojos) */}
          {avatar.hairType === 'corto' && (
            <path
              d="M 11.5 15 C 11.5 8.5, 26.5 8.5, 26.5 15 C 24.5 13, 20.5 12.2, 14 13.2 Z"
              fill={hair}
            />
          )}

          {avatar.hairType === 'copete_retro' && (
            <path
              d="M 11.5 15.5 C 11 6.8, 27 6.8, 26.5 15.5 C 25 12.5, 20 11.5, 14 13 Z"
              fill={hair}
            />
          )}

          {avatar.hairType === 'rizado' && (
            <g fill={hair}>
              <circle cx="13" cy="11.5" r="2.8" />
              <circle cx="16.5" cy="9.2" r="3" />
              <circle cx="21.5" cy="9.2" r="3" />
              <circle cx="25" cy="11.5" r="2.8" />
              <path d="M 11.5 15.5 C 11.5 10, 26.5 10, 26.5 15.5 C 24 13, 19 12.5, 14 13.5 Z" />
            </g>
          )}

          {avatar.hairType === 'lacio_largo' && (
            <g fill={hair}>
              {/* Flequillo y laterales ajustados a la sien */}
              <path d="M 11.5 15 C 11.5 8.5, 26.5 8.5, 26.5 15 C 24.5 13, 20 12, 14 13.2 Z" />
              <rect x="11" y="15" width="2" height="6.5" rx="0.8" />
              <rect x="25" y="15" width="2" height="6.5" rx="0.8" />
            </g>
          )}

          {avatar.hairType === 'coleta' && (
            <g>
              <path
                d="M 11.5 15.5 C 11.5 8.5, 26.5 8.5, 26.5 15.5 C 24.5 13, 20.5 12, 14 13.5 Z"
                fill={hair}
              />
              <circle cx="23.5" cy="14" r="1.5" fill="#f43f5e" />
            </g>
          )}

          {avatar.hairType === 'afro' && (
            <path
              d="M 12.5 15 C 13.5 11.5, 24.5 11.5, 25.5 15 C 23.5 13, 14.5 13, 12.5 15 Z"
              fill={hair}
            />
          )}

          {avatar.hairType === 'calvo_barba' && (
            <path
              d="M 11.5 16 C 12.5 13.5, 25.5 13.5, 26.5 16 C 24.5 15, 13.5 15, 11.5 16 Z"
              fill={hair}
              opacity="0.45"
            />
          )}

          {/* CAPA 9: Sombreros y Accesorios de Cabeza (Capa superior absoluta) */}
          {avatar.headwear === 'gorra_deportiva' && (
            <g>
              <path d="M 11.5 13 C 11.5 7.5, 26.5 7.5, 26.5 13 Z" fill="#e11d48" />
              {/* Visera orientada al frente */}
              <ellipse cx="23.5" cy="13" rx="6.5" ry="1.8" fill="#be123c" />
            </g>
          )}

          {avatar.headwear === 'sombrero' && (
            <g>
              <ellipse cx="19" cy="12" rx="10.5" ry="2.6" fill="#334155" />
              <path d="M 13.5 12 L 14.8 6.5 L 23.2 6.5 L 24.5 12 Z" fill="#1e293b" />
              <rect x="14.2" y="9.8" width="9.6" height="1.6" fill="#f59e0b" />
            </g>
          )}

          {avatar.headwear === 'audifonos' && (
            <g>
              <path d="M 10.5 16 A 8.5 8.5 0 0 1 27.5 16" stroke="#090a0f" strokeWidth="2.2" fill="none" />
              <rect x="9.5" y="13.5" width="2.8" height="5.5" rx="1.4" fill="#06b6d4" />
              <rect x="25.7" y="13.5" width="2.8" height="5.5" rx="1.4" fill="#06b6d4" />
            </g>
          )}

          {/* Casco de Seguridad Industrial / Protección Física (Escudo Reptil) */}
          {hasShieldProtection && (
            <g>
              <path d="M 10.5 12 C 10.5 5.5, 27.5 5.5, 27.5 12 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
              <rect x="9.5" y="11.5" width="19" height="2.2" rx="1" fill="#facc15" stroke="#ca8a04" strokeWidth="0.6" />
              <circle cx="19" cy="8.5" r="1.5" fill="#ffffff" />
            </g>
          )}
        </svg>
      </div>

      {/* =========================================================================
          2. DESVENTAJAS: A) TURNO CONGELADO (Cubo de Hielo 3D Translúcido con Vapor Frío)
          ========================================================================= */}
      {isFrozen && (
        <div className="absolute inset-0 -m-1.5 rounded-2xl bg-cyan-300/40 border-2 border-cyan-100 shadow-[0_0_25px_#38bdf8] backdrop-blur-[1.5px] flex flex-col items-center justify-between z-40 overflow-hidden">
          <div className="w-full h-2 bg-white/50 blur-[1px]" />
          <span className="text-base font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">❄</span>
          <div className="w-full h-3 bg-gradient-to-t from-white/70 to-transparent animate-pulse" />
        </div>
      )}

      {/* Distintivo de Pase Dorado */}
      {hasPaseDorado && (
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-400 border border-white text-[8px] font-black text-amber-950 flex items-center justify-center shadow-[0_0_8px_#fbbf24] z-30">
          ★
        </div>
      )}
    </div>
  );
};
