"use client";

import { useEffect, useState } from "react";
import { CalendarPicker } from "../components/CalendarPicker";
import { ConfirmBookingModal } from "../components/ConfirmBookingModal";
import { ExternalPopup } from "../components/ExternalPopup";
import { MeetingCard } from "../components/MeetingCard";
import { ProfileCard } from "../components/ProfileCard";
import { TimePicker } from "../components/TimePicker";
import { TimezonePicker } from "../components/TimezonePicker";
import { TopBar } from "../components/TopBar";
import { availableTimesForDate, dateFromKey, dateToKey, detectTimezoneOption, getInitialBookingSelection } from "../lib/booking-data";
import { buildBookingLink, defaultProfile, readProfileSettings, readShareSettings } from "../lib/settings";
import { readSupabaseProfile } from "../lib/supabase";

export default function Page() {
  const [initialSelection] = useState(() => getInitialBookingSelection());
  const [profile, setProfile] = useState(defaultProfile);
  const [selectedTime, setSelectedTime] = useState(initialSelection.time);
  const [visibleMonth, setVisibleMonth] = useState(new Date(initialSelection.date.getFullYear(), initialSelection.date.getMonth(), 1));
  const [selectedDateKey, setSelectedDateKey] = useState(initialSelection.dateKey);
  const [timezoneOpen, setTimezoneOpen] = useState(false);
  const [timezone, setTimezone] = useState("GMT / UTC");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [linkPopupOpen, setLinkPopupOpen] = useState(false);

  const selectedDate = dateFromKey(selectedDateKey);
  const availableTimes = availableTimesForDate(selectedDateKey);
  const bookingLink = buildBookingLink(profile.bookingEmail);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const supabaseProfile = await readSupabaseProfile();
        if (!cancelled) {
          setProfile(supabaseProfile || readShareSettings() || readProfileSettings());
        }
      } catch {
        if (!cancelled) {
          setProfile(readShareSettings() || readProfileSettings());
        }
      }
    }

    loadProfile();
    setTimezone(detectTimezoneOption());

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!confirmOpen && !linkPopupOpen) return undefined;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [confirmOpen, linkPopupOpen]);

  function chooseDate(date) {
    const nextDateKey = dateToKey(date);

    setSelectedDateKey(nextDateKey);
    setSelectedTime("");
  }

  function handleDateGridClick(event) {
    const button = event.target.closest("[data-date-key]");
    if (!button) return;

    chooseDate(dateFromKey(button.dataset.dateKey));
  }

  function handleTimeListClick(event) {
    const button = event.target.closest("[data-time]");
    if (!button) return;

    setSelectedTime(button.dataset.time);
  }

  function handleTimezoneSelect(option) {
    setTimezone(option);
    setTimezoneOpen(false);
  }

  function handleSignIn() {
    setConfirmOpen(false);
    setLinkPopupOpen(true);
  }

  return (
    <>
      <TopBar />
      {linkPopupOpen ? <ExternalPopup src={bookingLink} onClose={() => setLinkPopupOpen(false)} /> : null}

      <main className="page-shell">
        <ProfileCard profile={profile} />

        <section className="booking-panel" aria-label="Book a meeting">
          <MeetingCard profile={profile} />
          <div className="divider"></div>

          <div className="availability-head">
            <h2>Available times</h2>
            <TimezonePicker timezone={timezone} timezoneOpen={timezoneOpen} onToggle={() => setTimezoneOpen((open) => !open)} onSelect={handleTimezoneSelect} onClose={() => setTimezoneOpen(false)} />
          </div>

          <div className="availability-grid">
            <CalendarPicker visibleMonth={visibleMonth} selectedDateKey={selectedDateKey} onMonthChange={setVisibleMonth} onToday={(month, dateKey) => {
              setVisibleMonth(month);
              chooseDate(dateFromKey(dateKey));
            }} onDateGridClick={handleDateGridClick} />
            <TimePicker selectedDate={selectedDate} selectedTime={selectedTime} availableTimes={availableTimes} onTimeListClick={handleTimeListClick} />
          </div>

          <div className="footer-action">
            <button className="next-button" type="button" disabled={!selectedTime} onClick={() => setConfirmOpen(true)}>
              <span>Next</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9 6 6 6-6 6"></path>
              </svg>
            </button>
          </div>
        </section>
      </main>

      {confirmOpen ? <ConfirmBookingModal profile={profile} selectedDate={selectedDate} selectedTime={selectedTime} onClose={() => setConfirmOpen(false)} onSignIn={handleSignIn} /> : null}
    </>
  );
}
