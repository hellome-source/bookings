import { defaultProfile } from "./settings";

const SHARE_DOMAIN = "https://bookings.pritzkerorgfamilyoffice.com";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabaseProfileKey = "id";

function hasSupabaseConfig() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

function profileToRow(profile) {
  return {
    display_name: profile.displayName || defaultProfile.displayName,
    role: profile.role || defaultProfile.role,
    booking_label: profile.bookingLabel || defaultProfile.bookingLabel,
    meeting_title: profile.meetingTitle || defaultProfile.meetingTitle,
    meeting_description: profile.meetingDescription || defaultProfile.meetingDescription,
    booking_email: profile.bookingEmail || defaultProfile.bookingEmail,
    sign_in_url: profile.signInUrl || defaultProfile.signInUrl,
    available_days: JSON.stringify(profile.availableDays || defaultProfile.availableDays),
    time_range: JSON.stringify(profile.timeRange || defaultProfile.timeRange),
    profile_photo: profile.profilePhoto || ""
  };
}

function rowToProfile(row) {
  return {
    ...defaultProfile,
    displayName: row.display_name || defaultProfile.displayName,
    role: row.role || defaultProfile.role,
    bookingLabel: row.booking_label || defaultProfile.bookingLabel,
    meetingTitle: row.meeting_title || defaultProfile.meetingTitle,
    meetingDescription: row.meeting_description || defaultProfile.meetingDescription,
    bookingEmail: row.booking_email || defaultProfile.bookingEmail,
    signInUrl: row.sign_in_url || defaultProfile.signInUrl,
    availableDays: row.available_days ? JSON.parse(row.available_days) : defaultProfile.availableDays,
    timeRange: row.time_range ? JSON.parse(row.time_range) : defaultProfile.timeRange,
    profilePhoto: row.profile_photo || ""
  };
}

async function supabaseRequest(path, options = {}) {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase is not configured.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Supabase request failed.");
  }

  return response.json();
}

export function buildSupabaseShareUrl(slug) {
  const url = new URL(SHARE_DOMAIN + "/");
  url.searchParams.set(supabaseProfileKey, slug);
  return url.toString();
}

export async function createBookingProfile(profile) {
  const rows = await supabaseRequest("booking_profiles", {
    method: "POST",
    headers: {
      Prefer: "return=representation"
    },
    body: JSON.stringify(profileToRow(profile))
  });

  const row = rows?.[0];
  if (!row?.slug) {
    throw new Error("Supabase did not return a profile slug.");
  }

  return {
    slug: row.slug,
    profile: rowToProfile(row)
  };
}

export async function readSupabaseProfile() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get(supabaseProfileKey);
  if (!slug) return null;

  const rows = await supabaseRequest(`booking_profiles?slug=eq.${encodeURIComponent(slug)}&select=*`);
  const row = rows?.[0];
  return row ? rowToProfile(row) : null;
}

export async function fetchSupabaseProfile(slug) {
  if (!slug) return null;
  const rows = await supabaseRequest(`booking_profiles?slug=eq.${encodeURIComponent(slug)}&select=*`);
  const row = rows?.[0];
  return row ? rowToProfile(row) : null;
}
