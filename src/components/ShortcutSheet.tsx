import { Fragment } from "react";

interface ShortcutSheetProps {
  onClose: () => void;
}

const SHORTCUTS: [string, string][] = [
  ["Space", "Play / pause"],
  ["← / →", "Seek ±5s"],
  ["Shift + ← / →", "Previous / next episode"],
  ["↑ / ↓", "Volume up / down"],
  ["M", "Mute"],
  ["S", "Shuffle"],
  ["?", "Toggle this sheet"],
];

export function ShortcutSheet({ onClose }: ShortcutSheetProps) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="shortcuts-title" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-eyebrow">Keyboard</div>
        <h2 className="modal-title" id="shortcuts-title">
          Shortcuts
        </h2>
        <div className="shortcut-grid">
          {SHORTCUTS.map(([key, desc]) => (
            <Fragment key={key}>
              <kbd>{key}</kbd>
              <span>{desc}</span>
            </Fragment>
          ))}
        </div>
        <div className="modal-actions">
          <button type="button" className="modal-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
