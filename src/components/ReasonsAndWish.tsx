import { m, useReducedMotion } from 'motion/react';
import type { BirthdayContent } from '../content/birthday.ts';
import type { Journey } from '../hooks/useBirthday.ts';
import { Icon, Reveal } from './primitives.tsx';

export function ReasonsAndWish({ content, journey }: { content: BirthdayContent; journey: Journey }) {
  const reduce = useReducedMotion();
  const digits = String(content.age).split('');
  const wished = journey.candles.length === digits.length;
  return <>
    <section id="reasons" className="reasons-section scene section-pad" aria-labelledby="reasons-title"><div className="wrap reasons-wrap">
      <Reveal><p className="eyebrow">03 / IN CASE YOU EVER FORGET</p><h2 id="reasons-title">{content.age} years of you.<br /><em>{content.age} reasons I’m lucky.</em></h2><p>A tiny love note behind every heart.<br />Open one. Open them all. They’re all yours.</p></Reveal>
      <div className="trait-gallery" key={journey.episode} aria-label="The little things that feel like you">
        {content.personality.traits.map((trait) => <details className="trait-note" key={trait.title}><summary><Icon name="star" />{trait.title}<span aria-hidden="true">+</span></summary><p>{trait.note}</p></details>)}
      </div><p className="trait-caption">A little starlight, a little moonlight. But mostly, wonderfully, you.</p>
      <div className="reason-grid">{content.reasons.map((reason, index) => <m.details key={index} layout={!reduce && journey.opened.length < 5} initial={false}
        className={`reason${journey.seen.includes(index) ? ' seen' : ''}`} open={journey.opened.includes(index)} transition={{ type: 'spring', stiffness: 240, damping: 28 }}>
        <summary aria-label={`Reason ${index + 1}`} onClick={(event) => { event.preventDefault(); journey.toggleReason(index); }}><span className="reason-heart"><Icon name="heart" /></span><span>{String(index + 1).padStart(2, '0')}</span></summary>
        <p><span>REASON {String(index + 1).padStart(2, '0')}</span>{reason}</p>
      </m.details>)}</div>
      <div className="reason-footer"><span id="reason-progress" role="status">{journey.seen.length} of {content.age} little love notes opened</span><button className="text-button" id="read-reasons" onClick={journey.openAll}>Open every little note <Icon name="arrow" /></button></div>
    </div></section>
    <section id="wish" className="wish-section scene section-pad" aria-labelledby="wish-title"><div className="wrap wish-wrap">
      <Reveal><p className="eyebrow">04 / THIS PART IS ALL YOURS</p><h2 id="wish-title">Close your eyes.<br />Make a <em>little wish.</em></h2><p>Something big. Something small.<br />Something you haven’t told anyone at all.</p></Reveal>
      <div className="cake-scene"><span className="cake-sparkle">✧</span><span className="cake-sparkle second">✦</span><div className="cake"><div className="candles">{digits.map((digit, index) =>
        <button key={index} className="candle" aria-label={`Blow out candle ${index + 1}`} aria-pressed={journey.candles.includes(index)} onClick={() => journey.blowCandles([index], digits.length)}><span className="flame" /><span className="candle-number">{digit}</span></button>)}</div>
        <div className="cake-top" /><div className="cake-body"><span className="icing" /><span className="cake-message handwritten">oh, how loved you are</span><span className="cake-berries">●&#12288;●&#12288;●&#12288;●&#12288;●</span></div><div className="cake-plate" /><div className="cake-stand" />
      </div></div>
      <button className="button primary" id="make-wish" disabled={wished} onClick={() => journey.blowCandles(digits.map((_, index) => index), digits.length)}>{wished ? 'A wish, just for you ♡' : <>Make a wish <Icon name="star" /></>}</button>
      <p className="wish-status" id="wish-status" role="status">{wished ? 'Your wish is with the universe now. I’m here, cheering for it. ♡' : 'Tap the candles or make your wish. No peeking.'}</p>
    </div></section>
  </>;
}