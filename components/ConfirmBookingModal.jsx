import { formatSelectedDate } from "../lib/booking-data";
import { CalendarIcon, ClockIcon, PersonIcon, TeamsIcon } from "./icons";
import { ProfileAvatar } from "./ProfileAvatar";

export function ConfirmBookingModal({ profile, selectedDate, selectedTime, onClose, onSignIn }) {
  return (
    <div className="popup-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onClick={onClose}>
      <div className="signin-card" onClick={(event) => event.stopPropagation()}>
        <button className="popup-close signin-close" type="button" aria-label="Close popup" onClick={onClose}>
          ×
        </button>
        <div className="signin-host">
          <ProfileAvatar src={profile.profilePhoto} className="signin-avatar" />
          <strong>{profile.displayName}</strong>
        </div>

        <h2 id="confirm-title">Confirm your booking</h2>
        <p className="signin-subtitle">Quick verification to secure your meeting slot</p>

        <div className="summary-card">
          <h3>Booking Summary</h3>
          <div className="summary-row">
            <CalendarIcon className="summary-icon blue" />
            <span>{profile.meetingTitle}</span>
          </div>
          <div className="summary-row">
            <ClockIcon className="summary-icon gray" />
            <span>{formatSelectedDate(selectedDate)} at {selectedTime || "8:00 AM"}</span>
          </div>
          <div className="summary-row">
            <PersonIcon className="summary-icon gray filled" />
            <span>
              30 min · <span className="summary-teams"><TeamsIcon className="summary-teams-icon" />Microsoft Teams</span>
            </span>
          </div>
        </div>

        <button className="signin-button" type="button" onClick={onSignIn}>
          <span className="signin-button-icon">
            <PersonIcon />
          </span>
          <span>Sign in with a Microsoft 365 work or school account</span>
        </button>
      </div>
    </div>
  );
}
