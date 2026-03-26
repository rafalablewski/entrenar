"use client";

import Panel from "@/components/ui/Panel";
import Badge from "@/components/ui/Badge";
import SectionLabel from "@/components/ui/SectionLabel";
import { THREE_POINT_SCENARIOS, TEMPLATE_ROW_COUNTS } from "@/lib/manifests";

/* ── Position Targets ── */

export function PositionTargetsPanel({ inv }: {
  inv: {
    positionTargets: Record<string, string>;
    currentPrice: string;
    scenarioProbabilities: Record<string, string>;
  } | null;
}) {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {THREE_POINT_SCENARIOS.map((s) => (
          <Panel key={s.id} className={`p-3 md:p-4 text-center border ${s.bgActive}`}>
            <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">{s.label} TARGET</div>
            <div className={`text-2xl font-bold ${s.color}`}>{inv?.positionTargets?.[s.label] ?? "-"}</div>
          </Panel>
        ))}
        <Panel className="p-3 md:p-4 text-center border border-white/5">
          <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">CURRENT PRICE</div>
          <div className="text-2xl font-bold text-pq-text-bright">{inv?.currentPrice ?? "-"}</div>
        </Panel>
      </div>

      <Panel className="p-3 md:p-4">
        <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-2">SCENARIO PROBABILITY DISTRIBUTION</div>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {THREE_POINT_SCENARIOS.map((s) => {
            const probKey = s.label.charAt(0) + s.label.slice(1).toLowerCase();
            const prob = inv?.scenarioProbabilities?.[probKey] ?? null;
            return (
              <div key={s.id} className="text-center">
                <div className={`text-[9px] ${s.color} tracking-wide mb-1`}>{s.label}</div>
                <div className={`text-sm font-bold ${s.color} font-mono`}>{prob ?? "-%"}</div>
              </div>
            );
          })}
        </div>
      </Panel>
    </>
  );
}

/* ── Analysis Archive ── */

export function ArchivePanel({ inv }: {
  inv: {
    archiveRows?: Array<{ date: string; type: string; rating: string; target: string; priceAtTime: string; outcome: string; notes: string }>;
    historicalAccuracy: Record<string, string>;
  } | null;
}) {
  return (
    <>
      <Panel className="p-3 md:p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-pq-text-dim tracking-wide">
                <th className="text-left py-2 pr-4">DATE</th>
                <th className="text-left py-2 px-3">TYPE</th>
                <th className="text-center py-2 px-3">RATING</th>
                <th className="text-right py-2 px-3">TARGET</th>
                <th className="text-right py-2 px-3">PRICE AT TIME</th>
                <th className="text-right py-2 px-3">OUTCOME</th>
                <th className="text-left py-2 px-3">NOTES</th>
              </tr>
            </thead>
            <tbody>
              {inv?.archiveRows ? (
                inv.archiveRows.map((row, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="py-2 pr-4 font-mono text-pq-text-dim">{row.date}</td>
                    <td className="py-2 px-3"><Badge variant="default">{row.type}</Badge></td>
                    <td className="py-2 px-3 text-center"><Badge variant="default">{row.rating}</Badge></td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{row.target}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{row.priceAtTime}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{row.outcome}</td>
                    <td className="py-2 px-3 text-pq-text-dim">{row.notes}</td>
                  </tr>
                ))
              ) : (
                Array.from({ length: TEMPLATE_ROW_COUNTS.archiveRows }, (_, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="py-2 pr-4 font-mono text-pq-text-dim">-</td>
                    <td className="py-2 px-3"><Badge variant="default">-</Badge></td>
                    <td className="py-2 px-3 text-center"><Badge variant="default">-</Badge></td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">-</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">-</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">-</td>
                    <td className="py-2 px-3 text-pq-text-dim">-</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <SectionLabel className="text-pq-text-bright">HISTORICAL ACCURACY</SectionLabel>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {(["TOTAL CALLS", "HIT RATE", "AVG RETURN", "BRIER SCORE"] as const).map((label) => {
          const accuracyMap: Record<string, string> = {
            "TOTAL CALLS": "TOTAL CALLS",
            "HIT RATE": "ACCURACY RATE",
            "AVG RETURN": "AVG TARGET ERROR",
            "BRIER SCORE": "BEST CALL",
          };
          const value = inv?.historicalAccuracy?.[accuracyMap[label]] ?? null;
          return (
            <Panel key={label} className="p-3 text-center">
              <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">{label}</div>
              <div className="text-lg font-bold text-pq-text-bright">{value ?? "-"}</div>
            </Panel>
          );
        })}
      </div>
    </>
  );
}

/* ── Shared UI helpers (re-exported from shared) ── */

export { ProfileRow, BulletList } from "@/components/shared/DataDisplayComponents";
