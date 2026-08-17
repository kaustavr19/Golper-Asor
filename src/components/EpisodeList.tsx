import type { Episode } from "../episodes";
import { ytThumb, handleThumbError } from "../utils/thumbnail";

interface EpisodeListProps {
  stationCode: string;
  episodes: Episode[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export function EpisodeList({ stationCode, episodes, currentIndex, onSelect }: EpisodeListProps) {
  return (
    <section className="episode-section">
      <div className="episode-divider">episodes</div>
      <ul className="episode-list">
        {episodes.map((ep, i) => (
          <li key={`${ep.id}-${i}`}>
            <button
              type="button"
              className={`episode-row${i === currentIndex ? " active" : ""}`}
              onClick={() => onSelect(i)}
              aria-current={i === currentIndex ? "true" : undefined}
            >
              <span className="episode-index">{stationCode}-{String(i + 1).padStart(3, "0")}</span>
              <span className="episode-thumb">
                <img src={ytThumb(ep.id)} onError={(e) => handleThumbError(e, ep.id)} alt="" loading="lazy" />
              </span>
              <span className="episode-titles">
                <span className="episode-title-en">{ep.titleEn}</span>
                {ep.titleBn && <span className="episode-title-bn">{ep.titleBn}</span>}
              </span>
              <span className="episode-duration">{ep.duration ?? "--:--"}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
