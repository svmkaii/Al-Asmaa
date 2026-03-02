/**
 * Al-Asmaa — AudioEngine v3.0
 * Procedural Web Audio API sounds — no external files needed.
 * Separated from bomb.js for modularity.
 */
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.masterGain = null;
    this.volume = 0.8;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.ctx.destination);
      if (this.ctx.state === 'suspended') this.ctx.resume();
    } catch (e) {
      console.warn('Web Audio API unavailable');
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume;
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  // --- Tick (bomb timer) ---
  playTick(fast = false) {
    if (!this.ctx || !this.enabled) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.frequency.value = fast ? 1200 : 800;
      osc.type = 'sine';
      const t = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.start(t);
      osc.stop(t + 0.05);
    } catch (e) {}
  }

  // --- Correct answer (ascending arpeggio) ---
  playCorrect() {
    if (!this.ctx || !this.enabled) return;
    try {
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const t = this.ctx.currentTime + i * 0.1;
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
      });
    } catch (e) {}
  }

  // --- Error sound (low buzz) ---
  playError() {
    if (!this.ctx || !this.enabled) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.frequency.value = 200;
      osc.type = 'sawtooth';
      const t = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.start(t);
      osc.stop(t + 0.3);
    } catch (e) {}
  }

  // --- Explosion (noise + bass rumble + crack) ---
  playExplosion() {
    if (!this.ctx || !this.enabled) return;
    try {
      // White noise
      const bufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.08));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = this.ctx.createGain();
      const t = this.ctx.currentTime;
      noiseGain.gain.setValueAtTime(0.4, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      noise.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start();

      // Sub-bass
      const bass = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bass.frequency.setValueAtTime(60, t);
      bass.frequency.exponentialRampToValueAtTime(15, t + 0.5);
      bassGain.gain.setValueAtTime(0.5, t);
      bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      bass.connect(bassGain);
      bassGain.connect(this.masterGain);
      bass.start(t);
      bass.stop(t + 0.6);
    } catch (e) {}
  }

  // --- UI click (short blip) ---
  playClick() {
    if (!this.ctx || !this.enabled) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.frequency.value = 600;
      osc.type = 'sine';
      const t = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      osc.start(t);
      osc.stop(t + 0.03);
    } catch (e) {}
  }

  // --- Countdown warning (rising pitch) ---
  playWarning() {
    if (!this.ctx || !this.enabled) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.15);
      osc.type = 'triangle';
      const t = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.start(t);
      osc.stop(t + 0.2);
    } catch (e) {}
  }

  // --- Victory fanfare (full chord) ---
  playVictory() {
    if (!this.ctx || !this.enabled) return;
    try {
      const chords = [
        [261.63, 329.63, 392.00], // C4, E4, G4
        [329.63, 392.00, 523.25], // E4, G4, C5
        [392.00, 523.25, 659.25]  // G4, C5, E5
      ];
      chords.forEach((chord, ci) => {
        chord.forEach((freq) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.frequency.value = freq;
          osc.type = 'sine';
          const t = this.ctx.currentTime + ci * 0.2;
          gain.gain.setValueAtTime(0.08, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
          osc.start(t);
          osc.stop(t + 0.4);
        });
      });
    } catch (e) {}
  }

  // --- Elimination (descending) ---
  playElimination() {
    if (!this.ctx || !this.enabled) return;
    try {
      const notes = [523.25, 392.00, 261.63]; // C5, G4, C4 descending
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.frequency.value = freq;
        osc.type = 'triangle';
        const t = this.ctx.currentTime + i * 0.15;
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.start(t);
        osc.stop(t + 0.25);
      });
    } catch (e) {}
  }
}

// Global instance (nommée AudioFX pour ne pas masquer le constructeur natif Audio)
const AudioFX = new AudioEngine();
