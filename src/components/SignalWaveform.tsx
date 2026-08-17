import { useRef } from "react";

interface SignalWaveformProps {
  progress: number;
  isPlaying: boolean;
  isSearching: boolean;
  disabled: boolean;
  onSeek: (fraction: number) => void;
}

const BAR_HEIGHTS = [
  24, 38, 58, 74, 46, 30, 64, 88, 72, 42, 26, 52,
  78, 96, 62, 36, 48, 82, 68, 34, 22, 44, 70, 90,
  66, 40, 28, 56, 84, 72, 48, 30, 60, 94, 76, 42,
  26, 50, 80, 64, 38, 22, 46, 74, 88, 58, 34, 20,
];

export function SignalWaveform({ progress, isPlaying, isSearching, disabled, onSeek }: SignalWaveformProps) {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const safeProgress = Math.max(0, Math.min(1, progress));

  const fractionFromX = (clientX: number) => {
    const waveform = waveformRef.current;
    if (!waveform) return 0;
    const rect = waveform.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    onSeek(fractionFromX(event.clientX));
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || disabled) return;
    onSeek(fractionFromX(event.clientX));
  };

  const stopDragging = () => {
    draggingRef.current = false;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      onSeek(Math.max(0, Math.min(1, safeProgress + (event.key === "ArrowLeft" ? -0.02 : 0.02))));
    }
  };

  return (
    <div
      className={`signal-waveform${isPlaying ? " playing" : ""}${isSearching ? " searching" : ""}`}
      ref={waveformRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onKeyDown={handleKeyDown}
      role="slider"
      aria-label="Seek through broadcast"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(safeProgress * 100)}
      tabIndex={disabled ? -1 : 0}
    >
      <span className="waveform-baseline" aria-hidden />
      <div className="waveform-bars" aria-hidden>
        {BAR_HEIGHTS.map((height, index) => {
          const position = index / (BAR_HEIGHTS.length - 1);
          return (
            <i
              key={index}
              className={position <= safeProgress ? "heard" : ""}
              style={{
                height: `${isSearching ? 28 + ((height + index * 17) % 68) : height}%`,
                animationDelay: `${-(index % 12) * 70}ms`,
              }}
            />
          );
        })}
      </div>
      <span className="waveform-head" style={{ left: `${safeProgress * 100}%` }} aria-hidden />
    </div>
  );
}
