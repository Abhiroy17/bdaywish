import type { BirthdayContent } from '../content/birthday.ts';
import type { Journey } from '../hooks/useBirthday.ts';
import { Dots, Icon, Reveal, Room } from './primitives.tsx';
import { SongPlayer } from './SongPlayer.tsx';

export function Opening({ content: { name, sender, age }, journey, base }: { content: BirthdayContent; journey: Journey; base: string }) {
  const chapters = [['home', 'The beginning'], ['credits', 'Starring you'], ['coffee', 'Our little corner'], ['memories', 'Little moments'], ['reasons', `${age} reasons`], ['wish', 'Make a wish'], ['letter', 'Love, always']];
  return <>
    <section id="home" className="hero wrap scene" aria-labelledby="hero-title">
      <Reveal className="hero-copy"><p className="eyebrow"><span className="small-line" /> THE BIRTHDAY SPECIAL</p>
        <h1 id="hero-title">The one where<br /><em>{name}</em><br />turns <span className="age">{age}<svg viewBox="0 0 150 18" aria-hidden="true"><path d="M4 12Q73 0 146 7M14 17Q88 6 133 13" /></svg></span><span className="title-period">.</span></h1>
        <p className="hero-description">A little bit of our favourite show.<br />A whole lot of my favourite person.</p>
        <div className="hero-actions"><button className="button primary" id="enter-music" onClick={() => journey.enter(true)}>Come on in <Icon name="arrow" /></button><button className="quiet-button" id="enter-quiet" onClick={() => journey.enter(false)}>or enter quietly</button></div>
        <p className="sound-hint"><Icon name="music" /> Come on in plays Love Story. Quiet is lovely, too.</p>
        <div className="hero-signoff"><span className="handwritten">Made just for you,</span><span className="byline">with love, {sender} <Icon name="heart" /></span></div>
      </Reveal>
      <div className="hero-visual"><span className="scene-tag">SEASON {age} <span>·</span> EPISODE 01</span><span className="doodle-star star-one">✧</span><span className="doodle-star star-two">✧</span><Room open={journey.doorOpen} />
        <button className="door-knock" aria-label="Knock on the purple door" title="Knock, knock" onClick={() => { journey.setDoorOpen(!journey.doorOpen); journey.toast('The door is always open for my favourite person. ♡'); }}>knock, knock <Icon name="heart" /></button>
        <div className="birthday-stamp"><span>HAPPY</span><strong>{age}</strong><span>MY LOVE</span></div>
      </div>
      <a className="scroll-cue" href="#credits"><span>Your birthday episode starts here</span><span aria-hidden="true">↓</span></a>
    </section>
    <section id="credits" className="credits scene" aria-labelledby="credits-title"><div className="wrap">
      <nav className="episode-nav" aria-label="Episode chapters">{chapters.map(([id, label], index) => <a key={id} href={`#${id}`}><span>0{index + 1}</span>{label}</a>)}</nav>
      <Reveal className="credits-body"><p className="eyebrow">NO SKIPPABLE MOMENTS. JUST YOU.</p><h2 id="credits-title">My favourite person.<br />In every <em>season.</em></h2>
        <button id="credits-sparkle" className="cast-name" aria-label={`Celebrate ${name}, the star of this episode`} onClick={() => { journey.celebrate(); journey.toast('Best leading lady. Every season. Every single time. ♡'); }}>{name}<Dots /></button>
        <p>Starring you. Loved by me. Renewed for all the seasons to come.</p><span className="handwritten">Could you BE any more loved?</span>
      </Reveal>
      <SongPlayer journey={journey} base={base} />
    </div></section>
  </>;
}