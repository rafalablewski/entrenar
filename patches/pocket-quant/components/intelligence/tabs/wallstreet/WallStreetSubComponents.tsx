"use client";

import Panel from "@/components/ui/Panel";
import Badge from "@/components/ui/Badge";
import { MetricCard, ProfileRow, DistBar } from "@/components/shared/DataDisplayComponents";
import {
  OverflowKeyValues,
  OverflowItemFields,
} from "../shared/OverflowFields";
import {
  ANALYST_RATINGS,
  ESTIMATE_REVISION_METRICS,
  HISTORICAL_QUARTERS,
  WS_HEADER_METRICS,
  WS_PRICE_TARGET_LABELS,
  WS_COVERAGE_SUMMARY,
  WS_ESTIMATE_PERIODS,
  WS_CONSENSUS_ESTIMATE_LABELS,
  TEMPLATE_ROW_COUNTS,
} from "@/lib/manifests";

/* ── Known-key sets for overflow detection ── */
const HEADER_KEYS: ReadonlySet<string> = new Set(WS_HEADER_METRICS);
const RATING_KEYS: ReadonlySet<string> = new Set(ANALYST_RATINGS);
const PT_KEYS: ReadonlySet<string> = new Set(WS_PRICE_TARGET_LABELS);
const CONSENSUS_KEYS: ReadonlySet<string> = new Set(WS_CONSENSUS_ESTIMATE_LABELS);
const REVISION_KEYS: ReadonlySet<string> = new Set(ESTIMATE_REVISION_METRICS.map((m) => m.name));
const COVERAGE_SUMMARY_KEYS: ReadonlySet<string> = new Set(WS_COVERAGE_SUMMARY.map((s) => s.label));

const ANALYST_ACTION_KNOWN: ReadonlySet<string> = new Set([
  "date", "firm", "analyst", "action", "rating", "ptOld", "ptNew",
]);
const EARNINGS_KNOWN: ReadonlySet<string> = new Set([
  "quarter", "epsEst", "epsActual", "epsSurprise",
  "revEst", "revActual", "revSurprise", "reaction",
]);

/* eslint-disable @typescript-eslint/no-explicit-any */
type WsData = Record<string, any>;

/* ── Header Metrics with overflow ── */
export function HeaderMetrics({ ws }: { ws: WsData | undefined }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      {WS_HEADER_METRICS.map((label) => (
        <MetricCard key={label} label={label} value={ws?.headerMetrics?.[label]} />
      ))}
      <OverflowKeyValues data={ws?.headerMetrics} knownKeys={HEADER_KEYS} />
    </div>
  );
}

/* ── Rating Distribution with overflow ── */
export function RatingDistribution({ ws }: { ws: WsData | undefined }) {
  const rd = ws?.ratingDistribution;
  const vals = ANALYST_RATINGS.map((r) => {
    const v = rd?.[r];
    return typeof v === "number" ? v : v ? parseInt(String(v), 10) || 0 : 0;
  });
  const allVals = rd
    ? Object.values(rd).map((v) => (typeof v === "number" ? v : parseInt(String(v), 10) || 0))
    : vals;
  const maxVal = Math.max(...(allVals as number[]), 1);
  const colors = ["bg-pq-green", "bg-pq-emerald/70", "bg-pq-yellow/70", "bg-pq-orange/70", "bg-pq-red/70"];
  const extraRatings = rd
    ? Object.entries(rd).filter(([k]) => !RATING_KEYS.has(k) && !k.startsWith("_"))
    : [];

  return (
    <Panel className="p-3 md:p-4" variant="elevated">
      <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-4">RATING DISTRIBUTION</div>
      <div className="space-y-2">
        {ANALYST_RATINGS.map((rating, idx) => (
          <DistBar key={rating} label={rating} value={vals[idx]} max={maxVal} color={colors[idx]} />
        ))}
        {extraRatings.map(([k, v]) => (
          <DistBar key={k} label={k} value={typeof v === "number" ? v : parseInt(String(v), 10) || 0} max={maxVal} color="bg-pq-cyan/50" />
        ))}
      </div>
    </Panel>
  );
}

/* ── Price Targets with overflow ── */
export function PriceTargets({ ws }: { ws: WsData | undefined }) {
  const pt = ws?.priceTargets;
  const parsePrice = (s?: string) => {
    if (!s) return null;
    const n = parseFloat(String(s).replace(/[$,]/g, ""));
    return isNaN(n) ? null : n;
  };

  return (
    <Panel className="p-4" variant="elevated">
      <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-4">PRICE TARGETS</div>
      <div className="space-y-3">
        {WS_PRICE_TARGET_LABELS.map((label) => (
          <ProfileRow key={label} label={label} value={pt?.[label]} />
        ))}
        <OverflowKeyValues data={pt} knownKeys={PT_KEYS} />
        {pt && (() => {
          const low = parsePrice(pt["Low"]);
          const high = parsePrice(pt["High"]);
          const median = parsePrice(pt["Median"]);
          if (low != null && high != null) {
            return (
              <div className="mt-4 space-y-1.5">
                <div className="range-bar">
                  <div className="range-bar-fill" style={{ left: 0, right: 0 }} />
                  {median != null && <div className="range-bar-marker" style={{ left: `${((median - low) / (high - low)) * 100}%` }} />}
                </div>
                <div className="flex justify-between text-[9px] text-pq-text-dim font-mono">
                  <span>${low}</span>
                  {median != null && <span className="text-pq-text-bright">Median ${median}</span>}
                  <span>${high}</span>
                </div>
              </div>
            );
          }
          return null;
        })()}
      </div>
    </Panel>
  );
}

