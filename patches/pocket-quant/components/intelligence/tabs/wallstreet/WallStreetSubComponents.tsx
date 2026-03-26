"use client";

import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import { SectionDivider } from "@/components/shared/DataDisplayComponents";

/* ── Header Metrics ── */

export function HeaderMetrics({ ws }: { ws: Record<string, unknown> | undefined }) {
  const hm = ws?.headerMetrics as Record<string, string> | undefined;
  const metrics = [
    { label: "CONSENSUS RATING", key: "consensusRating" },
    { label: "AVG PRICE TARGET", key: "avgPriceTarget" },
    { label: "# OF ANALYSTS", key: "numAnalysts" },
    { label: "IMPLIED UPSIDE", key: "impliedUpside" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {metrics.map((m) => (
        <Panel key={m.label} className="p-3 text-center">
          <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">{m.label}</div>
          <div className="text-lg font-bold text-pq-text-bright">{hm?.[m.key] ?? "-"}</div>
        </Panel>
      ))}
      {/* Overflow: extra header metric keys */}
      {hm && Object.entries(hm)
        .filter(([k]) => !["consensusRating", "avgPriceTarget", "numAnalysts", "impliedUpside"].includes(k) && !k.startsWith("_"))
        .map(([k, v]) => (
          <Panel key={k} className="p-3 text-center">
            <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">
              {k.replace(/([A-Z])/g, " $1").toUpperCase()}
            </div>
            <div className="text-lg font-bold text-pq-text-bright">{v ?? "-"}</div>
          </Panel>
        ))
      }
    </div>
  );
}

/* ── Rating Distribution ── */

export function RatingDistribution({ ws }: { ws: Record<string, unknown> | undefined }) {
  const rd = ws?.ratingDistribution as Record<string, number> | undefined;
  if (!rd) return null;
  const total = Object.values(rd).reduce((s, v) => s + (typeof v === "number" ? v : 0), 0);
  const labels = ["strongBuy", "buy", "hold", "sell", "strongSell"];
  const colors: Record<string, string> = {
    strongBuy: "bg-pq-green",
    buy: "bg-pq-green/60",
    hold: "bg-pq-yellow",
    sell: "bg-pq-red/60",
    strongSell: "bg-pq-red",
  };
  return (
    <Panel className="p-3 md:p-4">
      <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-3">RATING DISTRIBUTION</div>
      <div className="space-y-2">
        {labels.map((label) => {
          const count = (rd[label] as number) ?? 0;
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={label} className="flex items-center gap-3">
              <span className="w-24 text-[10px] text-pq-text-dim capitalize">
                {label.replace(/([A-Z])/g, " $1")}
              </span>
              <div className="flex-1 h-2 bg-pq-surface2 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${colors[label] ?? "bg-white/20"}`} style={{ width: `${pct}%` }} />
              </div>
              <span className="text-[10px] text-pq-text font-mono w-6 text-right">{count}</span>
            </div>
          );
        })}
        {/* Overflow: extra rating keys not in standard labels */}
        {Object.entries(rd)
          .filter(([k]) => !labels.includes(k) && !k.startsWith("_"))
          .map(([k, v]) => {
            const pct = total > 0 ? ((v as number) / total) * 100 : 0;
            return (
              <div key={k} className="flex items-center gap-3">
                <span className="w-24 text-[10px] text-pq-text-dim capitalize">
                  {k.replace(/([A-Z])/g, " $1")}
                </span>
                <div className="flex-1 h-2 bg-pq-surface2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-white/20" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[10px] text-pq-text font-mono w-6 text-right">{v as number}</span>
              </div>
            );
          })
        }
      </div>
    </Panel>
  );
}

/* ── Price Targets ── */

