import React, { useState, useEffect, useRef } from 'react';
import { Player, Question, BoardThemeId, BrandConfig } from '../types';
import { downloadQuestionsExcel, parseExcelQuestions } from '../utils/excel';
import { generateStandaloneHtml } from '../utils/standaloneHtmlGenerator';
import { AvatarCustomizerModal } from './AvatarCustomizerModal';
import { CharacterAvatar } from './CharacterAvatar';
import { BOARD_THEMES } from '../utils/themeConfig';
import { extractLogoBranding } from '../utils/colorExtractor';
import QRCode from 'qrcode';
import {
  X,
  FileSpreadsheet,
  Upload,
  Download,
  Users,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  QrCode,
  BookOpen,
  Code,
  Palette,
  Sparkles,
  Trash2,
  Sliders,
  Check,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  onUpdatePlayers: (players: Player[]) => void;
  questions: Question[];
  onUpdateQuestions: (questions: Question[]) => void;
  onResetGame: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentTheme: BoardThemeId;
  onSelectTheme: (themeId: BoardThemeId) => void;
  brandConfig: BrandConfig;
  onUpdateBrandConfig: (config: BrandConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  players,
  onUpdatePlayers,
  questions,
  onUpdateQuestions,
  onResetGame,
  soundEnabled,
  onToggleSound,
  currentTheme,
  onSelectTheme,
  brandConfig,
  onUpdateBrandConfig
}) => {
  const [activeTab, setActiveTab] = useState<'themes' | 'branding' | 'excel' | 'teams' | 'qr' | 'rules' | 'export'>('themes');
  const [uploadFeedback, setUploadFeedback] = useState<{ success: boolean; msg: string } | null>(null);
  const [editablePlayers, setEditablePlayers] = useState<Player[]>(players);
  const [playerToCustomize, setPlayerToCustomize] = useState<Player | null>(null);
  const [isExtractingLogo, setIsExtractingLogo] = useState<boolean>(false);
  const [extractedPalette, setExtractedPalette] = useState<string[]>([]);
  const [brandingFeedback, setBrandingFeedback] = useState<string | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Sync internal state when players prop updates
  useEffect(() => {
    setEditablePlayers(players);
  }, [players]);

  // Generate QR Code for Mobile Controller view
  useEffect(() => {
    if (activeTab === 'qr' && qrCanvasRef.current) {
      const controllerUrl = `${window.location.origin}${window.location.pathname}?mode=controller`;
      QRCode.toCanvas(
        qrCanvasRef.current,
        controllerUrl,
        {
          width: 220,
          margin: 2,
          color: {
            dark: '#f43f5e',
            light: '#0a0a0c'
          }
        },
        (error) => {
          if (error) console.error(error);
        }
      );
    }
  }, [activeTab]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFeedback(null);
    const result = await parseExcelQuestions(file);

    if (result.success && result.questions) {
      onUpdateQuestions(result.questions);
      setUploadFeedback({
        success: true,
        msg: `¡Éxito! Se han importado correctamente ${result.count} preguntas desde el archivo Excel.`
      });
    } else {
      setUploadFeedback({
        success: false,
        msg: result.error || 'Error desconocido al importar el archivo.'
      });
    }

    // Reset input
    e.target.value = '';
  };

  const handlePlayerNameChange = (id: string, newName: string) => {
    const updated = editablePlayers.map(p => p.id === id ? { ...p, name: newName } : p);
    setEditablePlayers(updated);
    onUpdatePlayers(updated);
  };

  const handlePlayerNumberChange = (id: string, newNumber: string) => {
    const updated = editablePlayers.map(p => p.id === id ? { ...p, number: newNumber } : p);
    setEditablePlayers(updated);
    onUpdatePlayers(updated);
  };

  const handleAddPlayer = () => {
    if (editablePlayers.length >= 6) return;
    const newIdx = editablePlayers.length + 1;
    const colors = ['#10b981', '#f43f5e', '#06b6d4', '#f59e0b', '#a855f7', '#ec4899'];
    const numbers = ['456', '067', '218', '001', '101', '240'];

    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: `Jugador ${numbers[newIdx - 1] || newIdx}`,
      number: numbers[newIdx - 1] || String(newIdx),
      color: colors[(newIdx - 1) % colors.length],
      tile: 0,
      shields: { escudoReptil: false, campoFuerza: false, paseDorado: false, rebote: false },
      modifiers: {
        crioturbina: 0,
        gravedadPesada: false,
        furiaDados: false,
        dadoPlomo: false,
        presionExtrema: false,
        maldicionDoble: false,
        tiroAdicional: false
      },
      stats: { correctAnswers: 0, incorrectAnswers: 0 },
      cardsInventory: []
    };

    const updated = [...editablePlayers, newPlayer];
    setEditablePlayers(updated);
    onUpdatePlayers(updated);
  };

  const handleRemovePlayer = (id: string) => {
    if (editablePlayers.length <= 2) return;
    const updated = editablePlayers.filter(p => p.id !== id);
    setEditablePlayers(updated);
    onUpdatePlayers(updated);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBrandingFeedback(null);
    setIsExtractingLogo(true);
    try {
      const result = await extractLogoBranding(file);
      setExtractedPalette(result.palette);
      onUpdateBrandConfig({
        logoUrl: result.logoUrl,
        logoName: file.name.replace(/\.[^/.]+$/, ''),
        accentColor: result.dominantColor
      });
      setBrandingFeedback(`¡Logotipo procesado con éxito! Se ha extraído el color corporativo ${result.dominantColor} y se aplicó en toda la aplicación.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido al analizar la imagen.';
      setBrandingFeedback(`Error: ${msg}`);
    } finally {
      setIsExtractingLogo(false);
      e.target.value = '';
    }
  };

  const handleClearLogo = () => {
    onUpdateBrandConfig({
      logoUrl: null,
      logoName: null,
      accentColor: null
    });
    setExtractedPalette([]);
    setBrandingFeedback('Se ha retirado el logotipo y restablecido el color de acento por defecto.');
  };

  const handleSelectAccentColor = (color: string) => {
    onUpdateBrandConfig({
      ...brandConfig,
      accentColor: color
    });
    setBrandingFeedback(`Color de acento actualizado a ${color}`);
  };

  const downloadStandaloneHtml = () => {
    // Generates a complete standalone single HTML file
    const standaloneContent = generateStandaloneHtml();
    const blob = new Blob([standaloneContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Arena50_Squid_Gamification_Standalone.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const controllerUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?mode=controller`
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-neutral-950 border border-neutral-700 shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm" />
            <h2 className="text-base font-display font-bold uppercase tracking-wider text-white">
              Panel de Control · Arena 50
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-neutral-800 bg-neutral-950 text-xs font-mono overflow-x-auto">
          <button
            onClick={() => setActiveTab('themes')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-bold transition-all shrink-0 ${
              activeTab === 'themes'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-slate-200'
            }`}
          >
            <Palette size={15} />
            <span>Escenarios (5)</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-bold transition-all shrink-0 ${
              activeTab === 'branding'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-neutral-400 hover:text-slate-200'
            }`}
          >
            <Sparkles size={15} />
            <span>Logo & Branding</span>
          </button>

          <button
            onClick={() => setActiveTab('excel')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-bold transition-all shrink-0 ${
              activeTab === 'excel'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-neutral-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet size={15} />
            <span>Banco Excel</span>
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-bold transition-all shrink-0 ${
              activeTab === 'teams'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-neutral-400 hover:text-slate-200'
            }`}
          >
            <Users size={15} />
            <span>Equipos ({editablePlayers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-bold transition-all shrink-0 ${
              activeTab === 'qr'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-neutral-400 hover:text-slate-200'
            }`}
          >
            <QrCode size={15} />
            <span>Mando Móvil QR</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-bold transition-all shrink-0 ${
              activeTab === 'rules'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-neutral-400 hover:text-slate-200'
            }`}
          >
            <BookOpen size={15} />
            <span>Reglamento</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-bold transition-all shrink-0 ${
              activeTab === 'export'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-neutral-400 hover:text-slate-200'
            }`}
          >
            <Code size={15} />
            <span>Exportar HTML</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300">
          
          {/* TAB 0: ESCENARIOS Y TEMAS */}
          {activeTab === 'themes' && (
            <div className="space-y-5">
              <div className="bg-neutral-900/80 p-4 rounded-xl border border-neutral-800 flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Palette size={18} className="text-amber-400" />
                    Selector de 5 Escenarios Temáticos de la Arena
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Cambia la paleta cromática, iluminación, texturas de las plataformas y el ambiente visual general del juego.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-mono font-bold border border-amber-400/30 shrink-0">
                  5 Opciones
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(BOARD_THEMES).map((theme) => {
                  const isSelected = currentTheme === theme.id;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => onSelectTheme(theme.id)}
                      className={`relative flex flex-col justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer group ${
                        isSelected
                          ? 'bg-neutral-900/95 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.35)] ring-2 ring-amber-400/50'
                          : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900/50'
                      }`}
                    >
                      {/* Top Header of Theme Card */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                            {theme.subtitle}
                          </span>
                          {isSelected ? (
                            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-mono font-black shadow">
                              <CheckCircle size={12} /> ACTIVO
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-neutral-500 group-hover:text-neutral-300">
                              Pulsa para activar
                            </span>
                          )}
                        </div>

                        <h5 className="text-base font-display font-black text-white group-hover:text-amber-300 transition-colors">
                          {theme.name}
                        </h5>
                        <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                          {theme.description}
                        </p>
                      </div>

                      {/* Visual Terrace Preview Bars */}
                      <div className="mt-4 pt-3 border-t border-neutral-800/80">
                        <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1.5 font-bold">
                          Muestra de Pisos (5 al 1):
                        </span>
                        <div className="flex items-center gap-1.5 h-4 w-full rounded overflow-hidden">
                          {[5, 4, 3, 2, 1].map((piso) => (
                            <div
                              key={piso}
                              title={`Piso ${piso}: ${theme.terraces[piso].name}`}
                              className={`flex-1 h-full rounded-sm border ${theme.terraces[piso].bgClass} ${theme.terraces[piso].borderClass}`}
                            />
                          ))}
                        </div>

                        {/* Color Dots and Select Button */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1">
                            {theme.previewColors.map((color, idx) => (
                              <span
                                key={idx}
                                className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-xs"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTheme(theme.id);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-400 text-slate-950 shadow'
                                : 'bg-neutral-800 hover:bg-neutral-700 text-slate-300'
                            }`}
                          >
                            {isSelected ? '✓ Aplicado' : 'Seleccionar'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 0.5: BRANDING Y LOGOTIPO CORPORATIVO */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              {/* Introduction Banner */}
              <div className="bg-neutral-900/85 p-5 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-1">
                      Identidad Corporativa y Extracción de Color Accent
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">
                      Sube el logotipo de tu empresa o evento (PNG, SVG, JPG). El analizador de píxeles en canvas extraerá automáticamente el color dominante y lo sincronizará como acento dinámico en todo el juego (HUD, bordes, halos y marca de agua del tablero).
                    </p>
                  </div>
                </div>
              </div>

              {/* Brand Name Input Field */}
              <div className="bg-neutral-900/90 rounded-2xl p-4 border border-neutral-800 space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <span>🏢</span>
                    <span>Nombre de la Empresa / Marca:</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 font-normal">Se refleja en tiempo real en el sello del tablero</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={brandConfig.logoName || ''}
                    onChange={(e) => onUpdateBrandConfig({ ...brandConfig, logoName: e.target.value })}
                    placeholder="Ej. ACME Corporation, TechCorp, Banco Industrial..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-display text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-neutral-600"
                  />
                  {brandConfig.logoName && (
                    <button
                      type="button"
                      onClick={() => onUpdateBrandConfig({ ...brandConfig, logoName: null })}
                      className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white border border-neutral-700 text-xs font-mono cursor-pointer"
                      title="Borrar nombre"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-neutral-700 bg-neutral-950/90 text-center hover:border-cyan-400/80 hover:bg-neutral-900/50 transition-all group">
                <input
                  type="file"
                  id="logo-upload-input"
                  accept="image/png,image/svg+xml,image/jpeg,image/webp"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <label
                  htmlFor="logo-upload-input"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2.5"
                >
                  <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-700 group-hover:border-cyan-400 group-hover:scale-105 flex items-center justify-center text-cyan-400 transition-all shadow-md">
                    {isExtractingLogo ? (
                      <RefreshCw size={24} className="animate-spin text-cyan-400" />
                    ) : (
                      <Upload size={24} />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-display font-bold text-white group-hover:text-cyan-300 block">
                      {isExtractingLogo ? 'Analizando píxeles del logo...' : 'Haz clic para subir el Logo de la Empresa'}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono mt-0.5 block">
                      Formatos recomendados: PNG con fondo transparente o SVG vectorial
                    </span>
                  </div>
                  <span className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-display text-xs font-bold uppercase tracking-wider shadow-md mt-1">
                    Examinar Imagen
                  </span>
                </label>
              </div>

              {/* Feedback Alert */}
              {brandingFeedback && (
                <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                  brandingFeedback.startsWith('Error')
                    ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                    : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                }`}>
                  <CheckCircle size={16} className="shrink-0" />
                  <span>{brandingFeedback}</span>
                </div>
              )}

              {/* Logo Active Status and Color Controls */}
              {brandConfig.logoUrl ? (
                <div className="bg-neutral-900/90 rounded-2xl p-5 border border-neutral-800 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-14 rounded-xl bg-neutral-950 border border-neutral-700 p-2 flex items-center justify-center shadow-inner overflow-hidden">
                        <img
                          src={brandConfig.logoUrl}
                          alt="Logo cargado"
                          className="max-h-full max-w-full object-contain filter drop-shadow"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider block">
                          LOGOTIPO ACTIVO
                        </span>
                        <h5 className="text-sm font-display font-bold text-white">
                          {brandConfig.logoName || 'Logo Corporativo'}
                        </h5>
                        <span className="text-xs font-mono text-neutral-400">
                          Visible en la esquina superior del tablero y barra HUD
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleClearLogo}
                      className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-rose-950/80 text-neutral-300 hover:text-rose-300 border border-neutral-700 hover:border-rose-500/50 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all self-start sm:self-center cursor-pointer"
                    >
                      <Trash2 size={15} />
                      <span>Retirar Logo</span>
                    </button>
                  </div>

                  {/* Accent Color Controls */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold flex items-center gap-2">
                        <Sliders size={14} className="text-cyan-400" />
                        Color de Acento Corporativo (Extraído):
                      </label>
                      <span
                        className="font-mono text-xs font-bold text-white px-2.5 py-0.5 rounded border shadow-sm"
                        style={{
                          backgroundColor: brandConfig.accentColor || '#3b82f6',
                          borderColor: 'rgba(255,255,255,0.4)'
                        }}
                      >
                        {brandConfig.accentColor || '#3b82f6'}
                      </span>
                    </div>

                    {/* Extracted Palette Swatches */}
                    {extractedPalette.length > 0 && (
                      <div>
                        <span className="text-[11px] font-mono text-neutral-400 block mb-2">
                          Colores detectados del logo (pulsa para seleccionar como acento):
                        </span>
                        <div className="flex flex-wrap items-center gap-2.5">
                          {extractedPalette.map((color, idx) => {
                            const isSelected = brandConfig.accentColor?.toLowerCase() === color.toLowerCase();
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelectAccentColor(color)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                                  isSelected
                                    ? 'border-white bg-neutral-800 text-white shadow-[0_0_15px_rgba(255,255,255,0.3)] ring-2 ring-white/50'
                                    : 'border-neutral-700 bg-neutral-950 text-neutral-300 hover:border-neutral-500'
                                }`}
                              >
                                <span
                                  className="w-4 h-4 rounded-full border border-black/40 shadow-xs"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="font-bold">{color}</span>
                                {isSelected && <Check size={13} className="text-emerald-400" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Fine-Tuning Color Picker */}
                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-xs font-mono text-neutral-400">
                        O ajusta el tono con precisión manual:
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={brandConfig.accentColor || '#3b82f6'}
                          onChange={(e) => handleSelectAccentColor(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-neutral-700 p-0.5"
                        />
                        <span className="text-xs font-mono text-slate-400">Selector de color</span>
                      </div>
                    </div>
                  </div>

                  {/* Watermark Live Preview Card */}
                  <div className="pt-3 border-t border-neutral-800">
                    <span className="text-[11px] font-mono uppercase text-neutral-400 block mb-2 font-bold">
                      Vista previa del Sello en el Tablero:
                    </span>
                    <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400">
                        Marca de agua superior:
                      </span>
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border shadow-md"
                        style={{
                          borderColor: brandConfig.accentColor || '#3b82f6',
                          boxShadow: `0 0 16px ${(brandConfig.accentColor || '#3b82f6')}40`
                        }}
                      >
                        <div className="flex flex-col text-right">
                          <span className="text-[8px] font-mono uppercase tracking-widest text-neutral-400 font-bold leading-none">
                            SELLO CORPORATIVO
                          </span>
                          <span className="text-[10px] font-display font-black text-white leading-tight">
                            {brandConfig.logoName || 'Sede Oficial'}
                          </span>
                        </div>
                        <img
                          src={brandConfig.logoUrl}
                          alt="Logo preview"
                          className="h-6 max-w-[100px] object-contain filter drop-shadow"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 text-center">
                  <ImageIcon size={34} className="mx-auto text-neutral-600 mb-2" />
                  <p className="text-xs text-neutral-400 font-mono">
                    Aún no se ha cargado ningún logotipo. Sube un archivo arriba para activar el branding personalizado.
                  </p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'excel' && (
            <div className="space-y-6">
              <div className="bg-neutral-900/80 p-4 rounded-xl border border-neutral-800">
                <h4 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FileSpreadsheet size={18} className="text-emerald-400" />
                  Gestión y Edición de Preguntas con SheetJS
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  Actualmente hay <strong className="text-emerald-400 font-mono">{questions.length} preguntas</strong> cargadas en memoria. Puedes descargar la plantilla completa en formato Excel (.xlsx), editar las preguntas o agregar las tuyas, y luego volver a subir el archivo.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => downloadQuestionsExcel(questions)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-display text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    <Download size={16} />
                    <span>Descargar Preguntas (.xlsx)</span>
                  </button>

                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-slate-200 hover:text-white font-display text-xs font-bold uppercase tracking-wider transition-all border border-neutral-600 cursor-pointer">
                    <Upload size={16} />
                    <span>Subir Archivo Excel</span>
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Upload Feedback Message */}
                {uploadFeedback && (
                  <div
                    className={`mt-4 p-3 rounded-lg border text-xs flex items-center gap-2.5 ${
                      uploadFeedback.success
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                        : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                    }`}
                  >
                    {uploadFeedback.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    <span>{uploadFeedback.msg}</span>
                  </div>
                )}
              </div>

              {/* Sample preview of active questions */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Muestra de Preguntas Activas ({questions.length} en total)
                </h4>
                <div className="max-h-56 overflow-y-auto space-y-2 border border-neutral-800 rounded-xl p-3 bg-neutral-900/50">
                  {questions.slice(0, 10).map((q) => (
                    <div key={q.id} className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 text-xs">
                      <div className="flex items-center justify-between text-neutral-400 font-mono text-[10px] mb-1">
                        <span>PREGUNTA #{q.id}</span>
                        <span className="text-emerald-400">Opción Correcta: {['A', 'B', 'C'][q.correctIndex]}</span>
                      </div>
                      <p className="font-semibold text-slate-200">{q.question}</p>
                    </div>
                  ))}
                  {questions.length > 10 && (
                    <p className="text-center text-[11px] font-mono text-neutral-400 py-1">
                      ... y {questions.length - 10} preguntas más.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEAMS MANAGEMENT */}
          {activeTab === 'teams' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                    Equipos y Jugadores en Juego
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Personaliza los nombres y números de los participantes (mínimo 2, máximo 6).
                  </p>
                </div>
                {editablePlayers.length < 6 && (
                  <button
                    onClick={handleAddPlayer}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-display text-xs font-bold uppercase transition-all"
                  >
                    + Añadir Equipo
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {editablePlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-900 border border-neutral-800"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                      {/* Avatar Live Thumbnail */}
                      <div
                        className="w-11 h-13 rounded-xl bg-neutral-950 border border-neutral-700 flex items-center justify-center p-1 shrink-0 shadow-inner"
                        style={{ borderColor: player.color }}
                      >
                        <div className="scale-75 origin-center">
                          <CharacterAvatar player={player} action="IDLE" />
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">
                            Nombre del Equipo
                          </label>
                          <input
                            type="text"
                            value={player.name}
                            onChange={(e) => handlePlayerNameChange(player.id, e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-rose-500 font-display font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">
                            Dorsal / Número
                          </label>
                          <input
                            type="text"
                            maxLength={4}
                            value={player.number}
                            onChange={(e) => handlePlayerNumberChange(player.id, e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-rose-500 font-mono font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPlayerToCustomize(player)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-xs font-mono font-bold text-slate-200 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm"
                        title="Personalizar silueta, ropa, cabello y accesorios de este personaje"
                      >
                        <Palette size={13} className="text-rose-400" />
                        <span>Diseñar Avatar</span>
                      </button>

                      <span className="text-xs font-mono text-neutral-400 px-2 py-1 bg-neutral-950 rounded-lg border border-neutral-800">
                        C.{player.tile}
                      </span>

                      {editablePlayers.length > 2 && (
                        <button
                          onClick={() => handleRemovePlayer(player.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 font-mono hover:underline p-1 cursor-pointer"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reset Game Section */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-display font-bold text-white uppercase tracking-wider">
                    Reiniciar Estado de Partida
                  </h5>
                  <p className="text-[11px] text-neutral-400">
                    Devuelve a todos los jugadores a la Casilla 1 y limpia modificadores de cartas.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onResetGame();
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 font-display text-xs font-bold uppercase transition-all cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Reiniciar Partida</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: QR CODE & MOBILE CONTROLLER */}
          {activeTab === 'qr' && (
            <div className="text-center space-y-4 py-2">
              <div>
                <h4 className="text-base font-display font-bold text-white uppercase tracking-wider">
                  Código QR para Control Móvil
                </h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
                  Escanea este código con la cámara de cualquier teléfono móvil para abrir la vista de mando y lanzar el dado o responder preguntas a distancia.
                </p>
              </div>

              <div className="inline-block p-4 rounded-2xl bg-neutral-900 border-2 border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.25)]">
                <canvas ref={qrCanvasRef} className="rounded-lg mx-auto" />
              </div>

              <div className="max-w-md mx-auto">
                <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                  Enlace directo de conexión:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={controllerUrl}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-300 font-mono select-all focus:outline-none"
                  />
                  <a
                    href={controllerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-display text-xs font-bold uppercase tracking-wider shrink-0"
                  >
                    Abrir Mando
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REGLAMENTO Y GUÍA DE LA ARENA */}
          {activeTab === 'rules' && (
            <div className="space-y-4 text-xs leading-relaxed">
              <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
                <h5 className="font-display font-bold text-rose-400 text-sm uppercase mb-2">
                  1. Arquitectura de las 5 Terrazas
                </h5>
                <p className="text-slate-300">
                  El tablero cuenta con exactamente 50 casillas dispuestas en 5 niveles de elevación. El recorrido es bustrófedon (serpenteante): Terraza 1 (1-10), Terraza 2 (11-20 invertida), Terraza 3 (21-30), Terraza 4 (31-40 invertida) y Terraza 5 (41-50, Meta).
                </p>
              </div>

              <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
                <h5 className="font-display font-bold text-amber-400 text-sm uppercase mb-2">
                  2. Andamios de Acero (Escaleras) y Ductos Neumáticos (Toboganes)
                </h5>
                <p className="text-slate-300">
                  Las escaleras de andamio permiten salvar desniveles hacia terrazas superiores. Los ductos neumáticos te evacúan hacia plataformas inferiores. <strong>Regla Dinámica:</strong> cada vez que un jugador utiliza una conexión, esta se desensambla y se reubica aleatoriamente en el tablero.
                </p>
              </div>

              <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
                <h5 className="font-display font-bold text-emerald-400 text-sm uppercase mb-2">
                  3. Dilema Estratégico de Preguntas
                </h5>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>Acierto:</strong> Puedes elegir entre quedarte una tarjeta de VENTAJA para ti o infligir una DESVENTAJA a un rival directo.</li>
                  <li><strong>Fallo:</strong> Debes elegir entre recibir una penalización de DESVENTAJA o ceder una VENTAJA a un equipo rival.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: STANDALONE EXPORT */}
          {activeTab === 'export' && (
            <div className="bg-neutral-900 p-5 rounded-xl border border-neutral-800 text-center space-y-4">
              <Code size={36} className="mx-auto text-rose-400" />
              <div>
                <h4 className="text-base font-display font-bold text-white uppercase tracking-wider">
                  Descargar index.html Autónomo
                </h4>
                <p className="text-xs text-neutral-400 max-w-md mx-auto mt-1 leading-relaxed">
                  Exporta una versión en un solo archivo HTML autónomo para ejecutar la aplicación directamente en cualquier proyector o laptop sin conexión a internet ni requerir servidor Node.js.
                </p>
              </div>
              <button
                onClick={downloadStandaloneHtml}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                <Download size={16} />
                <span>Descargar Arena50_Squid_Gamification.html</span>
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-900 flex items-center justify-between text-xs font-mono text-neutral-400">
          <span>Arena 50 · Versión Industrial Gamificada</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-display font-semibold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>

      {/* Avatar Customizer Submodal */}
      {playerToCustomize && (
        <AvatarCustomizerModal
          player={playerToCustomize}
          isOpen={Boolean(playerToCustomize)}
          onClose={() => setPlayerToCustomize(null)}
          onSaveAvatar={(playerId, avatar) => {
            const updated = editablePlayers.map(p => p.id === playerId ? { ...p, avatar } : p);
            setEditablePlayers(updated);
            onUpdatePlayers(updated);
          }}
        />
      )}
    </div>
  );
};
