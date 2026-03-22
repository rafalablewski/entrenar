"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"trainer" | "athlete">("trainer");
  const [trainerEmail, setTrainerEmail] = useState("");
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
      body: JSON.stringify({
        action: "register",
        name,
        email,
        password,
        role,
        trainerEmail: role === "athlete" ? trainerEmail : undefined,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Registration failed");
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
          <h1 className="text-[24px] font-semibold tracking-tight mt-6 mb-2">Create account</h1>
          <p className="text-[14px] text-[#6B6B6B]">Start your training journey</p>
        </div>
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl mb-4 text-[13px]">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRole("trainer")}
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-medium border transition-all ${
                role === "trainer"
                  ? "border-[#0071E3] bg-[#EBF5FF] text-[#0071E3]"
                  : "border-[rgba(0,0,0,0.12)] text-[#6B6B6B] hover:border-[rgba(0,0,0,0.2)]"
              }`}
            >
              Trainer
            </button>
            <button
              type="button"
              onClick={() => setRole("athlete")}
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-medium border transition-all ${
                role === "athlete"
                  ? "border-[#0071E3] bg-[#EBF5FF] text-[#0071E3]"
                  : "border-[rgba(0,0,0,0.12)] text-[#6B6B6B] hover:border-[rgba(0,0,0,0.2)]"
              }`}
            >
              Athlete
            </button>
          </div>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="input"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 characters)"
            className="input"
          />
          {role === "athlete" && (
            <input
              type="email"
              required
              value={trainerEmail}
              onChange={(e) => setTrainerEmail(e.target.value)}
              placeholder="Your trainer's email"
              className="input"
            />
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full !py-2.5 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="text-center text-[13px] text-[#9CA3AF] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#0071E3] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
