import { useEffect, useRef } from "react";

export function ExternalPopup({ src, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(event) {
      if (panelRef.current?.contains(event.target)) return;
      onClose();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [onClose]);

  return (
    <div className="link-panel-layer" aria-label="External link panel">
      <div className="link-inline-panel" ref={panelRef}>
        <div className="link-panel-bar">
          <button className="link-panel-close" type="button" aria-label="Close popup" onClick={onClose}>
            ×
          </button>
        </div>
        <iframe className="popup-frame" src={src} title="External link"></iframe>
      </div>
    </div>
  );
}
