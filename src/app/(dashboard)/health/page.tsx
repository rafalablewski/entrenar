"use client";

import { useEffect, useState } from "react";

interface HealthReport {
  id: string;
  user_id: string;
  type: "injury" | "pain" | "note";
  body_area: string;
  severity: number;
  title: string;
  description: string;
  status: "active" | "monitoring" | "resolved";
  reported_at: string;
  resolved_at: string | null;
  created_at: string;
  user_name?: string;
}

const typeColors: Record<string, string> = {
  injury: "#FF3B5C",
  pain: "#FF6B35",
  note: "#00F0FF",
};

const typeLabels: Record<string, string> = {
  injury: "Injury",
  pain: "Pain",
  note: "General Note",
};

const statusColors: Record<string, string> = {
  active: "#FF3B5C",
  monitoring: "#FFD600",
  resolved: "#00E676",
};

function severityColor(s: number): string {
  if (s <= 3) return "#00E676";
  if (s <= 6) return "#FFD600";
  return "#FF3B5C";
}

export default function HealthPage() {
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "pain" as "injury" | "pain" | "note",
    body_area: "",
    severity: 5,
    title: "",
    description: "",
    reported_at: new Date().toISOString().split("T")[0],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    const res = await fetch("/api/health-reports");
    const data = await res.json();
    setReports(data.reports || []);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/health-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({
      type: "pain",
      body_area: "",
      severity: 5,
      title: "",
      description: "",
      reported_at: new Date().toISOString().split("T")[0],
    });
    setShowForm(false);
    fetchReports();
  }

  async function handleUpdateStatus(report: HealthReport) {
    const resolved_at = editStatus === "resolved" ? new Date().toISOString().split("T")[0] : report.resolved_at;
    await fetch("/api/health-reports", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: report.id,
        status: editStatus,
        resolved_at,
        severity: report.severity,
        description: report.description,
      }),
    });
    setEditingId(null);
    fetchReports();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this health report?")) return;
    await fetch("/api/health-reports", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchReports();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-[32px] font-bold tracking-[-0.03em]"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            Health Reports
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
            {reports.length} report{reports.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={showForm ? "btn-secondary" : "btn-primary"}
        >
          {showForm ? "Cancel" : "New Report"}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <form onSubmit={handleCreate} className="space-y-4">
            {/* Type selector */}
            <div>
              <label
                className="text-[12px] font-semibold block mb-2"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Type
              </label>
              <div className="flex gap-2">
                {(["injury", "pain", "note"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t })}
                    className="px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200"
                    style={{
                      background:
                        form.type === t
                          ? `${typeColors[t]}18`
                          : "rgba(255,255,255,0.03)",
                      color: form.type === t ? typeColors[t] : "rgba(255,255,255,0.4)",
                      border:
                        form.type === t
                          ? `1px solid ${typeColors[t]}40`
                          : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {typeLabels[t]}
                  </button>
                ))}
              </div>
            </div>

            {/* Body area + Date */}
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                value={form.body_area}
                onChange={(e) => setForm({ ...form, body_area: e.target.value })}
                placeholder="Body area (e.g. Left Knee, Lower Back)"
                className="input"
              />
              <input
                type="date"
                required
                value={form.reported_at}
                onChange={(e) => setForm({ ...form, reported_at: e.target.value })}
                className="input"
              />
            </div>

            {/* Title */}
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title (e.g. Sharp pain during squats)"
              className="input"
            />

            {/* Severity slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="text-[12px] font-semibold"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Severity
                </label>
                <span
                  className="text-[14px] font-bold"
                  style={{ color: severityColor(form.severity) }}
                >
                  {form.severity}/10
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={form.severity}
                  onChange={(e) =>
                    setForm({ ...form, severity: parseInt(e.target.value) })
                  }
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #00E676 0%, #FFD600 50%, #FF3B5C 100%)`,
                    accentColor: severityColor(form.severity),
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description (symptoms, context, what triggers it...)"
              rows={3}
              className="input"
            />

            <button type="submit" className="btn-primary">
              Submit Report
            </button>
          </form>
        </div>
      )}

      {/* Reports list */}
      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              No health reports yet.
            </p>
          </div>
        ) : (
          reports.map((r) => (
            <div key={r.id} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3
                      className="text-[16px] font-bold"
                      style={{ color: "rgba(255,255,255,0.9)" }}
                    >
                      {r.title}
                    </h3>
                    {/* Type badge */}
                    <span
                      className="badge"
                      style={{
                        background: `${typeColors[r.type]}18`,
                        color: typeColors[r.type],
                        border: `1px solid ${typeColors[r.type]}30`,
                      }}
                    >
                      {typeLabels[r.type]}
                    </span>
                    {/* Status badge */}
                    <span
                      className="badge"
                      style={{
                        background: `${statusColors[r.status]}18`,
                        color: statusColors[r.status],
                        border: `1px solid ${statusColors[r.status]}30`,
                      }}
                    >
                      {r.status}
                    </span>
                    {/* Severity indicator */}
                    <span
                      className="text-[12px] font-bold px-2 py-0.5 rounded-lg"
                      style={{
                        background: `${severityColor(r.severity)}18`,
                        color: severityColor(r.severity),
                        border: `1px solid ${severityColor(r.severity)}30`,
                      }}
                    >
                      {r.severity}/10
                    </span>
                  </div>
                  <p
                    className="text-[12px] mt-1.5"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {r.body_area}
                    {r.user_name ? ` \u00B7 ${r.user_name}` : ""}
                    {" \u00B7 "}
                    {new Date(r.reported_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {r.resolved_at &&
                      ` \u00B7 Resolved ${new Date(r.resolved_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}`}
                  </p>
                  {r.description && (
                    <p
                      className="text-[13px] mt-2"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {r.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="text-[12px] font-medium transition-colors"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#FF3B5C")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.25)")
                  }
                >
                  Delete
                </button>
              </div>

              {editingId === r.id ? (
                <div className="flex items-center gap-3 pt-2">
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="input !w-auto !py-1.5 text-[13px]"
                  >
                    <option value="active">Active</option>
                    <option value="monitoring">Monitoring</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <button
                    onClick={() => handleUpdateStatus(r)}
                    className="btn-primary !py-1.5 text-[13px]"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="btn-secondary !py-1.5 text-[13px]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditingId(r.id);
                    setEditStatus(r.status);
                  }}
                  className="text-[11px] font-semibold pt-1 hover:underline"
                  style={{ color: "#00F0FF" }}
                >
                  Update Status
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
