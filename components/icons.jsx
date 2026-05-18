export function CheckCircleIcon() {
  return (
    <svg className="check-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.75"></circle>
      <path d="m7.75 12.1 2.75 2.75 5.75-6.2"></path>
    </svg>
  );
}

export function CalendarIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 2v3M17 2v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
    </svg>
  );
}

export function ClockIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9"></circle>
      <path d="M12 7v6l4 2"></path>
    </svg>
  );
}

export function PersonIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3"></circle>
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0"></path>
    </svg>
  );
}

export function TeamsIcon({ className = "" }) {
  return <img className={className} src="/teams-icon.svg" alt="" />;
}
