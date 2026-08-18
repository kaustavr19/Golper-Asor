import { ArrowDown, ArrowUp, ListPlus, Play, Trash2 } from "lucide-react";
import type { QueueEpisode } from "../episodes";
import { handleThumbError, ytThumb } from "../utils/thumbnail";

interface QueueDrawerProps {
  queue: QueueEpisode[];
  currentIndex: number;
  hasPlaybackStarted: boolean;
  onPlay: (index: number) => void;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onClear: () => void;
  onExplore: () => void;
}

const displayTitle = (episode: QueueEpisode) => episode.titleIsFallback && episode.titleBn
  ? episode.titleBn
  : episode.titleEn;

export function QueueDrawer({ queue, currentIndex, hasPlaybackStarted, onPlay, onRemove, onMove, onClear, onExplore }: QueueDrawerProps) {
  const current = queue[currentIndex];
  const upNext = queue.slice(currentIndex + 1);

  if (!current) {
    return (
      <div className="queue-empty">
        <ListPlus size={25} />
        <strong>Your queue is quiet</strong>
        <p>Add individual broadcasts or an entire character, writer, or genre collection.</p>
        <button type="button" onClick={onExplore}>Explore programme guide</button>
      </div>
    );
  }

  return (
    <div className="queue-drawer-content">
      <section className="queue-now" aria-label="Now playing from queue">
        <span className="drawer-eyebrow">{hasPlaybackStarted ? "Now playing" : "Ready to play"}</span>
        <div className="queue-now-card">
          <img src={ytThumb(current.id)} onError={(event) => handleThumbError(event, current.id)} alt="" />
          <div>
            <strong>{displayTitle(current)}</strong>
            <span>{current.source.collectionLabel}</span>
          </div>
        </div>
      </section>

      <div className="queue-list-head">
        <span>Up next</span>
        <em>{upNext.length} waiting</em>
      </div>

      {upNext.length ? (
        <ol className="queue-list">
          {upNext.map((episode, offset) => {
            const index = currentIndex + offset + 1;
            return (
              <li key={`${episode.id}-${index}`}>
                <button type="button" className="queue-item-main" onClick={() => onPlay(index)} aria-label={`Play ${displayTitle(episode)} now`}>
                  <span>{String(offset + 1).padStart(2, "0")}</span>
                  <img src={ytThumb(episode.id)} onError={(event) => handleThumbError(event, episode.id)} alt="" loading="lazy" />
                  <span className="queue-item-copy">
                    <strong>{displayTitle(episode)}</strong>
                    <small>{episode.source.collectionLabel}</small>
                  </span>
                  <Play size={13} />
                </button>
                <span className="queue-item-actions">
                  <button type="button" onClick={() => onMove(index, -1)} disabled={offset === 0} aria-label={`Move ${displayTitle(episode)} up`}><ArrowUp size={13} /></button>
                  <button type="button" onClick={() => onMove(index, 1)} disabled={offset === upNext.length - 1} aria-label={`Move ${displayTitle(episode)} down`}><ArrowDown size={13} /></button>
                  <button type="button" onClick={() => onRemove(index)} aria-label={`Remove ${displayTitle(episode)} from queue`}><Trash2 size={13} /></button>
                </span>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="queue-finished">Nothing else is queued. Add another story or collection whenever you like.</div>
      )}

      <div className="queue-footer-actions">
        <button type="button" onClick={onExplore}>Add more stories</button>
        {upNext.length > 0 && <button type="button" onClick={onClear}>Clear up next</button>}
      </div>
    </div>
  );
}