export function PriceTargets({ ws }: { ws: Record<string, unknown> | undefined }) {
  const pt = ws?.priceTargets as Record<string, string> | undefined;
  if (!pt) return null;
  const targets = [
    { label: "HIGH", key: "high", color: "text-pq-green" },
    { label: "MEDIAN", key: "median", color: "text-pq-accent" },
    { label: "LOW", key: "low", color: "text-pq-red" },
  ];
  return (
    <Panel className="p-3 md:p-4">
      <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-3">PRICE TARGETS</div>
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {targets.map((t) => (
          <div key={t.key} className="text-center">
            <div className="text-[9px] text-pq-text-dim tracking-wide mb-1">{t.label}</div>
            <div className={`text-xl font-bold ${t.color} font-mono`}>{pt[t.key] ?? "-"}</div>
          </div>
        ))}
      </div>
      {/* Overflow: extra price target keys */}
      {Object.entries(pt)
        .filter(([k]) => !["high", "median", "low"].includes(k) && !k.startsWith("_"))
        .length > 0 && (
        <div className="grid grid-cols-3 gap-3 md:gap-4 mt-3 border-t border-white/5 pt-3">
          {Object.entries(pt)
            .filter(([k]) => !["high", "median", "low"].includes(k) && !k.startsWith("_"))
            .map(([k, v]) => (
              <div key={k} className="text-center">
                <div className="text-[9px] text-pq-text-dim tracking-wide mb-1">
                  {k.replace(/([A-Z])/g, " $1").toUpperCase()}
                </div>
                <div className="text-xl font-bold text-pq-text-bright font-mono">{v}</div>
              </div>
            ))
          }
        </div>
      )}
    </Panel>
  );
}

/* ── Analyst Actions Table ── */

