export type FootstepSurface = 'wood' | 'grass';

export class EscapeAudioEngine {
  private ctx: AudioContext | null = null;
  private muted = false;
  private userUnlocked = false;
  private ambientGain: GainNode | null = null;
  private ambientStarted = false;
  private noiseBuffer: AudioBuffer | null = null;
  private stepParity = false;

  public unlockFromGesture(): void {
    this.userUnlocked = true;
    this.ensureContext();
  }

  private ensureContext(): AudioContext | null {
    if (this.muted || !this.userUnlocked) return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer && this.noiseBuffer.sampleRate === ctx.sampleRate) {
      return this.noiseBuffer;
    }
    const len = Math.floor(ctx.sampleRate * 0.6);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(muted ? 0 : 0.028, this.ctx.currentTime, 0.08);
    }
  }

  public setAmbientActive(active: boolean): void {
    if (!active) {
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      }
      return;
    }
    const ctx = this.ensureContext();
    if (!ctx) return;

    if (!this.ambientStarted) {
      this.ambientStarted = true;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.value = 110;
      osc2.type = 'triangle';
      osc2.frequency.value = 164.81;

      filter.type = 'lowpass';
      filter.frequency.value = 260;

      gain.gain.value = this.muted ? 0 : 0.028;

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      this.ambientGain = gain;
    } else if (this.ambientGain) {
      this.ambientGain.gain.setTargetAtTime(this.muted ? 0 : 0.028, ctx.currentTime, 0.15);
    }
  }

  public playFootstep(surface: FootstepSurface = 'wood'): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    this.stepParity = !this.stepParity;
    const lrFactor = this.stepParity ? 1.0 : 0.91;
    const jitter = lrFactor * (0.96 + Math.random() * 0.08);

    if (surface === 'grass') {
      // Soft meadow rustle
      const src = ctx.createBufferSource();
      src.buffer = this.getNoiseBuffer(ctx);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1950 * jitter, now);
      filter.Q.value = 1.4;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      src.start(now);
      src.stop(now + 0.11);
      return;
    }

    // Wooden cabin floor footstep: warm low thud + crisp heel click transient
    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    bodyOsc.type = 'triangle';
    bodyOsc.frequency.setValueAtTime(118 * jitter, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(42, now + 0.065);
    bodyGain.gain.setValueAtTime(0.14, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
    bodyOsc.connect(bodyGain);
    bodyGain.connect(ctx.destination);
    bodyOsc.start(now);
    bodyOsc.stop(now + 0.085);

    const tapSrc = ctx.createBufferSource();
    tapSrc.buffer = this.getNoiseBuffer(ctx);
    const tapFilter = ctx.createBiquadFilter();
    tapFilter.type = 'bandpass';
    tapFilter.frequency.setValueAtTime(880 * jitter, now);
    tapFilter.Q.value = 2.4;
    const tapGain = ctx.createGain();
    tapGain.gain.setValueAtTime(0.1, now);
    tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    tapSrc.connect(tapFilter);
    tapFilter.connect(tapGain);
    tapGain.connect(ctx.destination);
    tapSrc.start(now);
    tapSrc.stop(now + 0.05);
  }

  public playClick(): void {
    this.userUnlocked = true;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520 + (Math.random() - 0.5) * 40, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.05);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.065);
  }

  public playDialTick(delta: 1 | -1 = 1): void {
    this.userUnlocked = true;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Mechanical brass tumbler/gear tick
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    const startFreq = delta > 0 ? 680 : 540;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(delta > 0 ? 920 : 390, now + 0.032);
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.042);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.048);

    const clickSrc = ctx.createBufferSource();
    clickSrc.buffer = this.getNoiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2200;
    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.045, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);
    clickSrc.connect(filter);
    filter.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickSrc.start(now);
    clickSrc.stop(now + 0.025);
  }

  public playHoverTarget(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(980, now);
    osc.frequency.exponentialRampToValueAtTime(1180, now + 0.022);
    gain.gain.setValueAtTime(0.024, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.032);
  }

  public playNotebookToggle(opening: boolean): void {
    this.userUnlocked = true;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Paper rustle noise sweep
    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(opening ? 1400 : 2300, now);
    filter.frequency.exponentialRampToValueAtTime(opening ? 2500 : 1200, now + 0.12);
    filter.Q.value = 1.6;
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.001, now);
    nGain.gain.linearRampToValueAtTime(0.09, now + 0.025);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    src.connect(filter);
    filter.connect(nGain);
    nGain.connect(ctx.destination);
    src.start(now);
    src.stop(now + 0.16);

    // Subtle soft chime
    const osc = ctx.createOscillator();
    const oGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(opening ? 587.33 : 440, now + 0.02);
    oGain.gain.setValueAtTime(0.045, now + 0.02);
    oGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(oGain);
    oGain.connect(ctx.destination);
    osc.start(now + 0.02);
    osc.stop(now + 0.18);
  }

  public playDialogueBlip(speaker?: string): void {
    this.userUnlocked = true;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const baseFreq =
      speaker === 'regina' || speaker === 'friend'
        ? 660
        : speaker === 'risaa'
          ? 740
          : speaker === 'boy'
            ? 560
            : 460;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.18, now + 0.045);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  public playPauseToggle(paused: boolean): void {
    this.userUnlocked = true;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const freqs = paused ? [523.25, 392.0] : [392.0, 523.25];
    freqs.forEach((f, i) => {
      const now = ctx.currentTime + i * 0.055;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.065, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    });
  }

  public playDoorSlide(): void {
    this.userUnlocked = true;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Metallic latch release click
    const latch = ctx.createOscillator();
    const latchGain = ctx.createGain();
    latch.type = 'square';
    latch.frequency.setValueAtTime(320, now);
    latch.frequency.exponentialRampToValueAtTime(140, now + 0.06);
    latchGain.gain.setValueAtTime(0.07, now);
    latchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    latch.connect(latchGain);
    latchGain.connect(ctx.destination);
    latch.start(now);
    latch.stop(now + 0.08);

    // Heavy bulkhead slide rumble
    const slideSrc = ctx.createBufferSource();
    slideSrc.buffer = this.getNoiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(280, now + 0.04);
    filter.frequency.linearRampToValueAtTime(170, now + 0.45);
    filter.Q.value = 1.8;
    const sGain = ctx.createGain();
    sGain.gain.setValueAtTime(0.001, now + 0.04);
    sGain.gain.linearRampToValueAtTime(0.14, now + 0.11);
    sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    slideSrc.connect(filter);
    filter.connect(sGain);
    sGain.connect(ctx.destination);
    slideSrc.start(now + 0.04);
    slideSrc.stop(now + 0.52);
  }

  public playLockboxOpen(): void {
    this.userUnlocked = true;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const notes = [659.25, 880.0, 1174.66, 1318.51];
    notes.forEach((freq, i) => {
      const now = ctx.currentTime + i * 0.065;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.085, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    });
  }

  public playDiscovery(): void {
    this.userUnlocked = true;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const now = ctx.currentTime + i * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    });
  }

  public playError(): void {
    this.userUnlocked = true;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(115, now + 0.2);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  }

  public playUnlock(): void {
    this.userUnlocked = true;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      const now = ctx.currentTime + i * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    });
  }

  public playFusionFanfare(): void {
    this.userUnlocked = true;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const notes = [392, 493.88, 587.33, 783.99, 987.77];
    notes.forEach((freq, i) => {
      const now = ctx.currentTime + i * 0.1;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.75);
    });
  }

  public playVictory(): void {
    this.userUnlocked = true;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const now = ctx.currentTime + i * 0.11;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.13, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.85);
    });
  }

  public playDefeat(): void {
    this.userUnlocked = true;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const notes = [293.66, 261.63, 220.0, 174.61];
    notes.forEach((freq, i) => {
      const now = ctx.currentTime + i * 0.14;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.42);
    });
  }

  public dispose(): void {
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
      this.ambientGain = null;
      this.noiseBuffer = null;
      this.ambientStarted = false;
    }
  }
}
