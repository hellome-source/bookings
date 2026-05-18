import { TeamsIcon } from "./icons";

export function MeetingCard({ profile }) {
  return (
    <div className="meeting-section">
      <h2>Choose a meeting type</h2>
      <button className="meeting-card" type="button" aria-pressed="true">
        <span className="meeting-title-row">
          <svg className="meeting-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 2v3M17 2v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
          </svg>
          <strong>{profile.meetingTitle}</strong>
        </span>
        <span className="meeting-copy">
          <span className="role">{profile.role}</span>
          <span className="meta">
            <b>30 min</b>
            <span className="teams" aria-hidden="true">
              <TeamsIcon />
              Microsoft Teams
            </span>
          </span>
          <span className="description">{profile.meetingDescription}</span>
        </span>
      </button>
    </div>
  );
}
