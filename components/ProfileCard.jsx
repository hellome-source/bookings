import { ProfileAvatar } from "./ProfileAvatar";

export function ProfileCard({ profile }) {
  return (
    <section className="profile-card" aria-label="Booking profile">
      <div className="cover"></div>
      <div className="profile-body">
        <ProfileAvatar src={profile.profilePhoto} />
        <div className="profile-copy">
          <h2>{profile.displayName}</h2>
          <a href="#">{profile.bookingLabel}</a>
        </div>
      </div>
    </section>
  );
}
