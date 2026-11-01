import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../../src/App';
import { birthdayContent } from '../../src/content/birthday';
import confetti from 'canvas-confetti';
import { useReducedMotion } from 'motion/react';

vi.mock('canvas-confetti', () => ({ default: Object.assign(vi.fn(), { reset: vi.fn() }) }));
vi.mock('motion/react', async (importOriginal) => ({ ...await importOriginal<typeof import('motion/react')>(), useReducedMotion: vi.fn(() => false) }));

describe('React birthday experience', () => {
  const audio = { isPlaying: false, play: vi.fn(async () => { audio.isPlaying = true; return true; }), pause: vi.fn(() => { audio.isPlaying = false; }), dispose: vi.fn() };
  const click = (selector: string) => fireEvent.click(document.querySelector(selector)!);
  beforeEach(() => {
    vi.stubGlobal('localStorage', { getItem: vi.fn(() => null), setItem: vi.fn() });
    Element.prototype.scrollIntoView = vi.fn();
    Element.prototype.scrollBy = vi.fn();
    audio.isPlaying = false;
    vi.clearAllMocks();
    vi.mocked(useReducedMotion).mockReturnValue(false);
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => undefined);
  });
  afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it('renders seven React scenes and preserves notes, candles and replay', async () => {
    render(<App content={birthdayContent} audio={audio} />);
    expect(document.querySelectorAll('main > section')).toHaveLength(7);
    click('.door-knock');
    expect(screen.getByText(/door is always open/)).toBeTruthy();
    click('#coffee-mug');
    expect(document.querySelector('#coffee-note')?.textContent).toContain('reserved for you');
    click('#lobster');
    expect(document.querySelector('#toast')?.textContent).toBe('My best friend, my favourite person, my very best plot twist. ♡');
    click('.memory summary'); click('.memory summary');
    click('.reason summary'); click('.reason summary');
    expect(document.querySelector('#reason-progress')?.textContent).toContain('1 of 28');
    click('#read-reasons');
    expect(document.querySelectorAll('.reason[open]')).toHaveLength(28);
    click('.candle'); click('#make-wish');
    expect(document.querySelector('#wish-status')?.textContent).toContain('universe');
    click('.letter-envelope summary');
    expect(document.querySelector('.letter-envelope[open]')).toBeTruthy();
    click('#replay');
    expect(document.querySelectorAll('.reason[open]')).toHaveLength(0);
    expect(document.querySelectorAll('.candle[aria-pressed="true"]')).toHaveLength(0);
    expect(document.querySelector('#home')).toBe(document.activeElement);
    await act(async () => {});
  });

  it('customizes coffee, shuffles date ideas and connects promises without gating content', () => {
    render(<App content={birthdayContent} audio={audio} />);
    for (const button of screen.getAllByRole('button', { name: /Order / })) fireEvent.click(button);
    expect(document.querySelector('.coffee-receipt')?.textContent).toContain('TOTAL');
    expect(document.querySelectorAll('.coffee-order [aria-pressed="true"]')).toHaveLength(1);
    const firstIdea = document.querySelector('.date-deck [role="status"]')?.textContent;
    click('#shuffle-date');
    expect(document.querySelector('.date-deck [role="status"]')?.textContent).not.toBe(firstIdea);
    for (let i = 0; i < 7; i++) click('#shuffle-date');
    for (const star of screen.getAllByRole('button', { name: /Connect star / })) fireEvent.click(star);
    expect(document.querySelector('#constellation-status')?.textContent).toContain('5 of 5');
    click('.promise-star');
    expect(document.querySelector('#constellation-status')?.textContent).toContain('5 of 5');
    click('#reset-stars');
    expect(document.querySelector('#constellation-status')?.textContent).toContain('0 of 5');
  });

  it('starts music only on request, exposes failure, and pauses when hidden', async () => {
    vi.stubGlobal('localStorage', { getItem: vi.fn(() => 'false'), setItem: vi.fn() });
    render(<App content={birthdayContent} audio={audio} />);
    expect(document.querySelector('#instrumental-toggle')?.getAttribute('title')).toContain('Welcome back');
    await act(async () => click('#instrumental-toggle'));
    expect(document.querySelector('#instrumental-toggle')?.getAttribute('aria-pressed')).toBe('true');
    click('#instrumental-toggle');
    expect(document.querySelector('#instrumental-toggle')?.getAttribute('aria-pressed')).toBe('false');
    audio.play.mockResolvedValueOnce(false);
    await act(async () => click('#instrumental-toggle'));
    expect(document.querySelector('#toast')?.textContent).toContain('unavailable');
    await act(async () => fireEvent.click(screen.getByRole('button', { name: /Play original instrumental/ })));
    expect(document.querySelector('.record-player')?.classList.contains('is-playing')).toBe(true);
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(document.querySelector('#instrumental-toggle')?.getAttribute('aria-pressed')).toBe('true');
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(document.querySelector('#instrumental-toggle')?.getAttribute('aria-pressed')).toBe('false');
    act(() => window.dispatchEvent(new Event('pagehide')));
  });

  it('bounds timed celebrations, cancels replay navigation, and supports reduced motion', async () => {
    vi.useFakeTimers();
    const view = render(<App content={birthdayContent} audio={audio} />);
    click('#credits-sparkle'); click('#credits-sparkle');
    expect(confetti).toHaveBeenCalledTimes(2);
    act(() => vi.advanceTimersByTime(5000));
    expect(document.querySelector('#toast')?.textContent).toBe('');
    click('#enter-quiet');
    act(() => vi.advanceTimersByTime(1000));
    expect(document.querySelector('#credits')).toBe(document.activeElement);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    await act(async () => click('#enter-music'));
    act(() => vi.advanceTimersByTime(1000));
    expect(document.querySelector('#song-player')).toBe(document.activeElement);
    expect(document.querySelector('iframe')).toBeNull();
    click('#enter-quiet'); click('#replay');
    act(() => vi.advanceTimersByTime(2000));
    expect(document.querySelector('#home')).toBe(document.activeElement);
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addListener: vi.fn(), removeListener: vi.fn() })));
    vi.mocked(useReducedMotion).mockReturnValue(true);
    view.rerender(<App content={birthdayContent} audio={audio} />);
    click('#credits-sparkle');
    expect(confetti).toHaveBeenCalledTimes(2);
    click('#enter-quiet');
    act(() => vi.advanceTimersByTime(1));
    expect(Element.prototype.scrollIntoView).toHaveBeenLastCalledWith({ behavior: 'instant', block: 'start' });
    click('#shuffle-date'); click('.promise-star'); click('.memory summary');
    click('.letter-envelope summary'); click('.letter-envelope summary');
    fireEvent.click(screen.getByRole('button', { name: 'Order Sweet mocha' }));
    click('.candle'); click('.candle');
    fireEvent.click(screen.getByRole('button', { name: 'Blow out candle 2' }));
    expect(document.querySelector('#wish-status')?.textContent).toContain('universe');
  });

  it('ignores pending audio replies after quiet entry and unmount', async () => {
    let finish!: (value: boolean) => void;
    audio.play.mockImplementationOnce(() => new Promise<boolean>((resolve) => { finish = resolve; }));
    const view = render(<App content={birthdayContent} audio={audio} />);
    click('#instrumental-toggle'); click('#enter-quiet');
    await act(async () => finish(true));
    expect(document.querySelector('#instrumental-toggle')?.getAttribute('aria-pressed')).toBe('false');
    audio.play.mockImplementationOnce(() => new Promise<boolean>((resolve) => { finish = resolve; }));
    click('#instrumental-toggle'); view.unmount();
    await act(async () => finish(true));
    expect(audio.dispose).toHaveBeenCalled();
    expect(confetti.reset).toHaveBeenCalled();
  });

  it('renders local photos and replaces failed images with original artwork', () => {
    const content = { ...birthdayContent, memories: [{ title: 'Our photo', caption: 'Our little moment', src: '/images/us.webp', alt: 'Us together' }] };
    render(<App content={content} base="/birthday/" audio={audio} />);
    const image = screen.getByAltText('Us together');
    expect(image.getAttribute('src')).toBe('/birthday/images/us.webp');
    fireEvent.error(image);
    expect(screen.queryByAltText('Us together')).toBe(null);
    expect(screen.getByText(/photo unavailable/)).toBeTruthy();
  });

  it('keeps personalized notes without showing identity badges in the opening', () => {
    render(<App content={birthdayContent} audio={audio} />);
    expect(screen.queryByText('Pisces soul')).toBeNull();
    expect(screen.queryByText('Mulank 2', { exact: true })).toBeNull();
    expect(document.querySelector('.celestial-signature')).toBeNull();
    expect(document.querySelectorAll('.trait-note')).toHaveLength(4);
    expect(document.querySelector('.letter-paper')?.textContent).toContain('Pisces');
    expect(birthdayContent.date).toBe('2026-11-02');
    expect(birthdayContent.reasons).toHaveLength(28);
  });

  it('loads the official song only after consent and never overlaps the instrumental', async () => {
    render(<App content={birthdayContent} audio={audio} />);
    expect(screen.getByText('Or listen to Love Story (Taylor’s Version) on Spotify')).toBeTruthy();
    expect(document.querySelector('iframe')).toBeNull();
    click('.sound-button');
    expect(document.querySelector('#song-player')).toBe(document.activeElement);
    expect(audio.play).not.toHaveBeenCalled();
    click('#load-song');
    expect(document.querySelector('iframe')?.getAttribute('src')).toBe('https://open.spotify.com/embed/track/3CeCwYWvdfXbZLXFhBrbnf?theme=0');
    expect(audio.pause).toHaveBeenCalled();
    click('#stop-music');
    expect(document.querySelector('iframe')).toBeNull();
    await act(async () => click('#instrumental-toggle'));
    expect(audio.isPlaying).toBe(true);
    click('#load-song');
    expect(audio.isPlaying).toBe(false);
    expect(document.querySelector('iframe')).toBeTruthy();
    await act(async () => click('#instrumental-toggle'));
    expect(document.querySelector('iframe')).toBeNull();
    click('#load-song');
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(document.querySelector('iframe')).toBeNull();
    expect(screen.getByRole('link', { name: /Open in Spotify/ }).getAttribute('href')).toBe('https://open.spotify.com/track/3CeCwYWvdfXbZLXFhBrbnf');
  });

  it('plays the provided MP3 only after a tap, pauses and resumes, and supports subpath hosting', async () => {
    render(<App content={birthdayContent} base="/birthday/" audio={audio} />);
    const media = document.querySelector<HTMLAudioElement>('#local-song')!;
    expect(media).not.toBeNull();
    expect(media.getAttribute('preload')).toBe('none');
    expect(media.getAttribute('src')).toBe('/birthday/audio/taylor-swift-love-story.mp3');
    expect(media.autoplay).toBe(false);
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    await act(async () => click('#play-local-song'));
    expect(document.querySelector('#play-local-song')?.getAttribute('aria-pressed')).toBe('true');
    expect(audio.isPlaying).toBe(false);
    click('#play-local-song');
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    await act(async () => click('#play-local-song'));
    click('#load-song');
    expect(document.querySelector('#play-local-song')?.getAttribute('aria-pressed')).toBe('false');
    await act(async () => click('#play-local-song'));
    expect(document.querySelector('iframe')).toBeNull();
    await act(async () => click('#instrumental-toggle'));
    expect(document.querySelector('#play-local-song')?.getAttribute('aria-pressed')).toBe('false');
  });
});