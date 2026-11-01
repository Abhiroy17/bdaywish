import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AudioController } from '../../src/lib/audio';
import { readMuted, saveMuted } from '../../src/lib/preferences';

function fakeContext() {
  const parameter = () => ({ value: 0, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), cancelScheduledValues: vi.fn() });
  const nodes: { onended: (() => void) | null; stop: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> }[] = [];
  const context = {
    currentTime: 0, state: 'suspended', destination: {},
    resume: vi.fn(async () => { context.state = 'running'; }),
    suspend: vi.fn(async () => { context.state = 'suspended'; }),
    close: vi.fn(async () => { context.state = 'closed'; }),
    createGain: vi.fn(() => ({ gain: parameter(), connect: vi.fn(), disconnect: vi.fn() })),
    createOscillator: vi.fn(() => {
      const node = { type: 'sine', frequency: parameter(), connect: vi.fn(), start: vi.fn(), stop: vi.fn(), disconnect: vi.fn(), onended: null as (() => void) | null };
      nodes.push(node); return node;
    }),
  };
  return { context, nodes, factory: () => context as unknown as AudioContext };
}

describe('original music lifecycle', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
  it('stays silent until play, schedules original notes and prevents duplicate loops', async () => {
    const { context, factory, nodes } = fakeContext();
    const audio = new AudioController(factory);
    expect(context.createOscillator).not.toHaveBeenCalled();
    expect(await audio.play()).toBe(true);
    expect(audio.isPlaying).toBe(true);
    expect(context.createOscillator).toHaveBeenCalled();
    await audio.play();
    expect(context.resume).toHaveBeenCalledTimes(1);
    for (let step = 1; step < 100; step++) { context.currentTime = step * .2; vi.advanceTimersByTime(100); }
    nodes[0].onended?.();
    expect(nodes[0].disconnect).toHaveBeenCalled();
    audio.pause();
    expect(audio.isPlaying).toBe(false);
    expect(context.suspend).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
    await audio.play();
    audio.dispose();
    expect(context.close).toHaveBeenCalled();
    audio.dispose();
  });
  it('handles unsupported or blocked audio without rejecting', async () => {
    const unavailable = new AudioController(() => { throw new Error('unsupported'); });
    expect(await unavailable.play()).toBe(false);
    unavailable.pause(); unavailable.dispose();
    const { context, factory } = fakeContext();
    context.resume.mockRejectedValueOnce(new Error('blocked'));
    const blocked = new AudioController(factory);
    expect(await blocked.play()).toBe(false);
    expect(blocked.isPlaying).toBe(false);
    blocked.dispose();
  });
  it('does not start a delayed resume after mute or teardown', async () => {
    const { context, factory } = fakeContext();
    let resume!: () => void;
    context.resume.mockImplementationOnce(() => new Promise<void>((resolve) => { resume = resolve; }));
    const audio = new AudioController(factory);
    const pending = audio.play();
    audio.pause(); resume();
    expect(await pending).toBe(false);
    expect(context.createOscillator).not.toHaveBeenCalled();
    audio.dispose();
  });
  it('constructs the default browser audio context on activation', async () => {
    const { factory } = fakeContext();
    vi.stubGlobal('AudioContext', class { constructor() { return factory(); } });
    const audio = new AudioController();
    expect(await audio.play()).toBe(true);
    audio.dispose();
  });
});

describe('mute preference', () => {
  const data = new Map<string, string>();
  const storage = {
    getItem: vi.fn((key: string) => data.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => { data.set(key, value); }),
  };
  beforeEach(() => { data.clear(); vi.stubGlobal('localStorage', storage); });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
  it('defaults to muted and persists explicit changes', () => {
    expect(readMuted()).toBe(true);
    saveMuted(false); expect(readMuted()).toBe(false);
    saveMuted(true); expect(readMuted()).toBe(true);
  });
  it('tolerates denied storage', () => {
    storage.getItem.mockImplementationOnce(() => { throw new Error('denied'); });
    storage.setItem.mockImplementationOnce(() => { throw new Error('denied'); });
    expect(readMuted()).toBe(true);
    expect(() => saveMuted(false)).not.toThrow();
  });
});