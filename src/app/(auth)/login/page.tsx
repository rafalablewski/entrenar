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
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-[15px] font-semibold tracking-tight text-[#1A1A1A]">
            entrenar
          </Link>
          <h1 className="text-[24px] font-semibold tracking-tight mt-6 mb-2">Welcome back</h1>
          <p className="text-[14px] text-[#6B6B6B]">Sign in to your account</p>
        </div>
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl mb-4 text-[13px]">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
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
            className="btn-primary w-full !py-2.5 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-[13px] text-[#9CA3AF] mt-6">
          No account?{" "}
          <Link href="/register" className="text-[#0071E3] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
