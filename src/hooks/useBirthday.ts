import { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { AudioController, type BirthdayAudio } from '../lib/audio.ts';
import { reducedMotion, observeScenes } from '../lib/motion.ts';
import { readMuted, saveMuted } from '../lib/preferences.ts';
import { bindMemoryCarousel } from '../lib/carousel.ts';
import { useLocalSong } from './useLocalSong.ts';

export const initialCoffee = 'Tap the coffee. I left you a little something.';

export function useBirthday(count: number, suppliedAudio?: BirthdayAudio) {
  const [audio] = useState(() => suppliedAudio ?? new AudioController());
  const [playing, setPlaying] = useState(false);
  const [songLoaded, setSongLoaded] = useState(false);
  const [soundTitle, setSoundTitle] = useState('Original music · tap to play');
  const [doorOpen, setDoorOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [coffeeNote, setCoffeeNote] = useState(initialCoffee);
  const [opened, setOpened] = useState<number[]>([]);
  const [seen, setSeen] = useState<number[]>([]);
  const [candles, setCandles] = useState<number[]>([]);
  const [episode, setEpisode] = useState(0);
  const request = useRef(0);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const later = useCallback((key: string, callback: () => void, delay: number) => {
    clearTimeout(timers.current.get(key));
    timers.current.set(key, setTimeout(() => { timers.current.delete(key); callback(); }, delay));
  }, []);
  const toast = useCallback((text: string) => {
    setMessage(text);
    later('toast', () => setMessage(''), 4800);
  }, [later]);
  const celebrate = () => {
    if (reducedMotion()) return;
    // One bounded burst per activation; canvas-confetti owns its animation cleanup.
    confetti.reset();
    void confetti({ particleCount: 85, spread: 85, startVelocity: 34, ticks: 180,
      origin: { y: .72 }, colors: ['#ae92bd', '#d8b36f', '#ce8c7c', '#8ca49a'],
      disableForReducedMotion: true, zIndex: 40 });
  };
  const navigate = (id: string) => {
    const element = document.getElementById(id)!;
    element.tabIndex = -1;
    element.focus({ preventScroll: true });
    element.scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth', block: 'start' });
  };
  const pauseAlternatives = useCallback(() => {
    request.current++;
    audio.pause(); setPlaying(false); setSongLoaded(false);
  }, [audio]);
  const localTrack = useLocalSong(pauseAlternatives);
  const pauseLocal = localTrack.pause;
  const pause = useCallback(() => { pauseAlternatives(); pauseLocal(); }, [pauseAlternatives, pauseLocal]);
  const play = async () => {
    pauseLocal();
    setSongLoaded(false);
    const current = ++request.current;
    const success = await audio.play();
    if (current !== request.current) return;
    setPlaying(success); saveMuted(!success);
    if (!success) toast('Music is unavailable right now. Every little surprise still works quietly.');
  };
  const enter = (withMusic: boolean) => {
    if (withMusic) void localTrack.play();
    else { pause(); saveMuted(true); }
    setDoorOpen(true);
    later('entry', () => navigate(withMusic ? 'song-player' : 'credits'), reducedMotion() ? 0 : 950);
  };
  const openSong = () => navigate('song-player');
  const loadSong = () => { pause(); saveMuted(true); setSongLoaded(true); };
  const stopMusic = () => { pause(); saveMuted(true); };
  const toggleLocal = () => { if (localTrack.active) pauseLocal(); else void localTrack.play(); };
  const toggleSound = () => {
    if (audio.isPlaying) { pause(); saveMuted(true); }
    else void play();
  };
  const toggleReason = (index: number) => {
    setOpened((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
    setSeen((current) => current.includes(index) ? current : [...current, index]);
  };
  const openAll = () => {
    const all = Array.from({ length: count }, (_, index) => index);
    setOpened(all); setSeen(all);
  };
  const blowCandles = (indices: number[], total: number) => {
    const next = [...new Set([...candles, ...indices])];
    setCandles(next);
    if (next.length === total && candles.length !== total) celebrate();
  };
  const replay = () => {
    timers.current.forEach(clearTimeout); timers.current.clear();
    confetti.reset();
    setOpened([]); setSeen([]); setCandles([]); setDoorOpen(false);
    setCoffeeNote(initialCoffee); setMessage(''); setEpisode((value) => value + 1);
    navigate('home');
  };

  useEffect(() => {
    const pending = timers.current;
    setSoundTitle(readMuted() ? 'Original music · tap to play' : 'Welcome back · tap to resume your music');
    const onVisibility = () => { if (document.hidden) pause(); };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', pause);
    return () => {
      pause(); audio.dispose(); confetti.reset();
      pending.forEach(clearTimeout); pending.clear();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', pause);
    };
  }, [audio, pause]);
  useEffect(() => {
    const stopCarousel = bindMemoryCarousel(document);
    const stopMotion = observeScenes(document);
    return () => { stopCarousel(); stopMotion(); };
  }, [episode]);

  return { playing, soundTitle, songLoaded, localTrack, toggleLocal, openSong, loadSong, stopMusic, doorOpen, setDoorOpen, message, toast, coffeeNote, setCoffeeNote,
    opened, seen, candles, episode, enter, toggleSound, toggleReason, openAll, blowCandles, celebrate, replay };
}

export type Journey = ReturnType<typeof useBirthday>;