import { Check, Headphones, ListPlus, Play, Radio, Search, Shuffle, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Episode } from "../episodes";
import {
  CHANNELS,
  type ChannelId,
  type CollectionKind,
  type StoryChannel,
  type StoryCollection,
  type WriterProfile,
} from "../catalogue";
import { EpisodeList } from "./EpisodeList";
import { YouTubeMark } from "./YouTubeMark";

interface ProgrammeGuideProps {
  channel: StoryChannel;
  collection: StoryCollection;
  episodes: Episode[];
  currentIndex: number;
  stationCode: string;
  onClose: () => void;
  onSelectChannel: (channelId: ChannelId) => void;
  onSelectCollection: (collectionId: string) => void;
  onPlayEpisode: (index: number) => void;
  onAddEpisode: (index: number) => void;
  onPlayCollection: () => void;
  onShuffleCollection: () => void;
  onAddCollection: () => void;
  onPlayWriter: (collections: StoryCollection[], shuffle: boolean) => void;
  onAddWriter: (collections: StoryCollection[]) => void;
  isWriterQueueBuilding: boolean;
  queuedIds: ReadonlySet<string>;
}

const FILTER_LABELS: Record<"all" | CollectionKind, string> = {
  all: "All programmes",
  character: "Characters",
  writer: "Writers",
  genre: "Genres",
  original: "Originals",
};

const collectionSearchText = (entry: StoryCollection) => [
  entry.label,
  entry.bengaliLabel,
  entry.entityLabel,
  entry.sourceWriter,
  entry.kind,
].filter(Boolean).join(" ").toLocaleLowerCase();

