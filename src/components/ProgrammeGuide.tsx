import { Check, Headphones, ListPlus, Play, Radio, Search, Shuffle, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Episode } from "../episodes";
import {
  CHANNELS,
  type ChannelId,
  type CollectionKind,
  type StoryChannel,
  type StoryCollection,
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
  queuedIds: ReadonlySet<string>;
}

const FILTER_LABELS: Record<"all" | CollectionKind, string> = {
  all: "All programmes",
  character: "Characters",
  writer: "Writers",
  genre: "Genres",
  original: "Originals",
};

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
  queuedIds,
}: ProgrammeGuideProps) {
  const [kind, setKind] = useState<"all" | CollectionKind>("all");
  const [query, setQuery] = useState("");
  const selectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setKind(channel.id === "sunday-suspense" ? "character" : "genre");
    setQuery("");
  }, [channel.id]);

  const availableKinds = useMemo(
    () => (["all", "character", "writer", "genre", "original"] as const).filter(
      (item) => item === "all" || channel.collections.some((entry) => entry.kind === item),
    ),
    [channel.collections],
  );

  const visibleCollections = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return channel.collections.filter((entry) => {
      const matchesKind = kind === "all" || entry.kind === kind;
      const haystack = [entry.label, entry.bengaliLabel, entry.entityLabel, entry.sourceWriter, entry.kind]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();
      return matchesKind && (!needle || haystack.includes(needle));
    });
  }, [channel.collections, kind, query]);

  const youtubeUrl = `https://www.youtube.com/playlist?list=${collection.playlistId}`;
  const collectionReady = episodes.length > 0 && episodes.every((episode) => episode.titleEn !== "Loading title…");
  const collectionQueued = episodes.length > 0 && episodes.every((episode) => queuedIds.has(episode.id));
  const selectCollection = (collectionId: string) => {
    onSelectCollection(collectionId);
    if (!window.matchMedia("(max-width: 900px)").matches) return;
    window.setTimeout(() => selectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

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
              <button
                key={entry.id}
                type="button"
                className={entry.id === channel.id ? "active" : ""}
                onClick={() => onSelectChannel(entry.id)}
                aria-pressed={entry.id === channel.id}
              >
                <span>{entry.frequency}</span>
                <strong>{entry.shortLabel}</strong>
              </button>
            ))}
          </div>
          <label className="guide-search">
            <Search size={18} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search characters, writers, genres or broadcasts"
              aria-label="Search the programme guide"
            />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={15} /></button>}
          </label>
        </div>

        <div className="guide-filters" role="tablist" aria-label="Explore programmes by">
          {availableKinds.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={kind === item}
              className={kind === item ? "active" : ""}
              onClick={() => setKind(item)}
            >
              {FILTER_LABELS[item]}
              <span>{item === "all" ? channel.collections.length : channel.collections.filter((entry) => entry.kind === item).length}</span>
            </button>
          ))}
        </div>

        <div className="guide-body">
          <section className="guide-browse" aria-label="Programme collections">
            <div className="guide-section-title">
              <div><span>Browse by {kind === "all" ? "collection" : kind}</span><strong>{visibleCollections.length} frequencies found</strong></div>
            </div>
            <div className="guide-collection-grid">
              {visibleCollections.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className={entry.id === collection.id ? "active" : ""}
                  onClick={() => selectCollection(entry.id)}
                  style={{ backgroundImage: `linear-gradient(180deg, transparent 20%, rgba(5, 8, 13, .96) 100%), url(${entry.artwork})` }}
                >
                  <span className="guide-card-kind">{entry.entityLabel ?? entry.kind}</span>
                  <span className="guide-card-copy">
                    {entry.bengaliLabel && <small>{entry.bengaliLabel}</small>}
                    <strong>{entry.label}</strong>
                    <em>{entry.videoCount} broadcasts{entry.sourceWriter ? ` · ${entry.sourceWriter}` : ""}</em>
                  </span>
                </button>
              ))}
            </div>
            {!visibleCollections.length && <div className="guide-empty">No collections match “{query}”. Try another name or browse all programmes.</div>}
          </section>

          <section ref={selectionRef} className="guide-selection" aria-label={`${collection.label} broadcasts`}>
            <div className="guide-selection-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(5,8,13,.98), rgba(5,8,13,.4)), url(${collection.artwork})` }}>
              <span className="guide-selection-kind">Now tuned · {collection.kind}</span>
              {collection.bengaliLabel && <h3>{collection.bengaliLabel}</h3>}
              <p className="guide-selection-name">{collection.label}</p>
              <p>{collection.sourceWriter ?? collection.entityLabel ?? `${collection.videoCount} archived broadcasts`}</p>
              <div className="guide-selection-actions">
                <button type="button" className="guide-play" onClick={onPlayCollection} disabled={!collectionReady}>
                  <Play size={15} fill="currentColor" /> Play all
                </button>
                <button type="button" onClick={onShuffleCollection} disabled={!collectionReady}>
                  <Shuffle size={15} /> Shuffle all
                </button>
                <button type="button" onClick={onAddCollection} disabled={!collectionReady || collectionQueued}>
                  {collectionQueued ? <Check size={15} /> : <ListPlus size={15} />} {collectionQueued ? "Queued" : "Add all"}
                </button>
                <a href={youtubeUrl} target="_blank" rel="noreferrer" aria-label={`Open ${collection.label} playlist on YouTube`}>
                  <YouTubeMark size={18} /> YouTube playlist
                </a>
              </div>
            </div>
            <div className="guide-episode-head">
              <span><Headphones size={14} /> Broadcasts</span>
              <em>{episodes.length || collection.videoCount} available</em>
            </div>
            {episodes.length ? (
              <EpisodeList
                stationCode={stationCode}
                episodes={episodes}
                currentIndex={currentIndex}
                query={query}
                onSelect={onPlayEpisode}
                onAdd={onAddEpisode}
                queuedIds={queuedIds}
              />
            ) : (
              <div className="catalogue-loading"><span /> Tuning this collection…</div>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}
