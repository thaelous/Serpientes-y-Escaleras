import React from 'react';
import { Player, GamePhase, BrandConfig } from '../types';
import { Dice3D } from './Dice3D';
import { Volume2, VolumeX, Settings, QrCode, Maximize2, Minimize2, Shield, Flame, Sun, Moon } from 'lucide-react';
import { sound } from '../audio';

interface HudProps {
  activePlayer: Player;
  round: number;
  phase: GamePhase;
  lastRoll: number | null;
  rolling: boolean;
  onRoll: () => void;
  onOpenSettings: () => void;
  onOpenQR: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  allPlayers: Player[];
  brandConfig?: BrandConfig;
  isDarkMode?: boolean;
  onToggleThemeMode?: () => void;
}

export const Hud: React.FC<HudProps> = ({
  activePlayer,
  round,
  phase,
  lastRoll,
  rolling,
  onRoll,
  onOpenSettings,
  onOpenQR,
  soundEnabled,
  onToggleSound,
  allPlayers,
  brandConfig,
  isDarkMode = true,
  onToggleThemeMode
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const isRollDisabled = phase !== 'WAITING_ROLL' || rolling || (activePlayer.modifiers.crioturbina > 0);
  const brandAccent = brandConfig?.accentColor;

  return (
    <header className={`sticky top-0 z-40 w-full px-3 py-2 sm:px-6 sm:py-3 backdrop-blur-xl border-b transition-colors duration-300 shadow-md ${
      isDarkMode
        ? 'bg-neutral-950/85 border-neutral-800/80 text-white shadow-[0_8px_30px_rgba(0,0,0,0.8)]'
        : 'bg-white/95 border-slate-200 text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
    }`}>
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Zone: Branding and Active Turn Badge */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-2">
            {brandConfig?.logoUrl ? (
              <img
                src={brandConfig.logoUrl}
                alt="Logo Empresa"
                className="h-6 sm:h-7 max-w-[110px] object-contain filter drop-shadow mr-1"
              />
            ) : null}
            <span
              className="text-sm sm:text-base font-display font-black tracking-widest uppercase flex items-center gap-1.5"
              style={{ color: brandAccent || '#f43f5e' }}
            >
              <span
                className="inline-block w-2.5 h-2.5 rounded-sm"
                style={{
                  backgroundColor: brandAccent || '#f43f5e',
                  boxShadow: `0 0 8px ${brandAccent || '#f43f5e'}`
                }}
              />
              ARENA 50
            </span>
            <span className="hidden md:inline text-xs text-neutral-400 font-mono">
              RONDA {round}
            </span>
          </div>

          {/* Active Player Focus Pill */}
          <div
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 shadow-inner"
            style={{
              borderColor: brandAccent ? `${brandAccent}60` : undefined
            }}
          >
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-display font-black text-xs sm:text-sm text-white border-2 border-white shadow-md transition-all"
              style={{ backgroundColor: activePlayer.color, boxShadow: `0 0 12px ${activePlayer.color}` }}
            >
              {activePlayer.number}
            </div>
            <div className="text-left">
              <span className="block text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                Turno Actual
              </span>
              <span className="block text-xs sm:text-sm font-display font-bold text-white tracking-wide truncate max-w-[130px] sm:max-w-[180px]">
                {activePlayer.name}
              </span>
            </div>

            {/* Badges for active buffs/debuffs */}
            <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-neutral-700">
              {activePlayer.shields.escudoReptil && (
                <span title="Escudo Reptil activo (inmune a serpiente)" className="flex items-center gap-1 text-[10px] text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800">
                  <Shield size={10} /> Escudo Reptil
                </span>
              )}
              {activePlayer.shields.campoFuerza && (
                <span title="Campo de Fuerza activo (inmune a desventajas)" className="flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                  <Shield size={10} /> Campo Fuerza
                </span>
              )}
              {activePlayer.shields.rebote && (
                <span title="Rebote activo (refleja castigo al agresor)" className="flex items-center gap-1 text-[10px] text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800">
                  🪞 Rebote
                </span>
              )}
              {activePlayer.shields.paseDorado && (
                <span title="Pase Dorado activo (seguro de pregunta)" className="flex items-center gap-1 text-[10px] text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800">
                  <Shield size={10} /> Pase Dorado
                </span>
              )}
              {activePlayer.modifiers.crioturbina > 0 && (
                <span title="Crioturbina (Turno congelado)" className="flex items-center gap-1 text-[10px] text-blue-300 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800">
                  ❄ Congelado
                </span>
              )}
              {activePlayer.modifiers.furiaDados && (
                <span title="Furia de Dados (2 dados próximo turno)" className="flex items-center gap-1 text-[10px] text-rose-300 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800">
                  <Flame size={10} /> 2 Dados
                </span>
              )}
              {activePlayer.modifiers.dadoPlomo && (
                <span title="Dado de Plomo (máx 2 casillas)" className="flex items-center gap-1 text-[10px] text-stone-300 bg-stone-900 px-1.5 py-0.5 rounded border border-stone-700">
                  ⚓ Dado Plomo
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center Zone: 3D Roll Button */}
        <div className="flex items-center justify-center">
          <Dice3D
            value={lastRoll || 1}
            rolling={rolling}
            onRoll={() => {
              sound.playDiceRoll();
              onRoll();
            }}
            disabled={isRollDisabled}
          />
        </div>

        {/* Right Zone: Controls (QR, Audio, Fullscreen, Settings) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Player Mini Badges Overview */}
          <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 bg-neutral-900/60 rounded-lg border border-neutral-800 mr-2">
            {allPlayers.map((p, idx) => (
              <div
                key={p.id}
                title={`${p.name} (#${p.number}) - Casilla ${p.tile}`}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-display font-bold text-white border transition-all ${
                  p.id === activePlayer.id ? 'ring-2 ring-rose-400 scale-110' : 'opacity-70'
                }`}
                style={{ backgroundColor: p.color }}
              >
                {p.number}
              </div>
            ))}
          </div>

          {/* Dark / Light Mode Toggle Button */}
          {onToggleThemeMode && (
            <button
              onClick={onToggleThemeMode}
              aria-label={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
              className={`p-2 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
                isDarkMode
                  ? 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-amber-400 hover:text-amber-300 shadow-sm'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-amber-600 hover:text-amber-700 shadow-sm'
              }`}
              title={isDarkMode ? 'Cambiar a Modo Claro (Salas Iluminadas)' : 'Cambiar a Modo Oscuro (Proyector)'}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}

          <button
            onClick={onOpenQR}
            aria-label="Abrir código QR para mando móvil"
            className={`p-2 sm:px-3 sm:py-2 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer ${
              isDarkMode
                ? 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-slate-300 hover:text-white'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900 shadow-xs'
            }`}
            title="Código QR / Mando Móvil"
          >
            <QrCode size={16} />
            <span className="hidden sm:inline">Móvil</span>
          </button>

          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Silenciar Efectos de Audio' : 'Activar Sonido FX'}
            className={`p-2 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
              isDarkMode
                ? soundEnabled
                  ? 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-emerald-400 hover:text-emerald-300 shadow-sm'
                  : 'bg-neutral-900 hover:bg-neutral-800 border-rose-900/60 text-rose-400 hover:text-rose-300 shadow-sm'
                : soundEnabled
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-emerald-600 hover:text-emerald-700 shadow-sm'
                  : 'bg-white hover:bg-slate-100 border-rose-300 text-rose-600 hover:text-rose-700 shadow-sm'
            }`}
            title={soundEnabled ? 'Silenciar Efectos de Audio (Web Audio API)' : 'Activar Efectos de Audio FX'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button
            onClick={toggleFullscreen}
            aria-label="Pantalla completa"
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-slate-300 hover:text-white transition-colors hidden sm:flex"
            title="Modo Proyector / Pantalla Completa"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <button
            onClick={onOpenSettings}
            aria-label="Configuración y Gestión Excel"
            className="p-2 sm:px-3 sm:py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/50 text-rose-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
            title="Ajustes de Partida y Excel"
          >
            <Settings size={16} />
            <span className="hidden sm:inline">Ajustes</span>
          </button>
        </div>

      </div>
    </header>
  );
};
