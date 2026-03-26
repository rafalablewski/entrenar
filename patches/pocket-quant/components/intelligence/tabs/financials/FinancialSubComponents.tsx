import Panel from "@/components/ui/Panel";
import Badge from "@/components/ui/Badge";
import type { MetricDefinition, QuarterPeriod } from "@/lib/manifests";

/* ── Shared types ── */

export type ValuesMap = Record<string, Record<string, string>>;

/** Map manifest quarter labels ("Q1 2025") to data quarter labels ("Q1 '25" or "Q2 '26E") */
export function toDataLabel(q: QuarterPeriod): string {
  const shortYear = `'${String(q.year).slice(2)}`;
  const suffix = q.isEstimate ? "E" : "";
  return `Q${q.quarter} ${shortYear}${suffix}`;
}

/** Lookup helper: values[metricName][dataQuarterLabel] */
export function lookupValue(
  values: ValuesMap | undefined,
  metricName: string,
  q: QuarterPeriod,
): string | null {
  if (!values) return null;
  return values[metricName]?.[toDataLabel(q)] ?? null;
}

/* ── MetricTable ── */

export function MetricTable({
  title,
  metrics,
  quarters: qs,
  showChange,
  values,
}: {
  title?: string;
  metrics: MetricDefinition[];
  quarters: QuarterPeriod[];
  showChange?: "qoq" | "yoy" | "qoq-yoy";
  values?: ValuesMap;
}) {
  return (
    <Panel className="p-3 md:p-4">
      {title && <div className="text-[10px] text-pq-accent tracking-wide uppercase font-bold mb-3">{title}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-pq-text-dim tracking-wide">
              <th className="text-left py-2 pr-4">METRIC</th>
              {qs.map((q) => <th key={q.label} className="text-right py-2 px-3">{q.label}</th>)}
              {(showChange === "qoq" || showChange === "qoq-yoy") && <th className="text-right py-2 px-3">QoQ %</th>}
              {(showChange === "yoy" || showChange === "qoq-yoy") && <th className="text-right py-2 px-3">YoY %</th>}
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-2 pr-4 text-pq-text-dim text-[10px]">{m.name}</td>
                {qs.map((q) => {
                  const v = lookupValue(values, m.name, q);
                  return (
                    <td key={q.label} className="py-2 px-3 text-right font-mono text-pq-text">
                      {v ?? "-"}
                    </td>
                  );
                })}
                {showChange && <td className="py-2 px-3 text-right font-mono text-pq-text-dim">-</td>}
                {showChange === "qoq-yoy" && <td className="py-2 px-3 text-right font-mono text-pq-text-dim">-</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ── RatioTable ── */

export function RatioTable({
  title,
  metrics,
  quarters: qs,
  values,
}: {
  title: string;
  metrics: MetricDefinition[];
  quarters: QuarterPeriod[];
  values?: ValuesMap;
}) {
  return (
    <Panel className="p-3 md:p-4">
      <div className="text-[10px] text-pq-accent tracking-wide uppercase font-bold mb-3">{title}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-pq-text-dim tracking-wide">
              <th className="text-left py-2 pr-4">RATIO</th>
              {qs.map((q) => <th key={q.label} className="text-right py-2 px-3">{q.label}</th>)}
              <th className="text-right py-2 px-3">TREND</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-2 pr-4 text-pq-text-dim text-[10px]">{m.name}</td>
                {qs.map((q) => {
                  const v = lookupValue(values, m.name, q);
                  return (
                    <td key={q.label} className="py-2 px-3 text-right font-mono text-pq-text">
                      {v ?? "-"}
                    </td>
                  );
                })}
                <td className="py-2 px-3 text-right"><Badge variant="default">-</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ── WaterfallTable ── */

export function WaterfallTable({
  metrics,
  quarters: qs,
  values,
}: {
  metrics: MetricDefinition[];
  quarters: QuarterPeriod[];
  values?: ValuesMap;
}) {
  return (
    <Panel className="p-3 md:p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-pq-text-dim tracking-wide">
              <th className="text-left py-2 pr-4">COMPONENT</th>
              {qs.map((q) => <th key={q.label} className="text-right py-2 px-3">{q.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.id} className={`border-t ${m.isSummaryRow ? "border-pq-accent/30" : "border-white/5"} hover:bg-white/5 transition-colors`}>
                <td className={`py-2 pr-4 text-[10px] ${m.isSummaryRow ? "text-pq-text-bright font-bold" : "text-pq-text-dim"}`}>
                  {m.name}
                </td>
                {qs.map((q) => {
                  const v = lookupValue(values, m.name, q);
                  return (
                    <td key={q.label} className={`py-2 px-3 text-right font-mono ${m.isSummaryRow ? "text-pq-text-bright font-bold" : "text-pq-text"}`}>
                      {v ?? "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ── Latest Quarter Summary Cards ── */

// Re-export summary panels from extracted file for backwards compatibility
export {
  LatestSummaryCards,
  BeatMissPanel,
  GuidancePanel,
  StockKPIsPanel,
  MilestonesPanel,
  ProfileRow,
} from "./FinancialSummaryPanels";
