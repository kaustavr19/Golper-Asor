import { useCallback, useEffect, useRef, useState } from "react";
import type { Episode, EpisodeSource, QueueEpisode } from "../episodes";
import { parseEpisodeTitle, type TitleContext } from "../utils/titleParser";

const QUEUE_STORAGE_KEY = "golper-asor-listening-queue-v1";
let apiPromise: Promise<void> | null = null;
let auxiliaryPlayerId = 0;

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

function readSavedQueue(): { queue: QueueEpisode[]; queueIndex: number } {
  try {
    const saved = JSON.parse(localStorage.getItem(QUEUE_STORAGE_KEY) ?? "null");
    if (!saved || !Array.isArray(saved.queue)) return { queue: [], queueIndex: 0 };
    const queue = saved.queue.filter((item: QueueEpisode) => item?.id && item?.source?.playlistId);
    const queueIndex = Math.max(0, Math.min(Number(saved.queueIndex) || 0, Math.max(0, queue.length - 1)));
    return { queue, queueIndex };
  } catch {
    return { queue: [], queueIndex: 0 };
  }
}

const shuffleItems = <T,>(items: T[]) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [next[index], next[target]] = [next[target], next[index]];
  }
  return next;
};

export interface PlayerState {
  ready: boolean;
  episodes: Episode[];
  queue: QueueEpisode[];
  queueIndex: number;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  shuffle: boolean;
  hasPlaybackStarted: boolean;
  isQueueBuilding: boolean;
}

export interface PlaylistQueueInput {
  playlistId: string;
  titleContext: TitleContext;
  source: EpisodeSource;
}

