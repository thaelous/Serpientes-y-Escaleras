import React, { useEffect, useState, useRef } from 'react';
import { sound } from '../audio';

export interface ProjectileConfig {
  senderTile: number;
  targetTile: number;
  type: 'ADVANTAGE' | 'DISADVANTAGE' | 'SWAP';
  player1Name?: string;
  player2Name?: string;
  onComplete: () => void;
}

interface ProjectileOverlayProps {
  config: ProjectileConfig | null;
  tileCenters: Record<number, { x: number; y: number }>;
}

export const ProjectileOverlay: React.FC<ProjectileOverlayProps> = ({
  config,
  tileCenters
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [impactBurst, setImpactBurst] = useState<boolean>(false);
  const [lightningJitter, setLightningJitter] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!config) {
      setProgress(0);
      setImpactBurst(false);
      return;
    }

    const start = tileCenters[config.senderTile];
    const end = tileCenters[config.targetTile];

    if (!start || !end) {
      // If coordinates aren't ready, finish immediately
      config.onComplete();
      return;
    }

    // Play projectile launch sound (stardust chimes for advantage, electric crackle for disadvantage)
    if (config.type === 'ADVANTAGE') {
      sound.playProjectileAdvantage();
    } else if (config.type === 'SWAP') {
      sound.playSwapTrajectory();
    } else {
      sound.playProjectileDisadvantage();
    }

    const duration = config.type === 'SWAP' ? 1000 : config.type === 'ADVANTAGE' ? 850 : 600;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);

      if (config.type === 'DISADVANTAGE') {
        setLightningJitter(Math.random() * 8 - 4);
      }

      if (p < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        // Impact!
        setImpactBurst(true);
        if (config.type === 'ADVANTAGE') {
          sound.playShieldImpact();
        } else if (config.type === 'SWAP') {
          sound.playLadderAscent();
        } else {
          sound.playWrong();
        }

        setTimeout(() => {
          config.onComplete();
        }, 550);
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [config, tileCenters]);

  if (!config) return null;

  const start = tileCenters[config.senderTile];
  const end = tileCenters[config.targetTile];
  if (!start || !end) return null;

  // Arc control point for Advantage Parabola
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const arcHeight = Math.max(90, Math.min(220, dist * 0.45));
  const midX = (start.x + end.x) / 2;
  const midY = Math.min(start.y, end.y) - arcHeight;

  // Quadratic Bezier interpolation: B(t) = (1-t)^2*P0 + 2*(1-t)*t*P1 + t^2*P2
  const t = progress;
  const currentX = (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * midX + t * t * end.x;
  const currentY = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * midY + t * t * end.y;

  // Trail particles for advantage
  const trailCount = 6;
  const trailPoints = [];
  for (let i = 1; i <= trailCount; i++) {
    const pt = Math.max(0, t - i * 0.04);
    const px = (1 - pt) * (1 - pt) * start.x + 2 * (1 - pt) * pt * midX + pt * pt * end.x;
    const py = (1 - pt) * (1 - pt) * start.y + 2 * (1 - pt) * pt * midY + pt * pt * end.y;
    trailPoints.push({ x: px, y: py, opacity: 1 - i / (trailCount + 1), scale: 1 - i * 0.12 });
  }

  // Generate jagged points for lightning bolt (Disadvantage)
  const segments = 12;
  const boltPoints: { x: number; y: number }[] = [];
  boltPoints.push(start);
  for (let i = 1; i < segments; i++) {
    const segT = i / segments;
    // Base straight line point
    const bx = start.x + dx * segT;
    const by = start.y + dy * segT;
    // Perpendicular normal vector
    const nx = -dy / (dist || 1);
    const ny = dx / (dist || 1);
    // Jagged displacement with animation jitter
    const offset = Math.sin(segT * Math.PI) * (Math.sin(i * 3.7 + lightningJitter) * 24);
    boltPoints.push({
      x: bx + nx * offset,
      y: by + ny * offset
    });
  }
  boltPoints.push(end);
  const boltPathD = boltPoints.reduce((acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '');

  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full z-40 overflow-visible"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Glow Filters */}
        <filter id="heart-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="lightning-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Advantage Gradient */}
        <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>

      {/* ==========================================================
          1. ADVANTAGE: Glowing Heart Travelling in Parabola
          ========================================================== */}
      {config.type === 'ADVANTAGE' && !impactBurst && (
        <g>
          {/* Subtle Parabolic Flight Guide Line */}
          <path
            d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
            fill="none"
            stroke="rgba(244, 63, 94, 0.25)"
            strokeWidth="2"
            strokeDasharray="6 8"
          />

          {/* Sparkle Trail Particles */}
          {trailPoints.map((tp, idx) => (
            <g key={idx} transform={`translate(${tp.x}, ${tp.y}) scale(${tp.scale})`} opacity={tp.opacity}>
              <circle r="4" fill="#fbbf24" filter="url(#heart-glow)" />
              <circle r="2" fill="#ffffff" />
            </g>
          ))}

          {/* Glowing Animated Heart Projectile */}
          <g
            transform={`translate(${currentX}, ${currentY}) scale(${1 + Math.sin(progress * Math.PI * 4) * 0.15})`}
            filter="url(#heart-glow)"
          >
            {/* Pulsing Aura Circle */}
            <circle r="24" fill="rgba(244, 63, 94, 0.2)" />
            <circle r="16" fill="rgba(251, 191, 36, 0.3)" />

            {/* SVG Heart Icon centered */}
            <g transform="translate(-14, -14)">
              <path
                d="M14 24.5l-1.9-1.7C5.4 16.8 1 12.8 1 7.8 1 3.8 4.1 0.7 8.1 0.7c2.3 0 4.4 1.1 5.9 2.8 1.5-1.7 3.6-2.8 5.9-2.8 4 0 7.1 3.1 7.1 7.1 0 5-4.4 9-11.1 15l-1.9 1.7z"
                fill="url(#heartGrad)"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>
          </g>
        </g>
      )}

      {/* Advantage Impact Explosion at Target */}
      {config.type === 'ADVANTAGE' && impactBurst && (
        <g transform={`translate(${end.x}, ${end.y})`}>
          {/* Expanding Aura Ring */}
          <circle
            r="38"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3.5"
            className="animate-ping opacity-75"
          />
          <circle
            r="22"
            fill="rgba(244, 63, 94, 0.4)"
            className="animate-pulse"
          />

          {/* 12 Radiant Spark Spokes */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * Math.PI * 2) / 12;
            const r1 = 12;
            const r2 = 32 + (i % 2 === 0 ? 10 : 0);
            return (
              <line
                key={i}
                x1={Math.cos(angle) * r1}
                y1={Math.sin(angle) * r1}
                x2={Math.cos(angle) * r2}
                y2={Math.sin(angle) * r2}
                stroke={i % 2 === 0 ? '#fbbf24' : '#f43f5e'}
                strokeWidth="2.5"
                strokeLinecap="round"
                className="opacity-95"
              />
            );
          })}
        </g>
      )}

      {/* ==========================================================
          2. DISADVANTAGE: Crackling Electric Lightning Bolt
          ========================================================== */}
      {config.type === 'DISADVANTAGE' && (
        <g>
          {/* Broad Electric Discharge Aura */}
          <path
            d={boltPathD}
            fill="none"
            stroke="rgba(6, 182, 212, 0.6)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#lightning-glow)"
          />

          {/* Secondary Neon Yellow Discharge */}
          <path
            d={boltPathD}
            fill="none"
            stroke="#facc15"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Core White Hot Filament */}
          <path
            d={boltPathD}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Electric Spark Orb Racing down the Bolt */}
          {!impactBurst && (
            <g transform={`translate(${start.x + dx * progress}, ${start.y + dy * progress})`}>
              <circle r="14" fill="rgba(250, 204, 21, 0.5)" filter="url(#lightning-glow)" />
              <circle r="7" fill="#ffffff" />
            </g>
          )}

          {/* Disadvantage Impact Shockwave at Target */}
          {impactBurst && (
            <g transform={`translate(${end.x}, ${end.y})`}>
              {/* Double Expanding Red & Electric Cyan Shockwave */}
              <circle
                r="44"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="4"
                className="animate-ping opacity-90"
              />
              <circle
                r="26"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                className="animate-pulse"
              />
              <circle r="12" fill="rgba(244, 63, 94, 0.7)" />

              {/* Electric Zap Spokes */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * Math.PI * 2) / 8;
                return (
                  <line
                    key={i}
                    x1={Math.cos(angle) * 8}
                    y1={Math.sin(angle) * 8}
                    x2={Math.cos(angle) * 36}
                    y2={Math.sin(angle) * 36}
                    stroke="#facc15"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          )}
        </g>
      )}

      {/* ==========================================================
          3. SWAP (Rebase Táctico / Caída de Puesto):
             Trayectoria en Parábola Cruzada Simultánea
          ========================================================== */}
      {config.type === 'SWAP' && (() => {
        const midY_up = Math.min(start.y, end.y) - arcHeight;
        const midY_down = Math.max(start.y, end.y) + arcHeight * 0.7;

        // Player 1 trajectory: start -> end (arches above)
        const curX1 = (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * midX + t * t * end.x;
        const curY1 = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * midY_up + t * t * end.y;

        // Player 2 trajectory: end -> start (arches below)
        const curX2 = (1 - t) * (1 - t) * end.x + 2 * (1 - t) * t * midX + t * t * start.x;
        const curY2 = (1 - t) * (1 - t) * end.y + 2 * (1 - t) * t * midY_down + t * t * start.y;

        // Trail particles
        const swapTrail1 = [];
        const swapTrail2 = [];
        for (let i = 1; i <= 5; i++) {
          const pt = Math.max(0, t - i * 0.05);
          swapTrail1.push({
            x: (1 - pt) * (1 - pt) * start.x + 2 * (1 - pt) * pt * midX + pt * pt * end.x,
            y: (1 - pt) * (1 - pt) * start.y + 2 * (1 - pt) * pt * midY_up + pt * pt * end.y,
            opacity: 1 - i * 0.18,
            scale: 1 - i * 0.14
          });
          swapTrail2.push({
            x: (1 - pt) * (1 - pt) * end.x + 2 * (1 - pt) * pt * midX + pt * pt * start.x,
            y: (1 - pt) * (1 - pt) * end.y + 2 * (1 - pt) * pt * midY_down + pt * pt * start.y,
            opacity: 1 - i * 0.18,
            scale: 1 - i * 0.14
          });
        }

        const isMidCrossing = Math.abs(t - 0.5) < 0.12;

        return (
          <g>
            {/* Parabola 1 Path (Cyan Glow) */}
            <path
              d={`M ${start.x} ${start.y} Q ${midX} ${midY_up} ${end.x} ${end.y}`}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeDasharray="8 6"
              opacity="0.6"
            />
            {/* Parabola 2 Path (Amber/Magenta Glow) */}
            <path
              d={`M ${end.x} ${end.y} Q ${midX} ${midY_down} ${start.x} ${start.y}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeDasharray="8 6"
              opacity="0.6"
            />

            {!impactBurst && (
              <>
                {/* Trail 1 */}
                {swapTrail1.map((tp, i) => (
                  <circle key={`t1-${i}`} cx={tp.x} cy={tp.y} r={5 * tp.scale} fill="#38bdf8" opacity={tp.opacity} />
                ))}
                {/* Trail 2 */}
                {swapTrail2.map((tp, i) => (
                  <circle key={`t2-${i}`} cx={tp.x} cy={tp.y} r={5 * tp.scale} fill="#fbbf24" opacity={tp.opacity} />
                ))}

                {/* Crossing Starburst Flash at Midpoint */}
                {isMidCrossing && (
                  <g transform={`translate(${midX}, ${(midY_up + midY_down) / 2})`}>
                    <circle r="36" fill="rgba(255,255,255,0.4)" className="animate-ping" />
                    <circle r="18" fill="#ffffff" filter="url(#heart-glow)" />
                    <text textAnchor="middle" dy="4" fill="#0f172a" fontSize="12" fontWeight="bold">✦</text>
                  </g>
                )}

                {/* Avatar Hologram Orb 1 (Heading to Target) */}
                <g transform={`translate(${curX1}, ${curY1})`} filter="url(#heart-glow)">
                  <circle r="20" fill="rgba(6, 182, 212, 0.4)" />
                  <circle r="14" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
                  <text textAnchor="middle" dy="4" fill="#ffffff" fontSize="11" fontWeight="black" fontFamily="sans-serif">
                    {config.player1Name ? config.player1Name.slice(0, 1) : '▲'}
                  </text>
                  <text textAnchor="middle" dy="28" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    RELEVO
                  </text>
                </g>

                {/* Avatar Hologram Orb 2 (Heading to Sender) */}
                <g transform={`translate(${curX2}, ${curY2})`} filter="url(#heart-glow)">
                  <circle r="20" fill="rgba(245, 158, 11, 0.4)" />
                  <circle r="14" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                  <text textAnchor="middle" dy="4" fill="#ffffff" fontSize="11" fontWeight="black" fontFamily="sans-serif">
                    {config.player2Name ? config.player2Name.slice(0, 1) : '▼'}
                  </text>
                  <text textAnchor="middle" dy="28" fill="#fbbf24" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    CAMBIO
                  </text>
                </g>
              </>
            )}

            {/* Dual Impact Bursts at Landing Tiles */}
            {impactBurst && (
              <>
                <g transform={`translate(${start.x}, ${start.y})`}>
                  <circle r="40" fill="none" stroke="#f59e0b" strokeWidth="3.5" className="animate-ping" />
                  <circle r="18" fill="rgba(245, 158, 11, 0.4)" />
                  <text textAnchor="middle" dy="4" fill="#ffffff" fontSize="14">✓</text>
                </g>
                <g transform={`translate(${end.x}, ${end.y})`}>
                  <circle r="40" fill="none" stroke="#06b6d4" strokeWidth="3.5" className="animate-ping" />
                  <circle r="18" fill="rgba(6, 182, 212, 0.4)" />
                  <text textAnchor="middle" dy="4" fill="#ffffff" fontSize="14">✓</text>
                </g>
              </>
            )}
          </g>
        );
      })()}
    </svg>
  );
};
