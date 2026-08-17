import { SITE } from "../config";

interface DisclaimerModalProps {
  onConfirm: () => void;
}

export function DisclaimerModal({ onConfirm }: DisclaimerModalProps) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="disclaimer-title">
      <div className="modal">
        <div className="modal-eyebrow">Before you tune in</div>
        <h2 className="modal-title" id="disclaimer-title">
          Unofficial fan tribute
        </h2>
        <div className="modal-body">
          <p>
            This is an unofficial fan tribute to {SITE.title}. The creator has no
            affiliation with Radio Mirchi, Mirchi Bangla, or RJ Mir.
          </p>
          <p>
            All stories stream directly from YouTube — this site does not host, own,
            or produce any audio. Rights belong solely to Radio Mirchi / Mirchi Bangla
            and the original creators.
          </p>
          <p>
            If you are a rights holder and want something removed,{" "}
            <a href={`mailto:${SITE.contactEmail}`}>get in touch</a>.
          </p>
          <p>By continuing, you acknowledge this is an unofficial fan page with no official ties.</p>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-primary" onClick={onConfirm}>
            Return to the radio
          </button>
        </div>
      </div>
    </div>
  );
}
