// Sound Manager for Game-like Audio Feedback
class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private isEnabled: boolean = true;
  private volume: number = 0.08; // Much lower default volume (8% instead of 30%)

  constructor() {
    this.initializeAudioContext();
    this.loadSettings();
  }

  private initializeAudioContext() {
    try {
      if (typeof window !== 'undefined') {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
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
      } else {
        // Set default subtle volume if not previously saved
        this.volume = 0.08;
      }
    }
  }

  // Enhanced tone creation with multiple layers and textures
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
        // ADSR envelope with much softer volume
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.6, now + envelope.attack); // Even softer
        gainNode.gain.linearRampToValueAtTime(this.volume * envelope.sustain * 0.4, now + envelope.attack + envelope.decay);
        gainNode.gain.setValueAtTime(this.volume * envelope.sustain * 0.4, now + duration - envelope.release);
        gainNode.gain.linearRampToValueAtTime(0, now + duration);
      } else {
        // Simple fade in/out with reduced volume
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.5, now + 0.01); // Softer peak
        gainNode.gain.linearRampToValueAtTime(0, now + duration);
      }
      
      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (error) {
      console.warn('Failed to create tone:', error);
    }
  }

  // Create layered sound with harmonics for richer texture
  private createLayeredSound(baseFreq: number, duration: number, harmonics: { freq: number, amp: number, type: OscillatorType }[], envelope?: { attack: number, decay: number, sustain: number, release: number }) {
    if (!this.audioContext || !this.isEnabled) return;

    harmonics.forEach((harmonic, index) => {
      setTimeout(() => {
        this.createTone(baseFreq * harmonic.freq, duration, harmonic.type, envelope);
      }, index * 5); // Slight stagger for richness
    });
  }

  // Create filtered noise for texture
  private createFilteredNoise(frequency: number, duration: number, filterType: 'lowpass' | 'highpass' | 'bandpass' = 'lowpass') {
    if (!this.audioContext || !this.isEnabled) return;

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      // Create noise buffer
      const bufferSize = this.audioContext.sampleRate * duration;
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.1; // Gentle noise
      }

      const source = this.audioContext.createBufferSource();
      const filter = this.audioContext.createBiquadFilter();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = buffer;
      filter.type = filterType;
      filter.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      filter.Q.setValueAtTime(2, this.audioContext.currentTime);
      
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      const now = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, now + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, now + duration);
      
      source.start(now);
      source.stop(now + duration);
    } catch (error) {
      console.warn('Failed to create filtered noise:', error);
    }
  }

  // Sound effect methods - Enhanced with texture and context
  playButtonHover() {
    // Extremely subtle UI hover - whisper-quiet feedback
    this.createLayeredSound(800, 0.02, [
      { freq: 1, amp: 0.15, type: 'sine' }, // Whisper quiet
    ], { attack: 0.001, decay: 0.019, sustain: 0, release: 0 });
  }

  playButtonClick() {
    // Satisfying click - layered tones that feel responsive
    this.createLayeredSound(440, 0.1, [
      { freq: 1, amp: 1, type: 'sine' },
      { freq: 1.5, amp: 0.4, type: 'triangle' }, // Fifth harmonic
      { freq: 2, amp: 0.2, type: 'sine' } // Octave
    ], { attack: 0.005, decay: 0.03, sustain: 0.3, release: 0.065 });
  }

  playSelectionMade() {
    // Medical selection - warm, professional ascending chime
    const medicalChord = [
      { freq: 523, delay: 0, duration: 0.12 },   // C5 - foundation
      { freq: 659, delay: 30, duration: 0.10 },  // E5 - major third
      { freq: 784, delay: 50, duration: 0.08 }   // G5 - perfect fifth
    ];
    
    medicalChord.forEach(note => {
      setTimeout(() => {
        this.createLayeredSound(note.freq, note.duration, [
          { freq: 1, amp: 1, type: 'sine' },
          { freq: 0.5, amp: 0.3, type: 'triangle' } // Sub-harmonic for warmth
        ], { attack: 0.01, decay: 0.04, sustain: 0.6, release: 0.05 });
      }, note.delay);
    });
  }

  playSelectionRemoved() {
    // Medical deselection - gentle descending with soft texture
    setTimeout(() => {
      this.createLayeredSound(659, 0.08, [
        { freq: 1, amp: 1, type: 'sine' },
        { freq: 0.75, amp: 0.2, type: 'triangle' }
      ]);
    }, 0);
    setTimeout(() => {
      this.createLayeredSound(523, 0.10, [
        { freq: 1, amp: 0.8, type: 'sine' },
        { freq: 0.5, amp: 0.15, type: 'sine' }
      ]);
    }, 40);
  }

  playStepComplete() {
    // Clinical milestone achievement - professional success sound
    const successProgression = [
      { freq: 523, delay: 0 },    // C5
      { freq: 659, delay: 60 },   // E5
      { freq: 784, delay: 120 },  // G5
      { freq: 1047, delay: 180 }  // C6 - triumphant finish
    ];
    
    successProgression.forEach(note => {
      setTimeout(() => {
        this.createLayeredSound(note.freq, 0.15, [
          { freq: 1, amp: 1, type: 'sine' },
          { freq: 2, amp: 0.3, type: 'triangle' },
          { freq: 1.5, amp: 0.2, type: 'sine' }
        ], { attack: 0.02, decay: 0.05, sustain: 0.7, release: 0.08 });
      }, note.delay);
    });
  }

  playXPGain() {
    // Experience points - rewarding sparkle with harmonic richness
    this.createLayeredSound(784, 0.25, [
      { freq: 1, amp: 1, type: 'sine' },
      { freq: 2, amp: 0.4, type: 'triangle' },
      { freq: 3, amp: 0.2, type: 'sine' },
      { freq: 4, amp: 0.1, type: 'sine' }
    ], { attack: 0.02, decay: 0.08, sustain: 0.6, release: 0.15 });
    
    // Add sparkle effect
    setTimeout(() => {
      this.createLayeredSound(1047, 0.15, [
        { freq: 1, amp: 0.6, type: 'sine' },
        { freq: 2, amp: 0.3, type: 'triangle' }
      ]);
    }, 100);
  }

  playNumbersIncrementing() {
    // Numbers counting up - gentle digital increment sound
    const baseFreq = 800 + Math.random() * 200; // Slight variation each time
    this.createLayeredSound(baseFreq, 0.03, [
      { freq: 1, amp: 0.6, type: 'triangle' },
      { freq: 2, amp: 0.2, type: 'sine' },
      { freq: 4, amp: 0.1, type: 'sine' } // High harmonic for digital feel
    ], { attack: 0.001, decay: 0.01, sustain: 0.2, release: 0.019 });
    
    // Add subtle digital texture
    setTimeout(() => {
      this.createFilteredNoise(baseFreq * 3, 0.015, 'highpass');
    }, 5);
  }

  playError() {
    // Medical error - serious but not harsh warning
    this.createLayeredSound(220, 0.2, [
      { freq: 1, amp: 1, type: 'triangle' },
      { freq: 1.414, amp: 0.3, type: 'sawtooth' }, // Tritone for tension
      { freq: 0.5, amp: 0.2, type: 'sine' }
    ], { attack: 0.01, decay: 0.08, sustain: 0.3, release: 0.11 });
    
    // Add subtle filtered noise for urgency
    setTimeout(() => {
      this.createFilteredNoise(400, 0.1, 'bandpass');
    }, 50);
  }

  playWarning() {
    // Clinical caution - attention-getting but professional
    this.createLayeredSound(660, 0.12, [
      { freq: 1, amp: 1, type: 'triangle' },
      { freq: 1.2, amp: 0.4, type: 'sine' } // Slight dissonance
    ], { attack: 0.01, decay: 0.06, sustain: 0.4, release: 0.05 });
  }

  playNotification() {
    // System notification - clear but unobtrusive
    this.createLayeredSound(880, 0.12, [
      { freq: 1, amp: 1, type: 'sine' },
      { freq: 2, amp: 0.3, type: 'triangle' },
      { freq: 0.5, amp: 0.2, type: 'sine' }
    ], { attack: 0.02, decay: 0.05, sustain: 0.5, release: 0.05 });
  }

  playPageTransition() {
    // Navigation - smooth, flowing transition
    this.createLayeredSound(440, 0.15, [
      { freq: 1, amp: 1, type: 'sine' },
      { freq: 1.5, amp: 0.4, type: 'triangle' }
    ], { attack: 0.03, decay: 0.05, sustain: 0.6, release: 0.07 });
    
    setTimeout(() => {
      this.createLayeredSound(554, 0.12, [
        { freq: 1, amp: 0.8, type: 'sine' },
        { freq: 2, amp: 0.2, type: 'triangle' }
      ]);
    }, 80);
  }

  playModalOpen() {
    // Modal appearance - welcoming and informative
    this.createLayeredSound(659, 0.1, [
      { freq: 1, amp: 1, type: 'sine' },
      { freq: 1.25, amp: 0.3, type: 'triangle' }
    ], { attack: 0.02, decay: 0.04, sustain: 0.6, release: 0.04 });
    
    setTimeout(() => {
      this.createLayeredSound(880, 0.08, [
        { freq: 1, amp: 0.7, type: 'sine' },
        { freq: 0.5, amp: 0.2, type: 'triangle' }
      ]);
    }, 60);
  }

  playModalClose() {
    // Modal dismissal - gentle completion
    this.createLayeredSound(880, 0.08, [
      { freq: 1, amp: 1, type: 'sine' },
      { freq: 0.75, amp: 0.3, type: 'triangle' }
    ]);
    setTimeout(() => {
      this.createLayeredSound(659, 0.1, [
        { freq: 1, amp: 0.8, type: 'sine' },
        { freq: 0.5, amp: 0.2, type: 'sine' }
      ]);
    }, 50);
  }

  playCaseStart() {
    // Beginning clinical case - inspiring and professional
    const openingTheme = [
      { freq: 523, delay: 0 },    // C5
      { freq: 659, delay: 80 },   // E5
      { freq: 784, delay: 160 },  // G5
      { freq: 1047, delay: 240 }  // C6
    ];
    
    openingTheme.forEach(note => {
      setTimeout(() => {
        this.createLayeredSound(note.freq, 0.18, [
          { freq: 1, amp: 1, type: 'sine' },
          { freq: 2, amp: 0.3, type: 'triangle' },
          { freq: 0.5, amp: 0.2, type: 'sine' }
        ], { attack: 0.03, decay: 0.06, sustain: 0.7, release: 0.09 });
      }, note.delay);
    });
  }

  playCaseComplete() {
    // Case completion - triumphant but dignified
    const victoryChord = [
      { freq: 523, delay: 0 },    // C5
      { freq: 659, delay: 40 },   // E5
      { freq: 784, delay: 80 },   // G5
      { freq: 1047, delay: 120 }, // C6
      { freq: 1319, delay: 200 }  // E6 - final flourish
    ];
    
    victoryChord.forEach(note => {
      setTimeout(() => {
        this.createLayeredSound(note.freq, 0.2, [
          { freq: 1, amp: 1, type: 'sine' },
          { freq: 2, amp: 0.4, type: 'triangle' },
          { freq: 3, amp: 0.2, type: 'sine' },
          { freq: 0.5, amp: 0.3, type: 'triangle' }
        ], { attack: 0.02, decay: 0.08, sustain: 0.7, release: 0.1 });
      }, note.delay);
    });
    
    // Add celebratory sparkle
    setTimeout(() => {
      this.createFilteredNoise(2000, 0.15, 'highpass');
    }, 300);
  }

  playTimer() {
    // Subtle time tracking - gentle pulse
    this.createLayeredSound(1000, 0.04, [
      { freq: 1, amp: 1, type: 'sine' },
      { freq: 2, amp: 0.2, type: 'triangle' }
    ]);
  }

  playCountdown() {
    // Countdown urgency - building tension
    this.createLayeredSound(660, 0.12, [
      { freq: 1, amp: 1, type: 'triangle' },
      { freq: 1.5, amp: 0.3, type: 'square' }
    ], { attack: 0.01, decay: 0.11, sustain: 0, release: 0 });
  }

  playSearchType() {
    // Typing feedback - paper-like texture
    const frequency = 800 + Math.random() * 200;
    this.createLayeredSound(frequency, 0.04, [
      { freq: 1, amp: 1, type: 'sine' },
      { freq: 2, amp: 0.15, type: 'triangle' }
    ]);
    
    // Add subtle paper-like texture
    if (Math.random() < 0.3) {
      setTimeout(() => {
        this.createFilteredNoise(frequency * 2, 0.02, 'highpass');
      }, 10);
    }
  }

  playScoreReveal() {
    // Score presentation - professional revelation
    const revealSequence = [
      { freq: 440, delay: 0 },
      { freq: 554, delay: 60 },
      { freq: 659, delay: 120 }
    ];
    
    revealSequence.forEach(note => {
      setTimeout(() => {
        this.createLayeredSound(note.freq, 0.12, [
          { freq: 1, amp: 1, type: 'sine' },
          { freq: 2, amp: 0.3, type: 'triangle' },
          { freq: 1.5, amp: 0.2, type: 'sine' }
        ], { attack: 0.02, decay: 0.04, sustain: 0.6, release: 0.06 });
      }, note.delay);
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
  numbersIncrementing: () => soundManager.playNumbersIncrementing(),
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