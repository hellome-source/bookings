"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed.");
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="topbar">
        <span className="msb-topbar-logo">
          <img className="brand-icon" src="/logo.svg" alt="" />
          <h1>Admin Login</h1>
        </span>
      </header>

      <main className="admin-shell">
        <section className="admin-panel">
          <div className="admin-heading">
            <h1>Admin Login</h1>
          </div>

          <form onSubmit={handleSubmit} className="admin-form admin-login-form">
            <label>
              <span>Password</span>
              <input
                type="password"
                name="password"
                autoFocus
                required
                disabled={loading}
              />
            </label>

            <div className="admin-actions">
              <button className="admin-save" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>

            {error ? <p className="admin-login-error">{error}</p> : null}
          </form>
        </section>
      </main>
    </>
  );
}
