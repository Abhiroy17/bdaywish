import { useCallback, useEffect, useRef, useState } from 'react';

type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export function useLocalSong(onActivate: () => void) {
  const ref = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const request = useRef(0);
  const wanted = useRef(false);

  const markPaused = useCallback(() => {
    request.current++; wanted.current = false;
    setStatus((current) => current === 'error' ? 'error' : 'paused');
  }, []);
  const pause = useCallback(() => {
    markPaused();
    const media = ref.current;
    // Pausing untouched media can start resource selection in WebKit despite preload="none".
    if (media && !media.paused) media.pause();
  }, [markPaused]);
  const play = useCallback(async () => {
    const media = ref.current;
    if (!media) return false;
    onActivate();
    const current = ++request.current;
    wanted.current = true; setStatus('loading');
    try {
      if (media.error) media.load();
      // Call play in the tap handler, before yielding, to retain mobile activation.
      await media.play();
      if (current !== request.current) {
        if (!wanted.current) media.pause();
        return false;
      }
      setStatus('playing'); return true;
    } catch {
      if (current === request.current) { wanted.current = false; setStatus('error'); }
      return false;
    }
  }, [onActivate]);

  useEffect(() => {
    const media = ref.current;
    return () => {
      pause();
      if (media) { media.pause(); media.removeAttribute('src'); media.load(); }
    };
  }, [pause]);

  const events = {
    onPlay: () => { onActivate(); wanted.current = true; setStatus('loading'); },
    onPlaying: () => { if (wanted.current) setStatus('playing'); },
    onPause: markPaused,
    onEnded: () => { request.current++; wanted.current = false; setStatus('idle'); },
    onError: () => { request.current++; wanted.current = false; setStatus('error'); },
    onWaiting: () => { if (wanted.current) setStatus('loading'); },
  };
  return { ref, status, play, pause, events, active: status === 'playing' || status === 'loading' };
}