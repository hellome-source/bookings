export function ProfileAvatar({ src = "", className = "" }) {
  return (
    <div className={`avatar ${className}`} aria-hidden="true">
      {src ? (
        <img className="avatar-img" src={src} alt="" />
      ) : (
        <div className="avatar-face">
          <div className="hair"></div>
          <div className="head"></div>
          <div className="shirt"></div>
          <div className="jacket left"></div>
          <div className="jacket right"></div>
        </div>
      )}
    </div>
  );
}
