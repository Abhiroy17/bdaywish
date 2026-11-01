import { useEffect, useState } from 'react';
import { m, useReducedMotion } from 'motion/react';
import type { BirthdayContent } from '../content/birthday.ts';
import { Dots, Icon, Reveal, TapHint } from './primitives.tsx';
import { Constellation } from './Surprises.tsx';

export function Letter({ content, date, replay }: { content: BirthdayContent; date: string; replay: () => void }) {
  // The server and first client render agree; only enhancement closes the letter.
  const [open, setOpen] = useState(true);
  const reduce = useReducedMotion();
  useEffect(() => setOpen(false), []);
  return <section id="letter" className="letter-section scene section-pad" aria-labelledby="letter-title"><div className="wrap letter-wrap">
    <Reveal><p className="eyebrow">05 / THE ONE FROM MY HEART</p><h2 id="letter-title">And one last thing,<br /><em>my love.</em></h2><p>Not a script. Not a famous line.<br />Just a few words, from me to you.</p></Reveal>
    <details className="letter-envelope" open={open}><summary onClick={(event) => { event.preventDefault(); setOpen(!open); }}>
      <span className="envelope-art"><span className="envelope-to handwritten">For {content.name}</span><span className="wax-seal"><Icon name="heart" /></span><span className="envelope-from">WITH ALL MY LOVE</span></span><span className="open-letter-label">{open ? 'Tap here to close your letter' : 'Tap here to open your letter'} <Icon name="arrow" /></span>
    </summary><m.article className="letter-paper" initial={false} animate={{ y: open ? 0 : 12 }} transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 90, damping: 18 }}>
      <span className="letter-date">{date} · YOUR {content.age}TH CHAPTER</span><h3 className="handwritten">My dearest {content.name},</h3>
      {content.letter.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      <div className="letter-signature"><span>Always in your corner,</span><strong className="handwritten">{content.sender} ♡</strong></div>
    </m.article></details>
    <Constellation />
    <div className="final-wish"><Dots /><h3>Happy birthday, {content.name}.</h3><p>You’re my favourite episode.<br />And I never want the credits to roll.</p><span className="handwritten">Here’s to a beautiful season {content.age}.</span><button className="text-button" id="replay" onClick={replay}><Icon name="replay" /><span>Let’s do that again<TapHint>Tap here to start the surprises again</TapHint></span></button></div>
  </div></section>;
}