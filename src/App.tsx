import { domMax, LazyMotion, MotionConfig } from 'motion/react';
import type { BirthdayContent } from './content/birthday.ts';
import type { BirthdayAudio } from './lib/audio.ts';
import { useBirthday } from './hooks/useBirthday.ts';
import { Opening } from './components/Opening.tsx';
import { CoffeeAndMemories } from './components/CoffeeAndMemories.tsx';
import { ReasonsAndWish } from './components/ReasonsAndWish.tsx';
import { Letter } from './components/Letter.tsx';
import { Dots, Icon } from './components/primitives.tsx';
import { localSong } from './content/music.ts';

export function App({ content, base = './', audio }: { content: BirthdayContent; base?: string; audio?: BirthdayAudio }) {
  const journey = useBirthday(content.reasons.length, audio);
  const musicActive = journey.songLoaded || journey.playing || journey.localTrack.active;
  const date = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' })
    .format(new Date(`${content.date}T12:00:00Z`));
  return <LazyMotion features={domMax} strict><MotionConfig reducedMotion="user">
    <a className="skip-link" href="#letter">Skip to your birthday letter</a>
    <header className="site-header wrap">
      <a className="brand" href="#home" aria-label="Birthday episode home"><Dots /><span>a little love, a lot of us.</span></a>
      <div className="header-right"><span className="header-date">{date} <span>·</span> a day for you</span>
        <button className="sound-button" type="button" title={`${localSong.title} · music controls`} aria-controls="song-player"
          aria-label={musicActive ? 'Stop music' : 'Open music player'} onClick={musicActive ? journey.stopMusic : journey.openSong}>
          <Icon name="music" /><span>{musicActive ? 'Stop music' : 'Our song'}</span>
        </button>
      </div>
    </header>
    <main>
      <Opening content={content} journey={journey} base={base} />
      <CoffeeAndMemories key={`memories-${journey.episode}`} content={content} base={base} journey={journey} />
      <ReasonsAndWish content={content} journey={journey} />
      <Letter key={`letter-${journey.episode}`} content={content} date={date} replay={journey.replay} />
    </main>
    <footer className="site-footer wrap"><span>Made with <Icon name="heart" /> by {content.sender}, just for you.</span><span>THE ONE WE KEEP FOREVER <Dots /></span></footer>
    <div id="toast" className={`toast${journey.message ? ' visible' : ''}`} role="status">{journey.message}</div>
    <noscript><style>{`.hero-actions,.sound-button,.door-knock,.coffee-mug,.lobster-button,.memory-controls,.reason-footer,.candles,.wish-status,#make-wish,#replay,.enhanced-only{display:none!important}.letter-envelope>article{display:block!important}.letter-envelope>summary{display:none}.cast-name{pointer-events:none}`}</style>
      <p className="noscript-note">Happy birthday, {content.name}. Your letter and every love note are here even without JavaScript. Tap the memory cards and hearts to read them.</p>
    </noscript>
  </MotionConfig></LazyMotion>;
}