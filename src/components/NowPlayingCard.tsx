import type { Episode } from "../episodes";
import { episodeSecondaryLabel } from "../utils/titleParser";
import { ytThumb, handleThumbError } from "../utils/thumbnail";
import { SITE } from "../config";

interface NowPlayingCardProps {
  episode?: Episode;
  isPlaying: boolean;
  contextLabel?: string;
}

export function NowPlayingCard({ episode, isPlaying, contextLabel }: NowPlayingCardProps) {
  const secondary = episode ? episodeSecondaryLabel(episode.series, episode.author) || contextLabel : "";

  return (
    <section className="now-playing" aria-live="polite">
      <div className="now-playing-art" aria-hidden={!episode}>
        {episode ? (
          <img
            src={ytThumb(episode.id, "max")}
            onError={(e) => handleThumbError(e, episode.id)}
            alt=""
            loading="eager"
          />
        ) : (
          <div className="now-playing-art-placeholder" />
        )}
      </div>
      <div className="now-playing-body">
        <div className={`on-air-row${isPlaying ? " live" : ""}`}>
          <span className={`on-air-dot${isPlaying ? " live" : ""}`} aria-hidden />
          {isPlaying ? "On air" : "Standing by"}
        </div>
        {episode ? (
          <>
            <h2 className={`now-playing-title${episode.titleIsFallback && episode.titleBn ? " bengali-primary" : ""}`}>
              {episode.titleIsFallback && episode.titleBn ? episode.titleBn : episode.titleEn}
            </h2>
            {episode.titleBn && !episode.titleIsFallback && <p className="now-playing-title-bn">{episode.titleBn}</p>}
            {secondary && <p className="now-playing-series">{secondary}</p>}
          </>
        ) : (
          <h2 className="now-playing-title">Tuning to {SITE.frequency}…</h2>
        )}
      </div>
    </section>
  );
}
