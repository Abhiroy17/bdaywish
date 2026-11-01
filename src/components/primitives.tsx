import type { ReactNode } from 'react';
import { m, useReducedMotion } from 'motion/react';
import { icon, memoryArt, sofa } from '../art.ts';

export function Icon({ name }: { name: Parameters<typeof icon>[0] }) {
  return <span className="art-inline" dangerouslySetInnerHTML={{ __html: icon(name) }} />;
}
export function Dots() {
  return <span className="friend-dots" aria-hidden="true"><i /><i /><i /></span>;
}
export function TapHint({ children, id, className = '' }: { children: ReactNode; id?: string; className?: string }) {
  return <span id={id} className={`tap-hint ${className}`}>{children}</span>;
}
export function Artwork({ index }: { index?: number }) {
  // Only locally authored SVG enters this boundary, never editable content.
  return <span className="art-inline" dangerouslySetInnerHTML={{ __html: index === undefined ? sofa() : memoryArt(index) }} />;
}
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return <m.div className={className} initial={false}
    whileInView={reduce ? undefined : { y: [18, 0], opacity: [.65, 1] }}
    viewport={{ once: true, amount: .15 }} transition={{ duration: .65, ease: [.22, 1, .36, 1] }}>
    {children}
  </m.div>;
}
export function Room({ open }: { open: boolean }) {
  const reduce = useReducedMotion();
  return <div className={`room${open ? ' is-open' : ''}`} role="img" aria-label="An original illustration of a purple apartment door and a warm orange sofa">
    <div className="room-glow" /><div className="room-arch" />
    <div className="wall-art"><span>you are<br />my happy<br /><em>place.</em></span></div>
    <div className="door-surround"><m.div className="door" initial={false} animate={{ rotateY: open ? -68 : 0 }} transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 65, damping: 16 }}>
      <span className="door-number">20</span><span className="peephole"><i /></span><span className="door-panel" /><span className="door-handle" />
    </m.div></div>
    <div className="plant"><i /><i /><i /><i /><i /><span /></div>
    <div className="room-rug" /><Artwork /><div className="room-note">the best seat is next to you ♡</div>
  </div>;
}