export function useYouTubePlayer(
  containerId: string,
  playlistId: string,
  titleContext: TitleContext = {},
  episodeSource: EpisodeSource,
) {
  const savedQueueRef = useRef(readSavedQueue());
  const playbackPlayerRef = useRef<any>(null);
  const cataloguePlayerRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);
  const episodesRef = useRef<Episode[]>([]);
  const queueRef = useRef<QueueEpisode[]>(savedQueueRef.current.queue);
  const queueIndexRef = useRef(savedQueueRef.current.queueIndex);
  const catalogueTokenRef = useRef(0);
  const sourceRef = useRef(episodeSource);
  const playlistCacheRef = useRef(new Map<string, QueueEpisode[]>());
  sourceRef.current = episodeSource;

  const [state, setState] = useState<PlayerState>({
    ready: false,
    episodes: [],
    queue: savedQueueRef.current.queue,
    queueIndex: savedQueueRef.current.queueIndex,
    isPlaying: false,
    isBuffering: false,
    currentTime: 0,
    duration: 0,
    volume: 80,
    muted: false,
    shuffle: false,
    hasPlaybackStarted: false,
    isQueueBuilding: false,
  });

  const patch = useCallback((next: Partial<PlayerState>) => {
    setState((current) => ({ ...current, ...next }));
  }, []);

  const setQueueState = useCallback((queue: QueueEpisode[], queueIndex: number) => {
    queueRef.current = queue;
    queueIndexRef.current = queueIndex;
    patch({ queue, queueIndex });
  }, [patch]);

  const stopTicking = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const tick = useCallback(() => {
    const player = playbackPlayerRef.current;
    if (player?.getCurrentTime) {
      patch({ currentTime: player.getCurrentTime() || 0, duration: player.getDuration() || 0 });
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [patch]);

  const startTicking = useCallback(() => {
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const playQueueIndex = useCallback((index: number, autoStart = true) => {
    const queue = queueRef.current;
    if (!queue.length) return;
    const nextIndex = Math.max(0, Math.min(index, queue.length - 1));
    queueIndexRef.current = nextIndex;
    patch({ queueIndex: nextIndex, currentTime: 0, duration: 0, isBuffering: autoStart, hasPlaybackStarted: true });
    const player = playbackPlayerRef.current;
    if (autoStart) player?.loadVideoById?.(queue[nextIndex].id);
    else player?.cueVideoById?.(queue[nextIndex].id);
  }, [patch]);

  const next = useCallback(() => {
    const nextIndex = queueIndexRef.current + 1;
    if (nextIndex >= queueRef.current.length) {
      stopTicking();
      patch({ isPlaying: false, isBuffering: false });
      return;
    }
    playQueueIndex(nextIndex, true);
  }, [patch, playQueueIndex, stopTicking]);

  const prev = useCallback(() => {
    if (!queueRef.current.length) return;
    playQueueIndex(Math.max(0, queueIndexRef.current - 1), true);
  }, [playQueueIndex]);

  useEffect(() => {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify({ queue: state.queue, queueIndex: state.queueIndex }));
  }, [state.queue, state.queueIndex]);

  useEffect(() => {
    let cancelled = false;
    loadYouTubeApi().then(() => {
      if (cancelled) return;
      const mount = document.getElementById(`${containerId}-mount`);
      if (!mount) return;
      const slot = document.createElement("div");
      slot.id = containerId;
      mount.replaceChildren(slot);
      playbackPlayerRef.current = new window.YT.Player(containerId, {
        height: "1",
        width: "1",
        playerVars: { controls: 0, disablekb: 1, modestbranding: 1, rel: 0, playsinline: 1 },
        events: {
          onReady: () => {
            playbackPlayerRef.current.setVolume(80);
            patch({ ready: true });
          },
          onStateChange: (event: any) => {
            const YTState = window.YT.PlayerState;
            const playing = event.data === YTState.PLAYING;
            const buffering = event.data === YTState.BUFFERING;
            patch({ isPlaying: playing, isBuffering: buffering });
            if (playing) startTicking();
            else if (!buffering) stopTicking();
            if (event.data === YTState.ENDED) next();
          },
        },
      });
    });

    return () => {
      cancelled = true;
      stopTicking();
      playbackPlayerRef.current?.destroy?.();
      playbackPlayerRef.current = null;
    };
  }, [containerId, next, patch, startTicking, stopTicking]);

  useEffect(() => {
    let cancelled = false;
    const token = ++catalogueTokenRef.current;
    const catalogueContainerId = `${containerId}-catalogue`;
    episodesRef.current = [];
    patch({ episodes: [] });

    const hydratePlaylist = (attempt = 0) => {
      const ids: string[] | undefined = cataloguePlayerRef.current?.getPlaylist?.();
      if ((!ids || !ids.length) && attempt < 15) {
        window.setTimeout(() => hydratePlaylist(attempt + 1), 300);
        return;
      }
      if (!ids?.length || token !== catalogueTokenRef.current) return;

      const initial = ids.map((id) => ({ id, titleEn: "Loading title…" }));
      episodesRef.current = initial;
      patch({ episodes: initial });

      ids.forEach((id, index) => {
        fetchTitle(id).then((title) => {
          if (token !== catalogueTokenRef.current) return;
          const current = episodesRef.current;
          if (!current[index] || current[index].id !== id) return;
          const nextEpisodes = [...current];
          const parsed = title
            ? parseEpisodeTitle(title, { ...titleContext, episodeNumber: index + 1 })
            : parseEpisodeTitle("", { ...titleContext, episodeNumber: index + 1 });
          nextEpisodes[index] = { ...nextEpisodes[index], ...parsed };
          episodesRef.current = nextEpisodes;
          patch({ episodes: nextEpisodes });
        });
      });
    };

    loadYouTubeApi().then(() => {
      if (cancelled) return;
      const mount = document.getElementById(`${catalogueContainerId}-mount`);
      if (!mount) return;
      cataloguePlayerRef.current?.destroy?.();
      const slot = document.createElement("div");
      slot.id = catalogueContainerId;
      mount.replaceChildren(slot);
      cataloguePlayerRef.current = new window.YT.Player(catalogueContainerId, {
        height: "1",
        width: "1",
        playerVars: { controls: 0, disablekb: 1, modestbranding: 1, rel: 0, playsinline: 1, listType: "playlist", list: playlistId },
        events: { onReady: () => hydratePlaylist() },
      });
    });

    return () => {
      cancelled = true;
      catalogueTokenRef.current += 1;
      cataloguePlayerRef.current?.destroy?.();
      cataloguePlayerRef.current = null;
    };
    // The playlist id represents the selected collection and refreshes its context.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId, playlistId, patch]);

  const withSource = useCallback((episode: Episode): QueueEpisode => ({ ...episode, source: sourceRef.current }), []);

  const loadPlaylistQueue = useCallback(async (input: PlaylistQueueInput): Promise<QueueEpisode[]> => {
    const cached = playlistCacheRef.current.get(input.playlistId);
    if (cached) return cached.map((episode) => ({ ...episode, source: input.source }));

    await loadYouTubeApi();
    return new Promise((resolve) => {
      const shell = document.createElement("div");
      const slot = document.createElement("div");
      const slotId = `${containerId}-writer-${auxiliaryPlayerId += 1}`;
      shell.className = "hidden-player-slot";
      slot.id = slotId;
      shell.appendChild(slot);
      document.body.appendChild(shell);

      let player: any;
      let settled = false;
      const finish = (episodes: QueueEpisode[]) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        player?.destroy?.();
        shell.remove();
        if (episodes.length) playlistCacheRef.current.set(input.playlistId, episodes);
        resolve(episodes);
      };
      const timeout = window.setTimeout(() => finish([]), 15000);

      const hydrate = (attempt = 0) => {
        const ids: string[] | undefined = player?.getPlaylist?.();
        if ((!ids || !ids.length) && attempt < 20) {
          window.setTimeout(() => hydrate(attempt + 1), 300);
          return;
        }
        if (!ids?.length) {
          finish([]);
          return;
        }

        Promise.all(ids.map(async (id, index) => {
          const rawTitle = await fetchTitle(id);
          const parsed = parseEpisodeTitle(rawTitle ?? "", { ...input.titleContext, episodeNumber: index + 1 });
          return { id, ...parsed, source: input.source };
        })).then(finish).catch(() => finish([]));
      };

      player = new window.YT.Player(slotId, {
        height: "1",
        width: "1",
        playerVars: { controls: 0, disablekb: 1, modestbranding: 1, rel: 0, playsinline: 1, listType: "playlist", list: input.playlistId },
        events: { onReady: () => hydrate(), onError: () => finish([]) },
      });
    });
  }, [containerId]);

  const buildPlaylistGroup = useCallback(async (inputs: PlaylistQueueInput[]) => {
    patch({ isQueueBuilding: true });
    try {
      const combined: QueueEpisode[] = [];
      for (const input of inputs) combined.push(...await loadPlaylistQueue(input));
      const seen = new Set<string>();
      return combined.filter((episode) => !seen.has(episode.id) && Boolean(seen.add(episode.id)));
    } finally {
      patch({ isQueueBuilding: false });
    }
  }, [loadPlaylistQueue, patch]);

  const playPlaylistGroup = useCallback(async (inputs: PlaylistQueueInput[], shuffle = false) => {
    const group = await buildPlaylistGroup(inputs);
    if (!group.length) return;
    const nextQueue = shuffle ? shuffleItems(group) : group;
    setQueueState(nextQueue, 0);
    patch({ shuffle });
    playQueueIndex(0, true);
  }, [buildPlaylistGroup, patch, playQueueIndex, setQueueState]);

  const addPlaylistGroup = useCallback(async (inputs: PlaylistQueueInput[]) => {
    const group = await buildPlaylistGroup(inputs);
    if (!group.length) return;
    const existingIds = new Set(queueRef.current.map((episode) => episode.id));
    const additions = group.filter((episode) => !existingIds.has(episode.id));
    if (!additions.length) return;
    setQueueState([...queueRef.current, ...additions], queueRef.current.length ? queueIndexRef.current : 0);
  }, [buildPlaylistGroup, setQueueState]);

  const playCollection = useCallback((shuffle = false) => {
    if (!episodesRef.current.length) return;
    const queue = episodesRef.current.map(withSource);
    const nextQueue = shuffle ? shuffleItems(queue) : queue;
    setQueueState(nextQueue, 0);
    patch({ shuffle });
    playQueueIndex(0, true);
  }, [patch, playQueueIndex, setQueueState, withSource]);

  const playCatalogueIndex = useCallback((index: number) => {
    const episode = episodesRef.current[index];
    if (!episode) return;
    const selected = withSource(episode);
    const remaining = queueRef.current
      .slice(queueIndexRef.current + 1)
      .filter((item) => item.id !== selected.id);
    const nextQueue = [selected, ...remaining];
    setQueueState(nextQueue, 0);
    playQueueIndex(0, true);
  }, [playQueueIndex, setQueueState, withSource]);

  const addEpisode = useCallback((index: number) => {
    const episode = episodesRef.current[index];
    if (!episode || queueRef.current.some((item) => item.id === episode.id)) return;
    setQueueState([...queueRef.current, withSource(episode)], queueIndexRef.current);
  }, [setQueueState, withSource]);

  const addCollection = useCallback(() => {
    const existingIds = new Set(queueRef.current.map((item) => item.id));
    const additions = episodesRef.current.filter((episode) => !existingIds.has(episode.id)).map(withSource);
    if (!additions.length) return;
    const queueIndex = queueRef.current.length ? queueIndexRef.current : 0;
    setQueueState([...queueRef.current, ...additions], queueIndex);
  }, [setQueueState, withSource]);

  const removeQueueItem = useCallback((index: number) => {
    if (index === queueIndexRef.current || index < 0 || index >= queueRef.current.length) return;
    const nextQueue = queueRef.current.filter((_, itemIndex) => itemIndex !== index);
    const nextIndex = index < queueIndexRef.current ? queueIndexRef.current - 1 : queueIndexRef.current;
    setQueueState(nextQueue, Math.max(0, nextIndex));
  }, [setQueueState]);

  const moveQueueItem = useCallback((index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (index <= queueIndexRef.current || target <= queueIndexRef.current || target >= queueRef.current.length) return;
    const nextQueue = [...queueRef.current];
    [nextQueue[index], nextQueue[target]] = [nextQueue[target], nextQueue[index]];
    setQueueState(nextQueue, queueIndexRef.current);
  }, [setQueueState]);

  const clearUpNext = useCallback(() => {
    if (!queueRef.current.length) return;
    const current = queueRef.current[queueIndexRef.current];
    setQueueState(current ? [current] : [], 0);
  }, [setQueueState]);

  const play = useCallback(() => {
    if (!queueRef.current.length) {
      playCollection(false);
      return;
    }
    const currentId = playbackPlayerRef.current?.getVideoData?.()?.video_id;
    const queuedId = queueRef.current[queueIndexRef.current]?.id;
    if (currentId !== queuedId) playQueueIndex(queueIndexRef.current, true);
    else playbackPlayerRef.current?.playVideo?.();
  }, [playCollection, playQueueIndex]);

  const pause = useCallback(() => playbackPlayerRef.current?.pauseVideo?.(), []);
  const toggle = useCallback(() => state.isPlaying ? pause() : play(), [pause, play, state.isPlaying]);

  const seekTo = useCallback((seconds: number) => {
    playbackPlayerRef.current?.seekTo?.(seconds, true);
    patch({ currentTime: seconds });
  }, [patch]);

  const seekRelative = useCallback((delta: number) => {
    const player = playbackPlayerRef.current;
    if (!player) return;
    seekTo(Math.max(0, Math.min(player.getDuration?.() || 0, (player.getCurrentTime?.() || 0) + delta)));
  }, [seekTo]);

  const setVolume = useCallback((value: number) => {
    const volume = Math.max(0, Math.min(100, value));
    playbackPlayerRef.current?.setVolume?.(volume);
    if (volume > 0 && state.muted) playbackPlayerRef.current?.unMute?.();
    patch({ volume, muted: volume > 0 ? false : state.muted });
  }, [patch, state.muted]);

  const toggleMute = useCallback(() => {
    if (state.muted) playbackPlayerRef.current?.unMute?.();
    else playbackPlayerRef.current?.mute?.();
    patch({ muted: !state.muted });
  }, [patch, state.muted]);

  const toggleShuffle = useCallback(() => {
    const shuffle = !state.shuffle;
    if (shuffle && queueRef.current.length > queueIndexRef.current + 2) {
      const played = queueRef.current.slice(0, queueIndexRef.current + 1);
      const upNext = shuffleItems(queueRef.current.slice(queueIndexRef.current + 1));
      setQueueState([...played, ...upNext], queueIndexRef.current);
    }
    patch({ shuffle });
  }, [patch, setQueueState, state.shuffle]);

  return {
    state,
    play,
    pause,
    toggle,
    next,
    prev,
    seekTo,
    seekRelative,
    setVolume,
    toggleMute,
    toggleShuffle,
    playCollection,
    playCatalogueIndex,
    playQueueIndex,
    addEpisode,
    addCollection,
    playPlaylistGroup,
    addPlaylistGroup,
    removeQueueItem,
    moveQueueItem,
    clearUpNext,
  };
}
