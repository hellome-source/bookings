"use client";

import { useEffect, useState } from "react";
import { buildSupabaseShareUrl, createBookingProfile } from "../../lib/supabase";
import { defaultProfile, buildShareUrl, readProfileSettings, settingsKey, writeProfileSettings } from "../../lib/settings";

export default function AdminPage() {
  const [settings, setSettings] = useState(defaultProfile);
  const [status, setStatus] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const nextSettings = readProfileSettings();
    setSettings(nextSettings);
    setShareUrl(buildShareUrl(nextSettings));
  }, []);

  function updateField(field, value) {
    setSettings((current) => {
      const nextSettings = { ...current, [field]: value };
      setShareUrl(buildShareUrl(nextSettings));
      return nextSettings;
    });
    setStatus("");
  }

  async function saveSettings(event) {
    event.preventDefault();
    writeProfileSettings(settings);
    setStatus("Saving...");

    try {
      const { slug } = await createBookingProfile(settings);
      setShareUrl(buildSupabaseShareUrl(slug));
      setStatus("Saved to Supabase. Use the share link to open this exact profile on any device.");
    } catch {
      setShareUrl(buildShareUrl(settings));
      setStatus("Saved locally. Run the Supabase SQL, then save again to create a short link.");
    }
  }

  async function copyShareUrl() {
    await navigator.clipboard.writeText(shareUrl);
    setStatus("Share link copied.");
  }

  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Could not read image."));
      reader.onload = () => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Could not load image."));
        image.src = String(reader.result || "");
      };
      reader.readAsDataURL(file);
    });
  }

  function resetSettings() {
    setSettings(defaultProfile);
    window.localStorage.removeItem(settingsKey);
    setShareUrl(buildShareUrl(defaultProfile));
    setStatus("Reset to defaults.");
  }

  function handlePhotoUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    loadImage(file)
      .then((image) => {
        const maxSize = 1024;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext("2d");
        if (!context) throw new Error("Could not process image.");

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        updateField("profilePhoto", canvas.toDataURL("image/png"));
      })
      .catch(() => {
        setStatus("Could not process that image.");
      });
  }

  return (
    <>
      <header className="topbar">
        <span className="msb-topbar-logo">
          <img className="brand-icon" src="/logo.svg" alt="" />
          <h1>Admin</h1>
        </span>
      </header>

      <main className="admin-shell">
        <section className="admin-panel">
          <div className="admin-heading">
            <div>
              <h1>Booking Page Settings</h1>
              <p>Edit the public profile content shown on the booking page.</p>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <a href="/" className="admin-link">View page</a>
              <form action="/api/admin/logout" method="POST" style={{ margin: 0 }}>
                <button className="admin-link" style={{ border: 0, background: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>Sign out</button>
              </form>
            </div>
          </div>

          <div className="admin-grid">
            <form className="admin-form" onSubmit={saveSettings}>
              <label>
                <span>Display name</span>
                <input value={settings.displayName} onChange={(event) => updateField("displayName", event.target.value)} />
              </label>

              <label>
                <span>Role / title</span>
                <input value={settings.role} onChange={(event) => updateField("role", event.target.value)} />
              </label>

              <label>
                <span>Booking label</span>
                <input value={settings.bookingLabel} onChange={(event) => updateField("bookingLabel", event.target.value)} />
              </label>

              <label>
                <span>Meeting title</span>
                <input value={settings.meetingTitle} onChange={(event) => updateField("meetingTitle", event.target.value)} />
              </label>

              <label>
                <span>Meeting description</span>
                <textarea rows="3" value={settings.meetingDescription} onChange={(event) => updateField("meetingDescription", event.target.value)} />
              </label>

              <label>
                <span>Profile picture</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} />
              </label>

              <label>
                <span>Booking email</span>
                <input value={settings.bookingEmail || ""} onChange={(event) => updateField("bookingEmail", event.target.value)} />
              </label>

              <label>
                <span>Sign-in URL</span>
                <input placeholder="https://..." value={settings.signInUrl || ""} onChange={(event) => updateField("signInUrl", event.target.value)} />
              </label>

              <div className="admin-fieldset">
                <span>Available days</span>
                <div className="admin-checkboxes">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label, index) => (
                    <label key={index} className="admin-checkbox">
                      <input
                        type="checkbox"
                        checked={(settings.availableDays || []).includes(index)}
                        onChange={(event) => {
                          const current = settings.availableDays || [];
                          const next = event.target.checked
                            ? [...current, index]
                            : current.filter((d) => d !== index);
                          updateField("availableDays", next);
                        }}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="admin-field-row">
                <label>
                  <span>Start time</span>
                  <select value={settings.timeRange?.start || "8:00 AM"} onChange={(event) => updateField("timeRange", { ...(settings.timeRange || {}), start: event.target.value })}>
                    {["12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>End time</span>
                  <select value={settings.timeRange?.end || "2:00 PM"} onChange={(event) => updateField("timeRange", { ...(settings.timeRange || {}), end: event.target.value })}>
                    {["1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM", "12:00 AM"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="admin-actions">
                <button className="admin-save" type="submit">Save changes</button>
                <button className="admin-reset" type="button" onClick={resetSettings}>Reset</button>
              </div>

              <label className="admin-share">
                <span>Shareable link</span>
                <div className="admin-share-row">
                  <input readOnly value={shareUrl} onFocus={(event) => event.target.select()} />
                  <button className="admin-copy" type="button" onClick={copyShareUrl}>Copy</button>
                </div>
              </label>

              {status ? <p className="admin-status">{status}</p> : null}
            </form>

            <aside className="admin-preview" aria-label="Profile preview">
              <div className="admin-avatar">
                {settings.profilePhoto ? <img src={settings.profilePhoto} alt="" /> : <span>{settings.displayName.slice(0, 1) || "J"}</span>}
              </div>
              <h2>{settings.displayName || "Display name"}</h2>
              <p>{settings.role || "Role / title"}</p>
              <p>{settings.bookingEmail || "Booking email"}</p>
              <div className="admin-preview-card">
                <strong>{settings.meetingTitle || "Meeting title"}</strong>
                <span>{settings.meetingDescription || "Meeting description"}</span>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
