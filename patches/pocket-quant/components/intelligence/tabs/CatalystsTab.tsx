"use client";

import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import { SectionDivider, TabTemplateFooter, AwaitingData } from "@/components/shared/DataDisplayComponents";
import { useStockData } from "@/components/intelligence/StockDataContext";

interface Props { ticker: string }

/* eslint-disable @typescript-eslint/no-explicit-any */
function renderOverflowFields(item: Record<string, any>, knownFields: Set<string>) {
  const extras = Object.entries(item).filter(
    ([k, v]) => !knownFields.has(k) && v !== undefined && v !== null && v !== ""
  );
  if (extras.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
      {extras.map(([k, v]) => (
        <span key={k} className="text-pq-text-dim text-[9px]">
          {k}: {typeof v === "object" ? JSON.stringify(v) : String(v)}
        </span>
      ))}
    </div>
  );
}

function renderGenericValue(value: any): React.ReactNode {
  if (value === null || value === undefined) return <span className="text-pq-text-dim text-xs">—</span>;
  if (typeof value === "string") return <div className="text-xs text-pq-text leading-relaxed">{value}</div>;
  if (Array.isArray(value)) {
    return (
      <ul className="text-xs text-pq-text space-y-1">
        {value.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-pq-text-dim">•</span>
            {typeof item === "object" ? (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                {Object.entries(item).map(([k, v]) => (
                  <span key={k} className="text-pq-text-dim text-[9px]">
                    {k}: {typeof v === "object" ? JSON.stringify(v) : String(v)}
                  </span>
                ))}
              </div>
            ) : (
              <span>{String(item)}</span>
            )}
          </li>
        ))}
      </ul>
    );
  }
  if (typeof value === "object") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
        {Object.entries(value).map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between border-b border-white/5 pb-1">
            <span className="text-[10px] text-pq-text-dim">{k}</span>
            <span className="text-xs text-pq-text font-mono">{typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
          </div>
        ))}
      </div>
    );
  }
  return <div className="text-xs text-pq-text">{String(value)}</div>;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function impactColor(i: string): "red" | "orange" | "yellow" | "green" | "default" {
  if (i === "Very High") return "red";
  if (i === "High") return "orange";
  if (i === "Medium") return "yellow";
  return "default";
}

function impactHeat(i: string): string {
  if (i === "Very High") return "heat-critical";
  if (i === "High") return "heat-high";
  if (i === "Medium") return "heat-medium";
  return "heat-low";
}

const KNOWN_TOP_LEVEL_KEYS = new Set(["nearTerm", "mediumTerm", "tracker"]);
const NEAR_TERM_KNOWN = new Set(["date", "catalyst", "notes", "category", "impact", "probability"]);
const MEDIUM_TERM_KNOWN = new Set(["timeframe", "catalyst", "notes", "category", "impact", "probability"]);
const TRACKER_KNOWN = new Set(["date", "catalyst", "status", "outcome"]);

