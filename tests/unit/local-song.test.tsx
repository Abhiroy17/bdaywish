import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useLocalSong } from '../../src/hooks/useLocalSong';

function setup() {
  const onActivate = vi.fn();
  const view = renderHook(() => useLocalSong(onActivate));
  const media = document.createElement('audio');
  const play = vi.spyOn(media, 'play').mockResolvedValue(undefined);
  const pause = vi.spyOn(media, 'pause').mockImplementation(() => undefined);
  const load = vi.spyOn(media, 'load').mockImplementation(() => undefined);
  view.result.current.ref.current = media;
  return { ...view, media, play, pause, load, onActivate };
}

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('local MP3 lifecycle', () => {
  it('does not call pause or load on untouched audio when entering quietly', () => {
    const { result, media, play, pause, load } = setup();
    expect(media.paused).toBe(true);
    expect(media.networkState).toBe(media.NETWORK_EMPTY);
    act(() => result.current.pause());
    act(() => result.current.pause());
    expect(result.current.status).toBe('paused');
    expect(play).not.toHaveBeenCalled();
    expect(pause).not.toHaveBeenCalled();
    expect(load).not.toHaveBeenCalled();
  });

  it('starts only on demand and follows native playback, buffering, pause, and ended events', async () => {
    const { result, media, play, pause, onActivate } = setup();
    expect(result.current.status).toBe('idle');
    expect(play).not.toHaveBeenCalled();
    act(() => result.current.events.onWaiting());
    expect(result.current.status).toBe('idle');
    await act(async () => { expect(await result.current.play()).toBe(true); });
    expect(onActivate).toHaveBeenCalled();
    expect(result.current.active).toBe(true);
    act(() => result.current.events.onWaiting());
    expect(result.current.status).toBe('loading');
    act(() => result.current.events.onPlaying());
    expect(result.current.status).toBe('playing');
    vi.spyOn(media, 'paused', 'get').mockReturnValue(false);
    act(() => result.current.pause());
    expect(pause).toHaveBeenCalled();
    act(() => result.current.events.onPlaying());
    expect(result.current.status).toBe('paused');
    act(() => result.current.events.onPlay());
    expect(result.current.status).toBe('loading');
    act(() => result.current.events.onPlaying());
    act(() => result.current.events.onEnded());
    expect(result.current.status).toBe('idle');
  });

  it('reports rejected playback and media errors without losing the retry path', async () => {
    const { result, media, play, load } = setup();
    play.mockRejectedValueOnce(new Error('Blocked or missing media'));
    await act(async () => { expect(await result.current.play()).toBe(false); });
    expect(result.current.status).toBe('error');
    act(() => result.current.events.onPause());
    expect(result.current.status).toBe('error');
    await act(async () => { await result.current.play(); });
    expect(result.current.status).toBe('playing');
    act(() => result.current.events.onError());
    expect(result.current.status).toBe('error');
    Object.defineProperty(media, 'error', { configurable: true, value: { code: 4 } });
    await act(async () => { await result.current.play(); });
    expect(load).toHaveBeenCalled();
  });

  it('does not restart after a pending play is cancelled or unmounted', async () => {
    const { result, play, pause, unmount } = setup();
    let finish!: () => void;
    play.mockImplementationOnce(() => new Promise<void>((resolve) => { finish = resolve; }));
    let pending!: Promise<boolean>;
    act(() => { pending = result.current.play(); });
    expect(result.current.status).toBe('loading');
    act(() => result.current.pause());
    await act(async () => { finish(); expect(await pending).toBe(false); });
    expect(result.current.active).toBe(false);
    expect(pause).toHaveBeenCalled();
    play.mockImplementationOnce(() => new Promise<void>((resolve) => { finish = resolve; }));
    act(() => { pending = result.current.play(); });
    unmount();
    await act(async () => { finish(); expect(await pending).toBe(false); });
  });

  it('ignores stale replies without pausing a newer playback request', async () => {
    const { result, play, pause } = setup();
    let finish!: () => void;
    play.mockImplementationOnce(() => new Promise<void>((resolve) => { finish = resolve; }));
    let pending!: Promise<boolean>;
    act(() => { pending = result.current.play(); });
    await act(async () => { await result.current.play(); });
    await act(async () => { finish(); expect(await pending).toBe(false); });
    expect(pause).not.toHaveBeenCalled();
    expect(result.current.status).toBe('playing');
    let reject!: (error: Error) => void;
    play.mockImplementationOnce(() => new Promise<void>((_, fail) => { reject = fail; }));
    act(() => { pending = result.current.play(); });
    act(() => result.current.pause());
    await act(async () => { reject(new Error('Cancelled')); expect(await pending).toBe(false); });
    expect(result.current.status).toBe('paused');
  });

  it('handles an absent audio element safely', async () => {
    const { result } = renderHook(() => useLocalSong(vi.fn()));
    await act(async () => { expect(await result.current.play()).toBe(false); });
    act(() => result.current.pause());
  });
});