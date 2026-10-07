import React, { useRef, useState, useEffect } from 'react';
import { Player, Connection, BoardThemeId, BrandConfig } from '../types';
import { ThematicLogo } from './ThematicLogo';
import { CharacterAvatar, CharacterAction } from './CharacterAvatar';
import { ProjectileOverlay, ProjectileConfig } from './ProjectileOverlay';
import { BOARD_THEMES } from '../utils/themeConfig';

interface BoardProps {
  players: Player[];
  activePlayerIndex: number;
  connections: Connection[];
  themeId?: BoardThemeId;
  brandConfig?: BrandConfig;
  isDarkMode?: boolean;
  shockwaveTile?: number | null;
  affectedPlayerAnim?: { playerId: string; type: 'BUFF' | 'DEBUFF' } | null;
  dissolvingConnectionId?: string | null;
  appearingConnectionId?: string | null;
  playerAction?: { playerId: string; action: CharacterAction } | null;
  activeProjectile?: ProjectileConfig | null;
  isMovingBackwards?: boolean;
  activeCardTransformation?: { playerId: string; effect: 'ROCKET_BOOTS' | 'SKIDDING' | 'TELEPORT' | 'VORTEX' | null } | null;
  onTileClick?: (tileNumber: number) => void;
}

export const Board: React.FC<BoardProps> = ({
  players,
  activePlayerIndex,
  connections,
  themeId = 'squid_arena',
  brandConfig,
  isDarkMode = true,
  shockwaveTile,
  affectedPlayerAnim,
  dissolvingConnectionId,
  appearingConnectionId,
  playerAction,
  activeProjectile,
  isMovingBackwards = false,
  activeCardTransformation,
  onTileClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tileCenters, setTileCenters] = useState<{ [key: number]: { x: number; y: number } }>({});
  const [boardWidth, setBoardWidth] = useState<number>(() => {
    return typeof window !== 'undefined' ? window.innerWidth : 1200;
  });
  const currentTheme = BOARD_THEMES[themeId] || BOARD_THEMES.squid_arena;

  // 5 Terraced Architectural Platforms (Top Row 5 to Bottom Row 1) based on active theme
  const rows = [
    {
      terrace: 5,
      name: currentTheme.terraces[5].name,
      tiles: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
      bgClass: currentTheme.terraces[5].bgClass,
      borderClass: currentTheme.terraces[5].borderClass,
      bevelClass: currentTheme.terraces[5].bevelClass,
      dotClass: currentTheme.terraces[5].dotClass
    },
    {
      terrace: 4,
      name: currentTheme.terraces[4].name,
      tiles: [40, 39, 38, 37, 36, 35, 34, 33, 32, 31],
      bgClass: currentTheme.terraces[4].bgClass,
      borderClass: currentTheme.terraces[4].borderClass,
      bevelClass: currentTheme.terraces[4].bevelClass,
      dotClass: currentTheme.terraces[4].dotClass
    },
    {
      terrace: 3,
      name: currentTheme.terraces[3].name,
      tiles: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
      bgClass: currentTheme.terraces[3].bgClass,
      borderClass: currentTheme.terraces[3].borderClass,
      bevelClass: currentTheme.terraces[3].bevelClass,
      dotClass: currentTheme.terraces[3].dotClass
    },
    {
      terrace: 2,
      name: currentTheme.terraces[2].name,
      tiles: [20, 19, 18, 17, 16, 15, 14, 13, 12, 11],
      bgClass: currentTheme.terraces[2].bgClass,
      borderClass: currentTheme.terraces[2].borderClass,
      bevelClass: currentTheme.terraces[2].bevelClass,
      dotClass: currentTheme.terraces[2].dotClass
    },
    {
      terrace: 1,
      name: currentTheme.terraces[1].name,
      tiles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      bgClass: currentTheme.terraces[1].bgClass,
      borderClass: currentTheme.terraces[1].borderClass,
      bevelClass: currentTheme.terraces[1].bevelClass,
      dotClass: currentTheme.terraces[1].dotClass
    }
  ];

  // Recalculate tile center coordinates for drawing connections on SVG overlay
  useEffect(() => {
    const updateCoordinates = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      setBoardWidth(containerRect.width);
      const centers: { [key: number]: { x: number; y: number } } = {};

      for (let i = 1; i <= 50; i++) {
        const el = containerRef.current.querySelector(`[data-tile="${i}"]`);
        if (el) {
          const rect = el.getBoundingClientRect();
          centers[i] = {
            x: rect.left + rect.width / 2 - containerRect.left,
            y: rect.top + rect.height / 2 - containerRect.top
          };
        }
      }
      setTileCenters(centers);
    };

    updateCoordinates();
    window.addEventListener('resize', updateCoordinates);
    const observer = new ResizeObserver(updateCoordinates);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', updateCoordinates);
      observer.disconnect();
    };
  }, [connections]);

  // Helper to build ladder scaffolding with adaptive mobile slimming
  const connectionScale = Math.min(1, Math.max(0.38, boardWidth / 1100));

  const renderLadder = (ladder: Connection) => {
    const start = tileCenters[ladder.startTile];
    const end = tileCenters[ladder.endTile];
    if (!start || !end) return null;

    const isDissolving = dissolvingConnectionId === ladder.id;
    const isAppearing = appearingConnectionId === ladder.id;

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    if (dist === 0) return null;

    const angle = Math.atan2(dy, dx);
    // Proportionally slender width on mobile / tablet to prevent crowding tiles
    const width = Math.max(7.5, 18 * connectionScale);

    // Perp vector for rails
    const px = Math.cos(angle + Math.PI / 2) * (width / 2);
    const py = Math.sin(angle + Math.PI / 2) * (width / 2);

    const r1Start = { x: start.x - px, y: start.y - py };
    const r1End = { x: end.x - px, y: end.y - py };
    const r2Start = { x: start.x + px, y: start.y + py };
    const r2End = { x: end.x + px, y: end.y + py };

    // Generate rungs
    const rungGap = Math.max(9, 14 * connectionScale);
    const numRungs = Math.max(3, Math.floor(dist / rungGap));
    const rungs = [];
    for (let i = 1; i < numRungs; i++) {
      const t = i / numRungs;
      const mx = start.x + dx * t;
      const my = start.y + dy * t;
      rungs.push({
        x1: mx - px,
        y1: my - py,
        x2: mx + px,
        y2: my + py
      });
    }

    const shadowW = Math.max(9, 24 * connectionScale);
    const railW1 = Math.max(2.4, 6 * connectionScale);
    const railW2 = Math.max(1, 2 * connectionScale);
    const rungW1 = Math.max(2, 5 * connectionScale);
    const rungW2 = Math.max(0.8, 1.5 * connectionScale);
    const pulseW = Math.max(1.4, 3.5 * connectionScale);
    const anchorR = Math.max(3.5, 8 * connectionScale);
    const anchorBorder = Math.max(1.2, 2.5 * connectionScale);

    return (
      <g
        key={ladder.id}
        style={{
          transformOrigin: `${start.x}px ${start.y}px`
        }}
        className={`transition-all duration-500 ${
          isDissolving
            ? 'animate-dissolve'
            : isAppearing
            ? 'animate-elastic-spawn'
            : ''
        }`}
      >
        {/* Floor drop shadow */}
        <line
          x1={start.x}
          y1={start.y + Math.max(4, 8 * connectionScale)}
          x2={end.x}
          y2={end.y + Math.max(4, 8 * connectionScale)}
          stroke="rgba(0,0,0,0.7)"
          strokeWidth={shadowW}
          strokeLinecap="round"
        />

        {/* Steel Rail 1 (Dark core + metallic top edge) */}
        <line
          x1={r1Start.x}
          y1={r1Start.y}
          x2={r1End.x}
          y2={r1End.y}
          stroke="#18181b"
          strokeWidth={railW1}
          strokeLinecap="round"
        />
        <line
          x1={r1Start.x}
          y1={r1Start.y}
          x2={r1End.x}
          y2={r1End.y}
          stroke="#a1a1aa"
          strokeWidth={railW2}
          strokeLinecap="round"
        />

        {/* Steel Rail 2 */}
        <line
          x1={r2Start.x}
          y1={r2Start.y}
          x2={r2End.x}
          y2={r2End.y}
          stroke="#18181b"
          strokeWidth={railW1}
          strokeLinecap="round"
        />
        <line
          x1={r2Start.x}
          y1={r2Start.y}
          x2={r2End.x}
          y2={r2End.y}
          stroke="#a1a1aa"
          strokeWidth={railW2}
          strokeLinecap="round"
        />

        {/* Metal Rungs */}
        {rungs.map((r, idx) => (
          <g key={idx}>
            <line
              x1={r.x1}
              y1={r.y1}
              x2={r.x2}
              y2={r.y2}
              stroke="#27272a"
              strokeWidth={rungW1}
              strokeLinecap="square"
            />
            <line
              x1={r.x1}
              y1={r.y1}
              x2={r.x2}
              y2={r.y2}
              stroke="#e4e4e7"
              strokeWidth={rungW2}
              strokeLinecap="square"
            />
          </g>
        ))}

        {/* Ascending Guide Light Pulse */}
        <line
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke="#38bdf8"
          strokeWidth={pulseW}
          strokeDasharray="10 24"
          className="opacity-90"
          style={{
            animation: 'flow-up 1.6s linear infinite'
          }}
        />

        {/* Start Footplate & End Landing Anchors */}
        <circle cx={start.x} cy={start.y} r={anchorR} fill="#27272a" stroke="#38bdf8" strokeWidth={anchorBorder} />
        <circle cx={end.x} cy={end.y} r={anchorR} fill="#047857" stroke="#34d399" strokeWidth={anchorBorder} />
      </g>
    );
  };

  // Helper to render the 3 distinct Snake Species (Boa, Cascabel, Coralillo)
  const renderSnake = (tube: Connection) => {
    const start = tileCenters[tube.startTile]; // Start: Top Platform (Tail)
    const end = tileCenters[tube.endTile];     // End: Bottom Platform (Head)
    if (!start || !end) return null;

    const species = tube.snakeSpecies || 'CASCABEL';
    const isDissolving = dissolvingConnectionId === tube.id;
    const isAppearing = appearingConnectionId === tube.id;

    // Organic S-Curvature scaled proportionately so curve does not loop excessively over adjacent tiles on mobile
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const offset = (dx > 0 ? 45 : -45) * Math.max(0.4, connectionScale);
    const cp1X = start.x + offset;
    const cp1Y = start.y + dy * 0.4;
    const cp2X = end.x - offset;
    const cp2Y = end.y - dy * 0.4;

    const pathD = `M ${start.x} ${start.y} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${end.x} ${end.y}`;
    const headAngle = Math.atan2(end.y - cp2Y, end.x - cp2X);
    const cosA = Math.cos(headAngle);
    const sinA = Math.sin(headAngle);

    // 1. BOA CONSTRICTOR (Heavy, thick, earth tones, rhomboid blotches, massive head)
    if (species === 'BOA') {
      const headLen = Math.max(12, 26 * connectionScale);
      const headWidth = Math.max(9, 20 * connectionScale);
      const tipOffset = 5 * connectionScale;
      const tipX = end.x + cosA * tipOffset;
      const tipY = end.y + sinA * tipOffset;
      const leftCornerX = end.x - cosA * headLen + sinA * (headWidth / 2);
      const leftCornerY = end.y - sinA * headLen - cosA * (headWidth / 2);
      const rightCornerX = end.x - cosA * headLen - sinA * (headWidth / 2);
      const rightCornerY = end.y - sinA * headLen + cosA * (headWidth / 2);
      const skullBaseX = end.x - cosA * (headLen * 0.85);
      const skullBaseY = end.y - sinA * (headLen * 0.85);

      const shadowW = Math.max(11, 32 * connectionScale);
      const bodyW1 = Math.max(10, 26 * connectionScale);
      const bodyW2 = Math.max(8, 22 * connectionScale);
      const markW1 = Math.max(5.5, 16 * connectionScale);
      const markW2 = Math.max(2, 6 * connectionScale);
      const spineW = Math.max(0.8, 1.5 * connectionScale);
      const pulseW = Math.max(1.8, 5 * connectionScale);
      const eyeR = Math.max(1.2, 2.5 * connectionScale);
      const eyeDist = Math.max(5, 12 * connectionScale);
      const eyeSpread = Math.max(2.5, 6 * connectionScale);
      const tailR = Math.max(3.8, 9 * connectionScale);

      return (
        <g
          key={tube.id}
          style={{ transformOrigin: `${start.x}px ${start.y}px` }}
          className={`transition-all duration-500 ${isDissolving ? 'animate-dissolve' : isAppearing ? 'animate-elastic-spawn' : ''}`}
        >
          {/* Drop Shadow */}
          <path d={`M ${start.x} ${start.y + Math.max(5, 12 * connectionScale)} C ${cp1X} ${cp1Y + Math.max(5, 12 * connectionScale)}, ${cp2X} ${cp2Y + Math.max(5, 12 * connectionScale)}, ${end.x} ${end.y + Math.max(5, 12 * connectionScale)}`} fill="none" stroke="rgba(0,0,0,0.75)" strokeWidth={shadowW} strokeLinecap="round" />
          {/* Outer thick muscular body */}
          <path d={pathD} fill="none" stroke="#1c110a" strokeWidth={bodyW1} strokeLinecap="round" />
          <path d={pathD} fill="none" stroke="#451a03" strokeWidth={bodyW2} strokeLinecap="round" />
          {/* Ocre & Earth Saddle Rhomboid Markings */}
          <path d={pathD} fill="none" stroke="#78350f" strokeWidth={markW1} strokeDasharray="14 18" strokeLinecap="round" />
          <path d={pathD} fill="none" stroke="#d7ccc8" strokeWidth={markW2} strokeDasharray="6 26" strokeLinecap="round" strokeOpacity="0.7" />
          {/* Spine Highlight */}
          <path d={pathD} fill="none" stroke="#fde68a" strokeWidth={spineW} strokeOpacity="0.5" strokeLinecap="round" />
          {/* Live Descending Pulse */}
          <path d={pathD} fill="none" stroke="#fbbf24" strokeWidth={pulseW} strokeDasharray="14 34" className="opacity-95" style={{ animation: 'flow-down 1.4s linear infinite' }} />
          {/* Massive Boa Head (Bottom) */}
          <g>
            <polygon points={`${tipX},${tipY + 3} ${leftCornerX},${leftCornerY + 3} ${skullBaseX},${skullBaseY + 3} ${rightCornerX},${rightCornerY + 3}`} fill="rgba(0,0,0,0.5)" />
            <polygon points={`${tipX},${tipY} ${leftCornerX},${leftCornerY} ${skullBaseX},${skullBaseY} ${rightCornerX},${rightCornerY}`} fill="#271810" stroke="#78350f" strokeWidth={Math.max(1.2, 2.5 * connectionScale)} />
            <ellipse cx={end.x - cosA * (headLen * 0.4)} cy={end.y - sinA * (headLen * 0.4)} rx={Math.max(2.5, 6 * connectionScale)} ry={Math.max(1.8, 4 * connectionScale)} transform={`rotate(${headAngle * 180 / Math.PI}, ${end.x - cosA * (headLen * 0.4)}, ${end.y - sinA * (headLen * 0.4)})`} fill="#451a03" />
            {/* Eyes */}
            <circle cx={end.x - cosA * eyeDist + sinA * eyeSpread} cy={end.y - sinA * eyeDist - cosA * eyeSpread} r={eyeR} fill="#f59e0b" />
            <circle cx={end.x - cosA * eyeDist - sinA * eyeSpread} cy={end.y - sinA * eyeDist + cosA * eyeSpread} r={eyeR} fill="#f59e0b" />
          </g>
          {/* Tail Entry */}
          <circle cx={start.x} cy={start.y} r={tailR} fill="#1c110a" stroke="#d97706" strokeWidth={Math.max(1, 2 * connectionScale)} />
        </g>
      );
    }

    // 2. CASCABEL (Medium thickness, sand & gold diamond pattern, segmented rattle tail, triangular head)
    if (species === 'CASCABEL') {
      const headLen = Math.max(10, 22 * connectionScale);
      const headWidth = Math.max(7, 15 * connectionScale);
      const tipOffset = 4 * connectionScale;
      const tipX = end.x + cosA * tipOffset;
      const tipY = end.y + sinA * tipOffset;
      const leftCornerX = end.x - cosA * headLen + sinA * (headWidth / 2);
      const leftCornerY = end.y - sinA * headLen - cosA * (headWidth / 2);
      const rightCornerX = end.x - cosA * headLen - sinA * (headWidth / 2);
      const rightCornerY = end.y - sinA * headLen + cosA * (headWidth / 2);
      const skullBaseX = end.x - cosA * (headLen * 0.85);
      const skullBaseY = end.y - sinA * (headLen * 0.85);

      const shadowW = Math.max(9, 24 * connectionScale);
      const bodyW1 = Math.max(7.5, 18 * connectionScale);
      const bodyW2 = Math.max(6, 15 * connectionScale);
      const diamondW = Math.max(4, 10 * connectionScale);
      const highlightW = Math.max(1.6, 4 * connectionScale);
      const pulseW = Math.max(1.6, 4 * connectionScale);
      const r1 = Math.max(3, 7 * connectionScale);
      const r2 = Math.max(2.2, 5 * connectionScale);
      const r3 = Math.max(1.5, 3.5 * connectionScale);
      const eyeR = Math.max(1, 2 * connectionScale);
      const eyeDist = Math.max(4.5, 10 * connectionScale);
      const eyeSpread = Math.max(2, 4.5 * connectionScale);

      return (
        <g
          key={tube.id}
          style={{ transformOrigin: `${start.x}px ${start.y}px` }}
          className={`transition-all duration-500 ${isDissolving ? 'animate-dissolve' : isAppearing ? 'animate-elastic-spawn' : ''}`}
        >
          {/* Drop Shadow */}
          <path d={`M ${start.x} ${start.y + Math.max(4, 10 * connectionScale)} C ${cp1X} ${cp1Y + Math.max(4, 10 * connectionScale)}, ${cp2X} ${cp2Y + Math.max(4, 10 * connectionScale)}, ${end.x} ${end.y + Math.max(4, 10 * connectionScale)}`} fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth={shadowW} strokeLinecap="round" />
          {/* Body base */}
          <path d={pathD} fill="none" stroke="#291e0a" strokeWidth={bodyW1} strokeLinecap="round" />
          <path d={pathD} fill="none" stroke="#78350f" strokeWidth={bodyW2} strokeLinecap="round" />
          {/* Desert Diamond Scale Pattern */}
          <path d={pathD} fill="none" stroke="#d97706" strokeWidth={diamondW} strokeDasharray="8 10" strokeLinecap="round" />
          <path d={pathD} fill="none" stroke="#fef08a" strokeWidth={highlightW} strokeDasharray="4 14" strokeLinecap="round" strokeOpacity="0.8" />
          {/* Live Descending Pulse */}
          <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth={pulseW} strokeDasharray="10 26" className="opacity-95" style={{ animation: 'flow-down 1.2s linear infinite' }} />
          {/* Segmented Rattle at Tail (Top) */}
          <g>
            <circle cx={start.x} cy={start.y} r={r1} fill="#fef08a" stroke="#78350f" strokeWidth={Math.max(1, 2 * connectionScale)} />
            <circle cx={start.x + Math.max(1.5, 3 * connectionScale)} cy={start.y - Math.max(1.5, 3 * connectionScale)} r={r2} fill="#fde68a" stroke="#78350f" strokeWidth={Math.max(0.8, 1.5 * connectionScale)} />
            <circle cx={start.x + Math.max(3, 6 * connectionScale)} cy={start.y - Math.max(3, 6 * connectionScale)} r={r3} fill="#ca8a04" stroke="#78350f" strokeWidth={Math.max(0.6, 1 * connectionScale)} />
          </g>
          {/* Triangular Viper Head (Bottom) */}
          <g>
            <polygon points={`${tipX},${tipY + 2} ${leftCornerX},${leftCornerY + 2} ${skullBaseX},${skullBaseY + 2} ${rightCornerX},${rightCornerY + 2}`} fill="rgba(0,0,0,0.5)" />
            <polygon points={`${tipX},${tipY} ${leftCornerX},${leftCornerY} ${skullBaseX},${skullBaseY} ${rightCornerX},${rightCornerY}`} fill="#451a03" stroke="#f59e0b" strokeWidth={Math.max(1, 2 * connectionScale)} />
            <circle cx={end.x - cosA * eyeDist + sinA * eyeSpread} cy={end.y - sinA * eyeDist - cosA * eyeSpread} r={eyeR} fill="#38bdf8" />
            <circle cx={end.x - cosA * eyeDist - sinA * eyeSpread} cy={end.y - sinA * eyeDist + cosA * eyeSpread} r={eyeR} fill="#38bdf8" />
          </g>
        </g>
      );
    }

    // 3. CORALILLO (Slender, agile, rhythmic bands of Red, Yellow/White and Black)
    const headLen = Math.max(8, 16 * connectionScale);
    const headWidth = Math.max(5.5, 11 * connectionScale);
    const tipOffset = 3 * connectionScale;
    const tipX = end.x + cosA * tipOffset;
    const tipY = end.y + sinA * tipOffset;
    const leftCornerX = end.x - cosA * headLen + sinA * (headWidth / 2);
    const leftCornerY = end.y - sinA * headLen - cosA * (headWidth / 2);
    const rightCornerX = end.x - cosA * headLen - sinA * (headWidth / 2);
    const rightCornerY = end.y - sinA * headLen + cosA * (headWidth / 2);
    const skullBaseX = end.x - cosA * (headLen * 0.85);
    const skullBaseY = end.y - sinA * (headLen * 0.85);

    const shadowW = Math.max(7.5, 18 * connectionScale);
    const baseW = Math.max(5.2, 12 * connectionScale);
    const bandW = Math.max(4.2, 10 * connectionScale);
    const whiteW = Math.max(0.8, 1.5 * connectionScale);
    const pulseW = Math.max(1.2, 3 * connectionScale);
    const tailR = Math.max(2.2, 5 * connectionScale);
    const eyeR = Math.max(0.8, 1.5 * connectionScale);
    const eyeDist = Math.max(3.2, 7 * connectionScale);
    const eyeSpread = Math.max(1.4, 3 * connectionScale);

    return (
      <g
        key={tube.id}
        style={{ transformOrigin: `${start.x}px ${start.y}px` }}
        className={`transition-all duration-500 ${isDissolving ? 'animate-dissolve' : isAppearing ? 'animate-elastic-spawn' : ''}`}
      >
        {/* Drop Shadow */}
        <path d={`M ${start.x} ${start.y + Math.max(3.5, 8 * connectionScale)} C ${cp1X} ${cp1Y + Math.max(3.5, 8 * connectionScale)}, ${cp2X} ${cp2Y + Math.max(3.5, 8 * connectionScale)}, ${end.x} ${end.y + Math.max(3.5, 8 * connectionScale)}`} fill="none" stroke="rgba(0,0,0,0.65)" strokeWidth={shadowW} strokeLinecap="round" />
        {/* Black base */}
        <path d={pathD} fill="none" stroke="#090a0f" strokeWidth={baseW} strokeLinecap="round" />
        {/* Coral Warning Rings: Red + Yellow/White Bands */}
        <path d={pathD} fill="none" stroke="#dc2626" strokeWidth={bandW} strokeDasharray="10 20" strokeLinecap="butt" />
        <path d={pathD} fill="none" stroke="#facc15" strokeWidth={bandW} strokeDasharray="4 26" strokeDashoffset="10" strokeLinecap="butt" />
        <path d={pathD} fill="none" stroke="#ffffff" strokeWidth={whiteW} strokeDasharray="2 28" strokeDashoffset="11" strokeOpacity="0.8" />
        {/* Live Descending Pulse */}
        <path d={pathD} fill="none" stroke="#f43f5e" strokeWidth={pulseW} strokeDasharray="8 20" className="opacity-95" style={{ animation: 'flow-down 1.0s linear infinite' }} />
        {/* Slender Tail */}
        <circle cx={start.x} cy={start.y} r={tailR} fill="#dc2626" stroke="#facc15" strokeWidth={Math.max(0.8, 1.5 * connectionScale)} />
        {/* Coral Head with Yellow Collar Band */}
        <g>
          <polygon points={`${tipX},${tipY + 2} ${leftCornerX},${leftCornerY + 2} ${skullBaseX},${skullBaseY + 2} ${rightCornerX},${rightCornerY + 2}`} fill="rgba(0,0,0,0.4)" />
          <polygon points={`${tipX},${tipY} ${leftCornerX},${leftCornerY} ${skullBaseX},${skullBaseY} ${rightCornerX},${rightCornerY}`} fill="#090a0f" stroke="#facc15" strokeWidth={Math.max(0.8, 1.5 * connectionScale)} />
          <line x1={leftCornerX} y1={leftCornerY} x2={rightCornerX} y2={rightCornerY} stroke="#facc15" strokeWidth={Math.max(1.2, 2.5 * connectionScale)} />
          <circle cx={end.x - cosA * eyeDist + sinA * eyeSpread} cy={end.y - sinA * eyeDist - cosA * eyeSpread} r={eyeR} fill="#f43f5e" />
          <circle cx={end.x - cosA * eyeDist - sinA * eyeSpread} cy={end.y - sinA * eyeDist + cosA * eyeSpread} r={eyeR} fill="#f43f5e" />
        </g>
      </g>
    );
  };

  return (
    <div className="relative w-full max-w-[1380px] mx-auto select-none px-2 py-1">
      {/* CSS Animation Keyframes for Movement & Reconnection */}
      <style>{`
        @keyframes flow-up {
          from { stroke-dashoffset: 64; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes flow-down {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: 80; }
        }
        @keyframes shockwave-pulse {
          0% { transform: scale(0.6); opacity: 1; border-color: #38bdf8; }
          100% { transform: scale(1.6); opacity: 0; border-color: #f43f5e; }
        }
        @keyframes elastic-spawn {
          0% { opacity: 0; transform: scale(0.3); }
          65% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes dissolve {
          0% { opacity: 1; transform: scale(1); filter: brightness(1.6); }
          100% { opacity: 0; transform: scale(0.75); filter: blur(4px); }
        }
        @keyframes token-shake {
          0%, 100% { transform: translate(0, 0) scale(1.15); }
          20% { transform: translate(-4px, 2px) rotate(-6deg); }
          40% { transform: translate(4px, -2px) rotate(6deg); }
          60% { transform: translate(-3px, -2px) rotate(-4deg); }
          80% { transform: translate(3px, 2px) rotate(4deg); }
        }
        .animate-elastic-spawn {
          animation: elastic-spawn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-dissolve {
          animation: dissolve 0.6s ease-out forwards;
        }
        .animate-token-shake {
          animation: token-shake 0.4s ease-in-out infinite;
        }
        @keyframes halo-gold-pulse {
          0%, 100% { box-shadow: 0 0 15px 5px rgba(250, 204, 21, 0.85), 0 0 26px 8px rgba(16, 185, 129, 0.65); transform: scale(1); }
          50% { box-shadow: 0 0 25px 9px rgba(250, 204, 21, 1), 0 0 38px 14px rgba(16, 185, 129, 0.9); transform: scale(1.08); }
        }
        @keyframes halo-ice-pulse {
          0%, 100% { box-shadow: 0 0 15px 5px rgba(56, 189, 248, 0.9), 0 0 26px 8px rgba(96, 165, 250, 0.7); transform: scale(1); }
          50% { box-shadow: 0 0 25px 9px rgba(56, 189, 248, 1), 0 0 38px 14px rgba(96, 165, 250, 0.95); transform: scale(1.08); }
        }
        @keyframes halo-red-pulse {
          0%, 100% { box-shadow: 0 0 15px 5px rgba(244, 63, 94, 0.85), 0 0 26px 8px rgba(220, 38, 38, 0.65); transform: scale(1); }
          50% { box-shadow: 0 0 25px 9px rgba(244, 63, 94, 1), 0 0 38px 14px rgba(220, 38, 38, 0.9); transform: scale(1.08); }
        }
        .halo-positive {
          animation: halo-gold-pulse 1.8s infinite ease-in-out;
        }
        .halo-freeze {
          animation: halo-ice-pulse 1.4s infinite ease-in-out;
        }
        .halo-negative {
          animation: halo-red-pulse 1.5s infinite ease-in-out;
        }
      `}</style>

      {/* Thematic Serpientes y Escaleras Title Logo */}
      <ThematicLogo isDarkMode={isDarkMode} />

      {/* Terraces Container */}
      <div
        ref={containerRef}
        style={{
          '--brand-accent': brandConfig?.accentColor || currentTheme.accentColor
        } as React.CSSProperties}
        className={`relative flex flex-col gap-3 rounded-2xl p-3 sm:p-4 backdrop-blur-md transition-all duration-500 ${
          isDarkMode ? currentTheme.containerClass : 'bg-white/90 border border-slate-300 shadow-[0_20px_50px_rgba(0,0,0,0.08)]'
        }`}
      >
        {/* Corporate Branding Watermark / Sponsor Seal in Upper Corner of Board */}
        {(brandConfig?.logoUrl || brandConfig?.logoName) && (
          <div
            className={`absolute top-2.5 right-3 sm:right-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-lg backdrop-blur-md transition-all pointer-events-none ${
              isDarkMode ? 'bg-neutral-950/90' : 'bg-white/95'
            }`}
            style={{
              borderColor: brandConfig?.accentColor || currentTheme.accentColor,
              boxShadow: `0 0 16px ${(brandConfig?.accentColor || currentTheme.accentColor)}40`
            }}
          >
            <div className="flex flex-col text-right hidden sm:flex">
              <span className={`text-[8px] font-mono uppercase tracking-widest font-bold leading-none ${
                isDarkMode ? 'text-neutral-400' : 'text-slate-500'
              }`}>
                SELLO CORPORATIVO
              </span>
              <span className={`text-[10px] font-display font-black leading-tight max-w-[140px] truncate ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {brandConfig?.logoName || 'Sede Oficial'}
              </span>
            </div>
            {brandConfig?.logoUrl ? (
              <img
                src={brandConfig.logoUrl}
                alt={brandConfig?.logoName || 'Logo Corporativo'}
                className="h-6 sm:h-7 max-w-[110px] object-contain filter drop-shadow"
              />
            ) : (
              <span className="text-base">🏢</span>
            )}
          </div>
        )}

        {/* Terraced Platforms (Top Row 5 down to Bottom Row 1) */}
        {rows.map((row) => {
          const brandAccent = brandConfig?.accentColor;
          // Harmonic gradient scale from terrace 1 to terrace 5 based on corporate accent color
          const harmonicStyle: React.CSSProperties = brandAccent ? {
            background: isDarkMode
              ? `linear-gradient(135deg, ${brandAccent}${Math.round((0.08 + (row.terrace - 1) * 0.04) * 255).toString(16).padStart(2, '0')}, rgba(15, 23, 42, 0.95))`
              : `linear-gradient(135deg, ${brandAccent}${Math.round((0.08 + (row.terrace - 1) * 0.04) * 255).toString(16).padStart(2, '0')}, rgba(255, 255, 255, 0.95))`,
            borderColor: `${brandAccent}${Math.round((0.25 + (row.terrace - 1) * 0.08) * 255).toString(16).padStart(2, '0')}`,
            boxShadow: `0 4px 18px ${brandAccent}${Math.round((0.06 + (row.terrace - 1) * 0.03) * 255).toString(16).padStart(2, '0')}`
          } : {};

          return (
            <div
              key={row.terrace}
              style={harmonicStyle}
              className={`relative rounded-xl border ${!brandAccent ? `${row.borderClass} ${row.bgClass} ${row.bevelClass}` : ''} p-2 transition-all duration-300`}
            >
              {/* Terrace Header Label */}
              <div className={`flex items-center justify-between px-2 pb-1.5 text-[11px] font-mono tracking-wider ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700 font-bold'
              }`}>
                <span className="flex items-center gap-1.5 font-bold uppercase">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${!brandAccent ? row.dotClass : ''}`}
                    style={brandAccent ? { backgroundColor: brandAccent, boxShadow: `0 0 8px ${brandAccent}` } : undefined}
                  />
                  {row.name}
                </span>
                <span className={`font-mono font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  PISO {row.terrace}
                </span>
              </div>

            {/* 10 High-Contrast Tiles Grid */}
            <div className="grid grid-cols-10 gap-1.5 sm:gap-2 relative z-10">
              {row.tiles.map((tileNum) => {
                const playersOnTile = players.filter(p => p.tile === tileNum);
                const ladderStart = connections.find(c => c.type === 'LADDER' && c.startTile === tileNum);
                const ladderEnd = connections.find(c => c.type === 'LADDER' && c.endTile === tileNum);
                const snakeStart = connections.find(c => c.type === 'TUBE' && c.startTile === tileNum);
                const snakeEnd = connections.find(c => c.type === 'TUBE' && c.endTile === tileNum);

                const isStart = tileNum === 1;
                const isGoal = tileNum === 50;
                const isShockwave = shockwaveTile === tileNum;

                return (
                  <button
                    key={tileNum}
                    data-tile={tileNum}
                    onClick={() => onTileClick && onTileClick(tileNum)}
                    className={`group relative flex items-center justify-center rounded-xl border-2 p-0 h-[56px] sm:h-[86px] md:h-[96px] max-h-[96px] overflow-hidden transition-all duration-200 cursor-pointer select-none
                      ${isGoal
                        ? currentTheme.goalTileClass
                        : isStart
                        ? currentTheme.startTileClass
                        : currentTheme.tileClass
                      }`}
                  >
                    {/* Shockwave Radar Ring on Piece Landing */}
                    {isShockwave && (
                      <div
                        className="absolute inset-0 rounded-xl border-4 pointer-events-none z-30"
                        style={{
                          animation: 'shockwave-pulse 0.45s ease-out forwards'
                        }}
                      />
                    )}

                    {/* Top Tile Row: Geometric Number & Connection Indicators */}
                    <span className={`absolute top-0.5 sm:top-1 left-0.5 sm:left-1 z-30 text-[10px] sm:text-xs md:text-sm font-display font-black tabular-nums tracking-wider pointer-events-none leading-none px-1 py-0.5 rounded shadow-2xs backdrop-blur-xs ${
                      isGoal
                        ? 'text-amber-950 bg-amber-300/95 font-black ring-1 ring-amber-400'
                        : isStart
                        ? 'text-emerald-950 bg-emerald-300/95 font-black ring-1 ring-emerald-400'
                        : isDarkMode
                        ? 'text-white bg-black/70 border border-neutral-700/60'
                        : 'text-slate-900 bg-white/90 border border-slate-300/80'
                    }`}>
                      {tileNum}
                    </span>

                    {/* Connection Badges Top-Right */}
                    <div className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1 z-30 flex items-center gap-0.5 pointer-events-none">
                      {ladderStart && (
                        <span
                          title="Base de Escalera (Ascenso)"
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-blue-600 text-white flex items-center justify-center text-[9px] sm:text-[10px] font-bold shadow"
                        >
                          ▲
                        </span>
                      )}
                      {ladderEnd && (
                        <span
                          title="Cima de Escalera"
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-emerald-600 text-white flex items-center justify-center text-[9px] sm:text-[10px] font-bold shadow"
                        >
                          ✓
                        </span>
                      )}
                      {snakeStart && (
                        <span
                          title={`Entrada de Serpiente (${snakeStart.snakeSpecies || 'Descenso'})`}
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-rose-600 text-white flex items-center justify-center text-[9px] sm:text-[10px] font-bold shadow animate-pulse"
                        >
                          ▼
                        </span>
                      )}
                      {snakeEnd && (
                        <span
                          title={`Cabeza de Serpiente (${snakeEnd.snakeSpecies || 'Llegada'})`}
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-neutral-900 text-amber-400 border border-amber-500 flex items-center justify-center text-[9px] sm:text-[10px] font-bold shadow"
                        >
                          🐍
                        </span>
                      )}
                    </div>

                    {/* Start / Goal Special Badges Bottom-Center */}
                    {isGoal && (
                      <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 z-30 text-[8px] sm:text-[9px] font-display font-black uppercase tracking-widest px-1 py-0.2 rounded border shadow-xs pointer-events-none whitespace-nowrap ${currentTheme.goalBadgeClass}`}>
                        META 50
                      </span>
                    )}
                    {isStart && (
                      <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 z-30 text-[8px] sm:text-[9px] font-display font-black uppercase tracking-wider px-1 py-0.2 rounded border shadow-xs pointer-events-none whitespace-nowrap ${currentTheme.startBadgeClass}`}>
                        INICIO
                      </span>
                    )}

                    {/* Players Tokens Centered on Tile in Horizontal Fan (Abanico) */}
                    <div className="relative w-full h-full flex items-center justify-center pointer-events-none z-30 overflow-hidden">
                      {playersOnTile.map((player, idx) => {
                        const count = playersOnTile.length;
                        const offsetPx = count <= 1 ? 0 : (idx - (count - 1) / 2) * (count > 3 ? 12 : 16);
                        const isActive = players[activePlayerIndex]?.id === player.id;
                        const isAffected = affectedPlayerAnim?.playerId === player.id;
                        const animType = affectedPlayerAnim?.type;

                        const hasPositiveHalo =
                          player.shields.escudoReptil ||
                          player.shields.campoFuerza ||
                          player.shields.paseDorado ||
                          player.shields.rebote ||
                          player.modifiers.furiaDados ||
                          player.modifiers.tiroAdicional;
                        const hasFreezeHalo = player.modifiers.crioturbina > 0;
                        const hasNegativeHalo =
                          !hasFreezeHalo &&
                          (player.modifiers.gravedadPesada ||
                            player.modifiers.dadoPlomo ||
                            player.modifiers.presionExtrema ||
                            player.modifiers.maldicionDoble ||
                            player.modifiers.trampaDoble);

                        let haloClass = '';
                        if (hasFreezeHalo) {
                          haloClass = 'halo-freeze ring-2 ring-sky-300';
                        } else if (hasPositiveHalo) {
                          haloClass = 'halo-positive ring-2 ring-emerald-300';
                        } else if (hasNegativeHalo) {
                          haloClass = 'halo-negative ring-2 ring-rose-400';
                        }

                        const currentAction =
                          playerAction && playerAction.playerId === player.id
                            ? playerAction.action
                            : 'IDLE';

                        // Bustrophedon horizontal orientation (Rows 1, 3, 5 face right; Rows 2, 4 face left)
                        const rowNumber = Math.min(5, Math.max(1, Math.floor((player.tile - 1) / 10) + 1));
                        const isOddRow = rowNumber % 2 !== 0;
                        const isPlayerMoving = currentAction === 'WALKING';
                        let facingDirection: 'left' | 'right' = isOddRow ? 'right' : 'left';
                        if (isPlayerMoving && isMovingBackwards) {
                          facingDirection = facingDirection === 'right' ? 'left' : 'right';
                        }

                        // Transformation effects for current player
                        const isThisPlayerTransforming = activeCardTransformation && activeCardTransformation.playerId === player.id;
                        const transformEffect = isThisPlayerTransforming ? activeCardTransformation.effect : null;

                        return (
                          <div
                            key={player.id}
                            title={`${player.name} (#${player.number})`}
                            style={{
                              position: count > 1 ? 'absolute' : 'relative',
                              transform: count > 1 ? `translateX(${offsetPx}px)` : undefined,
                              zIndex: isActive ? 35 : 10 + idx
                            }}
                            className={`flex items-center justify-center p-0.5 rounded-2xl transition-all duration-300 scale-[0.72] sm:scale-100 origin-center ${haloClass} ${
                              isActive ? 'scale-[0.82] sm:scale-110' : ''
                            } ${isAffected && animType === 'DEBUFF' ? 'animate-token-shake' : ''}`}
                          >
                            <CharacterAvatar
                              player={player}
                              action={currentAction}
                              isActive={isActive}
                              facingDirection={facingDirection}
                              hasRocketBootsEffect={transformEffect === 'ROCKET_BOOTS'}
                              isSkidding={transformEffect === 'SKIDDING'}
                              isTeleporting={transformEffect === 'TELEPORT'}
                              hasVortexEffect={transformEffect === 'VORTEX'}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

        {/* ZONA DE ESPERA Y ACCESO (BANCA DE CONCURSANTES FUERA DEL TABLERO) */}
        <div className={`relative z-10 mt-1 rounded-xl border p-2.5 shadow-inner transition-colors duration-500 ${
          isDarkMode ? currentTheme.benchContainerClass : 'bg-slate-100/90 border-slate-300 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                BANCA DE ESPERA · ACCESO A LA ARENA
              </span>
            </div>
            <span className={`text-[10px] font-mono font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {players.filter(p => p.tile === 0).length > 0
                ? `${players.filter(p => p.tile === 0).length} participantes esperando primer turno`
                : '✓ Todos los concursantes en juego'}
            </span>
          </div>

          <div className={`flex flex-wrap items-center gap-3 min-h-[58px] p-2 rounded-lg border ${
            isDarkMode ? 'bg-neutral-950/70 border-neutral-800' : 'bg-white border-slate-200'
          }`}>
            {players.filter(p => p.tile === 0).length === 0 ? (
              <span className="text-xs font-mono text-emerald-400 italic flex items-center gap-1.5 py-1 px-2">
                <span>✓</span> ¡Todos los participantes han entrado al tablero principal!
              </span>
            ) : (
              players.filter(p => p.tile === 0).map(player => {
                const isActive = players[activePlayerIndex]?.id === player.id;
                return (
                  <div
                    key={player.id}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-neutral-800/95 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] scale-105 ring-2 ring-amber-400/50'
                        : `${currentTheme.benchCardClass} opacity-85`
                    }`}
                  >
                    <div className="scale-75 origin-center">
                      <CharacterAvatar player={player} action="IDLE" isActive={isActive} />
                    </div>
                    <div>
                      <span className="block text-xs font-display font-bold text-white leading-tight">
                        {player.name}
                      </span>
                      <span className={`block text-[10px] font-mono font-bold ${isActive ? 'text-amber-400' : 'text-slate-400'}`}>
                        #{player.number} {isActive ? '· ¡TURNO DE ENTRAR!' : '· En banca'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Vector SVG Overlay for Scaffolding Ladders & 3 Distinct Snakes */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full z-20 overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ladders */}
          {connections.filter(c => c.type === 'LADDER').map(renderLadder)}
          {/* Snakes (Boa, Cascabel, Coralillo) */}
          {connections.filter(c => c.type === 'TUBE').map(renderSnake)}
        </svg>

        {/* High-Impact Projectile Overlay (Advantage Hearts & Disadvantage Lightning Bolts) */}
        <ProjectileOverlay config={activeProjectile || null} tileCenters={tileCenters} />
      </div>
    </div>
  );
};
