"use client";

import { Fragment, useState } from "react";
import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import {
  DUE_DILIGENCE_ITEMS,
  SCORECARD_DIMENSIONS,
  GROWTH_DRIVERS,
  RISK_CATEGORIES,
  RISK_PROBABILITY_LEVELS,
  RISK_SEVERITY_LEVELS,
} from "@/lib/manifests";

/* ── Collapsible section helper ── */

export function Expandable({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 group text-left">
        <span className="text-[10px] text-pq-text-dim group-hover:text-pq-text transition-colors">{open ? "▾" : "▸"}</span>
        <SectionLabel className="text-pq-text-bright">{title}</SectionLabel>
        {badge && <Badge variant="orange">{badge}</Badge>}
        <span className="text-[10px] text-pq-accent ml-auto">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="mt-3 space-y-3 md:space-y-4">{children}</div>}
    </div>
  );
}

/* ── Due Diligence Checklist Panel ── */

export function DDChecklistPanel({ checklist }: { checklist: Record<string, boolean> | null }) {
  return (
    <Panel className="p-3 md:p-4">
      <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-2">DUE DILIGENCE CHECKLIST</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-8 gap-y-1.5">
        {checklist ? (
          Object.entries(checklist).map(([label, checked]) => (
            <div key={label} className="flex items-center gap-2 border-b border-white/5 pb-1">
              <span className={`text-[10px] ${checked ? "text-pq-green" : "text-pq-text-dim"}`}>
                {checked ? "☑" : "☐"}
              </span>
              <span className="text-[10px] text-pq-text">{label}</span>
            </div>
          ))
        ) : (
          DUE_DILIGENCE_ITEMS.map((item) => (
            <div key={item.id} className="flex items-center gap-2 border-b border-white/5 pb-1">
              <span className="text-[10px] text-pq-text-dim">☐</span>
              <span className="text-[10px] text-pq-text">{item.label}</span>
            </div>
          ))
        )}
      </div>
    </Panel>
  );
}

/* ── Investment Scorecard Panel ── */

