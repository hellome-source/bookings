import { BookingPage } from "../components/BookingPage";
import { defaultProfile, decodeShareSettings, shareKey } from "../lib/settings";
import { fetchSupabaseProfile, supabaseProfileKey } from "../lib/supabase";

export default async function Page({ searchParams }) {
  const params = await searchParams;
  let profile = defaultProfile;

  const slug = params?.[supabaseProfileKey];
  if (slug) {
    try {
      const supabaseProfile = await fetchSupabaseProfile(slug);
      if (supabaseProfile) {
        profile = supabaseProfile;
      }
    } catch {
      // fall through to share/default
    }
  }

  if (profile === defaultProfile) {
    const sharePayload = params?.[shareKey];
    const shareProfile = decodeShareSettings(sharePayload);
    if (shareProfile) {
      profile = shareProfile;
    }
  }

  return <BookingPage initialProfile={profile} />;
}
