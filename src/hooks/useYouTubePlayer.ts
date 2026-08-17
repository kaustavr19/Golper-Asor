import { useCallback, useEffect, useRef, useState } from "react";
import type { Episode } from "../episodes";
import { parseEpisodeTitle } from "../utils/titleParser";

let apiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
  return apiPromise;
}

async function fetchTitle(videoId: string): Promise<string | null> {
  try {
    const url = `https://noembed.com/embed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return typeof data.title === "string" ? data.title : null;
  } catch {
    return null;
  }
}

export interface PlayerState {
  ready: boolean;
  episodes: Episode[];
  currentIndex: number;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  shuffle: boolean;
}

export function useYouTubePlayer(containerId: string, playlistId: string) {
  const playerRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);
  const shuffleRef = useRef(false);
  const episodesRef = useRef<Episode[]>([]);
  const currentIndexRef = useRef(0);
  const catalogueTokenRef = useRef(0);

  const [state, setState] = useState<PlayerState>({
    ready: false,
    episodes: [],
    currentIndex: 0,
    isPlaying: false,
    isBuffering: false,
    currentTime: 0,
    duration: 0,
    volume: 80,
    muted: false,
    shuffle: false,
  });

  const patch = (next: Partial<PlayerState>) => setState((current) => ({ ...current, ...next }));

  const stopTicking = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const tick = useCallback(() => {
    const player = playerRef.current;
    if (player?.getCurrentTime) {
      patch({ currentTime: player.getCurrentTime() || 0, duration: player.getDuration() || 0 });
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const startTicking = () => {
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
  };

  const hydratePlaylist = (token: number, attempt = 0) => {
    const ids: string[] | undefined = playerRef.current?.getPlaylist?.();
    if ((!ids || !ids.length) && attempt < 15) {
      window.setTimeout(() => hydratePlaylist(token, attempt + 1), 300);
      return;
    }
    if (!ids?.length || token !== catalogueTokenRef.current) return;

    const initial = ids.map((id) => ({ id, titleEn: "Loading title…" }));
    episodesRef.current = initial;
    patch({ episodes: initial });

    ids.forEach((id, index) => {
      fetchTitle(id).then((title) => {
        if (!title || token !== catalogueTokenRef.current) return;
        const current = episodesRef.current;
        if (!current[index] || current[index].id !== id) return;
        const next = [...current];
        next[index] = { ...next[index], ...parseEpisodeTitle(title) };
        episodesRef.current = next;
        patch({ episodes: next });
      });
    });
  };

  const syncIndexFromPlayer = () => {
    const index = playerRef.current?.getPlaylistIndex?.();
    if (typeof index === "number" && index >= 0 && index !== currentIndexRef.current) {
      currentIndexRef.current = index;
      patch({ currentIndex: index, currentTime: 0 });
    }
  };

  const applyDuration = () => {
    const duration = playerRef.current?.getDuration?.() || 0;
    const index = currentIndexRef.current;
    const current = episodesRef.current;
    if (!duration || !current[index] || current[index].duration) return;
    const mins = Math.floor(duration / 60);
    const secs = Math.floor(duration % 60).toString().padStart(2, "0");
    const next = [...current];
    next[index] = { ...next[index], duration: `${mins}:${secs}` };
    episodesRef.current = next;
    patch({ episodes: next, duration });
  };

  useEffect(() => {
    let cancelled = false;
    const token = ++catalogueTokenRef.current;
    currentIndexRef.current = 0;
    episodesRef.current = [];
    stopTicking();
    patch({ ready: false, episodes: [], currentIndex: 0, currentTime: 0, duration: 0, isPlaying: false, isBuffering: true });

    loadYouTubeApi().then(() => {
      if (cancelled) return;
      const mount = document.getElementById(`${containerId}-mount`);
      if (!mount) return;
      const slot = document.createElement("div");
      slot.id = containerId;
      mount.replaceChildren(slot);
      playerRef.current = new window.YT.Player(containerId, {
        height: "1",
        width: "1",
        playerVars: { controls: 0, disablekb: 1, modestbranding: 1, rel: 0, playsinline: 1, listType: "playlist", list: playlistId },
        events: {
          onReady: () => {
            playerRef.current.setVolume(80);
            patch({ ready: true, isBuffering: false });
            hydratePlaylist(token);
          },
          onStateChange: (event: any) => {
            const YTState = window.YT.PlayerState;
            const playing = event.data === YTState.PLAYING;
            const buffering = event.data === YTState.BUFFERING;
            patch({ isPlaying: playing, isBuffering: buffering });
            if (playing || event.data === YTState.CUED) applyDuration();
            if (playing) {
              startTicking();
              syncIndexFromPlayer();
            } else if (!buffering) stopTicking();
            if (event.data === YTState.ENDED) syncIndexFromPlayer();
          },
        },
      });
    });

    return () => {
      cancelled = true;
      catalogueTokenRef.current += 1;
      stopTicking();
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId, playlistId]);

  const playIndex = (index: number, autoStart = true) => {
    const list = episodesRef.current;
    if (!list.length) return;
    const nextIndex = ((index % list.length) + list.length) % list.length;
    currentIndexRef.current = nextIndex;
    patch({ currentIndex: nextIndex, currentTime: 0 });
    if (autoStart) playerRef.current?.playVideoAt?.(nextIndex);
    else {
      playerRef.current?.playVideoAt?.(nextIndex);
      playerRef.current?.pauseVideo?.();
    }
  };

  const play = () => playerRef.current?.playVideo?.();
  const pause = () => playerRef.current?.pauseVideo?.();
  const toggle = () => state.isPlaying ? pause() : play();

  const next = () => {
    if (!episodesRef.current.length) return;
    if (!shuffleRef.current) {
      playerRef.current?.nextVideo?.();
      window.setTimeout(syncIndexFromPlayer, 200);
      return;
    }
    playIndex(Math.floor(Math.random() * episodesRef.current.length), true);
  };

  const prev = () => {
    if (!episodesRef.current.length) return;
    if (!shuffleRef.current) {
      playerRef.current?.previousVideo?.();
      window.setTimeout(syncIndexFromPlayer, 200);
      return;
    }
    playIndex(Math.floor(Math.random() * episodesRef.current.length), true);
  };

  const seekTo = (seconds: number) => {
    playerRef.current?.seekTo?.(seconds, true);
    patch({ currentTime: seconds });
  };

  const seekRelative = (delta: number) => {
    const player = playerRef.current;
    if (!player) return;
    seekTo(Math.max(0, Math.min(player.getDuration?.() || 0, (player.getCurrentTime?.() || 0) + delta)));
  };

  const setVolume = (value: number) => {
    const volume = Math.max(0, Math.min(100, value));
    playerRef.current?.setVolume?.(volume);
    if (volume > 0 && state.muted) playerRef.current?.unMute?.();
    patch({ volume, muted: volume > 0 ? false : state.muted });
  };

  const toggleMute = () => {
    if (state.muted) playerRef.current?.unMute?.();
    else playerRef.current?.mute?.();
    patch({ muted: !state.muted });
  };

  const toggleShuffle = () => {
    shuffleRef.current = !shuffleRef.current;
    patch({ shuffle: shuffleRef.current });
  };

  return { state, play, pause, toggle, next, prev, seekTo, seekRelative, setVolume, toggleMute, toggleShuffle, playIndex };
}
