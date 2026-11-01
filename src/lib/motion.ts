export function reducedMotion(): boolean {
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function observeScenes(root: Document): () => void {
  if (!('IntersectionObserver' in globalThis)) return () => undefined;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
      if (entry.isIntersecting) {
        root.querySelectorAll('.episode-nav a').forEach((link) => {
          if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { threshold: .08 });
  root.querySelectorAll('.scene').forEach((scene) => observer.observe(scene));
  return () => observer.disconnect();
}