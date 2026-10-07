import React from 'react';

export const ThematicLogo: React.FC<{ isDarkMode?: boolean }> = ({ isDarkMode = true }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center my-2 select-none">
      {/* Recuadro negro permanente con alto contraste para el título (conservado estrictamente en Modo Claro y Modo Oscuro) */}
      <div
        className={`relative flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-6 py-2.5 rounded-2xl bg-black border-2 border-neutral-800 shadow-[0_12px_40px_rgba(0,0,0,0.85)] ${
          !isDarkMode ? 'ring-2 ring-black/40 shadow-2xl shadow-black/70' : ''
        }`}
      >
        
        {/* SERPIENTES (Organic, serpentine curves, emerald venom scales, forked tongue S) */}
        <div className="flex items-center gap-1.5">
          {/* S with Forked Tongue Vector */}
          <div className="relative flex items-center justify-center">
            <svg width="34" height="38" viewBox="0 0 34 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 drop-shadow-[0_0_8px_#10b981]">
              {/* Forked tongue extending from head */}
              <path d="M 23 9 Q 29 7 33 5 M 29 7 Q 31 10 33 11" stroke="#f43f5e" strokeWidth="1.8" strokeLinecap="round" />
              {/* Serpentine S body with scaly gradient */}
              <defs>
                <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="40%" stopColor="#059669" />
                  <stop offset="80%" stopColor="#064e3b" />
                  <stop offset="100%" stopColor="#022c22" />
                </linearGradient>
                <pattern id="snakeSkin" width="6" height="6" patternUnits="userSpaceOnUse">
                  <path d="M 0 3 L 3 0 L 6 3 L 3 6 Z" fill="none" stroke="#6ee7b7" strokeWidth="0.6" strokeOpacity="0.4" />
                </pattern>
              </defs>
              {/* Outer body path */}
              <path
                d="M 24 9 C 24 4, 11 3, 9 8 C 7 13, 26 15, 23 23 C 20 31, 6 31, 6 26"
                stroke="url(#snakeGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Snake scales overlay */}
              <path
                d="M 24 9 C 24 4, 11 3, 9 8 C 7 13, 26 15, 23 23 C 20 31, 6 31, 6 26"
                stroke="url(#snakeSkin)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Viper Eye */}
              <circle cx="21" cy="7" r="1.5" fill="#facc15" />
              <circle cx="21" cy="7" r="0.6" fill="#000000" />
            </svg>
          </div>

          {/* Rest of the word "ERPIENTES" with venomous emerald gradient */}
          <span
            className="text-2xl sm:text-3xl font-display font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 drop-shadow-[0_2px_10px_rgba(16,185,129,0.5)]"
            style={{
              textShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
              letterSpacing: '0.12em'
            }}
          >
            ERPIENTES
          </span>
        </div>

        {/* Separator / Amber Hazard "Y" */}
        <div className="flex items-center justify-center">
          <span className="font-display font-black text-amber-400 text-base sm:text-lg px-2 py-0.5 rounded bg-neutral-900 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            Y
          </span>
        </div>

        {/* ESCALERAS (Industrial scaffolding beams, horizontal ladder rungs, metallic rivets) */}
        <div className="relative flex items-center">
          <span
            className="text-2xl sm:text-3xl font-display font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-b from-slate-100 via-slate-300 to-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]"
            style={{
              letterSpacing: '0.14em'
            }}
          >
            ESCALERAS
          </span>

          {/* Scaffolding Rung / Rivet Vector Accent */}
          <svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1 shrink-0 drop-shadow-[0_0_8px_#f59e0b]">
            {/* Scaffolding vertical rails */}
            <line x1="4" y1="2" x2="4" y2="24" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="20" y1="2" x2="20" y2="24" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
            {/* Horizontal rungs */}
            <line x1="4" y1="7" x2="20" y2="7" stroke="#fef08a" strokeWidth="2" />
            <line x1="4" y1="13" x2="20" y2="13" stroke="#fef08a" strokeWidth="2" />
            <line x1="4" y1="19" x2="20" y2="19" stroke="#fef08a" strokeWidth="2" />
            {/* Metallic bolts / rivets */}
            <circle cx="4" cy="7" r="1.2" fill="#000000" />
            <circle cx="20" cy="7" r="1.2" fill="#000000" />
            <circle cx="4" cy="13" r="1.2" fill="#000000" />
            <circle cx="20" cy="13" r="1.2" fill="#000000" />
            <circle cx="4" cy="19" r="1.2" fill="#000000" />
            <circle cx="20" cy="19" r="1.2" fill="#000000" />
          </svg>
        </div>

      </div>
    </div>
  );
};

