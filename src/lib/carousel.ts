import { reducedMotion } from './motion.ts';

/** Keep native touch scrolling; arrows are an optional, geometry-aware alternative. */
export function bindMemoryCarousel(root: Document): () => void {
  const track = root.querySelector<HTMLElement>('.memory-track')!;
  const card = track.querySelector<HTMLElement>('.memory')!;
  const previous = root.querySelector<HTMLButtonElement>('#memory-prev')!;
  const next = root.querySelector<HTMLButtonElement>('#memory-next')!;
  const events = new AbortController();
  const options = { signal: events.signal };
  const update = () => {
    const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
    previous.disabled = maximum <= 1 || track.scrollLeft <= 1;
    next.disabled = maximum <= 1 || track.scrollLeft >= maximum - 1;
  };
  const move = (direction: number) => {
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: reducedMotion() ? 'instant' : 'smooth' });
  };
  previous.addEventListener('click', () => move(-1), options);
  next.addEventListener('click', () => move(1), options);
  track.addEventListener('scroll', update, { ...options, passive: true });
  root.defaultView!.addEventListener('resize', update, options);
  const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update);
  observer?.observe(track);
  observer?.observe(card);
  update();
  return () => { events.abort(); observer?.disconnect(); };
}