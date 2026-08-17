import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Headphones, Info, ListMusic, Pause, Play, Radio, X } from "lucide-react";
import "./App.css";
import { useYouTubePlayer } from "./hooks/useYouTubePlayer";
import { SignalWaveform } from "./components/SignalWaveform";
import { TransportControls } from "./components/TransportControls";
import { NowPlayingCard } from "./components/NowPlayingCard";
import { EpisodeList } from "./components/EpisodeList";
import { DisclaimerModal } from "./components/DisclaimerModal";
import { ShortcutSheet } from "./components/ShortcutSheet";
import { KolkataClock } from "./components/KolkataClock";
import { CHANNELS, getChannel, getCollection, type ChannelId, type CollectionKind } from "./catalogue";

const PLAYER_CONTAINER_ID = "yt-hidden-player";
const TUNING_DURATION_MS = 1800;

function App() {
  const [activeChannelId, setActiveChannelId] = useState<ChannelId>("sunday-suspense");
  const activeChannel = getChannel(activeChannelId);
  const [activeCollectionId, setActiveCollectionId] = useState(activeChannel.defaultCollectionId);
  const activeCollection = getCollection(activeChannel, activeCollectionId);

  const {
    state,
    toggle,
    next,
    prev,
    seekTo,
    seekRelative,
    setVolume,
    toggleMute,
    toggleShuffle,
    playIndex,
  } = useYouTubePlayer(PLAYER_CONTAINER_ID, activeCollection.playlistId);

  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [libraryKind, setLibraryKind] = useState<"all" | CollectionKind>("character");
  const [tuningAnim, setTuningAnim] = useState(true);
  const [stationTuning, setStationTuning] = useState(false);
  const [pendingChannelId, setPendingChannelId] = useState<ChannelId | null>(null);
  const stationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setTuningAnim(false), prefersReduced ? 0 : TUNING_DURATION_MS);
    if (prefersReduced) setTuningAnim(false);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => () => {
    if (stationTimerRef.current !== null) window.clearTimeout(stationTimerRef.current);
  }, []);

  useEffect(() => {
    if (showDisclaimer || showShortcuts) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          toggle();
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (e.shiftKey) prev();
          else seekRelative(-5);
          break;
        case "ArrowRight":
          e.preventDefault();
          if (e.shiftKey) next();
          else seekRelative(5);
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume(state.volume + 5);
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume(state.volume - 5);
          break;
        case "m":
        case "M":
          toggleMute();
          break;
        case "s":
        case "S":
          toggleShuffle();
          break;
        case "?":
          setShowShortcuts(true);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showDisclaimer, showShortcuts, toggle, prev, next, seekRelative, setVolume, toggleMute, toggleShuffle, state.volume]);

  const handleDisclaimerConfirm = () => {
    setShowDisclaimer(false);
  };

  const selectChannel = (channelId: ChannelId) => {
    if (channelId === activeChannelId || stationTuning) return;
    const channel = getChannel(channelId);
    setPendingChannelId(channelId);
    setStationTuning(true);
    stationTimerRef.current = window.setTimeout(() => {
      setActiveChannelId(channelId);
      setActiveCollectionId(channel.defaultCollectionId);
      setLibraryKind(channelId === "sunday-suspense" ? "character" : "genre");
      setPendingChannelId(null);
      setStationTuning(false);
    }, 800);
  };

  const indicatedChannelId = pendingChannelId ?? activeChannelId;
  const stationCode = activeChannelId === "sunday-suspense" ? "SS" : "GMT";

  const currentEpisode = state.episodes[state.currentIndex];
  const progress = tuningAnim
    ? 0.5
    : state.duration > 0
    ? state.currentTime / state.duration
    : 0;

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div
      className={`app channel-${activeChannel.id}${stationTuning ? " station-tuning" : ""}`}
      style={{ "--channel-accent": activeChannel.accent } as CSSProperties}
    >
      <div id={`${PLAYER_CONTAINER_ID}-mount`} className="hidden-player-slot" />

      <div
        key={activeCollection.artwork}
        className="scene"
        style={{ backgroundImage: `url(${activeCollection.artwork || activeChannel.defaultArtwork})` }}
        aria-hidden
      />
      <div className="scene-shade" aria-hidden />

      <header className="topbar">
        <div className="topbar-cluster">
          <KolkataClock />
          <span className="topbar-rule" />
          <span className="station-label"><Radio size={14} /> {activeChannel.frequency}</span>
        </div>
        <div className="topbar-actions">
          <span className="listener-pill"><span className="live-dot" /> story radio</span>
          <button type="button" className="round-action" onClick={() => setShowEpisodes(true)} aria-label="Open episode library">
            <ListMusic size={18} />
          </button>
          <button type="button" className="round-action" onClick={() => setShowDisclaimer(true)} aria-label="About this website">
            <Info size={18} />
          </button>
        </div>
      </header>

      <main className="hero">
        <div className="station-tuner" role="group" aria-label="Tune radio station">
          <div className="station-tuner-status">
            <span>FM / archive receiver</span>
            <strong>{stationTuning ? "Searching signal…" : `${activeChannel.frequency} · signal locked`}</strong>
          </div>
          <div className="station-scale" aria-hidden="true">
            {Array.from({ length: 21 }).map((_, index) => <i key={index} className={index % 5 === 0 ? "major" : ""} />)}
            <span className="scale-label scale-start">88</span>
            <span className="scale-label scale-end">108</span>
            <span className={`station-needle needle-${indicatedChannelId}`} />
          </div>
          {CHANNELS.map((channel) => (
            <button
              key={channel.id}
              type="button"
              className={`station-marker marker-${channel.id}${channel.id === indicatedChannelId ? " active" : ""}`}
              onClick={() => selectChannel(channel.id)}
              aria-pressed={channel.id === activeChannel.id}
              disabled={stationTuning}
            >
              <span>{channel.frequency}</span>
              <strong>{channel.shortLabel}</strong>
            </button>
          ))}
        </div>
        <div className="hero-kicker"><span /> {activeChannel.kicker} <span /></div>
        <h1 className="site-title-bn">{activeChannel.bengaliTitle}</h1>
        <p className="site-title-en">{activeChannel.titleLead} {activeChannel.titleMain} · {activeChannel.frequency}</p>
        <p className="hero-copy">{activeChannel.tagline}</p>
        <button type="button" className="active-collection" onClick={() => setShowEpisodes(true)}>
          {activeCollection.kind} · {activeCollection.label}
        </button>
      </main>

      <section className="player-dock" aria-label="Audio player">
        <div className="broadcast-console">
          <div className="console-header">
            <span className="console-name"><Radio size={13} /> Night broadcast console</span>
            <div className={`signal-meter${state.isBuffering || stationTuning ? " searching" : ""}`} aria-label={stationTuning ? "Searching for signal" : "Signal locked"}>
              {[1, 2, 3, 4].map((bar) => <i key={bar} />)}
            </div>
            <span className="console-mode">FM · ARCHIVE · STEREO</span>
          </div>
          <div className="player-content">
          <NowPlayingCard episode={currentEpisode} isPlaying={state.isPlaying} contextLabel={activeCollection.label} />
          <div className="player-progress">
            <SignalWaveform
              progress={progress}
              isPlaying={state.isPlaying}
              isSearching={tuningAnim || state.isBuffering || stationTuning}
              disabled={tuningAnim || state.duration <= 0}
              onSeek={(fraction) => {
                if (state.duration > 0) seekTo(fraction * state.duration);
              }}
            />
            <div className="time-row">
              <span>{formatTime(state.currentTime)}</span>
              <span>{formatTime(state.duration)}</span>
            </div>
          </div>

          <TransportControls
            isPlaying={state.isPlaying}
            shuffle={state.shuffle}
            muted={state.muted}
            volume={state.volume}
            disabled={!state.ready || showDisclaimer}
            onToggle={toggle}
            onNext={next}
            onPrev={prev}
            onShuffle={toggleShuffle}
            onMute={toggleMute}
            onVolume={setVolume}
          />
          <button
            type="button"
            className="mobile-play"
            onClick={toggle}
            disabled={!state.ready || showDisclaimer}
            aria-label={state.isPlaying ? "Pause" : "Play"}
          >
            {state.isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          </div>
        </div>
        <button type="button" className="library-trigger" onClick={() => setShowEpisodes(true)}>
          <Headphones size={15} /> Open programme archive <span>{String(state.episodes.length || activeCollection.videoCount).padStart(2, "0")}</span>
        </button>
      </section>

      <aside className={`episode-drawer${showEpisodes ? " open" : ""}`} aria-hidden={!showEpisodes}>
        <div className="drawer-head">
          <div><span className="drawer-eyebrow">Station programme guide</span><h2>Broadcast archive</h2></div>
          <button type="button" className="round-action" onClick={() => setShowEpisodes(false)} aria-label="Close episode library"><X size={20} /></button>
        </div>
        <div className="drawer-channel-switcher" role="group" aria-label="Library channel">
          {CHANNELS.map((channel) => (
            <button key={channel.id} type="button" className={channel.id === activeChannel.id ? "active" : ""} onClick={() => selectChannel(channel.id)}>
              {channel.shortLabel}
            </button>
          ))}
        </div>
        <div className="collection-filters" role="tablist" aria-label="Browse collections">
          {(["all", "character", "writer", "genre", "original"] as const).map((kind) => {
            const available = kind === "all" || activeChannel.collections.some((collection) => collection.kind === kind);
            const labels = { all: "all", character: "characters", writer: "writers", genre: "genres", original: "originals" };
            return available && <button key={kind} type="button" role="tab" aria-selected={libraryKind === kind} className={libraryKind === kind ? "active" : ""} onClick={() => setLibraryKind(kind)}>{labels[kind]}</button>;
          })}
        </div>
        <div className="collection-grid">
          {activeChannel.collections
            .filter((collection) => libraryKind === "all" || collection.kind === libraryKind)
            .map((collection) => (
              <button key={collection.id} type="button" className={collection.id === activeCollection.id ? "active" : ""} onClick={() => setActiveCollectionId(collection.id)}>
                <span className="collection-kind">{collection.entityLabel ?? collection.kind}</span>
                <strong>{collection.label}</strong>
                {collection.bengaliLabel && <small>{collection.bengaliLabel}</small>}
                <span className="collection-meta">{collection.videoCount} archived broadcasts{collection.sourceWriter ? ` · ${collection.sourceWriter}` : ""}</span>
              </button>
            ))}
        </div>
        <div className="episode-shelf-head"><span>{activeCollection.label}</span><em>{state.episodes.length || activeCollection.videoCount} broadcasts</em></div>
        {state.episodes.length ? (
          <EpisodeList stationCode={stationCode} episodes={state.episodes} currentIndex={state.currentIndex} onSelect={(i) => { playIndex(i, true); setShowEpisodes(false); }} />
        ) : (
          <div className="catalogue-loading"><span /> Tuning this collection…</div>
        )}
      </aside>
      {showEpisodes && <button className="drawer-scrim" aria-label="Close episode library" onClick={() => setShowEpisodes(false)} />}

      <footer className="footer">
        <span>Unofficial fan tribute · Audio streams from YouTube</span>
        <button type="button" className="shortcut-hint" onClick={() => setShowShortcuts(true)}>
          Keyboard controls&nbsp; ?
        </button>
      </footer>

      {showDisclaimer && <DisclaimerModal onConfirm={handleDisclaimerConfirm} />}
      {showShortcuts && <ShortcutSheet onClose={() => setShowShortcuts(false)} />}
    </div>
  );
}

export default App;