export function AnalystActionsTable({ ws }: { ws: Record<string, unknown> | undefined }) {
  const actions = ws?.analystActions as Array<Record<string, string>> | undefined;
  if (!actions || actions.length === 0) return null;
  return (
    <>
      <SectionDivider />
      <SectionLabel className="text-pq-text-bright">RECENT ANALYST ACTIONS</SectionLabel>
      <Panel className="p-3 md:p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-pq-text-dim tracking-wide">
                <th className="text-left py-2 pr-4">DATE</th>
                <th className="text-left py-2 px-3">FIRM</th>
                <th className="text-left py-2 px-3">ANALYST</th>
                <th className="text-center py-2 px-3">ACTION</th>
                <th className="text-center py-2 px-3">RATING</th>
                <th className="text-right py-2 px-3">PRICE TARGET</th>
              </tr>
            </thead>
            <tbody>
              {actions.map((action, i) => (
                <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-2 pr-4 font-mono text-pq-text-dim">{action.date ?? "-"}</td>
                  <td className="py-2 px-3 text-pq-text">{action.firm ?? "-"}</td>
                  <td className="py-2 px-3 text-pq-text-dim">{action.analyst ?? "-"}</td>
                  <td className="py-2 px-3 text-center"><Badge variant="default">{action.action ?? "-"}</Badge></td>
                  <td className="py-2 px-3 text-center"><Badge variant="default">{action.rating ?? "-"}</Badge></td>
                  <td className="py-2 px-3 text-right font-mono text-pq-text-bright">{action.pt ?? action.priceTarget ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

/* ── Consensus Estimates Table ── */

export function ConsensusEstimatesTable({ ws }: { ws: Record<string, unknown> | undefined }) {
  const estimates = ws?.consensusEstimates as Record<string, Record<string, string>> | undefined;
  if (!estimates) return null;
  const periods = Object.keys(estimates);
  if (periods.length === 0) return null;
  const metricKeys = Array.from(new Set(periods.flatMap((p) => Object.keys(estimates[p]))));
  return (
    <Panel className="p-3 md:p-4">
      <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-3">CONSENSUS ESTIMATES</div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-pq-text-dim tracking-wide">
              <th className="text-left py-2 pr-4">METRIC</th>
              {periods.map((p) => (
                <th key={p} className="text-right py-2 px-3">{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metricKeys.map((metric) => (
              <tr key={metric} className="border-t border-white/5">
                <td className="py-2 pr-4 text-pq-text-dim">{metric}</td>
                {periods.map((p) => (
                  <td key={p} className="py-2 px-3 text-right font-mono text-pq-text">
                    {estimates[p]?.[metric] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ── Estimate Revisions Table ── */

export function EstimateRevisionsTable({ ws }: { ws: Record<string, unknown> | undefined }) {
  const revisions = ws?.estimateRevisions as Array<Record<string, string>> | undefined;
  if (!revisions || revisions.length === 0) return null;
  return (
    <Panel className="p-3 md:p-4">
      <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-3">ESTIMATE REVISIONS</div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-pq-text-dim tracking-wide">
              <th className="text-left py-2 pr-4">METRIC</th>
              <th className="text-left py-2 px-3">PERIOD</th>
              <th className="text-right py-2 px-3">PREVIOUS</th>
              <th className="text-right py-2 px-3">CURRENT</th>
              <th className="text-right py-2 px-3">CHANGE</th>
              <th className="text-left py-2 px-3">DATE</th>
            </tr>
          </thead>
          <tbody>
            {revisions.map((rev, i) => (
              <tr key={i} className="border-t border-white/5">
                <td className="py-2 pr-4 text-pq-text">{rev.metric ?? "-"}</td>
                <td className="py-2 px-3 text-pq-text-dim">{rev.period ?? "-"}</td>
                <td className="py-2 px-3 text-right font-mono text-pq-text-dim">{rev.previous ?? "-"}</td>
                <td className="py-2 px-3 text-right font-mono text-pq-text">{rev.current ?? "-"}</td>
                <td className="py-2 px-3 text-right font-mono text-pq-text-bright">{rev.change ?? "-"}</td>
                <td className="py-2 px-3 font-mono text-pq-text-dim">{rev.date ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ── Earnings Surprise Table ── */

export function EarningsSurpriseTable({ ws }: { ws: Record<string, unknown> | undefined }) {
  const surprises = ws?.earningsSurprise as Array<Record<string, string>> | undefined;
  if (!surprises || surprises.length === 0) return null;
  return (
    <Panel className="p-3 md:p-4">
      <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-3">EARNINGS SURPRISE HISTORY</div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-pq-text-dim tracking-wide">
              <th className="text-left py-2 pr-4">QUARTER</th>
              <th className="text-right py-2 px-3">EPS EST</th>
              <th className="text-right py-2 px-3">EPS ACTUAL</th>
              <th className="text-right py-2 px-3">SURPRISE</th>
              <th className="text-right py-2 px-3">REV EST</th>
              <th className="text-right py-2 px-3">REV ACTUAL</th>
              <th className="text-right py-2 px-3">REV SURPRISE</th>
            </tr>
          </thead>
          <tbody>
            {surprises.map((s, i) => (
              <tr key={i} className="border-t border-white/5">
                <td className="py-2 pr-4 font-mono text-pq-text">{s.quarter ?? "-"}</td>
                <td className="py-2 px-3 text-right font-mono text-pq-text-dim">{s.epsEst ?? "-"}</td>
                <td className="py-2 px-3 text-right font-mono text-pq-text">{s.epsActual ?? "-"}</td>
                <td className="py-2 px-3 text-right font-mono text-pq-text-bright">{s.epsSurprise ?? "-"}</td>
                <td className="py-2 px-3 text-right font-mono text-pq-text-dim">{s.revEst ?? "-"}</td>
                <td className="py-2 px-3 text-right font-mono text-pq-text">{s.revActual ?? "-"}</td>
                <td className="py-2 px-3 text-right font-mono text-pq-text-bright">{s.revSurprise ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ── Coverage Summary ── */

export function CoverageSummary({ ws }: { ws: Record<string, unknown> | undefined }) {
  const summary = ws?.coverageSummary as Record<string, string> | undefined;
  if (!summary) return null;
  return (
    <Panel className="p-3 md:p-4">
      <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-3">COVERAGE SUMMARY</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-2">
        {Object.entries(summary).map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between border-b border-white/5 pb-1">
            <span className="text-[10px] text-pq-text-dim">
              {k.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ").trim()}
            </span>
            <span className="text-xs text-pq-text font-mono">{v ?? "-"}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
