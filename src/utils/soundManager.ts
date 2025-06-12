// Sound Manager for Game-like Audio Feedback
class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private isEnabled: boolean = true;
  private volume: number = 0.3; // Default volume (30%)

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  // Enable/disable sounds
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundEnabled', enabled.toString());
    }
  }

  // Set master volume (0-1)
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundVolume', this.volume.toString());
    }
  }

  // Load settings from localStorage
  loadSettings() {
    if (typeof window !== 'undefined') {
      const savedEnabled = localStorage.getItem('soundEnabled');
      const savedVolume = localStorage.getItem('soundVolume');
      
      if (savedEnabled !== null) {
        this.isEnabled = savedEnabled === 'true';
      }
      
      if (savedVolume !== null) {
        this.volume = parseFloat(savedVolume);
      }
    }
  }

  // Generate different types of sounds programmatically
  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine', envelope?: { attack: number, decay: number, sustain: number, release: number }) {
    if (!this.audioContext || !this.isEnabled) return;

    try {
      // Resume audio context if suspended (required for user interaction)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = type;
      
      const now = this.audioContext.currentTime;
      
      if (envelope) {
        // ADSR envelope
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(this.volume, now + envelope.attack);
        gainNode.gain.linearRampToValueAtTime(this.volume * envelope.sustain, now + envelope.attack + envelope.decay);
        gainNode.gain.setValueAtTime(this.volume * envelope.sustain, now + duration - envelope.release);
        gainNode.gain.linearRampToValueAtTime(0, now + duration);
      } else {
        // Simple fade in/out
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(this.volume, now + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, now + duration);
      }
      
      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (error) {
      console.warn('Failed to create tone:', error);
    }
  }

  // Sound effect methods
  playButtonHover() {
    this.createTone(800, 0.1, 'sine');
  }

  playButtonClick() {
    this.createTone(600, 0.15, 'square', { attack: 0.01, decay: 0.05, sustain: 0.7, release: 0.09 });
  }

  playSelectionMade() {
    // Pleasant upward chime
    setTimeout(() => this.createTone(523, 0.1, 'sine'), 0);    // C5
    setTimeout(() => this.createTone(659, 0.1, 'sine'), 50);   // E5
    setTimeout(() => this.createTone(784, 0.2, 'sine'), 100);  // G5
  }

  playSelectionRemoved() {
    // Gentle downward tone
    setTimeout(() => this.createTone(784, 0.1, 'sine'), 0);   // G5
    setTimeout(() => this.createTone(659, 0.15, 'sine'), 50); // E5
  }

  playStepComplete() {
    // Success fanfare
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      setTimeout(() => this.createTone(freq, 0.3, 'sine'), index * 100);
    });
  }

  playXPGain() {
    // Satisfying XP sound
    this.createTone(1047, 0.4, 'triangle', { attack: 0.02, decay: 0.1, sustain: 0.8, release: 0.28 });
    setTimeout(() => this.createTone(1319, 0.3, 'triangle'), 100); // E6
  }

  playError() {
    // Error buzz
    this.createTone(220, 0.3, 'sawtooth', { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.19 });
  }

  playWarning() {
    // Warning tone
    setTimeout(() => this.createTone(880, 0.1, 'square'), 0);
    setTimeout(() => this.createTone(880, 0.1, 'square'), 200);
  }

  playNotification() {
    // Gentle notification
    this.createTone(1760, 0.2, 'sine', { attack: 0.02, decay: 0.08, sustain: 0.6, release: 0.1 });
  }

  playPageTransition() {
    // Smooth transition sound
    this.createTone(440, 0.2, 'sine');
    setTimeout(() => this.createTone(554, 0.2, 'sine'), 100);
  }

  playModalOpen() {
    // Modal open sound
    setTimeout(() => this.createTone(659, 0.1, 'sine'), 0);
    setTimeout(() => this.createTone(880, 0.15, 'sine'), 50);
  }

  playModalClose() {
    // Modal close sound
    setTimeout(() => this.createTone(880, 0.1, 'sine'), 0);
    setTimeout(() => this.createTone(659, 0.15, 'sine'), 50);
  }

  playCaseStart() {
    // Case start fanfare
    const melody = [523, 659, 784, 659, 784, 1047]; // C5-E5-G5-E5-G5-C6
    melody.forEach((freq, index) => {
      setTimeout(() => this.createTone(freq, 0.2, 'sine'), index * 120);
    });
  }

  playCaseComplete() {
    // Victory fanfare
    const victoryMelody = [523, 659, 784, 1047, 1319, 1568]; // C5-E5-G5-C6-E6-G6
    victoryMelody.forEach((freq, index) => {
      setTimeout(() => this.createTone(freq, 0.3, 'triangle'), index * 150);
    });
  }

  playTimer() {
    // Subtle timer tick
    this.createTone(1760, 0.05, 'square');
  }

  playCountdown() {
    // Countdown beep
    this.createTone(880, 0.2, 'square', { attack: 0.01, decay: 0.19, sustain: 0, release: 0 });
  }

  playSearchType() {
    // Typing feedback
    this.createTone(1200 + Math.random() * 200, 0.05, 'square');
  }

  playScoreReveal() {
    // Score reveal sound
    const frequencies = [440, 554, 659, 784, 880];
    frequencies.forEach((freq, index) => {
      setTimeout(() => this.createTone(freq, 0.15, 'sine'), index * 80);
    });
  }
}

// Create and export singleton instance
export const soundManager = new SoundManager();

// Initialize settings on load
if (typeof window !== 'undefined') {
  soundManager.loadSettings();
}

// Export convenience functions
export const playSound = {
  buttonHover: () => soundManager.playButtonHover(),
  buttonClick: () => soundManager.playButtonClick(),
  selectionMade: () => soundManager.playSelectionMade(),
  selectionRemoved: () => soundManager.playSelectionRemoved(),
  stepComplete: () => soundManager.playStepComplete(),
  xpGain: () => soundManager.playXPGain(),
  error: () => soundManager.playError(),
  warning: () => soundManager.playWarning(),
  notification: () => soundManager.playNotification(),
  pageTransition: () => soundManager.playPageTransition(),
  modalOpen: () => soundManager.playModalOpen(),
  modalClose: () => soundManager.playModalClose(),
  caseStart: () => soundManager.playCaseStart(),
  caseComplete: () => soundManager.playCaseComplete(),
  timer: () => soundManager.playTimer(),
  countdown: () => soundManager.playCountdown(),
  searchType: () => soundManager.playSearchType(),
  scoreReveal: () => soundManager.playScoreReveal(),
}; 