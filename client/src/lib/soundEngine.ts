/*
 * Gilded Archive — generative ambient sound engine (Web Audio API).
 * Produces a calm piano-esque ambient loop + rain noise, no external files.
 * Two soundtracks: "gallery" (warm pentatonic) and "nocturne" (minor, slower) for the clock easter egg.
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let musicGain: GainNode | null = null;
let rainGain: GainNode | null = null;
let rainNode: AudioBufferSourceNode | null = null;
let musicTimer: ReturnType<typeof setTimeout> | null = null;
let currentTrack: "gallery" | "nocturne" = "gallery";
let playing = false;

function ensureCtx(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.55;
    musicGain.connect(masterGain);
    rainGain = ctx.createGain();
    rainGain.gain.value = 0;
    rainGain.connect(masterGain);
  }
  return ctx;
}

/* Soft piano-like pluck */
function pluck(freq: number, time: number, dur: number, vel: number) {
  if (!ctx || !musicGain) return;
  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const g = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 2200;
  osc.type = "sine";
  osc.frequency.value = freq;
  osc2.type = "triangle";
  osc2.frequency.value = freq * 2;
  const g2 = ctx.createGain();
  g2.gain.value = 0.12;
  osc2.connect(g2);
  g2.connect(g);
  osc.connect(g);
  g.connect(filter);
  filter.connect(musicGain);
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(vel, time + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  osc.start(time);
  osc.stop(time + dur + 0.1);
  osc2.start(time);
  osc2.stop(time + dur + 0.1);
}

const gallerySteps = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25]; // C pentatonic-ish
const nocturneSteps = [220.0, 246.94, 261.63, 329.63, 349.23, 440.0, 493.88, 523.25]; // A minor colours

function scheduleLoop() {
  if (!ctx || !playing) return;
  const steps = currentTrack === "gallery" ? gallerySteps : nocturneSteps;
  const t = ctx.currentTime + 0.1;
  const noteCount = 3 + Math.floor(Math.random() * 3);
  let offset = 0;
  for (let i = 0; i < noteCount; i++) {
    const freq = steps[Math.floor(Math.random() * steps.length)];
    const dur = currentTrack === "gallery" ? 2.5 + Math.random() * 2 : 3.5 + Math.random() * 2.5;
    pluck(freq, t + offset, dur, 0.10 + Math.random() * 0.08);
    // occasional soft fifth below
    if (Math.random() < 0.35) pluck(freq / 1.5, t + offset + 0.05, dur * 1.2, 0.05);
    offset += currentTrack === "gallery" ? 0.9 + Math.random() * 1.4 : 1.4 + Math.random() * 1.8;
  }
  musicTimer = setTimeout(scheduleLoop, (offset + 1.5) * 1000);
}

function makeRainBuffer(c: AudioContext): AudioBuffer {
  const len = c.sampleRate * 3;
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 2.8;
    }
  }
  return buf;
}

export const soundEngine = {
  start() {
    const c = ensureCtx();
    if (c.state === "suspended") c.resume();
    if (playing) return;
    playing = true;
    scheduleLoop();
  },
  stop() {
    playing = false;
    if (musicTimer) { clearTimeout(musicTimer); musicTimer = null; }
  },
  setVolume(v: number) {
    if (masterGain && ctx) masterGain.gain.linearRampToValueAtTime(v, ctx.currentTime + 0.2);
  },
  setTrack(track: "gallery" | "nocturne") {
    currentTrack = track;
  },
  setRain(on: boolean) {
    const c = ensureCtx();
    if (c.state === "suspended") c.resume();
    if (on) {
      if (!rainNode && rainGain) {
        rainNode = c.createBufferSource();
        rainNode.buffer = makeRainBuffer(c);
        rainNode.loop = true;
        const filter = c.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 1400;
        filter.Q.value = 0.4;
        rainNode.connect(filter);
        filter.connect(rainGain);
        rainNode.start();
      }
      rainGain?.gain.linearRampToValueAtTime(0.12, c.currentTime + 1.5);
    } else {
      rainGain?.gain.linearRampToValueAtTime(0, c.currentTime + 1);
    }
  },
  chime() {
    const c = ensureCtx();
    if (c.state === "suspended") c.resume();
    pluck(783.99, c.currentTime + 0.02, 1.6, 0.14);
    pluck(1046.5, c.currentTime + 0.18, 1.8, 0.1);
  },
};
