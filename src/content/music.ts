// User-provided MP3; the filename does not independently establish its recording/version.
export const localSong = {
  title: 'Love Story',
  artist: 'Taylor Swift',
  src: 'audio/taylor-swift-love-story.mp3',
};

// Verified official Taylor's Version single, kept as an optional streaming alternative.
const spotifyTrack = '3CeCwYWvdfXbZLXFhBrbnf';

export const birthdaySong = {
  title: 'Love Story (Taylor’s Version)',
  artist: 'Taylor Swift',
  url: `https://open.spotify.com/track/${spotifyTrack}`,
  embedUrl: `https://open.spotify.com/embed/track/${spotifyTrack}?theme=0`,
};