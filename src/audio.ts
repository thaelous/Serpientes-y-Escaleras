/**
 * Procedural Audio Synthesizer for Squid Game Industrial Gamification
 * Uses Native Web Audio API for zero-dependency high-fidelity corporate audio
 */

export type SnakeSpeciesType = 'BOA' | 'CASCABEL' | 'CORALILLO';

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (err) {
      console.warn('AudioContext init failed', err);
    }
  }

  private safeTime(offset: number = 0): number {
    try {
      const base = this.ctx && Number.isFinite(this.ctx.currentTime) ? this.ctx.currentTime : 0;
      return Math.max(0.005, base + Math.max(0, offset));
    } catch {
      return 0.005 + Math.max(0, offset);
    }
  }

  // =========================================================================
  // 1. TRAQUETEO DEL DADO 3D (Rhythmic tumbling clicks with settling stop thud)
  // =========================================================================
  public playDiceRoll() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Series of rapid mechanical clicks that progressively decelerate
      let timeAccumulator = 0;
      const baseInterval = 0.045;
      for (let i = 0; i < 15; i++) {
        timeAccumulator += baseInterval + i * 0.005 + Math.random() * 0.008;
        const t = this.safeTime(timeAccumulator);

        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = i % 2 === 0 ? 'triangle' : 'square';
        const startFreq = 240 + Math.random() * 340;
        osc.frequency.setValueAtTime(startFreq, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.025);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(700 + Math.random() * 300, t);
        filter.Q.setValueAtTime(2.2, t);

        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.035);
      }
    } catch (e) {
      console.warn('playDiceRoll audio error', e);
    }
  }

  public playDiceStop() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.safeTime(0);

      // Low solid stopping thud
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.exponentialRampToValueAtTime(35, now + 0.12);
      gain1.gain.setValueAtTime(0.45, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);

      // Snap surface impact
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(800, now);
      osc2.frequency.exponentialRampToValueAtTime(120, now + 0.03);
      gain2.gain.setValueAtTime(0.28, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.04);
    } catch (e) {
      console.warn('playDiceStop error', e);
    }
  }

  // =========================================================================
  // 2. PASOS AL CAMINAR (Sutil y elegante repiqueteo de calzado en loseta)
  // =========================================================================
  public playStep() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.safeTime(0);

      // Crisp tile heel-tap click
      const osc1 = this.ctx.createOscillator();
      const filter1 = this.ctx.createBiquadFilter();
      const gain1 = this.ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(850, now);
      osc1.frequency.exponentialRampToValueAtTime(220, now + 0.03);
      filter1.type = 'bandpass';
      filter1.frequency.setValueAtTime(1250, now);
      filter1.Q.setValueAtTime(2.2, now);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc1.connect(filter1);
      filter1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.04);

      // Warm resonance body
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(155, now);
      osc2.frequency.exponentialRampToValueAtTime(45, now + 0.075);
      gain2.gain.setValueAtTime(0.24, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.09);
    } catch (e) {
      console.warn('playStep audio error', e);
    }
  }

  // =========================================================================
  // 3. ASCENSO DE ESCALERAS (Zumbido metálico ascendente de alta precisión mecánica)
  // =========================================================================
  public playLadderAscent() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const freqs = [293.66, 369.99, 440.0, 587.33, 739.99, 880.0, 1174.66];
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const t = this.safeTime(idx * 0.065);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.15, t + 0.18);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.23);
      });

      // Background metallic gear hum
      const now = this.safeTime(0);
      const hum = this.ctx.createOscillator();
      const humGain = this.ctx.createGain();
      hum.type = 'sawtooth';
      hum.frequency.setValueAtTime(180, now);
      hum.frequency.exponentialRampToValueAtTime(540, now + 0.45);
      humGain.gain.setValueAtTime(0.08, now);
      humGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      hum.connect(humGain);
      humGain.connect(this.ctx.destination);
      hum.start(now);
      hum.stop(now + 0.52);
    } catch (e) {
      console.warn('playLadderAscent audio error', e);
    }
  }

  // =========================================================================
  // 4. DESCENSO DE SERPIENTES (Boa, Cascabel, Coralillo)
  // =========================================================================
  public playTubeSlide(species: SnakeSpeciesType = 'BOA') {
    if (species === 'CASCABEL') {
      this.playSnakeCascabel();
    } else if (species === 'CORALILLO') {
      this.playSnakeCoralillo();
    } else {
      this.playSnakeBoa();
    }
  }

  // 4a. Boa: Silbido grave de aire comprimido con eco
  public playSnakeBoa() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.safeTime(0);

      // Low frequency air sweep
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.7);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);

      // Resonant echo tail
      [0.18, 0.38, 0.58].forEach((offset, idx) => {
        if (!this.ctx) return;
        const t = this.safeTime(offset);
        const echoOsc = this.ctx.createOscillator();
        const echoGain = this.ctx.createGain();
        echoOsc.type = 'triangle';
        echoOsc.frequency.setValueAtTime(220 / (idx + 1), t);
        echoGain.gain.setValueAtTime(0.12 / (idx + 1), t);
        echoGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        echoOsc.connect(echoGain);
        echoGain.connect(this.ctx.destination);
        echoOsc.start(t);
        echoOsc.stop(t + 0.28);
      });
    } catch (e) {
      console.warn('playSnakeBoa error', e);
    }
  }

  // 4b. Cascabel: Chasquido metálico y tensión simulada
  public playSnakeCascabel() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // 10 high-speed metallic rattle pulses
      for (let i = 0; i < 10; i++) {
        const t = this.safeTime(i * 0.04);
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2200 + (i % 2 === 0 ? 300 : -200), t);

        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1800, t);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.03);
      }

      // Descending tension hum
      const now = this.safeTime(0);
      const hum = this.ctx.createOscillator();
      const humGain = this.ctx.createGain();
      hum.type = 'triangle';
      hum.frequency.setValueAtTime(340, now);
      hum.frequency.exponentialRampToValueAtTime(90, now + 0.5);
      humGain.gain.setValueAtTime(0.2, now);
      humGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      hum.connect(humGain);
      humGain.connect(this.ctx.destination);
      hum.start(now);
      hum.stop(now + 0.6);
    } catch (e) {
      console.warn('playSnakeCascabel error', e);
    }
  }

  // 4c. Coralillo: Chispa eléctrica corta de advertencia
  public playSnakeCoralillo() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Sharp electric snap & discharge
      for (let i = 0; i < 4; i++) {
        const t = this.safeTime(i * 0.03);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400 + Math.random() * 800, t);
        osc.frequency.linearRampToValueAtTime(200, t + 0.04);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.05);
      }
    } catch (e) {
      console.warn('playSnakeCoralillo error', e);
    }
  }

  // =========================================================================
  // 5. TENSIÓN DE PREGUNTA (Pulso grave tipo latido de corazón "lub-dub")
  // =========================================================================
  public playQuestionHeartbeat() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // "Lub" (first heartbeat thump)
      const t1 = this.safeTime(0);
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(62, t1);
      osc1.frequency.exponentialRampToValueAtTime(38, t1 + 0.12);
      gain1.gain.setValueAtTime(0.35, t1);
      gain1.gain.exponentialRampToValueAtTime(0.001, t1 + 0.14);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t1);
      osc1.stop(t1 + 0.15);

      // "Dub" (second heartbeat thump slightly louder and lower)
      const t2 = this.safeTime(0.18);
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(74, t2);
      osc2.frequency.exponentialRampToValueAtTime(32, t2 + 0.16);
      gain2.gain.setValueAtTime(0.42, t2);
      gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.2);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t2);
      osc2.stop(t2 + 0.22);
    } catch (e) {
      console.warn('playQuestionHeartbeat error', e);
    }
  }

  // =========================================================================
  // 6. ACIERTO (Acorde electrónico triunfante ascendente - campanas de cristal)
  // =========================================================================
  public playCorrect() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Crystal bells arpeggio in C Major
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const t = this.safeTime(idx * 0.06);

        // Pure sine core
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.24, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.75);

        // Glass bell shimmer overtone
        const overtone = this.ctx.createOscillator();
        const oGain = this.ctx.createGain();
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * 2, t);
        oGain.gain.setValueAtTime(0.08, t);
        oGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        overtone.connect(oGain);
        oGain.connect(this.ctx.destination);
        overtone.start(t);
        overtone.stop(t + 0.45);
      });
    } catch (e) {
      console.warn('playCorrect audio error', e);
    }
  }

  // =========================================================================
  // 7. ERROR (Tono de advertencia sobrio y descendente)
  // =========================================================================
  public playWrong() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.safeTime(0);

      // Dual analog oscillator downward glide
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(260, now);
      osc1.frequency.exponentialRampToValueAtTime(80, now + 0.42);

      osc2.frequency.setValueAtTime(274, now);
      osc2.frequency.exponentialRampToValueAtTime(85, now + 0.42);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch (e) {
      console.warn('playWrong audio error', e);
    }
  }

  // =========================================================================
  // 8. PROYECTILES (Corazones / Polvo Estelar y Rayos Eléctricos)
  // =========================================================================
  // 8a. Ventajas / Corazones: Tintineo mágico de polvo estelar
  public playProjectileAdvantage() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const freqs = [880, 1174.66, 1318.51, 1567.98, 1760, 2093, 2349.32];
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const t = this.safeTime(idx * 0.04);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.38);
      });
    } catch (e) {
      console.warn('playProjectileAdvantage error', e);
    }
  }

  // 8b. Desventajas / Rayos: Chisporroteo eléctrico y zumbido
  public playProjectileDisadvantage() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Electrical crackles
      for (let i = 0; i < 7; i++) {
        const t = this.safeTime(i * 0.045);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(750 + Math.random() * 850, t);
        osc.frequency.linearRampToValueAtTime(180, t + 0.035);

        gain.gain.setValueAtTime(0.24, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.045);
      }
    } catch (e) {
      console.warn('playProjectileDisadvantage error', e);
    }
  }

  // =========================================================================
  // 9. EFECTO DE REBOTE (ESCUDO ESPEJO - Reverberación estéreo de campo de fuerza)
  // =========================================================================
  public playRebote() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.safeTime(0);

      // Immediate metallic deflection ping
      const ping = this.ctx.createOscillator();
      const pingGain = this.ctx.createGain();
      ping.type = 'square';
      ping.frequency.setValueAtTime(720, now);
      ping.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
      pingGain.gain.setValueAtTime(0.3, now);
      pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      ping.connect(pingGain);
      pingGain.connect(this.ctx.destination);
      ping.start(now);
      ping.stop(now + 0.12);

      // Warping mirror reflection whoosh
      const warp = this.ctx.createOscillator();
      const warpGain = this.ctx.createGain();
      warp.type = 'sawtooth';
      warp.frequency.setValueAtTime(180, now);
      warp.frequency.exponentialRampToValueAtTime(1600, now + 0.22);
      warp.frequency.exponentialRampToValueAtTime(380, now + 0.45);
      warpGain.gain.setValueAtTime(0.28, now);
      warpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      warp.connect(warpGain);
      warpGain.connect(this.ctx.destination);
      warp.start(now);
      warp.stop(now + 0.55);
    } catch (e) {
      console.warn('playRebote error', e);
    }
  }

  // =========================================================================
  // 10. PODIO DE VICTORIA (Fanfarria épica y festiva de triunfo al alcanzar la casilla 50)
  // =========================================================================
  public playVictory() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Epic multi-chord fanfarria (C -> F -> G -> High C Majesty)
      const fanfarreChords = [
        { freqs: [261.63, 329.63, 392.0], duration: 0.22 },
        { freqs: [349.23, 440.0, 523.25], duration: 0.22 },
        { freqs: [392.0, 493.88, 587.33], duration: 0.24 },
        { freqs: [523.25, 659.25, 783.99, 1046.5], duration: 0.85 }
      ];

      let chordTime = 0;
      fanfarreChords.forEach(({ freqs, duration }) => {
        const chordStart = this.safeTime(chordTime);
        chordTime += duration;

        freqs.forEach((freq) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, chordStart);

          gain.gain.setValueAtTime(0.24, chordStart);
          gain.gain.exponentialRampToValueAtTime(0.001, chordStart + duration + 0.2);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(chordStart);
          osc.stop(chordStart + duration + 0.25);
        });
      });
    } catch (e) {
      console.warn('playVictory audio error', e);
    }
  }

  // =========================================================================
  // SUPPORTING UTILITIES
  // =========================================================================
  public playShieldImpact() {
    this.playRebote();
  }

  public playFreezeImpact() {
    this.playSnakeCascabel();
  }

  public playVortexImpact() {
    this.playSnakeBoa();
  }

  public playElectricShock() {
    this.playSnakeCoralillo();
  }

  public playCardReveal() {
    this.playProjectileAdvantage();
  }

  public playReset() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.safeTime(0);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.25);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch (e) {
      console.warn('playReset error', e);
    }
  }

  public playSwapTrajectory() {
    this.playRebote();
  }
}

export const sound = new SoundEngine();
