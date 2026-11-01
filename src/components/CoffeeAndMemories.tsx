import { useState } from 'react';
import { m, useReducedMotion } from 'motion/react';
import type { BirthdayContent, Memory } from '../content/birthday.ts';
import type { Journey } from '../hooks/useBirthday.ts';
import { Artwork, Icon, Reveal, TapHint } from './primitives.tsx';
import { CoffeeOrder, DateDeck } from './Surprises.tsx';

function MemoryCard({ memory, index, base }: { memory: Memory; index: number; base: string }) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduce = useReducedMotion();
  return <details className="memory" open={open}>
    <summary aria-label={`Reveal note: ${memory.title}`} onClick={(event) => { event.preventDefault(); setOpen(!open); }}>
      <span className={`memory-photo photo-${index % 4}`}>
        {memory.src && !failed ? <img src={base + memory.src.replace(/^\/+/, '')} alt={memory.alt} loading="lazy" width="480" height="640" onError={() => setFailed(true)} /> : <Artwork index={index} />}
        {(!memory.src || failed) && <span className="photo-placeholder">{failed ? 'A moment to imagine — photo unavailable' : 'a little space for our photo'}</span>}
      </span><span className="memory-title handwritten">{memory.title}</span><span className="memory-tap"><Icon name="heart" /> Tap here to read our note</span>
    </summary>
    <m.p initial={false} animate={{ opacity: reduce || !open ? 1 : [.6, 1], y: reduce || !open ? 0 : [8, 0] }} transition={{ duration: reduce ? 0 : .3 }}>{memory.caption}</m.p>
  </details>;
}

export function CoffeeAndMemories({ content, base, journey }: { content: BirthdayContent; base: string; journey: Journey }) {
  return <>
    <section id="coffee" className="coffee-section scene section-pad" aria-labelledby="coffee-title"><div className="wrap two-column">
      <Reveal className="coffee-art"><div className="coffee-drawing"><div className="cafe-sign"><span>OUR OWN LITTLE</span><strong>Central <em>♥</em> Corner</strong><span>GOOD COFFEE. BETTER COMPANY.</span></div><Artwork />
        <button id="coffee-mug" className="coffee-mug" aria-label="Pick up your coffee and reveal a love note" aria-describedby="coffee-tap-hint" onClick={() => journey.setCoffeeNote('One comfy seat, forever reserved for you. And one heart, too. ♡')}><span className="steam steam-one">♡</span><span className="steam steam-two">♡</span><span className="cup"><span>you + me</span></span><span className="saucer" /></button><TapHint id="coffee-tap-hint" className="coffee-art-caption enhanced-only">Tap the cup for a love note ↑</TapHint>
        </div><CoffeeOrder onOrder={journey.setCoffeeNote} />
      </Reveal>
      <Reveal className="section-copy"><p className="eyebrow">01 / A PLACE THAT FEELS LIKE US</p><h2 id="coffee-title">You, me &<br />the <em>comfy seat.</em></h2><p>Some people feel like a grand adventure.<br />You feel like that, and coming home.</p><p>So take the good seat. Stay a little longer.<br />Today, the whole place is reserved for you.</p><div className="coffee-note" id="coffee-note" role="status">{journey.coffeeNote}</div><button className="lobster-button" id="lobster" onClick={() => journey.toast('My best friend, my favourite person, my very best plot twist. ♡')}>A tiny secret for you <span aria-hidden="true">♧</span><TapHint>Tap here to reveal it</TapHint></button></Reveal>
    </div></section>
    <section id="memories" className="memories-section scene section-pad" aria-labelledby="memories-title"><div className="wrap">
      <Reveal className="section-heading"><div><p className="eyebrow">02 / THE LITTLE THINGS ARE THE BIG THINGS</p><h2 id="memories-title">A few frames of <em>us.</em></h2></div><p>Not every beautiful moment needs a camera.<br />But I’d keep every one with you.</p></Reveal>
      <div className="memory-track" aria-label="Memory cards">{content.memories.map((memory, index) => <MemoryCard key={index} memory={memory} index={index} base={base} />)}</div>
      <div className="memory-controls"><p className="small-text">Our little scrapbook. Swipe or tap the arrows for more.</p><div><button className="round-button" id="memory-prev" aria-label="Previous memory">←</button><button className="round-button" id="memory-next" aria-label="Next memory">→</button></div></div>
      <DateDeck />
    </div></section>
  </>;
}