import { useEffect, useRef } from "react";
import { timezoneOptions } from "../lib/booking-data";

export function TimezonePicker({ timezone, timezoneOpen, onToggle, onSelect, onClose }) {
  const pickerRef = useRef(null);

  useEffect(() => {
    if (!timezoneOpen) return undefined;

    function handlePointerDown(event) {
      if (pickerRef.current?.contains(event.target)) return;
      onClose();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [timezoneOpen, onClose]);

  return (
    <div className="timezone-wrap" ref={pickerRef}>
      <button className={`timezone${timezoneOpen ? " open" : ""}`} type="button" aria-haspopup="listbox" aria-expanded={timezoneOpen} onClick={onToggle}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M3 12h18M12 3c2.3 2.4 3.5 5.4 3.5 9S14.3 18.6 12 21c-2.3-2.4-3.5-5.4-3.5-9S9.7 5.4 12 3z"></path>
        </svg>
        <span>{timezone}</span>
        <svg className="chevron" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </button>

      {timezoneOpen ? (
        <div className="timezone-menu" role="listbox" aria-label="Time zone">
          {timezoneOptions.map((option) => (
            <button className="timezone-option" type="button" role="option" aria-selected={timezone === option} onClick={() => onSelect(option)} key={option}>
              <span className="timezone-check">{timezone === option ? "✓" : ""}</span>
              <span>{option}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
