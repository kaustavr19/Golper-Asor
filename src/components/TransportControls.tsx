import { Pause, Play, Shuffle, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from "lucide-react";
import { YouTubeMark } from "./YouTubeMark";

interface TransportControlsProps {
  isPlaying: boolean;
  shuffle: boolean;
  muted: boolean;
  volume: number;
  disabled: boolean;
  youtubeUrl: string;
  onToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onShuffle: () => void;
  onMute: () => void;
  onVolume: (v: number) => void;
}

const ICON_SIZE = 18;
const ICON_STROKE = 1.75;

function VolumeIcon({ muted, volume }: { muted: boolean; volume: number }) {
  if (muted || volume === 0) return <VolumeX size={ICON_SIZE} strokeWidth={ICON_STROKE} />;
  if (volume < 50) return <Volume1 size={ICON_SIZE} strokeWidth={ICON_STROKE} />;
  return <Volume2 size={ICON_SIZE} strokeWidth={ICON_STROKE} />;
}

export function TransportControls({
  isPlaying,
  shuffle,
  muted,
  volume,
  disabled,
  youtubeUrl,
  onToggle,
  onNext,
  onPrev,
  onShuffle,
  onMute,
  onVolume,
}: TransportControlsProps) {
  return (
    <div className="transport">
      <button
        type="button"
        className={`transport-btn${shuffle ? " active" : ""}`}
        onClick={onShuffle}
        aria-pressed={shuffle}
        aria-label="Shuffle episodes"
        title="Shuffle (s)"
      >
        <Shuffle size={ICON_SIZE} strokeWidth={ICON_STROKE} />
      </button>
      <button
        type="button"
        className="transport-btn"
        onClick={onPrev}
        disabled={disabled}
        aria-label="Previous episode"
        title="Previous (shift + ←)"
      >
        <SkipBack size={ICON_SIZE} strokeWidth={ICON_STROKE} />
      </button>
      <button
        type="button"
        className="transport-btn primary"
        onClick={onToggle}
        disabled={disabled}
        aria-label={isPlaying ? "Pause" : "Play"}
        title="Play / Pause (space)"
      >
        {isPlaying ? (
          <Pause size={22} strokeWidth={ICON_STROKE} fill="currentColor" />
        ) : (
          <Play size={22} strokeWidth={ICON_STROKE} fill="currentColor" />
        )}
      </button>
      <button
        type="button"
        className="transport-btn"
        onClick={onNext}
        disabled={disabled}
        aria-label="Next episode"
        title="Next (shift + →)"
      >
        <SkipForward size={ICON_SIZE} strokeWidth={ICON_STROKE} />
      </button>
      <div className="volume-group">
        <button
          type="button"
          className="transport-btn"
          onClick={onMute}
          aria-pressed={muted}
          aria-label={muted ? "Unmute" : "Mute"}
          title="Mute (m)"
        >
          <VolumeIcon muted={muted} volume={volume} />
        </button>
        <input
          type="range"
          className="volume-slider"
          min={0}
          max={100}
          value={muted ? 0 : volume}
          onChange={(e) => onVolume(Number(e.target.value))}
          aria-label="Volume"
          style={{ ["--volume-pct" as string]: `${muted ? 0 : volume}%` }}
        />
      </div>
      <a
        className="transport-btn youtube-link"
        href={youtubeUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Open the current story on YouTube"
        title="Open in YouTube"
      >
        <YouTubeMark size={20} />
      </a>
    </div>
  );
}
