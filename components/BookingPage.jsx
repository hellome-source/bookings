"use client";

import { useEffect, useState } from "react";
import { CalendarPicker } from "./CalendarPicker";
import { ConfirmBookingModal } from "./ConfirmBookingModal";
import { ExternalPopup } from "./ExternalPopup";
import { MeetingCard } from "./MeetingCard";
import { ProfileCard } from "./ProfileCard";
import { TimePicker } from "./TimePicker";
import { TimezonePicker } from "./TimezonePicker";
import { TopBar } from "./TopBar";
import { availableTimesForDate, dateFromKey, dateToKey, detectTimezoneOption, getInitialBookingSelection } from "../lib/booking-data";
import { buildBookingLink, defaultProfile, readProfileSettings, readShareSettings } from "../lib/settings";
import { readSupabaseProfile } from "../lib/supabase";

export function BookingPage({ initialProfile }) {
  const [profile, setProfile] = useState(initialProfile);
  const [selectedTime, setSelectedTime] = useState("");
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const selection = getInitialBookingSelection(new Date(), initialProfile);
    return new Date(selection.date.getFullYear(), selection.date.getMonth(), 1);
  });
  const [selectedDateKey, setSelectedDateKey] = useState(() => {
    const selection = getInitialBookingSelection(new Date(), initialProfile);
    return selection.dateKey;
  });
  const [timezoneOpen, setTimezoneOpen] = useState(false);
  const [timezone, setTimezone] = useState("GMT / UTC");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [linkPopupOpen, setLinkPopupOpen] = useState(false);

  const selectedDate = dateFromKey(selectedDateKey);
  const availableTimes = availableTimesForDate(selectedDateKey, profile.availableDays, profile.timeRange);
  const bookingLink = buildBookingLink(profile.bookingEmail, profile.signInUrl);

  useEffect(() => {
    setTimezone(detectTimezoneOption());
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
            <CalendarPicker visibleMonth={visibleMonth} selectedDateKey={selectedDateKey} onMonthChange={setVisibleMonth} availableDays={profile.availableDays} onToday={(month, dateKey) => {
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
