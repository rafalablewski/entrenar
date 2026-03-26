"use client";

import React from "react";
import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import { useStockData } from "@/components/intelligence/StockDataContext";

function renderGenericValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    return (
      <div className="space-y-1">
        {value.map((item, i) => (
          <div key={i} className="text-[9px] text-pq-text-dim">
            {typeof item === "object" ? Object.entries(item as Record<string, unknown>).map(([k, v]) => `${k}: ${String(v)}`).join(" · ") : String(item)}
          </div>
        ))}
      </div>
    );
  }
  if (typeof value === "object") {
    return (
      <div className="space-y-0.5">
        {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
          <div key={k} className="flex justify-between text-[9px]">
            <span className="text-pq-text-dim">{k}</span>
            <span className="text-pq-text-secondary font-mono">{String(v)}</span>
          </div>
        ))}
      </div>
    );
  }
  return String(value);
}

/** Known top-level keys on the operations object */
const KNOWN_OPS_KEYS = new Set(["kpis", "milestones"]);

interface Props { ticker: string }

/** Known fields for a KPI item — everything else is rendered as overflow */
const KNOWN_KPI_FIELDS = new Set(["label", "value", "change", "period"]);

/** Known fields for a milestone item — everything else is rendered as overflow */
const KNOWN_MILESTONE_FIELDS = new Set(["date", "milestone", "status"]);

/** Map milestone status strings to Badge color variants */
function statusVariant(status: string): "green" | "blue" | "yellow" | "cyan" | "orange" | "default" {
  switch (status) {
    case "Completed":       return "green";
    case "On Track":        return "blue";
    case "In Progress":     return "cyan";
    case "In Negotiation":  return "yellow";
    case "Planning":        return "orange";
    case "Projected":
    case "Long-Range Plan":
    case "Conditional":     return "default";
    default:                return "default";
  }
}

/** Color for KPI change values: green for positive, red for negative */
function changeColor(change: string): string {
  if (change?.startsWith("+")) return "text-pq-green";
  if (change?.startsWith("-")) return "text-pq-red";
  return "text-pq-text";
}

export function OperationsTab({ ticker }: Props) {
  const data = useStockData();

  if (data?.operations) {
    const { kpis, milestones } = data.operations;
    return (
      <div className="space-y-3 md:space-y-4">
        <SectionLabel className="text-pq-text-bright">STOCK-SPECIFIC OPERATIONS</SectionLabel>
        <Panel className="p-3 md:p-4">
          <div className="text-xs text-pq-text-dim leading-relaxed">
            Operational metrics and milestones for <span className="text-pq-accent font-bold">{ticker}</span>.
            This tab captures domain-specific KPIs unique to this stock.
          </div>
        </Panel>

        {/* -- Operational KPIs -- */}
        <Panel className="p-3 md:p-4 space-y-3">
          <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">OPERATIONAL KPIS</div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] text-pq-text-dim tracking-wide">
                  <th className="text-left py-2 pr-4">KPI</th>
                  <th className="text-right py-2 px-3">VALUE</th>
                  <th className="text-right py-2 px-3">CHANGE</th>
                  <th className="text-right py-2 px-3">PERIOD</th>
                </tr>
              </thead>
              <tbody>
                {kpis.map((kpi: Record<string, unknown>, idx: number) => {
                  const overflow = Object.entries(kpi).filter(([k]) => !KNOWN_KPI_FIELDS.has(k));
                  return (
                    <tr key={String(kpi.label) ?? idx} className="border-t border-white/5">
                      <td className="py-2 pr-4 text-pq-text-dim text-[10px]">
                        {String(kpi.label)}
                        {overflow.length > 0 && (
                          <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                            {overflow.map(([k, v]) => (
                              <span key={k} className="text-pq-text-dim text-[9px]">{k}: {typeof v === "object" && v !== null ? JSON.stringify(v) : String(v)}</span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-pq-text-bright font-bold">{String(kpi.value)}</td>
                      <td className={`py-2 px-3 text-right font-mono ${changeColor(String(kpi.change))}`}>{String(kpi.change)}</td>
                      <td className="py-2 px-3 text-right text-[10px] text-pq-text-dim">{String(kpi.period)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* -- Operational Milestones -- */}
        <Panel className="p-3 md:p-4 space-y-3">
          <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">OPERATIONAL TIMELINE</div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] text-pq-text-dim tracking-wide">
                  <th className="text-left py-2 pr-4">DATE</th>
                  <th className="text-left py-2 px-3">MILESTONE</th>
                  <th className="text-center py-2 px-3">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {milestones.map((ms: Record<string, unknown>, idx: number) => {
                  const overflow = Object.entries(ms).filter(([k]) => !KNOWN_MILESTONE_FIELDS.has(k));
                  return (
                    <tr key={String(ms.date) + String(ms.milestone) ?? idx} className="border-t border-white/5">
                      <td className="py-2 pr-4 font-mono text-pq-text-dim whitespace-nowrap">{String(ms.date)}</td>
                      <td className="py-2 px-3 text-pq-text">
                        {String(ms.milestone)}
                        {overflow.length > 0 && (
                          <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                            {overflow.map(([k, v]) => (
                              <span key={k} className="text-pq-text-dim text-[9px]">{k}: {typeof v === "object" && v !== null ? JSON.stringify(v) : String(v)}</span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <Badge variant={statusVariant(String(ms.status))}>{String(ms.status)}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Overflow: unknown top-level keys on operations data */}
        {(() => {
          const extras = Object.entries(data.operations).filter(([k]) => !KNOWN_OPS_KEYS.has(k));
          if (extras.length === 0) return null;
          return extras.map(([key, value]) => (
            <div key={key}>
              <SectionLabel className="text-pq-text-bright">{key.replace(/([A-Z])/g, " $1").toUpperCase()}</SectionLabel>
              <Panel className="p-3">{renderGenericValue(value)}</Panel>
            </div>
          ));
        })()}
      </div>
    );
  }

  /* -- Fallback: no operations data for this ticker -- */
  return (
    <div className="space-y-3 md:space-y-4">
      <SectionLabel className="text-pq-text-bright">STOCK-SPECIFIC OPERATIONS</SectionLabel>
      <Panel className="p-3 md:p-4">
        <div className="text-xs text-pq-text-dim leading-relaxed">
          This tab contains operational metrics unique to <span className="text-pq-accent font-bold">{ticker}</span>.
          Unlike other tabs which share a common schema, this tab is fully customized per stock to capture
          domain-specific KPIs and operational data.
        </div>
      </Panel>
      <Panel className="p-3 md:p-4 space-y-3">
        <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">OPERATIONAL KPIS</div>
        <div className="text-xs text-pq-text-dim text-center py-8">
          Stock-specific operational metrics will be defined when data is added.
          Examples: hash rate (miners), subscribers (SaaS), satellites in orbit (space), load factor (airlines).
        </div>
      </Panel>
      <Panel className="p-3 md:p-4 space-y-3">
        <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">OPERATIONAL TIMELINE</div>
        <div className="text-xs text-pq-text-dim text-center py-4">
          Domain-specific milestones and operational events
        </div>
      </Panel>
      <div className="text-[10px] text-pq-text-dim border border-white/10 p-3">
        TEMPLATE: Operations tab for <span className="text-pq-accent">{ticker}</span>. This is the only tab with a fully custom schema per stock. Structure will be defined based on the stock&apos;s industry and key operational drivers.
      </div>
    </div>
  );
}
