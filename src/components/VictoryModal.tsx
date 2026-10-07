import React, { useEffect } from 'react';
import { Player, BoardThemeId, BrandConfig } from '../types';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Award,
  Crown,
  Sparkles,
  Star,
  Settings,
  CheckCircle2,
  XCircle,
  Target,
  BarChart2,
  TrendingUp,
  Medal
} from 'lucide-react';
import { sound } from '../audio';
import { CharacterAvatar } from './CharacterAvatar';
import { BOARD_THEMES } from '../utils/themeConfig';

interface VictoryModalProps {
  winner: Player;
  players: Player[];
  rounds: number;
  themeId?: BoardThemeId;
  brandConfig?: BrandConfig;
  onRestart: () => void;
  onOpenSettings?: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winner,
  players,
  rounds,
  themeId = 'squid_arena',
  brandConfig,
  onRestart,
  onOpenSettings
}) => {
  const currentTheme = BOARD_THEMES[themeId] || BOARD_THEMES.squid_arena;

  useEffect(() => {
    sound.playVictory();

    // Palette of the selected corporate/scenario theme + brand accent if present
    const themeColors = [
      ...(brandConfig?.accentColor ? [brandConfig.accentColor] : []),
      ...currentTheme.previewColors,
      currentTheme.accentColor,
      '#facc15',
      '#ffffff'
    ];

    // Initial fireworks burst from bottom corners and center
    confetti({
      particleCount: 75,
      spread: 75,
      origin: { y: 0.6 },
      colors: themeColors
    });

    // Continuous choreographed confetti showers
    const duration = 4.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors: themeColors
      });

      confetti({
        particleCount: 5,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors: themeColors
      });

      if (Math.random() < 0.08) {
        confetti({
          particleCount: 25,
          spread: 90,
          origin: { x: 0.5, y: 0.35 },
          colors: themeColors,
          shapes: ['circle', 'square']
        });
      }

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [currentTheme, brandConfig]);

  // Sort players by:
  // 1. Tile reached (highest tile first, winner reached 50)
  // 2. Correct answers
  // 3. Least incorrect answers
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.tile !== a.tile) return b.tile - a.tile;
    const aCorrect = a.stats?.correctAnswers || 0;
    const bCorrect = b.stats?.correctAnswers || 0;
    if (bCorrect !== aCorrect) return bCorrect - aCorrect;
    const aIncorrect = a.stats?.incorrectAnswers || 0;
    const bIncorrect = b.stats?.incorrectAnswers || 0;
    return aIncorrect - bIncorrect;
  });

  // Calculate session global metrics
  const totalCorrect = players.reduce((sum, p) => sum + (p.stats?.correctAnswers || 0), 0);
  const totalIncorrect = players.reduce((sum, p) => sum + (p.stats?.incorrectAnswers || 0), 0);
  const totalQuestions = totalCorrect + totalIncorrect;
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/92 backdrop-blur-2xl animate-in fade-in duration-500 overflow-y-auto">
      <style>{`
        @keyframes spotlight-beam-left {
          0%, 100% { opacity: 0.65; transform: rotate(-18deg) scaleX(1); }
          50% { opacity: 0.95; transform: rotate(-13deg) scaleX(1.15); }
        }
        @keyframes spotlight-beam-right {
          0%, 100% { opacity: 0.65; transform: rotate(18deg) scaleX(1); }
          50% { opacity: 0.95; transform: rotate(13deg) scaleX(1.15); }
        }
        @keyframes pedestal-pulse {
          0%, 100% { transform: scale(1); opacity: 0.75; }
          50% { transform: scale(1.08); opacity: 1; filter: drop-shadow(0 0 25px rgba(250, 204, 21, 0.9)); }
        }
        @keyframes crown-bob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(4deg); }
        }
      `}</style>

      <div
        className={`relative w-full max-w-3xl rounded-3xl border-2 p-5 sm:p-8 text-center shadow-[0_0_100px_rgba(0,0,0,0.98)] overflow-hidden transition-all my-auto max-h-[92vh] flex flex-col justify-between ${
          currentTheme.id === 'cyberpunk'
            ? 'bg-[#050614] border-cyan-400 shadow-[0_0_80px_rgba(6,182,212,0.4)]'
            : currentTheme.id === 'selva_mistica'
            ? 'bg-[#0b130e] border-amber-400 shadow-[0_0_80px_rgba(234,179,8,0.4)]'
            : currentTheme.id === 'corporativo'
            ? 'bg-[#0f172a] border-slate-300 shadow-[0_0_80px_rgba(203,213,225,0.4)]'
            : currentTheme.id === 'retro_arcade'
            ? 'bg-[#0a0a18] border-yellow-400 shadow-[0_0_80px_rgba(250,204,21,0.5)]'
            : 'bg-neutral-950 border-amber-400 shadow-[0_0_80px_rgba(250,204,21,0.45)]'
        }`}
      >
        {/* =========================================================
            STAGE LIGHTING ILLUMINATION SYSTEM (ILUMINACIÓN DE ESCENARIO)
            ========================================================= */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {/* Left Conical Spotlight Beam */}
          <div
            className="absolute -top-16 left-4 w-48 h-80 origin-top pointer-events-none blur-md"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.accentColor} 0%, rgba(255,255,255,0.85) 20%, transparent 80%)`,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              animation: 'spotlight-beam-left 3.5s ease-in-out infinite'
            }}
          />

          {/* Right Conical Spotlight Beam */}
          <div
            className="absolute -top-16 right-4 w-48 h-80 origin-top pointer-events-none blur-md"
            style={{
              background: `linear-gradient(225deg, ${currentTheme.accentColor} 0%, rgba(255,255,255,0.85) 20%, transparent 80%)`,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              animation: 'spotlight-beam-right 3.5s ease-in-out infinite'
            }}
          />

          {/* Center Stage Downlight Cone */}
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-72 pointer-events-none opacity-40 blur-xl"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.95), ${currentTheme.accentColor} 45%, transparent 75%)`
            }}
          />
        </div>

        {/* Scrollable Content Container */}
        <div className="relative z-20 overflow-y-auto pr-1 space-y-4">
          {/* Scenario & Corporate Watermark Banner */}
          <div className="flex items-center justify-between px-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-700 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-300">
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: brandConfig?.accentColor || currentTheme.accentColor }}
              />
              <span>ESCENARIO: {currentTheme.name}</span>
            </div>

            {brandConfig?.logoName && (
              <span className="text-[11px] font-display font-black text-amber-400 uppercase tracking-wider">
                {brandConfig.logoName}
              </span>
            )}

            <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400">
              <Sparkles size={14} />
              <span>CEREMONIA DE PREMIACIÓN</span>
            </div>
          </div>

          {/* =========================================================
              STAGE PODIUM & WINNING AVATAR SPOTLIGHT SHOWCASE
              ========================================================= */}
          <div className="flex flex-col items-center justify-center pt-1 pb-2">
            {/* Floating Crown above the Winner */}
            <div className="mb-0.5" style={{ animation: 'crown-bob 2.2s ease-in-out infinite' }}>
              <div className="relative flex items-center justify-center">
                <Crown size={40} className="text-amber-400 fill-amber-400 drop-shadow-[0_0_16px_#facc15]" />
                <Star size={14} className="absolute -top-1 -right-2 text-yellow-200 fill-white animate-spin" style={{ animationDuration: '4s' }} />
              </div>
            </div>

            {/* The Hero Stage Pedestal Box */}
            <div className="relative flex items-center justify-center w-48 h-36">
              {/* Concentric Halo Spotlight Rings */}
              <div
                className="absolute bottom-2 w-36 h-12 rounded-full blur-[2px] pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse, ${brandConfig?.accentColor || currentTheme.accentColor} 0%, rgba(250, 204, 21, 0.8) 45%, transparent 75%)`,
                  animation: 'pedestal-pulse 2s ease-in-out infinite'
                }}
              />

              {/* Glowing Metallic Pedestal Floor Disc */}
              <div
                className="absolute bottom-1 w-32 h-9 rounded-[50%] border-2 border-amber-300 shadow-[0_0_30px_rgba(250,204,21,0.8)] pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, #fde047 0%, #ca8a04 40%, #713f12 100%)'
                }}
              >
                <div className="w-full h-full rounded-[50%] border-t border-white/80 opacity-70" />
              </div>

              {/* Stage Pedestal Plinth Base */}
              <div className="absolute -bottom-3 w-28 h-4 rounded-b-xl bg-gradient-to-b from-[#713f12] to-[#291404] border-b-2 border-amber-600 shadow-md flex items-center justify-center">
                <span className="text-[8px] font-display font-black text-amber-200 tracking-widest uppercase">
                  CAMPEÓN #1
                </span>
              </div>

              {/* Prominent Custom Winner Character Avatar */}
              <div className="relative z-30 transform scale-135 -translate-y-2.5 filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.85)]">
                <CharacterAvatar
                  player={winner}
                  isActive={true}
                  action="IDLE"
                />
              </div>
            </div>

            {/* Winner Name and Team Number Banner */}
            <div className="mt-2 text-center">
              <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-extrabold block">
                ★ GANADOR INVICTO DE LA ARENA ★
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-wider mt-0.5 leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                {winner.name}
              </h2>
              <div className="inline-flex items-center gap-2 mt-1 px-3.5 py-1 rounded-full bg-neutral-900/90 border border-neutral-700">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center font-display font-bold text-white text-[10px] border shadow-xs"
                  style={{ backgroundColor: winner.color }}
                >
                  {winner.number}
                </div>
                <span className="text-xs font-mono text-slate-300 font-semibold">
                  Casilla 50 alcanzada en {rounds} rondas
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2.5 py-2 px-3 rounded-2xl bg-neutral-900/70 border border-neutral-800 text-center">
            <div className="flex flex-col items-center justify-center p-1.5">
              <span className="text-[10px] font-mono text-neutral-400 uppercase font-semibold flex items-center gap-1">
                <Award size={12} className="text-amber-400" /> Rondas
              </span>
              <span className="text-lg font-display font-black text-amber-300">{rounds}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1.5 border-x border-neutral-800">
              <span className="text-[10px] font-mono text-neutral-400 uppercase font-semibold flex items-center gap-1">
                <Target size={12} className="text-emerald-400" /> Preguntas
              </span>
              <span className="text-lg font-display font-black text-emerald-400">{totalQuestions}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1.5">
              <span className="text-[10px] font-mono text-neutral-400 uppercase font-semibold flex items-center gap-1">
                <TrendingUp size={12} className="text-cyan-400" /> Precisión Global
              </span>
              <span className="text-lg font-display font-black text-cyan-300">{overallAccuracy}%</span>
            </div>
          </div>

          {/* =========================================================
              REPORTE ESTADÍSTICO DETALLADO POR JUGADOR (TABLA DE PODIO)
              ========================================================= */}
          <div className="bg-neutral-900/90 rounded-2xl p-3 sm:p-4 border border-neutral-800 text-left backdrop-blur-md">
            <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <BarChart2 size={16} className="text-amber-400" />
                <h3 className="text-xs sm:text-sm font-display font-black uppercase tracking-wider text-slate-100">
                  Reporte Estadístico y Clasificación de Participantes
                </h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                {players.length} concursantes
              </span>
            </div>

            <div className="space-y-2">
              {sortedPlayers.map((p, idx) => {
                const correct = p.stats?.correctAnswers || 0;
                const incorrect = p.stats?.incorrectAnswers || 0;
                const totalQ = correct + incorrect;
                const accuracy = totalQ > 0 ? Math.round((correct / totalQ) * 100) : 0;
                const isWinner = p.id === winner.id;

                return (
                  <div
                    key={p.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl border transition-all gap-2.5 ${
                      isWinner
                        ? 'bg-amber-950/30 border-amber-500/80 text-amber-200 shadow-[0_0_15px_rgba(250,204,21,0.25)]'
                        : idx === 1
                        ? 'bg-slate-900/50 border-slate-700/80 text-slate-200'
                        : idx === 2
                        ? 'bg-amber-900/20 border-amber-700/60 text-amber-100'
                        : 'bg-neutral-950/70 border-neutral-800/80 text-slate-300'
                    }`}
                  >
                    {/* Left: Position Rank, Avatar SVG Preview, Name & Number */}
                    <div className="flex items-center gap-3">
                      {/* Podium Medal or Rank Badge */}
                      <div className="flex items-center justify-center w-7 shrink-0">
                        {idx === 0 ? (
                          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-neutral-950 font-display font-black text-xs shadow-[0_0_10px_rgba(245,158,11,0.6)]">
                            👑 1
                          </div>
                        ) : idx === 1 ? (
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-neutral-950 font-display font-black text-xs">
                            🥈 2
                          </div>
                        ) : idx === 2 ? (
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white font-display font-black text-xs">
                            🥉 3
                          </div>
                        ) : (
                          <span className="font-mono font-bold text-xs text-neutral-500">
                            #{idx + 1}
                          </span>
                        )}
                      </div>

                      {/* Modular SVG Avatar Preview Box */}
                      <div
                        className="w-10 h-11 shrink-0 rounded-xl overflow-hidden flex items-center justify-center border relative shadow-inner bg-neutral-950/90"
                        style={{ borderColor: p.color }}
                      >
                        <div className="transform scale-70 -translate-y-1">
                          <CharacterAvatar
                            player={p}
                            isActive={false}
                            action="IDLE"
                          />
                        </div>
                      </div>

                      {/* Participant Identification */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-display font-bold text-sm text-white truncate">
                            {p.name}
                          </span>
                          <span
                            className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold text-white shadow-xs"
                            style={{ backgroundColor: p.color }}
                          >
                            #{p.number}
                          </span>
                          {isWinner && (
                            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/40">
                              GANADOR
                            </span>
                          )}
                        </div>

                        {/* Final Board Tile Destination */}
                        <div className="text-[11px] font-mono mt-0.5 text-neutral-400">
                          Posición final:{' '}
                          <span className="font-bold text-amber-300">
                            {p.tile >= 50
                              ? '🏁 Casilla 50 (Meta)'
                              : p.tile === 0
                              ? 'Banquillo de salida (0)'
                              : `Casilla ${p.tile}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Academic Performance Statistics (Correct, Incorrect, Accuracy) */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end sm:self-center">
                      {/* Correct Answers Badge */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        <span className="text-xs font-mono font-bold">
                          {correct} <span className="text-[10px] font-normal hidden sm:inline">correctas</span>
                        </span>
                      </div>

                      {/* Incorrect Answers Badge */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300">
                        <XCircle size={13} className="text-rose-400" />
                        <span className="text-xs font-mono font-bold">
                          {incorrect} <span className="text-[10px] font-normal hidden sm:inline">falladas</span>
                        </span>
                      </div>

                      {/* Accuracy Percentage Badge */}
                      <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-neutral-800/80 border border-neutral-700 text-slate-300">
                        <span className="text-[10px] font-mono font-semibold">
                          {accuracy}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================
            BOTTOM ACTIONS: RESTART OR CONFIGURE
            ========================================================= */}
        <div className="relative z-20 pt-4 flex flex-col sm:flex-row items-center gap-2.5">
          {/* Reconfigure Settings Button */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="w-full sm:w-1/3 py-3 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-slate-200 font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-md"
            >
              <Settings size={16} className="text-amber-400" />
              <span>AJUSTES Y CONFIGURACIÓN</span>
            </button>
          )}

          {/* Primary Play Again / Restart Button */}
          <button
            onClick={onRestart}
            className={`w-full ${
              onOpenSettings ? 'sm:w-2/3' : 'sm:w-full'
            } py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 font-display font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-[0_4px_25px_rgba(250,204,21,0.5)] transition-all cursor-pointer active:scale-95 ring-2 ring-amber-300`}
          >
            <RotateCcw size={18} className="stroke-[3]" />
            <span>JUGAR DE NUEVO / REINICIAR PARTIDA</span>
          </button>
        </div>

      </div>
    </div>
  );
};
