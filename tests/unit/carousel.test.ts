import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bindMemoryCarousel } from '../../src/lib/carousel';

describe('responsive memory navigation', () => {
  let track: HTMLElement;
  let previous: HTMLButtonElement;
  let next: HTMLButtonElement;
  let width: number;
  let resize: ResizeObserverCallback;
  let cleanup: () => void;
  const disconnect = vi.fn();

  beforeEach(() => {
    document.body.innerHTML = '<div class="memory-track"><details class="memory"></details></div><button id="memory-prev"></button><button id="memory-next"></button>';
    track = document.querySelector('.memory-track')!;
    previous = document.querySelector('#memory-prev')!;
    next = document.querySelector('#memory-next')!;
    width = 300;
    Object.defineProperties(track, {
      clientWidth: { get: () => width },
      scrollWidth: { get: () => 1100 },
    });
    const card = track.querySelector<HTMLElement>('.memory')!;
    Object.defineProperty(card, 'offsetWidth', { value: 250 });
    track.style.columnGap = '20px';
    track.scrollBy = vi.fn();
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })));
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: ResizeObserverCallback) { resize = callback; }
      observe = vi.fn(); disconnect = disconnect;
    });
    cleanup = bindMemoryCarousel(document);
  });
  afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it('disables arrows at either edge and uses the rendered card step', () => {
    expect(previous.disabled).toBe(true);
    expect(next.disabled).toBe(false);
    next.click();
    expect(track.scrollBy).toHaveBeenCalledWith({ left: 270, behavior: 'smooth' });
    track.scrollLeft = 800;
    track.dispatchEvent(new Event('scroll'));
    expect(next.disabled).toBe(true);
    expect(previous.disabled).toBe(false);
    previous.click();
    expect(track.scrollBy).toHaveBeenLastCalledWith({ left: -270, behavior: 'smooth' });
  });

  it('recomputes navigation when tablet rotation makes every card fit', () => {
    width = 1100;
    resize([], {} as ResizeObserver);
    expect(next.disabled).toBe(true);
    expect(previous.disabled).toBe(true);
    width = 300;
    window.dispatchEvent(new Event('resize'));
    expect(next.disabled).toBe(false);
  });

  it('respects reduced motion, fractional scroll edges and listener cleanup', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })));
    next.click();
    expect(track.scrollBy).toHaveBeenCalledWith({ left: 270, behavior: 'instant' });
    track.scrollLeft = 799.5;
    track.dispatchEvent(new Event('scroll'));
    expect(next.disabled).toBe(true);
    cleanup();
    expect(disconnect).toHaveBeenCalled();
    track.scrollLeft = 0;
    track.dispatchEvent(new Event('scroll'));
    expect(next.disabled).toBe(true);
  });

  it('works without ResizeObserver and with a single fully visible card', () => {
    cleanup();
    vi.stubGlobal('ResizeObserver', undefined);
    width = 1100;
    cleanup = bindMemoryCarousel(document);
    expect(next.disabled).toBe(true);
    expect(previous.disabled).toBe(true);
  });
});