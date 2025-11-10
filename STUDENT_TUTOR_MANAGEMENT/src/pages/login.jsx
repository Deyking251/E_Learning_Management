import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import { auth } from "../auth";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
    if (auth.login({ email, password })) {
      nav("/", { replace: true });
    } }else {
      setErr("Invalid credentials");
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-title">Sign in</h1>
        <p className="muted" style={{ marginTop: 4 }}>Demo accepts any email & password.</p>

        <label className="label">Email</label>
        <input
          className="input wide"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="label">Password</label>
        <input
          className="input wide"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {err && <div className="error">{err}</div>}

        <button type="submit" className="btn primary wide" style={{ marginTop: 12 }}>
          Continue
        </button>

        <div className="muted small" style={{ textAlign: "center", marginTop: 10 }}>
          <Link to="/">Back to site</Link>
        </div>
      </form>
    </div>
  );
}
