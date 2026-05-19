"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

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

          <form action={formAction} className="admin-form admin-login-form">
            <label>
              <span>Password</span>
              <input
                type="password"
                name="password"
                autoFocus
                required
                disabled={pending}
              />
            </label>

            <div className="admin-actions">
              <button className="admin-save" type="submit" disabled={pending}>
                {pending ? "Signing in..." : "Sign in"}
              </button>
            </div>

            {state?.error ? (
              <p className="admin-login-error">{state.error}</p>
            ) : null}
          </form>
        </section>
      </main>
    </>
  );
}