/* ── Analyst Actions table with per-item overflow ── */
export function AnalystActionsTable({ ws }: { ws: WsData | undefined }) {
  const actions = ws?.analystActions as Array<Record<string, unknown>> | undefined;

  return (
    <Panel className="p-3 md:p-4">
      <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-3">RECENT ANALYST ACTIONS</div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-pq-text-dim tracking-wide">
              <th className="text-left py-2 pr-4">DATE</th>
              <th className="text-left py-2 px-3">FIRM</th>
              <th className="text-left py-2 px-3">ANALYST</th>
              <th className="text-center py-2 px-3">ACTION</th>
              <th className="text-center py-2 px-3">RATING</th>
              <th className="text-right py-2 px-3">PT (OLD → NEW)</th>
            </tr>
          </thead>
          <tbody>
            {actions
              ? actions.map((a, i) => (
                  <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-2 pr-4 font-mono text-pq-text-dim">{String(a.date ?? "")}</td>
                    <td className="py-2 px-3 text-pq-text">{String(a.firm ?? "")}</td>
                    <td className="py-2 px-3 text-pq-text-dim">{String(a.analyst ?? "")}</td>
                    <td className="py-2 px-3 text-center"><Badge variant="default">{String(a.action ?? "")}</Badge></td>
                    <td className="py-2 px-3 text-center"><Badge variant="default">{String(a.rating ?? "")}</Badge></td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">
                      {String(a.ptOld ?? "")} → {String(a.ptNew ?? "")}
                      <OverflowItemFields item={a} knownKeys={ANALYST_ACTION_KNOWN} />
                    </td>
                  </tr>
                ))
              : Array.from({ length: TEMPLATE_ROW_COUNTS.analystActions }, (_, i) => (
                  <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-2 pr-4 font-mono text-pq-text-dim">—</td>
                    <td className="py-2 px-3 text-pq-text">—</td>
                    <td className="py-2 px-3 text-pq-text-dim">—</td>
                    <td className="py-2 px-3 text-center"><Badge variant="default">—</Badge></td>
                    <td className="py-2 px-3 text-center"><Badge variant="default">—</Badge></td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">— → —</td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ── Consensus Estimates table with overflow ── */
export function ConsensusEstimatesTable({ ws }: { ws: WsData | undefined }) {
  const estimates = ws?.consensusEstimates as Record<string, Record<string, string>> | undefined;

  return (
    <Panel className="p-3 md:p-4">
      <div className="text-[10px] text-pq-accent tracking-wide uppercase font-bold mb-3">CONSENSUS ESTIMATES</div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-pq-text-dim tracking-wide">
              <th className="text-left py-2 pr-4">METRIC</th>
              {WS_ESTIMATE_PERIODS.map((p) => (
                <th key={p} className="text-right py-2 px-3">{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WS_CONSENSUS_ESTIMATE_LABELS.map((metric) => (
              <tr key={metric} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-2 pr-4 text-pq-text-dim text-[10px]">{metric}</td>
                {WS_ESTIMATE_PERIODS.map((p) => (
                  <td key={p} className="py-2 px-3 text-right font-mono text-pq-text">
                    {estimates?.[metric]?.[p] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
            {estimates && Object.keys(estimates)
              .filter((k) => !CONSENSUS_KEYS.has(k) && !k.startsWith("_"))
              .map((metric) => (
                <tr key={metric} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-2 pr-4 text-pq-text-dim text-[10px]">{metric}</td>
                  {WS_ESTIMATE_PERIODS.map((p) => (
                    <td key={p} className="py-2 px-3 text-right font-mono text-pq-text">
                      {estimates[metric]?.[p] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ── Estimate Revisions table with overflow ── */
export function EstimateRevisionsTable({ ws }: { ws: WsData | undefined }) {
  const revisions = ws?.estimateRevisions as Record<string, Record<string, string>> | undefined;

  return (
    <Panel className="p-3 md:p-4">
      <div className="text-[10px] text-pq-accent tracking-wide uppercase font-bold mb-3">
        ESTIMATE REVISIONS (LAST 30 / 60 / 90 DAYS)
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-pq-text-dim tracking-wide">
              <th className="text-left py-2 pr-4">METRIC</th>
              <th className="text-right py-2 px-3">30D AGO</th>
              <th className="text-right py-2 px-3">60D AGO</th>
              <th className="text-right py-2 px-3">90D AGO</th>
              <th className="text-right py-2 px-3">CURRENT</th>
              <th className="text-right py-2 px-3">Δ 30D</th>
              <th className="text-right py-2 px-3">Δ 90D</th>
            </tr>
          </thead>
          <tbody>
            {ESTIMATE_REVISION_METRICS.map((m) => {
              const rev = revisions?.[m.name];
              return (
                <tr key={m.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-2 pr-4 text-pq-text-dim text-[10px]">{m.name}</td>
                  <td className="py-2 px-3 text-right font-mono text-pq-text">{rev?.d30 ?? "—"}</td>
                  <td className="py-2 px-3 text-right font-mono text-pq-text">{rev?.d60 ?? "—"}</td>
                  <td className="py-2 px-3 text-right font-mono text-pq-text">{rev?.d90 ?? "—"}</td>
                  <td className="py-2 px-3 text-right font-mono text-pq-text-bright">{rev?.current ?? "—"}</td>
                  <td className="py-2 px-3 text-right font-mono text-pq-text-dim">{rev?.delta30 ?? "—"}</td>
                  <td className="py-2 px-3 text-right font-mono text-pq-text-dim">{rev?.delta90 ?? "—"}</td>
                </tr>
              );
            })}
            {revisions && Object.keys(revisions)
              .filter((k) => !REVISION_KEYS.has(k) && !k.startsWith("_"))
              .map((name) => {
                const rev = revisions[name];
                return (
                  <tr key={name} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-2 pr-4 text-pq-text-dim text-[10px]">{name}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{rev?.d30 ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{rev?.d60 ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{rev?.d90 ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text-bright">{rev?.current ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text-dim">{rev?.delta30 ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text-dim">{rev?.delta90 ?? "—"}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ── Earnings Surprise table with per-item overflow ── */
export function EarningsSurpriseTable({ ws }: { ws: WsData | undefined }) {
  const earnings = ws?.earningsSurprise as Array<Record<string, unknown>> | undefined;

  return (
    <Panel className="p-3 md:p-4">
      <div className="text-[10px] text-pq-accent tracking-wide uppercase font-bold mb-3">
        EARNINGS SURPRISE HISTORY
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-pq-text-dim tracking-wide">
              <th className="text-left py-2 pr-4">QUARTER</th>
              <th className="text-right py-2 px-3">EPS EST</th>
              <th className="text-right py-2 px-3">EPS ACTUAL</th>
              <th className="text-right py-2 px-3">SURPRISE %</th>
              <th className="text-right py-2 px-3">REV EST ($M)</th>
              <th className="text-right py-2 px-3">REV ACTUAL</th>
              <th className="text-right py-2 px-3">SURPRISE %</th>
              <th className="text-center py-2 px-3">REACTION</th>
            </tr>
          </thead>
          <tbody>
            {earnings
              ? earnings.map((e, i) => (
                  <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-2 pr-4 text-pq-text font-mono">{String(e.quarter ?? "")}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{String(e.epsEst ?? "")}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text-bright">{String(e.epsActual ?? "")}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{String(e.epsSurprise ?? "")}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{String(e.revEst ?? "")}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text-bright">{String(e.revActual ?? "")}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{String(e.revSurprise ?? "")}</td>
                    <td className="py-2 px-3 text-center">
                      <Badge variant="default">{String(e.reaction ?? "")}</Badge>
                      <OverflowItemFields item={e} knownKeys={EARNINGS_KNOWN} />
                    </td>
                  </tr>
                ))
              : HISTORICAL_QUARTERS.map((q) => (
                  <tr key={q.label} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-2 pr-4 text-pq-text font-mono">{q.label}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">—</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text-bright">—</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">—</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">—</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text-bright">—</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">—</td>
                    <td className="py-2 px-3 text-center"><Badge variant="default">—</Badge></td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ── Coverage Summary with overflow ── */
export function CoverageSummary({ ws }: { ws: WsData | undefined }) {
  const summary = ws?.coverageSummary;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {WS_COVERAGE_SUMMARY.map((s) => (
        <Panel key={s.label} className="p-3 text-center">
          <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">{s.label}</div>
          <div className={`text-lg font-bold ${s.color}`}>
            {summary?.[s.label] ?? "—"}
          </div>
        </Panel>
      ))}
      {summary && Object.entries(summary)
        .filter(([k]) => !COVERAGE_SUMMARY_KEYS.has(k) && !k.startsWith("_"))
        .map(([k, v]) => (
          <Panel key={k} className="p-3 text-center">
            <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">{k}</div>
            <div className="text-lg font-bold text-pq-text-bright">{String(v ?? "—")}</div>
          </Panel>
        ))
      }
    </div>
  );
}
