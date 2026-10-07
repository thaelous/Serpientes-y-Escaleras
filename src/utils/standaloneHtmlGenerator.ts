/**
 * Standalone Single-File HTML Generator (Vanilla HTML5 + Tailwind CDN + SheetJS + QRCode.js)
 * Allows users to download a 100% self-contained offline index.html that runs anywhere
 */

export function generateStandaloneHtml(): string {
  return `<!doctype html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Arena 50 - Squid Gamification Challenge</title>
  <meta name="description" content="Juego de capacitación corporativa y gamificación estilo Serpientes y Escaleras en 5 terrazas con estética industrial Squid Game." />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.4/build/qrcode.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #090a0f; color: #f1f5f9; margin: 0; }
    .font-display { font-family: 'Chakra Petch', sans-serif; }
    @keyframes flow-up { from { stroke-dashoffset: 64; } to { stroke-dashoffset: 0; } }
    @keyframes flow-down { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 80; } }
    @keyframes shockwave-pulse { 0% { transform: scale(0.6); opacity: 1; border-color: #38bdf8; } 100% { transform: scale(1.6); opacity: 0; border-color: #f43f5e; } }
    @keyframes elastic-spawn { 0% { opacity: 0; transform: scale(0.3); } 65% { opacity: 1; transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes dissolve { 0% { opacity: 1; transform: scale(1); filter: brightness(1.6); } 100% { opacity: 0; transform: scale(0.75); filter: blur(4px); } }
    @keyframes token-shake { 0%, 100% { transform: translate(0, 0) scale(1.15); } 20% { transform: translate(-4px, 2px) rotate(-6deg); } 40% { transform: translate(4px, -2px) rotate(6deg); } 60% { transform: translate(-3px, -2px) rotate(-4deg); } 80% { transform: translate(3px, 2px) rotate(4deg); } }
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
    .halo-positive { animation: halo-gold-pulse 1.8s infinite ease-in-out; }
    .halo-freeze { animation: halo-ice-pulse 1.4s infinite ease-in-out; }
    .halo-negative { animation: halo-red-pulse 1.5s infinite ease-in-out; }
    @media (max-width: 768px) {
      #connections-svg line, #connections-svg path {
        stroke-width: clamp(2px, 1.8vw, 9px) !important;
      }
    }
  </style>
</head>
<body class="bg-[#090a0f] text-slate-100 antialiased selection:bg-rose-600 selection:text-white min-h-screen flex flex-col justify-between select-none">
  <!-- Master Application Header -->
  <header class="sticky top-0 z-40 w-full px-4 py-3 bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-800 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 bg-rose-500 rounded-sm shadow-[0_0_8px_#f43f5e]"></span>
        <span class="font-display font-black text-rose-500 tracking-wider">ARENA 50</span>
      </div>
      <div id="active-player-pill" class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700">
        <div id="active-badge" class="w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-xs text-white border">456</div>
        <div>
          <span class="block text-[10px] font-mono text-neutral-400">TURNO ACTUAL</span>
          <span id="active-name" class="block text-xs font-display font-bold text-white">Jugador 456</span>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-2 sm:gap-3">
      <button id="btn-roll" class="px-5 py-2 rounded-xl bg-gradient-to-b from-rose-950 via-neutral-900 to-black hover:from-rose-900 border border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.3)] flex items-center gap-3 cursor-pointer active:scale-95 transition-all">
        <div id="dice-box" class="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-600 flex items-center justify-center font-display font-bold text-sm text-white">1</div>
        <div class="text-left">
          <span class="block text-[9px] font-mono uppercase text-rose-400 font-bold">Lanzar Dado 3D</span>
          <span id="dice-status" class="block text-xs font-display font-bold text-white">LISTO</span>
        </div>
      </button>
      <button id="btn-theme" onclick="toggleThemeMode()" class="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-amber-400 cursor-pointer" title="Modo Claro / Modo Oscuro">☀️</button>
      <button id="btn-sound" onclick="toggleSound()" class="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-slate-300 cursor-pointer" title="Activar/Silenciar Efectos Web Audio API">🔊</button>
      <button id="btn-settings" class="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-slate-300 cursor-pointer">⚙️</button>
    </div>
  </header>

  <!-- Central Board Platform -->
  <main class="flex-1 flex flex-col items-center justify-center p-3 sm:p-5 relative">
    <!-- Recuadro negro permanente con el título SERPIENTES Y ESCALERAS -->
    <div class="w-full flex flex-col items-center justify-center my-2 select-none">
      <div class="relative flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-6 py-2.5 rounded-2xl bg-black border-2 border-neutral-800 shadow-[0_12px_40px_rgba(0,0,0,0.85)] ring-2 ring-black/40">
        <div class="flex items-center gap-1.5">
          <span class="text-2xl sm:text-3xl font-display font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 drop-shadow-[0_2px_10px_rgba(16,185,129,0.5)]">
            SERPIENTES
          </span>
        </div>
        <div class="flex items-center justify-center">
          <span class="font-display font-black text-amber-400 text-base sm:text-lg px-2 py-0.5 rounded bg-neutral-900 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            Y
          </span>
        </div>
        <div class="relative flex items-center">
          <span class="text-2xl sm:text-3xl font-display font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-b from-slate-100 via-slate-300 to-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
            ESCALERAS
          </span>
        </div>
      </div>
    </div>

    <div id="board-container" class="relative w-full max-w-[1360px] flex flex-col gap-3 rounded-2xl bg-neutral-950/90 p-4 border border-neutral-800 shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
      <!-- 5 Terraces injected dynamically with high-contrast ivory tiles -->
    </div>
    <svg id="connections-svg" class="pointer-events-none absolute inset-0 w-full h-full z-20 overflow-visible"></svg>
  </main>

  <!-- Modals & Cinematic Alerts Layer -->
  <div id="modal-container"></div>
  <div id="center-alert-container"></div>

  <script>
    // Advanced Web Audio API Synthesizer (10 Procedural Effects)
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    let soundEnabled = true;
    let isDarkMode = true;

    function toggleThemeMode() {
      isDarkMode = !isDarkMode;
      document.documentElement.classList.toggle('dark', isDarkMode);
      const btn = document.getElementById('btn-theme');
      if (btn) btn.textContent = isDarkMode ? '☀️' : '🌙';
    }

    function toggleSound() {
      soundEnabled = !soundEnabled;
      const btn = document.getElementById('btn-sound');
      if (btn) btn.textContent = soundEnabled ? '🔊' : '🔇';
    }

    function initAudio() {
      if (!audioCtx) audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    function getSafeTime(ctx, offset = 0) {
      try {
        const base = ctx && Number.isFinite(ctx.currentTime) ? ctx.currentTime : 0;
        return Math.max(0.005, base + Math.max(0, offset));
      } catch (e) {
        return 0.005 + Math.max(0, offset);
      }
    }

    // 1. Traqueteo del Dado 3D
    function playDiceRoll() {
      if (!soundEnabled) return;
      try {
        initAudio();
        for (let i = 0; i < 14; i++) {
          const t = getSafeTime(audioCtx, i * 0.045);
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = i % 2 === 0 ? 'triangle' : 'square';
          osc.frequency.setValueAtTime(220 + Math.random() * 320, t);
          osc.frequency.exponentialRampToValueAtTime(50, t + 0.025);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.035);
        }
      } catch (e) {}
    }

    function playDiceStop() {
      if (!soundEnabled) return;
      try {
        initAudio();
        const now = getSafeTime(audioCtx, 0);
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } catch (e) {}
    }

    // 2. Pasos al Caminar
    function playStep() {
      if (!soundEnabled) return;
      try {
        initAudio();
        const now = getSafeTime(audioCtx, 0);
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } catch (e) {}
    }

    // 3. Ascenso de Escaleras
    function playLadderAscent() {
      if (!soundEnabled) return;
      try {
        initAudio();
        const freqs = [330, 440, 554, 659, 880, 1108];
        freqs.forEach((f, idx) => {
          const t = getSafeTime(audioCtx, idx * 0.07);
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, t);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.22);
        });
      } catch (e) {}
    }

    // 4. Descenso de Serpientes (Boa, Cascabel, Coralillo)
    function playTubeSlide(species = 'BOA') {
      if (!soundEnabled) return;
      try {
        initAudio();
        const now = getSafeTime(audioCtx, 0);
        if (species === 'CASCABEL') {
          for (let i = 0; i < 8; i++) {
            const t = getSafeTime(audioCtx, i * 0.04);
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(2400, t);
            gain.gain.setValueAtTime(0.25, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.03);
          }
        } else if (species === 'CORALILLO') {
          for (let i = 0; i < 4; i++) {
            const t = getSafeTime(audioCtx, i * 0.03);
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(1600, t);
            osc.frequency.linearRampToValueAtTime(200, t + 0.04);
            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.05);
          }
        } else {
          // Boa: silbido grave con eco
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(650, now);
          osc.frequency.exponentialRampToValueAtTime(60, now + 0.7);
          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.8);
        }
      } catch (e) {}
    }

    // 5. Tensión de Pregunta (Latido)
    function playQuestionHeartbeat() {
      if (!soundEnabled) return;
      try {
        initAudio();
        const t1 = getSafeTime(audioCtx, 0);
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(65, t1);
        osc1.frequency.exponentialRampToValueAtTime(38, t1 + 0.12);
        gain1.gain.setValueAtTime(0.35, t1);
        gain1.gain.exponentialRampToValueAtTime(0.001, t1 + 0.14);
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.start(t1);
        osc1.stop(t1 + 0.15);

        const t2 = getSafeTime(audioCtx, 0.18);
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(75, t2);
        osc2.frequency.exponentialRampToValueAtTime(32, t2 + 0.16);
        gain2.gain.setValueAtTime(0.4, t2);
        gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.2);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start(t2);
        osc2.stop(t2 + 0.22);
      } catch (e) {}
    }

    // 6. Acierto (Campanas de cristal)
    function playCorrect() {
      if (!soundEnabled) return;
      try {
        initAudio();
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((f, idx) => {
          const t = getSafeTime(audioCtx, idx * 0.06);
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t);
          gain.gain.setValueAtTime(0.24, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.75);
        });
      } catch (e) {}
    }

    // 7. Error (Advertencia sobria descendente)
    function playWrong() {
      if (!soundEnabled) return;
      try {
        initAudio();
        const now = getSafeTime(audioCtx, 0);
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.46);
      } catch (e) {}
    }

    // 8. Proyectiles
    function playProjectileAdvantage() {
      if (!soundEnabled) return;
      try {
        initAudio();
        const freqs = [880, 1174, 1318, 1567, 1760];
        freqs.forEach((f, idx) => {
          const t = getSafeTime(audioCtx, idx * 0.04);
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t);
          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.32);
        });
      } catch (e) {}
    }

    function playProjectileDisadvantage() {
      if (!soundEnabled) return;
      try {
        initAudio();
        for (let i = 0; i < 6; i++) {
          const t = getSafeTime(audioCtx, i * 0.045);
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(700 + Math.random() * 600, t);
          osc.frequency.linearRampToValueAtTime(180, t + 0.035);
          gain.gain.setValueAtTime(0.24, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.045);
        }
      } catch (e) {}
    }

    // 9. Rebote
    function playRebote() {
      if (!soundEnabled) return;
      try {
        initAudio();
        const now = getSafeTime(audioCtx, 0);
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.2);
        osc.frequency.exponentialRampToValueAtTime(380, now + 0.4);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      } catch (e) {}
    }

    // 10. Podio de Victoria
    function playVictory() {
      if (!soundEnabled) return;
      try {
        initAudio();
        const chords = [
          [261.63, 329.63, 392.0],
          [349.23, 440.0, 523.25],
          [392.0, 493.88, 587.33],
          [523.25, 659.25, 783.99, 1046.5]
        ];
        chords.forEach((c, idx) => {
          const t = getSafeTime(audioCtx, idx * 0.22);
          c.forEach(f => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, t);
            gain.gain.setValueAtTime(0.22, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.45);
          });
        });
      } catch (e) {}
    }

    // High Impact Center Screen Alert with manual continue button
    function showCenterAlert(msg, isHazard = false) {
      const container = document.getElementById('center-alert-container');
      if (!container) return;
      container.innerHTML = \`
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div class="max-w-2xl w-full p-6 sm:p-8 rounded-3xl border-3 shadow-2xl text-center \${isHazard ? 'bg-neutral-950/98 border-rose-500 text-rose-100 shadow-[0_0_60px_rgba(244,63,94,0.5)]' : 'bg-neutral-950/98 border-amber-400 text-amber-200 shadow-[0_0_60px_rgba(251,191,36,0.5)]'}">
            <span class="text-xs font-mono font-bold uppercase tracking-widest block mb-2">\${isHazard ? '⚠️ ALERTA TÁCTICA' : '★ SUCESO DESTACADO'}</span>
            <h3 class="text-2xl sm:text-4xl font-display font-black uppercase tracking-wide mb-6">\${msg}</h3>
            <button onclick="document.getElementById('center-alert-container').innerHTML=''" class="px-8 py-3 rounded-2xl font-display font-black text-sm uppercase tracking-wider text-white \${isHazard ? 'bg-rose-600 hover:bg-rose-500' : 'bg-amber-600 hover:bg-amber-500'} cursor-pointer transition-all active:scale-95 shadow-xl">
              CONTINUAR / ACEPTAR
            </button>
          </div>
        </div>
      \`;
    }

    // Victory Podium Screen with detailed statistics per participant
    function showVictoryPodium(winner, playersList, totalRounds) {
      if (window.confetti) {
        window.confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      }
      const container = document.getElementById('modal-container');
      if (!container) return;

      const sorted = [...(playersList || [])].sort((a, b) => (b.tile || 0) - (a.tile || 0));
      const rowsHtml = sorted.map((p, idx) => \`
        <div class="flex items-center justify-between p-2.5 rounded-xl border border-neutral-800 bg-neutral-950/80 text-xs">
          <div class="flex items-center gap-2">
            <span class="font-mono font-bold text-amber-400">#\${idx + 1}</span>
            <div class="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white" style="background-color: \${p.color || '#10b981'}">
              \${p.number || ''}
            </div>
            <span class="font-bold text-white">\${p.name || ''}</span>
          </div>
          <div class="flex items-center gap-2 font-mono">
            <span class="text-amber-300 font-bold">\${p.tile >= 50 ? 'Meta (50)' : 'Casilla ' + (p.tile || 0)}</span>
            <span class="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/40 font-bold">✓ \${p.stats ? p.stats.correctAnswers : 0}</span>
            <span class="text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-500/40 font-bold">✗ \${p.stats ? p.stats.incorrectAnswers : 0}</span>
          </div>
        </div>
      \`).join('');

      container.innerHTML = \`
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div class="max-w-xl w-full p-6 sm:p-8 rounded-3xl border-2 border-amber-400 bg-neutral-950 text-center shadow-2xl">
            <span class="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">👑 ¡CAMPEÓN SUPREMO!</span>
            <h2 class="text-3xl sm:text-4xl font-display font-black text-white uppercase mb-2">\${winner.name || 'Ganador'}</h2>
            <p class="text-xs font-mono text-neutral-400 mb-6">Casilla 50 alcanzada en \${totalRounds || 1} rondas</p>
            <div class="text-left mb-6 space-y-2">
              <h4 class="text-xs font-mono uppercase text-slate-300 font-bold mb-2">Reporte Estadístico de la Partida</h4>
              \${rowsHtml}
            </div>
            <div class="flex gap-3">
              <button onclick="location.reload()" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 font-display font-black text-sm uppercase text-neutral-950 shadow-xl cursor-pointer">
                JUGAR DE NUEVO / REINICIAR PARTIDA
              </button>
            </div>
          </div>
        </div>
      \`;
    }
  </script>
</body>
</html>`;
}
