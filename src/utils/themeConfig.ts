import { BoardThemeId } from '../types';

export interface TerraceStyle {
  name: string;
  bgClass: string;
  borderClass: string;
  bevelClass: string;
  dotClass: string;
}

export interface BoardTheme {
  id: BoardThemeId;
  name: string;
  subtitle: string;
  description: string;
  accentColor: string;
  previewColors: string[];
  bodyBgClass: string;
  containerClass: string;
  terraces: Record<number, TerraceStyle>;
  tileClass: string;
  tileNumberClass: string;
  goalTileClass: string;
  goalBadgeClass: string;
  startTileClass: string;
  startBadgeClass: string;
  benchContainerClass: string;
  benchCardClass: string;
}

export const BOARD_THEMES: Record<BoardThemeId, BoardTheme> = {
  squid_arena: {
    id: 'squid_arena',
    name: 'Squid Arena',
    subtitle: 'Industrial Neón & Concurso VIP',
    description: 'Plataformas en tonos rosa pastel, verde menta, violeta oscuro y ocre con acentos neón y estética de concurso televisivo.',
    accentColor: '#f43f5e',
    previewColors: ['#f43f5e', '#10b981', '#facc15', '#6366f1', '#18181b'],
    bodyBgClass: 'bg-[#090a0f]',
    containerClass: 'bg-neutral-950/90 border border-neutral-800 shadow-[0_25px_60px_rgba(0,0,0,0.95)]',
    terraces: {
      5: {
        name: 'Terraza 5 · Cima de Victoria',
        bgClass: 'bg-[#3f2005]/95',
        borderClass: 'border-[#facc15]/80 shadow-[0_16px_36px_rgba(0,0,0,0.9),0_0_25px_rgba(250,204,21,0.2)]',
        bevelClass: 'border-b-[6px] border-[#1f1002]',
        dotClass: 'bg-amber-400'
      },
      4: {
        name: 'Terraza 4 · Sector Industrial',
        bgClass: 'bg-[#431407]/95',
        borderClass: 'border-[#ea580c]/60 shadow-[0_16px_36px_rgba(0,0,0,0.9)]',
        bevelClass: 'border-b-[6px] border-[#220a04]',
        dotClass: 'bg-orange-500'
      },
      3: {
        name: 'Terraza 3 · Arena Squid Magenta',
        bgClass: 'bg-[#4c0519]/95',
        borderClass: 'border-[#f43f5e]/60 shadow-[0_16px_36px_rgba(0,0,0,0.9)]',
        bevelClass: 'border-b-[6px] border-[#25030d]',
        dotClass: 'bg-rose-500'
      },
      2: {
        name: 'Terraza 2 · Cámara Índigo',
        bgClass: 'bg-[#0f172a]/95',
        borderClass: 'border-[#6366f1]/60 shadow-[0_16px_36px_rgba(0,0,0,0.9)]',
        bevelClass: 'border-b-[6px] border-[#070b14]',
        dotClass: 'bg-indigo-500'
      },
      1: {
        name: 'Terraza 1 · Base Esmeralda Oscuro',
        bgClass: 'bg-[#022c22]/95',
        borderClass: 'border-[#10b981]/60 shadow-[0_16px_36px_rgba(0,0,0,0.9)]',
        bevelClass: 'border-b-[6px] border-[#011712]',
        dotClass: 'bg-emerald-500'
      }
    },
    tileClass: 'bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] border-slate-300/90 hover:border-white shadow-[0_6px_14px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,1)] hover:scale-[1.02]',
    tileNumberClass: 'text-slate-950',
    goalTileClass: 'bg-gradient-to-b from-amber-200 via-amber-100 to-amber-300 border-amber-400 text-slate-950 shadow-[0_0_25px_rgba(250,204,21,0.6)] ring-2 ring-amber-300',
    goalBadgeClass: 'bg-amber-400/90 text-amber-950 border-amber-500',
    startTileClass: 'bg-gradient-to-b from-emerald-100 via-white to-emerald-200 border-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.5)]',
    startBadgeClass: 'bg-emerald-300/80 text-emerald-950 border-emerald-400',
    benchContainerClass: 'border-neutral-800 bg-neutral-900/90',
    benchCardClass: 'bg-neutral-900/80 border-neutral-700/80'
  },

  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk / Synthwave',
    subtitle: 'Neón Eléctrico & Rejilla Láser',
    description: 'Tonos oscuros de fondo (negro/carbón), con neones vibrantes en azul cian, magenta eléctrico, morado profundo y amarillo láser brillante en las casillas.',
    accentColor: '#06b6d4',
    previewColors: ['#06b6d4', '#d946ef', '#facc15', '#a855f7', '#030712'],
    bodyBgClass: 'bg-[#030712] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]',
    containerClass: 'bg-[#050614]/95 border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.25)]',
    terraces: {
      5: {
        name: 'Sector 5 · Cúspide Cyber Neón',
        bgClass: 'bg-[#18002e]/95',
        borderClass: 'border-[#facc15] shadow-[0_0_25px_rgba(250,204,21,0.4)]',
        bevelClass: 'border-b-[6px] border-[#29004f]',
        dotClass: 'bg-amber-400'
      },
      4: {
        name: 'Sector 4 · Corredor Magenta',
        bgClass: 'bg-[#0a0026]/95',
        borderClass: 'border-[#d946ef] shadow-[0_0_25px_rgba(217,70,239,0.35)]',
        bevelClass: 'border-b-[6px] border-[#1f004d]',
        dotClass: 'bg-fuchsia-400'
      },
      3: {
        name: 'Sector 3 · Red de Datos Cian',
        bgClass: 'bg-[#03152d]/95',
        borderClass: 'border-[#06b6d4] shadow-[0_0_25px_rgba(6,182,212,0.35)]',
        bevelClass: 'border-b-[6px] border-[#06244f]',
        dotClass: 'bg-cyan-400'
      },
      2: {
        name: 'Sector 2 · Núcleo Violeta Láser',
        bgClass: 'bg-[#12002b]/95',
        borderClass: 'border-[#a855f7] shadow-[0_0_20px_rgba(168,85,247,0.3)]',
        bevelClass: 'border-b-[6px] border-[#220050]',
        dotClass: 'bg-purple-400'
      },
      1: {
        name: 'Sector 1 · Subsuelo Synthwave',
        bgClass: 'bg-[#1a001a]/95',
        borderClass: 'border-[#f43f5e] shadow-[0_0_25px_rgba(244,63,94,0.35)]',
        bevelClass: 'border-b-[6px] border-[#360036]',
        dotClass: 'bg-rose-400'
      }
    },
    tileClass: 'bg-gradient-to-b from-[#0b1329] via-[#0f172a] to-[#040814] border-cyan-400/80 hover:border-cyan-200 text-cyan-200 shadow-[0_0_14px_rgba(6,182,212,0.3),inset_0_1px_1px_rgba(34,211,238,0.5)] hover:scale-[1.03]',
    tileNumberClass: 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]',
    goalTileClass: 'bg-gradient-to-b from-amber-400 via-yellow-300 to-amber-500 border-yellow-200 text-slate-950 shadow-[0_0_35px_rgba(250,204,21,0.9)] ring-2 ring-yellow-200',
    goalBadgeClass: 'bg-yellow-400 text-black border-yellow-200 shadow-[0_0_10px_#facc15]',
    startTileClass: 'bg-gradient-to-b from-cyan-400 via-sky-300 to-cyan-500 border-cyan-100 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.8)]',
    startBadgeClass: 'bg-cyan-400 text-black border-cyan-200 shadow-[0_0_10px_#06b6d4]',
    benchContainerClass: 'border-cyan-900/80 bg-[#060817]/95 shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    benchCardClass: 'bg-[#080d22]/85 border-cyan-800/80'
  },

  selva_mistica: {
    id: 'selva_mistica',
    name: 'Selva Mística / Aventura',
    subtitle: 'Ruinas Ancestrales & Templo Perdido',
    description: 'Tonos naturales inspirados en ruinas y vegetación: verde musgo, marrón madera, ocre tierra, piedra antigua y detalles dorados tipo templo perdido.',
    accentColor: '#10b981',
    previewColors: ['#15803d', '#b45309', '#eab308', '#64748b', '#1c1917'],
    bodyBgClass: 'bg-[#070d09] bg-[radial-gradient(circle_at_bottom_left,rgba(20,83,45,0.3),transparent_50%)]',
    containerClass: 'bg-[#0b130e]/95 border border-[#2d4a3e] shadow-[0_25px_60px_rgba(0,0,0,0.95)]',
    terraces: {
      5: {
        name: 'Plataforma 5 · Altar Dorado de los Dioses',
        bgClass: 'bg-[#292209]/95',
        borderClass: 'border-[#eab308]/90 shadow-[0_16px_36px_rgba(0,0,0,0.9),0_0_25px_rgba(234,179,8,0.35)]',
        bevelClass: 'border-b-[6px] border-[#181303]',
        dotClass: 'bg-yellow-400'
      },
      4: {
        name: 'Plataforma 4 · Pasarela de Caoba & Ocre',
        bgClass: 'bg-[#241a12]/95',
        borderClass: 'border-[#b45309]/80 shadow-[0_16px_36px_rgba(0,0,0,0.9)]',
        bevelClass: 'border-b-[6px] border-[#150d06]',
        dotClass: 'bg-amber-600'
      },
      3: {
        name: 'Plataforma 3 · Dosel Verde Musgo',
        bgClass: 'bg-[#122216]/95',
        borderClass: 'border-[#15803d]/80 shadow-[0_16px_36px_rgba(0,0,0,0.9)]',
        bevelClass: 'border-b-[6px] border-[#08150c]',
        dotClass: 'bg-emerald-500'
      },
      2: {
        name: 'Plataforma 2 · Ruinas de Piedra Ancestral',
        bgClass: 'bg-[#182124]/95',
        borderClass: 'border-[#64748b]/80 shadow-[0_16px_36px_rgba(0,0,0,0.9)]',
        bevelClass: 'border-b-[6px] border-[#0d1416]',
        dotClass: 'bg-slate-400'
      },
      1: {
        name: 'Plataforma 1 · Sendero de Lianas & Raíces',
        bgClass: 'bg-[#161c12]/95',
        borderClass: 'border-[#4d7c0f]/80 shadow-[0_16px_36px_rgba(0,0,0,0.9)]',
        bevelClass: 'border-b-[6px] border-[#0c1009]',
        dotClass: 'bg-lime-500'
      }
    },
    tileClass: 'bg-gradient-to-b from-[#fef3c7] via-[#fde68a] to-[#f5d061] border-[#b45309]/80 hover:border-amber-300 text-[#451a03] shadow-[0_6px_14px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:scale-[1.02]',
    tileNumberClass: 'text-[#451a03]',
    goalTileClass: 'bg-gradient-to-b from-yellow-300 via-amber-200 to-amber-400 border-yellow-500 text-[#451a03] shadow-[0_0_25px_rgba(234,179,8,0.7)] ring-2 ring-yellow-400',
    goalBadgeClass: 'bg-amber-400 text-[#451a03] border-amber-600',
    startTileClass: 'bg-gradient-to-b from-emerald-200 via-green-100 to-emerald-300 border-emerald-600 text-[#064e3b] shadow-[0_0_20px_rgba(16,185,129,0.5)]',
    startBadgeClass: 'bg-emerald-300 text-[#064e3b] border-emerald-500',
    benchContainerClass: 'border-[#284435] bg-[#0f1712]/95',
    benchCardClass: 'bg-[#15231c]/80 border-[#2f4f3e]'
  },

  corporativo: {
    id: 'corporativo',
    name: 'Corporativo Ejecutivos / Minimalista',
    subtitle: 'Elegancia Sobria & Executive Slate',
    description: 'Estilo sobrio, limpio y elegante para empresas: gris perla, azul marino corporativo, grafito, toques de plata y blanco marfil.',
    accentColor: '#3b82f6',
    previewColors: ['#1e3a8a', '#3b82f6', '#94a3b8', '#0f172a', '#f8fafc'],
    bodyBgClass: 'bg-[#090d16] bg-[radial-gradient(ellipse_at_top,rgba(30,58,138,0.25),transparent_50%)]',
    containerClass: 'bg-[#0f172a]/95 border border-slate-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.95)]',
    terraces: {
      5: {
        name: 'Terraza 5 · Sala de Juntas Ejecutiva (Platinum)',
        bgClass: 'bg-[#1e293b]/95',
        borderClass: 'border-slate-300/90 shadow-[0_0_25px_rgba(203,213,225,0.3)]',
        bevelClass: 'border-b-[6px] border-[#0f172a]',
        dotClass: 'bg-slate-300'
      },
      4: {
        name: 'Terraza 4 · Dirección Corporativa Navy',
        bgClass: 'bg-[#172554]/95',
        borderClass: 'border-[#3b82f6]/70 shadow-[0_16px_36px_rgba(0,0,0,0.8)]',
        bevelClass: 'border-b-[6px] border-[#0e1738]',
        dotClass: 'bg-blue-500'
      },
      3: {
        name: 'Terraza 3 · Estrategia & Planificación Índigo',
        bgClass: 'bg-[#1e1b4b]/95',
        borderClass: 'border-[#6366f1]/70 shadow-[0_16px_36px_rgba(0,0,0,0.8)]',
        bevelClass: 'border-b-[6px] border-[#100e2e]',
        dotClass: 'bg-indigo-500'
      },
      2: {
        name: 'Terraza 2 · Gestión Operativa Grafito',
        bgClass: 'bg-[#18181b]/95',
        borderClass: 'border-[#94a3b8]/70 shadow-[0_16px_36px_rgba(0,0,0,0.8)]',
        bevelClass: 'border-b-[6px] border-[#09090b]',
        dotClass: 'bg-slate-400'
      },
      1: {
        name: 'Terraza 1 · Base Logística Azul Cielo',
        bgClass: 'bg-[#0f2830]/95',
        borderClass: 'border-[#0ea5e9]/70 shadow-[0_16px_36px_rgba(0,0,0,0.8)]',
        bevelClass: 'border-b-[6px] border-[#07171d]',
        dotClass: 'bg-sky-400'
      }
    },
    tileClass: 'bg-gradient-to-b from-[#ffffff] via-[#f8fafc] to-[#e2e8f0] border-slate-300 text-[#0f172a] hover:border-blue-400 shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:scale-[1.02]',
    tileNumberClass: 'text-[#0f172a]',
    goalTileClass: 'bg-gradient-to-b from-blue-100 via-sky-50 to-blue-200 border-blue-500 text-blue-950 shadow-[0_0_20px_rgba(59,130,246,0.6)] ring-2 ring-blue-300',
    goalBadgeClass: 'bg-blue-600 text-white border-blue-400',
    startTileClass: 'bg-gradient-to-b from-slate-100 via-white to-slate-200 border-slate-400 text-slate-900 shadow-[0_0_15px_rgba(148,163,184,0.5)]',
    startBadgeClass: 'bg-slate-300 text-slate-900 border-slate-400',
    benchContainerClass: 'border-slate-800 bg-[#0d1527]/95',
    benchCardClass: 'bg-[#121c33]/80 border-slate-700/80'
  },

  retro_arcade: {
    id: 'retro_arcade',
    name: 'Retro Arcade 8-bits / Neón Retro',
    subtitle: 'Nostalgia Gamer & High Score 80s',
    description: 'Tonos contrastantes y llamativos tipo videojuego clásico: azul rey, rojo neón, amarillo vibrante, verde lima y fondo oscuro con sutil patrón de retícula.',
    accentColor: '#eab308',
    previewColors: ['#2563eb', '#ef4444', '#eab308', '#84cc16', '#a855f7'],
    bodyBgClass: 'bg-[#050510] bg-[linear-gradient(to_right,#1f293720_1px,transparent_1px),linear-gradient(to_bottom,#1f293720_1px,transparent_1px)] bg-[size:28px_28px]',
    containerClass: 'bg-[#0a0a18]/95 border-2 border-indigo-500/80 shadow-[0_0_40px_rgba(99,102,241,0.35)]',
    terraces: {
      5: {
        name: 'LEVEL 5 · CIMA FINAL (GOLD TROPHY)',
        bgClass: 'bg-[#2a1700]/95',
        borderClass: 'border-[#eab308] shadow-[0_0_30px_rgba(234,179,8,0.5)]',
        bevelClass: 'border-b-[6px] border-[#140b00]',
        dotClass: 'bg-yellow-400 animate-bounce'
      },
      4: {
        name: 'LEVEL 4 · BOSS STAGE (ROJO NEÓN)',
        bgClass: 'bg-[#2c000e]/95',
        borderClass: 'border-[#ef4444] shadow-[0_0_25px_rgba(239,68,68,0.4)]',
        bevelClass: 'border-b-[6px] border-[#140006]',
        dotClass: 'bg-red-500'
      },
      3: {
        name: 'LEVEL 3 · BONUS STAGE (VIOLETA RETRO)',
        bgClass: 'bg-[#150030]/95',
        borderClass: 'border-[#a855f7] shadow-[0_0_25px_rgba(168,85,247,0.4)]',
        bevelClass: 'border-b-[6px] border-[#0a001a]',
        dotClass: 'bg-purple-500'
      },
      2: {
        name: 'LEVEL 2 · WATER WORLD (AZUL REY)',
        bgClass: 'bg-[#001738]/95',
        borderClass: 'border-[#2563eb] shadow-[0_0_25px_rgba(37,99,235,0.4)]',
        bevelClass: 'border-b-[6px] border-[#000a1a]',
        dotClass: 'bg-blue-500'
      },
      1: {
        name: 'LEVEL 1 · GREEN ZONE (VERDE LIMA)',
        bgClass: 'bg-[#022108]/95',
        borderClass: 'border-[#84cc16] shadow-[0_0_25px_rgba(132,204,22,0.4)]',
        bevelClass: 'border-b-[6px] border-[#011004]',
        dotClass: 'bg-lime-400'
      }
    },
    tileClass: 'bg-gradient-to-b from-[#18182e] via-[#101026] to-[#060614] border-yellow-400 text-yellow-300 hover:border-yellow-200 shadow-[0_0_12px_rgba(250,204,21,0.3),inset_0_1px_1px_rgba(250,204,21,0.4)] hover:scale-[1.03]',
    tileNumberClass: 'text-yellow-300 drop-shadow-[0_0_6px_rgba(250,204,21,0.7)] font-mono font-black',
    goalTileClass: 'bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-500 border-yellow-200 text-black shadow-[0_0_35px_rgba(250,204,21,0.9)] ring-2 ring-yellow-200',
    goalBadgeClass: 'bg-yellow-400 text-black border-black font-mono font-black',
    startTileClass: 'bg-gradient-to-b from-lime-300 via-green-400 to-lime-500 border-lime-200 text-black shadow-[0_0_25px_rgba(132,204,22,0.9)]',
    startBadgeClass: 'bg-lime-400 text-black border-black font-mono font-black',
    benchContainerClass: 'border-indigo-800 bg-[#0e0e22]/95 shadow-[0_0_20px_rgba(99,102,241,0.2)]',
    benchCardClass: 'bg-[#141432]/90 border-indigo-700/80'
  }
};