export function ScorecardPanel({ scorecard, compositeScore }: {
  scorecard: Record<string, { score: number; weight: string; weighted: string; notes: string }> | null;
  compositeScore: string | null;
}) {
  const scorecardKeys = scorecard ? Object.keys(scorecard) : [];
  return (
    <Panel className="p-3 md:p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-pq-text-dim tracking-wide">
              <th className="text-left py-2 pr-4">DIMENSION</th>
              <th className="text-center py-2 px-3">SCORE (1-10)</th>
              <th className="text-center py-2 px-3">WEIGHT</th>
              <th className="text-center py-2 px-3">WEIGHTED</th>
              <th className="text-left py-2 px-3">NOTES</th>
            </tr>
          </thead>
          <tbody>
            {scorecard ? (
              scorecardKeys.map((key) => {
                const row = scorecard[key];
                return (
                  <tr key={key} className="border-t border-white/5">
                    <td className="py-2 pr-4 text-pq-text">{key}</td>
                    <td className="py-2 px-3 text-center font-mono text-pq-text-bright">{row.score}</td>
                    <td className="py-2 px-3 text-center font-mono text-pq-text-dim">{row.weight}</td>
                    <td className="py-2 px-3 text-center font-mono text-pq-text">{row.weighted}</td>
                    <td className="py-2 px-3 text-pq-text-dim">{row.notes}</td>
                  </tr>
                );
              })
            ) : (
              SCORECARD_DIMENSIONS.map((dim) => (
                <tr key={dim.id} className="border-t border-white/5">
                  <td className="py-2 pr-4 text-pq-text">{dim.label}</td>
                  <td className="py-2 px-3 text-center font-mono text-pq-text-bright">-</td>
                  <td className="py-2 px-3 text-center font-mono text-pq-text-dim">-</td>
                  <td className="py-2 px-3 text-center font-mono text-pq-text">-</td>
                  <td className="py-2 px-3 text-pq-text-dim">-</td>
                </tr>
              ))
            )}
            <tr className="border-t-2 border-pq-accent/30">
              <td className="py-2 pr-4 text-pq-accent font-bold">COMPOSITE SCORE</td>
              <td className="py-2 px-3 text-center font-mono text-pq-accent font-bold">{compositeScore ?? "-"}</td>
              <td className="py-2 px-3 text-center font-mono text-pq-accent font-bold">100%</td>
              <td className="py-2 px-3 text-center font-mono text-pq-accent font-bold">{compositeScore ?? "-"}</td>
              <td className="py-2 px-3" />
            </tr>
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ── Growth Drivers Table ── */

export function GrowthDriversTable({ drivers }: {
  drivers: Record<string, { impact: string; timeline: string; probability: string; details: string }> | null;
}) {
  return (
    <Panel className="p-3 md:p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-pq-text-dim tracking-wide">
              <th className="text-left py-2 pr-4">DRIVER</th>
              <th className="text-center py-2 px-3">IMPACT</th>
              <th className="text-center py-2 px-3">TIMELINE</th>
              <th className="text-center py-2 px-3">PROBABILITY</th>
              <th className="text-left py-2 px-3">DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {drivers ? (
              Object.entries(drivers).map(([name, driver]) => (
                <tr key={name} className="border-t border-white/5">
                  <td className="py-2 pr-4 text-pq-text">{name}</td>
                  <td className="py-2 px-3 text-center"><Badge variant="default">{driver.impact}</Badge></td>
                  <td className="py-2 px-3 text-center font-mono text-pq-text-dim">{driver.timeline}</td>
                  <td className="py-2 px-3 text-center font-mono text-pq-text">{driver.probability}</td>
                  <td className="py-2 px-3 text-pq-text-dim">{driver.details}</td>
                </tr>
              ))
            ) : (
              GROWTH_DRIVERS.map((driver) => (
                <tr key={driver.id} className="border-t border-white/5">
                  <td className="py-2 pr-4 text-pq-text">{driver.label}</td>
                  <td className="py-2 px-3 text-center"><Badge variant="default">-</Badge></td>
                  <td className="py-2 px-3 text-center font-mono text-pq-text-dim">-</td>
                  <td className="py-2 px-3 text-center font-mono text-pq-text">-</td>
                  <td className="py-2 px-3 text-pq-text-dim">-</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ── Risk Matrix + Heat Map ── */

export function RiskMatrixPanel({ riskMatrix }: {
  riskMatrix: Record<string, { probability: string; severity: string; composite: string; mitigation: string }> | null;
}) {
  return (
    <>
      <Panel className="p-3 md:p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-pq-text-dim tracking-wide">
                <th className="text-left py-2 pr-4">RISK</th>
                <th className="text-center py-2 px-3">PROBABILITY</th>
                <th className="text-center py-2 px-3">SEVERITY</th>
                <th className="text-center py-2 px-3">COMPOSITE</th>
                <th className="text-left py-2 px-3">MITIGATION</th>
              </tr>
            </thead>
            <tbody>
              {riskMatrix ? (
                Object.entries(riskMatrix).map(([name, risk]) => (
                  <tr key={name} className="border-t border-white/5">
                    <td className="py-2 pr-4 text-pq-text">{name}</td>
                    <td className="py-2 px-3 text-center"><Badge variant="default">{risk.probability}</Badge></td>
                    <td className="py-2 px-3 text-center"><Badge variant="default">{risk.severity}</Badge></td>
                    <td className="py-2 px-3 text-center font-mono text-pq-text-bright">{risk.composite}</td>
                    <td className="py-2 px-3 text-pq-text-dim">{risk.mitigation}</td>
                  </tr>
                ))
              ) : (
                RISK_CATEGORIES.map((risk) => (
                  <tr key={risk.id} className="border-t border-white/5">
                    <td className="py-2 pr-4 text-pq-text">{risk.label}</td>
                    <td className="py-2 px-3 text-center"><Badge variant="default">-</Badge></td>
                    <td className="py-2 px-3 text-center"><Badge variant="default">-</Badge></td>
                    <td className="py-2 px-3 text-center font-mono text-pq-text-bright">-</td>
                    <td className="py-2 px-3 text-pq-text-dim">-</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel className="p-3 md:p-4">
        <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-3">RISK HEAT MAP (PROBABILITY x SEVERITY)</div>
        <div className="grid grid-cols-6 gap-px text-[9px]">
          <div />
          {RISK_PROBABILITY_LEVELS.map((h) => (
            <div key={h} className="text-center text-pq-text-dim py-1">{h}</div>
          ))}
          {RISK_SEVERITY_LEVELS.map((sev) => (
            <Fragment key={sev}>
              <div className="text-pq-text-dim py-2 pr-2 text-right">{sev}</div>
              {RISK_PROBABILITY_LEVELS.map((prob) => (
                <div key={`${sev}-${prob}`} className="h-8 border border-white/5 bg-white/5" />
              ))}
            </Fragment>
          ))}
        </div>
      </Panel>
    </>
  );
}

/* ── Position Sizing & Price Targets ── */

// Re-export from extracted helpers for backwards compatibility
export { PositionTargetsPanel, ArchivePanel, ProfileRow, BulletList } from "./InvestmentHelpers";
