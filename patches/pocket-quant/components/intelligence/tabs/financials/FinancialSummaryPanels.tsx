"use client";

import Panel from "@/components/ui/Panel";
import Badge from "@/components/ui/Badge";
import { ProfileRow } from "@/components/shared/DataDisplayComponents";
import type { MetricDefinition, QuarterPeriod } from "@/lib/manifests";
import { toDataLabel } from "./FinancialSubComponents";

export { ProfileRow };

/* ── Summary Cards ── */

const SUMMARY_CARDS: { label: string; changeLabel?: string }[] = [
  { label: "REVENUE", changeLabel: "REVENUE GROWTH (QoQ)" },
  { label: "GROSS MARGIN" },
  { label: "NET LOSS", changeLabel: "REVENUE GROWTH (YoY)" },
  { label: "EPS (DILUTED)" },
];

export function LatestSummaryCards({ summary }: { summary?: Record<string, string> }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {SUMMARY_CARDS.map(({ label, changeLabel }) => {
        const value = summary?.[label] ?? "-";
        const change = changeLabel && summary?.[changeLabel] ? summary[changeLabel] : "-";
        return (
          <Panel key={label} className="p-3 md:p-4 text-center border border-white/5">
            <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">{label}</div>
            <div className="text-xl font-bold text-pq-text-bright">{value}</div>
            <div className="text-[9px] text-pq-text-dim mt-1">{change}</div>
          </Panel>
        );
      })}
    </div>
  );
}

/* ── Beat / Miss Panel ── */

export function BeatMissPanel({ beatMiss }: { beatMiss?: Record<string, { result: string; vs: string }> }) {
  const items = beatMiss ? Object.entries(beatMiss) : [];
  return (
    <Panel className="p-3 md:p-4">
      <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-2">BEAT / MISS SUMMARY</div>
      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {items.map(([metric, { result, vs }]) => (
            <div key={metric}>
              <div className="text-[9px] text-pq-text-dim mb-1">{metric}</div>
              <div className="flex items-center gap-2">
                <Badge variant={result === "BEAT" ? "green" : result === "MISS" ? "red" : "default"}>{result}</Badge>
                <span className="text-[10px] text-pq-text font-mono">{vs}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {["Revenue", "EPS"].map((item) => (
            <div key={item}>
              <div className="text-[9px] text-pq-text-dim mb-1">{item}</div>
              <div className="flex items-center gap-2">
                <Badge variant="default">-</Badge>
                <span className="text-[10px] text-pq-text font-mono">- vs consensus -</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ── Management Guidance Panel ── */

export function GuidancePanel({ guidance }: { guidance?: Record<string, string> }) {
  const entries = guidance ? Object.entries(guidance) : [];
  return (
    <Panel className="p-3 md:p-4">
      <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-2">MANAGEMENT GUIDANCE</div>
      {entries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-2">
          {entries.map(([label, value]) => (
            <ProfileRow key={label} label={label} value={value} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-2">
          {["Revenue Guidance (Next Q)", "Revenue Guidance (FY)", "EPS Guidance (Next Q)",
            "EPS Guidance (FY)", "Guidance vs Prior", "Guidance vs Consensus"].map((label) => (
            <ProfileRow key={label} label={label} />
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ── Stock-Specific KPIs Panel ── */

export function StockKPIsPanel({
  kpis,
  quarters: qs,
  placeholderCount,
}: {
  kpis?: { label: string; quarters: Record<string, string>; trend: string }[];
  quarters: QuarterPeriod[];
  placeholderCount: number;
}) {
  const rows = kpis ?? [];
  return (
    <Panel className="p-3 md:p-4">
      <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-3">SECTOR / BUSINESS-SPECIFIC KPIs</div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-pq-text-dim tracking-wide">
              <th className="text-left py-2 pr-4">KPI</th>
              {qs.map((q) => <th key={q.label} className="text-right py-2 px-3">{q.label}</th>)}
              <th className="text-right py-2 px-3">TREND</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0
              ? rows.map((kpi) => (
                  <tr key={kpi.label} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-2 pr-4 text-pq-text-dim text-[10px]">{kpi.label}</td>
                    {qs.map((q) => {
                      const dl = toDataLabel(q);
                      return (
                        <td key={q.label} className="py-2 px-3 text-right font-mono text-pq-text">
                          {kpi.quarters[dl] ?? "-"}
                        </td>
                      );
                    })}
                    <td className="py-2 px-3 text-right text-[10px] text-pq-text-dim max-w-[200px]">
                      {kpi.trend}
                    </td>
                  </tr>
                ))
              : Array.from({ length: placeholderCount }, (_, i) => (
                  <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-2 pr-4 text-pq-text-dim text-[10px]">KPI {i + 1} - (Entity-Specific)</td>
                    {qs.map((q) => <td key={q.label} className="py-2 px-3 text-right font-mono text-pq-text">-</td>)}
                    <td className="py-2 px-3 text-right"><Badge variant="default">-</Badge></td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ── Financial Milestones Panel ── */

function statusVariant(status: string): "green" | "orange" | "cyan" | "default" {
  const s = status.toLowerCase();
  if (s === "completed") return "green";
  if (s === "on track") return "cyan";
  if (s === "upcoming") return "orange";
  return "default";
}

export function MilestonesPanel({
  manifestMilestones,
  dataMilestones,
}: {
  manifestMilestones: MetricDefinition[];
  dataMilestones?: Record<string, { date: string; status: string; details: string }>;
}) {
  const entries = dataMilestones ? Object.entries(dataMilestones) : null;
  return (
    <Panel className="p-3 md:p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-pq-text-dim tracking-wide">
              <th className="text-left py-2 pr-4">DATE</th>
              <th className="text-left py-2 px-3">MILESTONE</th>
              <th className="text-center py-2 px-3">STATUS</th>
              <th className="text-left py-2 px-3">DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {entries
              ? entries.map(([name, ms]) => (
                  <tr key={name} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-2 pr-4 font-mono text-pq-text-dim">{ms.date}</td>
                    <td className="py-2 px-3 text-pq-text">{name}</td>
                    <td className="py-2 px-3 text-center">
                      <Badge variant={statusVariant(ms.status)}>{ms.status}</Badge>
                    </td>
                    <td className="py-2 px-3 text-pq-text-dim">{ms.details}</td>
                  </tr>
                ))
              : manifestMilestones.map((ms) => (
                  <tr key={ms.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-2 pr-4 font-mono text-pq-text-dim">-</td>
                    <td className="py-2 px-3 text-pq-text">{ms.name}</td>
                    <td className="py-2 px-3 text-center"><Badge variant="default">-</Badge></td>
                    <td className="py-2 px-3 text-pq-text-dim">-</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