export function ProgrammeGuide({
  channel,
  collection,
  episodes,
  currentIndex,
  stationCode,
  onClose,
  onSelectChannel,
  onSelectCollection,
  onPlayEpisode,
  onAddEpisode,
  onPlayCollection,
  onShuffleCollection,
  onAddCollection,
  onPlayWriter,
  onAddWriter,
  isWriterQueueBuilding,
  queuedIds,
}: ProgrammeGuideProps) {
  const [kind, setKind] = useState<"all" | CollectionKind>("all");
  const [query, setQuery] = useState("");
  const [selectedWriterId, setSelectedWriterId] = useState<string | null>(null);
  const selectionRef = useRef<HTMLElement>(null);

  const writerProfiles = useMemo<WriterProfile[]>(() => {
    if (channel.writers?.length) return channel.writers;
    return channel.collections
      .filter((entry) => entry.kind === "writer")
      .map((entry) => ({
        id: entry.writerId ?? entry.id,
        label: entry.sourceWriter ?? entry.label,
        bengaliLabel: entry.sourceWriter ? undefined : entry.bengaliLabel,
        artwork: entry.artwork,
      }));
  }, [channel]);

  const collectionsForWriter = (writerId: string) => channel.writers?.length
    ? channel.collections.filter((entry) => entry.writerId === writerId)
    : channel.collections.filter((entry) => (entry.writerId ?? entry.id) === writerId);

  useEffect(() => {
    setKind(channel.id === "sunday-suspense" ? "character" : "genre");
    setQuery("");
    setSelectedWriterId(null);
  }, [channel.id]);

  const availableKinds = useMemo(
    () => (["all", "character", "writer", "genre", "original"] as const).filter(
      (item) => item === "all" || (item === "writer" ? writerProfiles.length > 0 : channel.collections.some((entry) => entry.kind === item)),
    ),
    [channel.collections, writerProfiles.length],
  );

  const visibleCollections = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return channel.collections.filter((entry) => {
      const matchesKind = kind === "all" || entry.kind === kind;
      return matchesKind && (!needle || collectionSearchText(entry).includes(needle));
    });
  }, [channel.collections, kind, query]);

  const visibleWriters = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return writerProfiles.filter((writer) => {
      const series = collectionsForWriter(writer.id);
      const haystack = [writer.label, writer.bengaliLabel, ...series.map(collectionSearchText)].filter(Boolean).join(" ").toLocaleLowerCase();
      return !needle || haystack.includes(needle);
    });
    // collectionsForWriter is intentionally derived from the active channel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel.collections, query, writerProfiles]);

  const collectionWriter = writerProfiles.find((writer) => collectionsForWriter(writer.id).some((entry) => entry.id === collection.id));
  const activeWriter = writerProfiles.find((writer) => writer.id === selectedWriterId) ?? collectionWriter ?? writerProfiles[0];
  const writerSeries = activeWriter ? collectionsForWriter(activeWriter.id) : [];
  const writerMode = kind === "writer" && Boolean(activeWriter);
  const youtubeUrl = `https://www.youtube.com/playlist?list=${collection.playlistId}`;
  const collectionReady = episodes.length > 0 && episodes.every((episode) => episode.titleEn !== "Loading title…");
  const collectionQueued = episodes.length > 0 && episodes.every((episode) => queuedIds.has(episode.id));

  const scrollToSelection = () => {
    if (!window.matchMedia("(max-width: 900px)").matches) return;
    window.setTimeout(() => selectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };
  const selectCollection = (collectionId: string) => {
    onSelectCollection(collectionId);
    scrollToSelection();
  };
  const selectWriter = (writer: WriterProfile) => {
    const series = collectionsForWriter(writer.id);
    setSelectedWriterId(writer.id);
    if (series.length && !series.some((entry) => entry.id === collection.id)) onSelectCollection(series[0].id);
    scrollToSelection();
  };
  const selectKind = (nextKind: "all" | CollectionKind) => {
    setKind(nextKind);
    if (nextKind !== "writer" || !writerProfiles.length) return;
    selectWriter(collectionWriter ?? writerProfiles[0]);
  };
  const filterCount = (item: "all" | CollectionKind) => {
    if (item === "all") return channel.collections.length;
    if (item === "writer") return writerProfiles.length;
    return channel.collections.filter((entry) => entry.kind === item).length;
  };
  const collectionCountLabel = (entry: StoryCollection) => entry.videoCount > 0
    ? `${entry.videoCount} broadcasts${entry.sourceWriter ? ` · ${entry.sourceWriter}` : ""}`
    : `Archive series${entry.sourceWriter ? ` · ${entry.sourceWriter}` : ""}`;

  return (
    <div className="programme-guide-overlay" role="dialog" aria-modal="true" aria-labelledby="programme-guide-title">
      <section className="programme-guide">
        <header className="guide-header">
          <div>
            <span className="guide-eyebrow"><Radio size={13} /> Station programme guide</span>
            <h2 id="programme-guide-title">Explore the broadcast archive</h2>
            <p>Find a familiar character, tune by writer, or wander through a different kind of story.</p>
          </div>
          <button type="button" className="guide-close" onClick={onClose} aria-label="Close programme guide"><X size={22} /></button>
        </header>

        <div className="guide-controls">
          <div className="guide-channel-switcher" role="group" aria-label="Choose story channel">
            {CHANNELS.map((entry) => (
              <button key={entry.id} type="button" className={entry.id === channel.id ? "active" : ""} onClick={() => onSelectChannel(entry.id)} aria-pressed={entry.id === channel.id}>
                <span>{entry.frequency}</span><strong>{entry.shortLabel}</strong>
              </button>
            ))}
          </div>
          <label className="guide-search">
            <Search size={18} />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search characters, writers, series or broadcasts" aria-label="Search the programme guide" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={15} /></button>}
          </label>
        </div>

        <div className="guide-filters" role="tablist" aria-label="Explore programmes by">
          {availableKinds.map((item) => (
            <button key={item} type="button" role="tab" aria-selected={kind === item} className={kind === item ? "active" : ""} onClick={() => selectKind(item)}>
              {FILTER_LABELS[item]}<span>{filterCount(item)}</span>
            </button>
          ))}
        </div>

        <div className="guide-body">
          <section className="guide-browse" aria-label="Programme collections">
            <div className="guide-section-title">
              <div><span>Browse by {kind === "all" ? "collection" : kind}</span><strong>{writerMode ? visibleWriters.length : visibleCollections.length} {writerMode ? "writers" : "frequencies"} found</strong></div>
            </div>

            <div className={`guide-collection-grid${writerMode ? " writer-grid" : ""}`}>
              {writerMode ? visibleWriters.map((writer) => {
                const series = collectionsForWriter(writer.id);
                return (
                  <button key={writer.id} type="button" className={writer.id === activeWriter?.id ? "active" : ""} onClick={() => selectWriter(writer)} style={{ backgroundImage: `linear-gradient(180deg, transparent 20%, rgba(5, 8, 13, .96) 100%), url(${writer.artwork})` }}>
                    <span className="guide-card-kind">Writer archive</span>
                    <span className="guide-card-copy">{writer.bengaliLabel && <small>{writer.bengaliLabel}</small>}<strong>{writer.label}</strong><em>{series.length} {series.length === 1 ? "series" : "series collections"}</em></span>
                  </button>
                );
              }) : visibleCollections.map((entry) => (
                <button key={entry.id} type="button" className={entry.id === collection.id ? "active" : ""} onClick={() => selectCollection(entry.id)} style={{ backgroundImage: `linear-gradient(180deg, transparent 20%, rgba(5, 8, 13, .96) 100%), url(${entry.artwork})` }}>
                  <span className="guide-card-kind">{entry.entityLabel ?? entry.kind}</span>
                  <span className="guide-card-copy">{entry.bengaliLabel && <small>{entry.bengaliLabel}</small>}<strong>{entry.label}</strong><em>{collectionCountLabel(entry)}</em></span>
                </button>
              ))}
            </div>
            {(writerMode ? !visibleWriters.length : !visibleCollections.length) && <div className="guide-empty">No collections match “{query}”. Try another name or browse all programmes.</div>}
          </section>

          <section ref={selectionRef} className={`guide-selection${writerMode ? " writer-selection" : ""}`} aria-label={`${writerMode ? activeWriter?.label : collection.label} broadcasts`}>
            <div className="guide-selection-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(5,8,13,.98), rgba(5,8,13,.4)), url(${writerMode ? activeWriter?.artwork : collection.artwork})` }}>
              <span className="guide-selection-kind">Now tuned · {writerMode ? "writer archive" : collection.kind}</span>
              {(writerMode ? activeWriter?.bengaliLabel : collection.bengaliLabel) && <h3>{writerMode ? activeWriter?.bengaliLabel : collection.bengaliLabel}</h3>}
              <p className="guide-selection-name">{writerMode ? activeWriter?.label : collection.label}</p>
              <p>{writerMode ? `${writerSeries.length} ${writerSeries.length === 1 ? "series" : "series collections"}` : collection.sourceWriter ?? collection.entityLabel ?? `${collection.videoCount} archived broadcasts`}</p>
              <div className="guide-selection-actions">
                {writerMode ? <>
                  <button type="button" className="guide-play" onClick={() => onPlayWriter(writerSeries, false)} disabled={isWriterQueueBuilding || !writerSeries.length}><Play size={15} fill="currentColor" /> {isWriterQueueBuilding ? "Building queue…" : "Play writer"}</button>
                  <button type="button" onClick={() => onPlayWriter(writerSeries, true)} disabled={isWriterQueueBuilding || !writerSeries.length}><Shuffle size={15} /> Shuffle writer</button>
                  <button type="button" onClick={() => onAddWriter(writerSeries)} disabled={isWriterQueueBuilding || !writerSeries.length}><ListPlus size={15} /> Add writer</button>
                </> : <>
                  <button type="button" className="guide-play" onClick={onPlayCollection} disabled={!collectionReady}><Play size={15} fill="currentColor" /> Play all</button>
                  <button type="button" onClick={onShuffleCollection} disabled={!collectionReady}><Shuffle size={15} /> Shuffle all</button>
                  <button type="button" onClick={onAddCollection} disabled={!collectionReady || collectionQueued}>{collectionQueued ? <Check size={15} /> : <ListPlus size={15} />} {collectionQueued ? "Queued" : "Add all"}</button>
                  <a href={youtubeUrl} target="_blank" rel="noreferrer" aria-label={`Open ${collection.label} playlist on YouTube`}><YouTubeMark size={18} /> YouTube playlist</a>
                </>}
              </div>
            </div>

            {writerMode && <div className="guide-series-panel">
              <div className="guide-series-head"><span>Series in this archive</span><em>{writerSeries.length} available</em></div>
              <div className="guide-series-tabs">
                {writerSeries.map((series) => <button key={series.id} type="button" className={series.id === collection.id ? "active" : ""} onClick={() => selectCollection(series.id)}>{series.bengaliLabel && <small>{series.bengaliLabel}</small>}<strong>{series.label}</strong></button>)}
              </div>
              <div className="guide-series-actions">
                <span><strong>{collection.label}</strong><em>{collection.kind === "character" ? "Character series" : "Selected series"}</em></span>
                <div>
                  <button type="button" className="guide-play" onClick={onPlayCollection} disabled={!collectionReady}><Play size={13} fill="currentColor" /> Play series</button>
                  <button type="button" onClick={onShuffleCollection} disabled={!collectionReady}><Shuffle size={13} /> Shuffle</button>
                  <button type="button" onClick={onAddCollection} disabled={!collectionReady || collectionQueued}>{collectionQueued ? <Check size={13} /> : <ListPlus size={13} />} {collectionQueued ? "Queued" : "Add"}</button>
                  <a href={youtubeUrl} target="_blank" rel="noreferrer" aria-label={`Open ${collection.label} playlist on YouTube`}><YouTubeMark size={16} /></a>
                </div>
              </div>
            </div>}

            <div className="guide-episode-head">
              <span><Headphones size={14} /> {writerMode ? collection.label : "Broadcasts"}</span>
              <em>{episodes.length ? `${episodes.length} available` : collection.videoCount > 0 ? `${collection.videoCount} expected` : "Tuning archive"}</em>
            </div>
            {episodes.length ? <EpisodeList stationCode={stationCode} episodes={episodes} currentIndex={currentIndex} query={writerMode ? "" : query} onSelect={onPlayEpisode} onAdd={onAddEpisode} queuedIds={queuedIds} /> : <div className="catalogue-loading"><span /> Tuning this collection…</div>}
          </section>
        </div>
      </section>
    </div>
  );
}
