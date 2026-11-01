export interface BirthdayAudio {
  readonly isPlaying: boolean;
  play(): Promise<boolean>;
  pause(): void;
  dispose(): void;
}

// “A Little More of Us”: an original 16-bar miniature, not the TV theme.
const melody = [
  76, 0, 79, 83, 81, 79, 76, 0, 74, 76, 79, 0, 83, 81, 79, 0,
  74, 0, 78, 81, 79, 78, 74, 0, 73, 74, 78, 0, 81, 79, 78, 0,
  72, 0, 76, 79, 83, 79, 76, 0, 74, 72, 76, 0, 79, 76, 72, 0,
  74, 0, 78, 81, 86, 81, 78, 0, 79, 78, 74, 0, 71, 74, 79, 0,
];
const chords = [[55, 59, 62, 66], [54, 57, 62, 66], [52, 55, 60, 64], [50, 57, 60, 66]];
const beat = .3;

export class AudioController implements BirthdayAudio {
  private context?: AudioContext;
  private master?: GainNode;
  private timer?: ReturnType<typeof setInterval>;
  private nodes = new Set<OscillatorNode>();
  private nextTime = 0;
  private step = 0;
  private generation = 0;
  private playing = false;
  private disposed = false;
  private readonly factory: () => AudioContext;

  constructor(factory: () => AudioContext = () => new AudioContext()) { this.factory = factory; }
  get isPlaying(): boolean { return this.playing; }

  async play(): Promise<boolean> {
    if (this.disposed) return false;
    if (this.playing) return true;
    const generation = ++this.generation;
    try {
      // Construct and request resume in the original pointer/keyboard event.
      this.context ??= this.factory();
      const context = this.context;
      await context.resume();
      if (generation !== this.generation || this.disposed) {
        if (!this.playing && context.state !== 'closed') await context.suspend();
        return false;
      }
      this.master ??= context.createGain();
      this.master.connect(context.destination);
      this.master.gain.setValueAtTime(0, context.currentTime);
      this.master.gain.linearRampToValueAtTime(.22, context.currentTime + .7);
      this.nextTime = context.currentTime + .05;
      this.playing = true;
      this.schedule();
      this.timer = setInterval(() => this.schedule(), 100);
      return true;
    } catch {
      this.pause();
      return false;
    }
  }

  private note(midi: number, time: number, duration: number, volume: number, type: OscillatorType): void {
    const context = this.context!;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(440 * 2 ** ((midi - 69) / 12), time);
    envelope.gain.setValueAtTime(.0001, time);
    envelope.gain.exponentialRampToValueAtTime(volume, time + .015);
    envelope.gain.exponentialRampToValueAtTime(.0001, time + duration);
    oscillator.connect(envelope);
    envelope.connect(this.master!);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); this.nodes.delete(oscillator); };
    this.nodes.add(oscillator);
    oscillator.start(time);
    oscillator.stop(time + duration + .02);
  }

  private schedule(): void {
    const context = this.context!;
    // Bound lookahead and skip old beats after a stalled/backgrounded thread.
    this.nextTime = Math.max(this.nextTime, context.currentTime);
    while (this.nextTime < context.currentTime + .3) {
      const note = melody[this.step % melody.length];
      const chord = chords[Math.floor(this.step / 16) % chords.length];
      if (note) this.note(note, this.nextTime, .52, .23, 'triangle');
      if (this.step % 4 === 0) {
        chord.forEach((tone, index) => this.note(tone, this.nextTime + index * .024, 1.1, .075, 'sine'));
        this.note(chord[0] - 12, this.nextTime, .65, .32, 'sine');
      }
      if (this.step % 2 === 1) this.note(91, this.nextTime, .04, .035, 'triangle');
      this.step = (this.step + 1) % melody.length;
      this.nextTime += beat;
    }
  }

  pause(): void {
    this.generation++;
    this.playing = false;
    clearInterval(this.timer);
    this.timer = undefined;
    for (const node of this.nodes) { node.stop(); node.disconnect(); }
    this.nodes.clear();
    if (this.context && this.context.state !== 'closed') {
      this.master?.disconnect();
      void this.context.suspend().catch(() => undefined);
    }
  }

  dispose(): void {
    this.pause();
    this.disposed = true;
    if (this.context && this.context.state !== 'closed') void this.context.close().catch(() => undefined);
  }
}