export function CatalystsTab({ ticker }: Props) {
  const data = useStockData();
  const c = data?.catalysts;

  if (c) {
    const unknownSections = Object.entries(c).filter(([k]) => !KNOWN_TOP_LEVEL_KEYS.has(k));
    return (
      <div className="space-y-3 md:space-y-4">
        <SectionLabel className="text-pq-text-bright">CATALYSTS</SectionLabel>

        {/* Near-term catalysts */}
        <Panel className="p-3 md:p-4 space-y-2" variant="elevated">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-pq-green glow-green" />
            <span className="text-[10px] text-pq-text-dim tracking-wide uppercase">NEAR-TERM (0-6 MONTHS)</span>
            <Badge variant="green">{(c.nearTerm ?? []).length}</Badge>
          </div>
          {(c.nearTerm ?? []).map((cat: Record<string, any>, i: number) => (
            <div key={i} className={`rounded-md px-3 py-2.5 ${impactHeat(cat.impact)} transition-all`}>
              <div className="flex items-start gap-3">
                <span className="text-[10px] font-mono text-pq-text-dim whitespace-nowrap mt-0.5 shrink-0">{cat.date}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-pq-text-bright font-medium">{cat.catalyst}</div>
                  {cat.notes && <div className="text-[10px] text-pq-text-dim mt-0.5">{cat.notes}</div>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Badge variant="cyan">{cat.category}</Badge>
                  <Badge variant={impactColor(cat.impact)}>{cat.impact}</Badge>
                  <Badge variant={(cat.probability ?? "").includes("High") ? "green" : "yellow"}>{cat.probability}</Badge>
                </div>
              </div>
              {renderOverflowFields(cat, NEAR_TERM_KNOWN)}
            </div>
          ))}
        </Panel>

        {/* Medium-term catalysts */}
        <Panel className="p-3 md:p-4 space-y-2" variant="elevated">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-pq-yellow glow-yellow" />
            <span className="text-[10px] text-pq-text-dim tracking-wide uppercase">MEDIUM-TERM (6-18 MONTHS)</span>
            <Badge variant="yellow">{(c.mediumTerm ?? []).length}</Badge>
          </div>
          {(c.mediumTerm ?? []).map((cat: Record<string, any>, i: number) => (
            <div key={i} className={`rounded-md px-3 py-2.5 ${impactHeat(cat.impact)} transition-all`}>
              <div className="flex items-start gap-3">
                <span className="text-[10px] font-mono text-pq-text-dim whitespace-nowrap mt-0.5 shrink-0">{cat.timeframe}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-pq-text-bright font-medium">{cat.catalyst}</div>
                  {cat.notes && <div className="text-[10px] text-pq-text-dim mt-0.5">{cat.notes}</div>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Badge variant="cyan">{cat.category}</Badge>
                  <Badge variant={impactColor(cat.impact)}>{cat.impact}</Badge>
                  <Badge variant={(cat.probability ?? "").includes("High") ? "green" : "yellow"}>{cat.probability}</Badge>
                </div>
              </div>
              {renderOverflowFields(cat, MEDIUM_TERM_KNOWN)}
            </div>
          ))}
        </Panel>

        {/* Catalyst tracker */}
        <SectionDivider />
        <SectionLabel className="text-pq-text-bright">CATALYST TRACKER</SectionLabel>
        <Panel className="p-3 md:p-4" variant="elevated">
          <div className="space-y-0">
            {(c.tracker ?? []).map((t: Record<string, any>, i: number) => (
              <div key={i} className="flex items-start gap-3 pb-3 last:pb-0 relative">
                {i < (c.tracker ?? []).length - 1 && (
                  <div className="timeline-line absolute left-[4px] top-[14px] bottom-0" />
                )}
                <div className={`timeline-dot ${
                  t.status === "Completed" ? "timeline-dot-completed" : t.status === "Pending" ? "timeline-dot-pending" : ""
                } mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono text-pq-text-dim">{t.date}</span>
                    <Badge variant={t.status === "Completed" ? "green" : t.status === "Pending" ? "yellow" : "default"}>{t.status}</Badge>
                  </div>
                  <div className="text-xs text-pq-text-bright font-medium">{t.catalyst}</div>
                  {t.outcome && <div className="text-[10px] text-pq-text-dim mt-0.5">{t.outcome}</div>}
                  {renderOverflowFields(t, TRACKER_KNOWN)}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Unknown top-level sections */}
        {unknownSections.map(([key, value]) => (
          <Panel key={key} className="p-3 md:p-4 space-y-2">
            <SectionLabel className="text-pq-text-bright">{key.replace(/([A-Z])/g, " $1").toUpperCase()}</SectionLabel>
            {renderGenericValue(value)}
          </Panel>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      <SectionLabel className="text-pq-text-bright">CATALYSTS</SectionLabel>

      <Panel className="p-3 md:p-4 space-y-2" variant="elevated">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-pq-green glow-green" />
          <span className="text-[10px] text-pq-text-dim tracking-wide uppercase">NEAR-TERM (0-6 MONTHS)</span>
          <Badge variant="green">0</Badge>
        </div>
        <AwaitingData />
      </Panel>

      <Panel className="p-3 md:p-4 space-y-2" variant="elevated">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-pq-yellow glow-yellow" />
          <span className="text-[10px] text-pq-text-dim tracking-wide uppercase">MEDIUM-TERM (6-18 MONTHS)</span>
          <Badge variant="yellow">0</Badge>
        </div>
        <AwaitingData />
      </Panel>

      <SectionDivider />
      <SectionLabel className="text-pq-text-bright">CATALYST TRACKER</SectionLabel>
      <Panel className="p-3 md:p-4" variant="elevated">
        <AwaitingData />
      </Panel>

      <TabTemplateFooter tabName="Catalysts" ticker={ticker} detail="Near-term and medium-term catalysts will be populated from SEC filing analysis." />
    </div>
  );
}
