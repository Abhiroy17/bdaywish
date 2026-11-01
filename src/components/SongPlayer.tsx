import type { Journey } from '../hooks/useBirthday.ts';
import { birthdaySong, localSong } from '../content/music.ts';
import { Icon } from './primitives.tsx';

export function SongPlayer({ journey, base }: { journey: Journey; base: string }) {
  const track = journey.localTrack;
  const statusText = {
    idle: 'A little soundtrack for your birthday. Tap play whenever you’re ready.',
    loading: 'Getting your song ready… You can pause at any time.',
    playing: 'Now playing your birthday song. Stay here a little longer. ♡',
    paused: 'Paused. Your place in the song is waiting for you.',
    error: 'The MP3 couldn’t play. Try again, or choose Spotify below. Every birthday note still works quietly.',
  }[track.status];
  return <div className="song-player" id="song-player" role="region" aria-labelledby="song-title">
    <div className="song-heading"><span className="song-disc" aria-hidden="true">♡</span><div>
      <span className="record-caption">THE SONG FOR THIS LITTLE LOVE STORY</span>
      <h3 id="song-title">{localSong.title}</h3><p>{localSong.artist} · our birthday soundtrack</p>
    </div></div>
    <p className="song-dedication handwritten">For the dreamer, the gentle heart, and all our unwritten chapters.</p>
    <div className={`local-song-player${track.active ? ' is-playing' : ''}`}>
      <button id="play-local-song" className="button primary enhanced-only" aria-pressed={track.active} aria-controls="local-song" onClick={journey.toggleLocal}>
        {track.active ? 'Pause Love Story' : 'Play Love Story'} <Icon name="music" />
      </button>
      <audio id="local-song" ref={track.ref} src={base + localSong.src} controls preload="none" aria-label="Love Story audio controls" {...track.events} />
      <p id="local-song-status" className="small-text enhanced-only" role="status">{statusText}</p>
    </div>
    <h4 className="streaming-alternative">Or listen to {birthdaySong.title} on Spotify</h4>
    <p className="song-privacy" id="song-privacy">Loading the player connects to Spotify, which may use cookies. Nothing loads until you choose it. Spotify may offer a preview; full playback depends on your account, region, and browser.</p>
    <div className="song-actions"><button id="load-song" className="button primary enhanced-only" disabled={journey.songLoaded} aria-describedby="song-privacy" onClick={journey.loadSong}>{journey.songLoaded ? 'Spotify player loaded' : 'Load Spotify player'} <Icon name="music" /></button>
      <a className="text-button" href={birthdaySong.url} target="_blank" rel="noopener noreferrer">Open in Spotify <Icon name="arrow" /><span className="sr-only"> (opens a new tab)</span></a>
    </div>
    {journey.songLoaded && <div className="spotify-frame">
      <iframe src={birthdaySong.embedUrl} title={`${birthdaySong.title} by ${birthdaySong.artist} — Spotify player`} width="100%" height="152" allow="encrypted-media; autoplay" referrerPolicy="no-referrer" />
      <p className="small-text">Press play inside Spotify. If it is blocked or only plays a preview, use “Open in Spotify” above. There is no forced autoplay.</p>
    </div>}
    <div className="enhanced-only music-options">
      <button id="stop-music" className="text-button" onClick={journey.stopMusic}>Stop music & close player</button>
      <div className={`record-player${journey.playing ? ' is-playing' : ''}`}><span className="vinyl" aria-hidden="true"><span>♡</span></span><div>
        <span className="record-caption">OPTIONAL LOCAL INSTRUMENTAL · NOT TAYLOR’S SONG</span><strong>A Little More of Us</strong>
        <button id="instrumental-toggle" className="text-button" aria-pressed={journey.playing} title={journey.soundTitle} onClick={journey.toggleSound}>{journey.playing ? 'Pause original instrumental' : 'Play original instrumental instead'} <Icon name="music" /></button>
      </div></div>
    </div>
  </div>;
}