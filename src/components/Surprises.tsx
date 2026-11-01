import { useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { coffeeOrders, dateIdeas, promises } from '../content/surprises.ts';
import { Icon, TapHint } from './primitives.tsx';

export function CoffeeOrder({ onOrder }: { onOrder: (note: string) => void }) {
  const [order, setOrder] = useState(0);
  const reduce = useReducedMotion();
  return <div className="coffee-order enhanced-only">
    <p className="interaction-label" id="coffee-order-label">HOW SHALL I MAKE YOUR DAY?</p>
    <TapHint id="coffee-order-hint">Tap a coffee to choose your order ↓</TapHint>
    <div className="order-options" role="group" aria-labelledby="coffee-order-label" aria-describedby="coffee-order-hint">{coffeeOrders.map((coffee, index) =>
      <button key={coffee.name} aria-label={`Order ${coffee.name}`} aria-pressed={order === index} onClick={() => { setOrder(index); onOrder(coffee.note); }}>
        <span aria-hidden="true">{coffee.symbol}</span>{coffee.name}
      </button>)}</div>
    <m.div className="coffee-receipt" key={order} initial={false} animate={{ y: reduce ? 0 : [-8, 0], rotate: reduce ? 0 : [-2, 0] }} transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 160, damping: 18 }}>
      <span>CENTRAL CORNER · ORDER FOR YOU</span><strong>{coffeeOrders[order].name}</strong><p>{coffeeOrders[order].extra}</p><div><span>TOTAL</span><span>one little smile ♡</span></div>
    </m.div>
  </div>;
}

export function DateDeck() {
  const [turn, setTurn] = useState(0);
  const reduce = useReducedMotion();
  // Visit every idea before repeating; no backend or random permissions needed.
  const index = (turn * 5) % dateIdeas.length;
  const idea = dateIdeas[index];
  return <div className="date-deck enhanced-only" aria-labelledby="date-deck-title">
    <div className="date-deck-copy"><p className="eyebrow">BONUS SCENE / TO BE CONTINUED</p><h3 id="date-deck-title">Our next <em>little episode.</em></h3><p>Not a plan you have to keep.<br />Just a few ways I’d love to spend time with you.</p>
      <button id="shuffle-date" className="button primary" onClick={() => setTurn((value) => value + 1)}><span className="button-copy">Shuffle our date night<TapHint>Tap here for another idea</TapHint></span><Icon name="replay" /></button>
      <p className="small-text" role="status">Idea {index + 1} of {dateIdeas.length}: {idea.title}</p>
    </div>
    <div className="date-stack"><span className="stack-back back-one" /><span className="stack-back back-two" />
      <AnimatePresence initial={false} mode="popLayout">
        <m.article key={turn} className="date-card" aria-label={`Date idea: ${idea.title}`}
          initial={reduce ? false : { rotate: -9, y: 28, opacity: 0, scale: .94 }} animate={{ rotate: 0, y: 0, opacity: 1, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { rotate: 12, x: 30, opacity: 0, scale: .92 }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 22 }}>
          <span className="date-card-icon" aria-hidden="true">{idea.icon}</span><span className="interaction-label">A FUTURE MEMORY · {String(index + 1).padStart(2, '0')}</span><h4>{idea.title}</h4><p>{idea.detail}</p><span className="handwritten">with you? always.</span>
        </m.article>
      </AnimatePresence>
    </div>
  </div>;
}

export function Constellation() {
  const [connected, setConnected] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const complete = connected.length === promises.length;
  return <div className="constellation enhanced-only" aria-labelledby="constellation-title">
    <p className="eyebrow">A LITTLE UNIVERSE, JUST FOR US</p><h3 id="constellation-title">Some things I’ll <em>keep choosing.</em></h3><p>There’s a promise in every star.<br />Connect them in your own time.</p><TapHint id="star-tap-hint">Tap each glowing star to read a promise ↓</TapHint>
    <div className="star-board">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="constellation-lines">{promises.slice(1).map((star, index) => {
        const from = promises[index];
        const active = connected.includes(index) && connected.includes(index + 1);
        return <m.path key={star.title} d={`M${from.x} ${from.y}L${star.x} ${star.y}`} initial={false} animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }} transition={{ duration: reduce ? 0 : .7 }} />;
      })}</svg>
      {promises.map((star, index) => <button key={star.title} className={`promise-star${connected.includes(index) ? ' connected' : ''}`} style={{ left: `${star.x}%`, top: `${star.y}%` }}
        aria-label={`Connect star ${index + 1}: ${star.title}`} aria-describedby="star-tap-hint" aria-pressed={connected.includes(index)} onClick={() => { setSelected(index); setConnected((current) => current.includes(index) ? current : [...current, index]); }}>
        <m.span aria-hidden="true" initial={false} animate={{ rotate: !reduce && connected.includes(index) ? 90 : 0, scale: !reduce && connected.includes(index) ? 1.18 : 1 }} transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 130, damping: 12 }}>✦</m.span>
      </button>)}
      <span className="star-board-caption handwritten">{complete ? 'my favourite constellation is us.' : 'five stars. a whole lot of love.'}</span>
    </div>
    <div className="promise-message" role="status"><m.div key={selected} initial={false} animate={{ opacity: reduce ? 1 : [.4, 1], y: reduce ? 0 : [6, 0] }} transition={{ duration: reduce ? 0 : .3 }}>
      {selected === null ? <p>No grand script. Just the things that matter.</p> : <><strong>{promises[selected].title}</strong><p>{promises[selected].text}</p></>}
    </m.div></div>
    <div className="constellation-footer"><span id="constellation-status" role="status">{connected.length} of {promises.length} stars connected{complete ? ' · Our little universe is complete ♡' : ''}</span><button id="reset-stars" className="text-button" onClick={() => { setConnected([]); setSelected(null); }}><span>Trace it again<TapHint>Tap here to reset the stars</TapHint></span><Icon name="replay" /></button></div>
  </div>;
}