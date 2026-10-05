// Web Audio API Ringtone & Kitchen Order Alarm Engine
// Zero external dependencies, 100% reliable offline & in all modern browsers

let audioCtx = null;
let ringtoneInterval = null;
let isRinging = false;
let isMuted = false;

export const getAudioContext = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

// Play a high-quality, attention-grabbing dual chime bell tone
export const playOrderChime = () => {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  try {
    const now = ctx.currentTime;

    // Tone 1: High crisp notification chime (987.77 Hz - B5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(987.77, now);
    osc1.frequency.exponentialRampToValueAtTime(1318.51, now + 0.15); // E6

    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.55);

    // Tone 2: Harmonic secondary chime bell after 180ms (1567.98 Hz - G6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1567.98, now + 0.18);
    osc2.frequency.exponentialRampToValueAtTime(1760.00, now + 0.35); // A6

    gain2.gain.setValueAtTime(0.001, now);
    gain2.gain.setValueAtTime(0.45, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.18);
    osc2.stop(now + 0.8);
  } catch (err) {
    console.warn('Audio play notice:', err);
  }
};

export const startOrderRingtone = () => {
  if (isRinging) return;
  isRinging = true;

  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  // Play immediately
  playOrderChime();

  // Pulse ring every 1.5 seconds continuously until stopped/accepted
  if (ringtoneInterval) clearInterval(ringtoneInterval);
  ringtoneInterval = setInterval(() => {
    if (isRinging) {
      playOrderChime();
    } else {
      clearInterval(ringtoneInterval);
      ringtoneInterval = null;
    }
  }, 1500);
};

export const stopOrderRingtone = () => {
  isRinging = false;
  if (ringtoneInterval) {
    clearInterval(ringtoneInterval);
    ringtoneInterval = null;
  }
};

export const isRingtonePlaying = () => isRinging;

export const toggleMuteRingtone = () => {
  isMuted = !isMuted;
  if (isMuted) {
    stopOrderRingtone();
  }
  return isMuted;
};

// Continuous unlock listener across all standard user actions (only resumes audio context without playing chimes)
if (typeof window !== 'undefined') {
  const unlock = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  };

  ['click', 'keydown', 'touchstart', 'pointerdown'].forEach((evt) => {
    window.addEventListener(evt, unlock, { passive: true });
  });
}

