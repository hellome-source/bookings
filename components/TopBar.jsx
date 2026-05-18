export function TopBar({ title = "Bookings with me" }) {
  return (
    <header className="topbar">
      <span className="msb-topbar-logo">
        <img className="brand-icon" src="/logo.svg" alt="" />
        <h1>{title}</h1>
      </span>
    </header>
  );
}
