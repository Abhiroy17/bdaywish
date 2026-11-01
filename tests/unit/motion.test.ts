import { afterEach, describe, expect, it, vi } from 'vitest';
import { observeScenes } from '../../src/lib/motion';

describe('visible-scene animation lifecycle', () => {
  afterEach(() => vi.unstubAllGlobals());
  it('remains readable without intersection observer', () => {
    const existing = globalThis.IntersectionObserver;
    Reflect.deleteProperty(globalThis, 'IntersectionObserver');
    expect(() => observeScenes(document)()).not.toThrow();
    if (existing) vi.stubGlobal('IntersectionObserver', existing);
  });
  it('marks visible sections, changes chapter indication and disconnects', () => {
    document.body.innerHTML = '<nav class="episode-nav"><a href="#a">A</a><a href="#b">B</a></nav><section class="scene" id="a"></section><section class="scene" id="b"></section>';
    let callback!: IntersectionObserverCallback;
    const observe = vi.fn(); const disconnect = vi.fn();
    vi.stubGlobal('IntersectionObserver', class {
      constructor(fn: IntersectionObserverCallback) { callback = fn; }
      observe = observe; disconnect = disconnect;
    });
    const cleanup = observeScenes(document);
    expect(observe).toHaveBeenCalledTimes(2);
    const target = document.querySelector('#a')!;
    const notify = (visible: boolean) => callback([{ target, isIntersecting: visible } as IntersectionObserverEntry], {} as IntersectionObserver);
    notify(true);
    expect(target.classList.contains('is-visible')).toBe(true);
    expect(document.querySelector('a')?.getAttribute('aria-current')).toBe('location');
    notify(false);
    expect(target.classList.contains('is-visible')).toBe(false);
    cleanup(); expect(disconnect).toHaveBeenCalledOnce();
  });
});