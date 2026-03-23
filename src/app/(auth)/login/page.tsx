"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "var(--color-depth-1)" }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #00F0FF, transparent 70%)", top: "-150px", right: "-100px" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #A855F7, transparent 70%)", bottom: "-100px", left: "-50px" }} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00F0FF, #4D7CFF)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="text-[15px] font-bold tracking-[-0.02em]" style={{ color: "rgba(255,255,255,0.9)" }}>
              ENTRENAR
            </span>
          </Link>
          <h1 className="text-[28px] font-bold tracking-[-0.03em] mb-2" style={{ color: "rgba(255,255,255,0.95)" }}>
            Welcome back
          </h1>
          <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            Sign in to continue training
          </p>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl mb-5 text-[13px] font-medium"
            style={{ background: "rgba(255,59,92,0.1)", color: "#FF3B5C", border: "1px solid rgba(255,59,92,0.2)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full !py-3 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-[13px] mt-8" style={{ color: "rgba(255,255,255,0.3)" }}>
          No account?{" "}
          <Link href="/register" className="font-medium hover:underline" style={{ color: "#00F0FF" }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
