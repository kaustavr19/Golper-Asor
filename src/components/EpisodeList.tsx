import { Check, ListPlus } from "lucide-react";
import type { Episode } from "../episodes";
import { ytThumb, handleThumbError } from "../utils/thumbnail";

interface EpisodeListProps {
  stationCode: string;
  episodes: Episode[];
  currentIndex: number;
  query?: string;
  onSelect: (index: number) => void;
  onAdd?: (index: number) => void;
  queuedIds?: ReadonlySet<string>;
}

export function EpisodeList({ stationCode, episodes, currentIndex, query = "", onSelect, onAdd, queuedIds }: EpisodeListProps) {
  const needle = query.trim().toLocaleLowerCase();
  const visibleEpisodes = episodes
    .map((episode, index) => ({ episode, index }))
    .filter(({ episode }) => !needle || `${episode.titleEn} ${episode.titleBn ?? ""}`.toLocaleLowerCase().includes(needle));

  return (
    <section className="episode-section">
      <div className="episode-divider">episodes</div>
      <ul className="episode-list">
        {visibleEpisodes.map(({ episode: ep, index: i }) => (
          <li key={`${ep.id}-${i}`}>
            <div className={`episode-row-wrap${i === currentIndex ? " active" : ""}`}>
              <button
                type="button"
                className={`episode-row${i === currentIndex ? " active" : ""}`}
                onClick={() => onSelect(i)}
                disabled={ep.titleEn === "Loading title…"}
                aria-current={i === currentIndex ? "true" : undefined}
              >
                <span className="episode-index">{stationCode}-{String(i + 1).padStart(3, "0")}</span>
                <span className="episode-thumb">
                  <img src={ytThumb(ep.id)} onError={(e) => handleThumbError(e, ep.id)} alt="" loading="lazy" />
                </span>
                <span className="episode-titles">
                  <span className={`episode-title-en${ep.titleIsFallback && ep.titleBn ? " bengali-primary" : ""}`}>
                    {ep.titleIsFallback && ep.titleBn ? ep.titleBn : ep.titleEn}
                  </span>
                  {ep.titleBn && !ep.titleIsFallback && <span className="episode-title-bn">{ep.titleBn}</span>}
                </span>
                <span className="episode-duration">{ep.duration ?? "--:--"}</span>
              </button>
              {onAdd && (
                <button
                  type="button"
                  className={`episode-queue-add${queuedIds?.has(ep.id) ? " queued" : ""}`}
                  onClick={() => onAdd(i)}
                  disabled={queuedIds?.has(ep.id) || ep.titleEn === "Loading title…"}
                  aria-label={queuedIds?.has(ep.id) ? `${ep.titleEn} is already queued` : `Add ${ep.titleEn} to queue`}
                  title={queuedIds?.has(ep.id) ? "Already queued" : "Add to queue"}
                >
                  {queuedIds?.has(ep.id) ? <Check size={14} /> : <ListPlus size={14} />}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {!visibleEpisodes.length && <div className="episode-search-empty">No broadcasts in this collection match “{query}”.</div>}
    </section>
  );
}
