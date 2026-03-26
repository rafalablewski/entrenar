"use client";

import React from "react";
import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import { useStockData } from "@/components/intelligence/StockDataContext";
import { TabTemplateFooter, AwaitingData } from "@/components/shared/DataDisplayComponents";

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

interface Props { ticker: string }

function scenarioColor(label: string): "red" | "default" | "green" | "orange" {
  switch (label) { case "Bear": return "red"; case "Base": return "default"; case "Bull": return "green"; case "Moon": return "orange"; default: return "default"; }
}

/** Known fields for a scenario item — everything else is rendered as overflow */
const KNOWN_SCENARIO_FIELDS = new Set([
  "label", "probability", "targetPrice", "upside",
  "revenue", "margin", "multiple", "keyAssumptions",
]);

/** Known top-level keys for the scenarios object */
const KNOWN_TOP_LEVEL_KEYS = new Set([
  "currentPrice", "expectedValue", "lastUpdated",
  "scenarios", "sensitivityDrivers",
]);

export function ScenariosTab({ ticker }: Props) {
  const data = useStockData();
  const s = data?.scenarios;
  if (s) {
    /* Detect unknown top-level keys */
    const topLevelOverflow = Object.entries(s).filter(
      ([k]) => !KNOWN_TOP_LEVEL_KEYS.has(k)
    );

    return (
      <div className="space-y-3 md:space-y-4">
        <SectionLabel className="text-pq-text-bright">SCENARIOS</SectionLabel>
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <Panel className="p-3 text-center">
            <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">CURRENT PRICE</div>
            <div className="text-lg font-bold text-pq-text-bright">{s.currentPrice}</div>
          </Panel>
          <Panel className="p-3 text-center">
            <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">EXPECTED VALUE</div>
            <div className="text-lg font-bold text-pq-green">{s.expectedValue}</div>
          </Panel>
          <Panel className="p-3 text-center">
            <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">LAST UPDATED</div>
            <div className="text-sm font-bold text-pq-text-bright">{s.lastUpdated}</div>
          </Panel>
        </div>

        {/* Scenario cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {(s.scenarios ?? []).map((sc: Record<string, unknown>) => (
            <div key={String(sc.label)}>
            <Panel className="p-3 md:p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant={scenarioColor(String(sc.label))}>{String(sc.label)}</Badge>
                <span className="text-[10px] text-pq-text-dim">P: {String(sc.probability)}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold text-pq-text-bright">{String(sc.targetPrice)}</span>
                <span className={`text-sm font-mono ${(String(sc.upside ?? "")).startsWith("+") ? "text-pq-green" : "text-pq-red"}`}>{String(sc.upside)}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div><span className="text-pq-text-dim">Rev:</span> <span className="text-pq-text font-mono">{String(sc.revenue)}</span></div>
                <div><span className="text-pq-text-dim">Margin:</span> <span className="text-pq-text font-mono">{String(sc.margin)}</span></div>
                <div><span className="text-pq-text-dim">Multiple:</span> <span className="text-pq-text font-mono">{String(sc.multiple)}</span></div>
              </div>
              {/* Per-scenario overflow: render any extra metrics the AI extracts */}
              {Object.entries(sc)
                .filter(([k]) => !KNOWN_SCENARIO_FIELDS.has(k))
                .length > 0 && (
                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                  {Object.entries(sc)
                    .filter(([k]) => !KNOWN_SCENARIO_FIELDS.has(k))
                    .map(([k, v]) => (
                      <span key={k} className="text-pq-text-dim text-[9px]">{k}: {renderGenericValue(v)}</span>
                    ))}
                </div>
              )}
              <div className="border-t border-white/5 pt-2">
                <div className="text-[10px] text-pq-text-dim mb-1">KEY ASSUMPTIONS</div>
                <ul className="text-[10px] text-pq-text space-y-0.5">
                  {((sc.keyAssumptions ?? []) as string[]).map((a, i) => <li key={i}>• {a}</li>)}
                </ul>
              </div>
            </Panel>
            </div>
          ))}
        </div>

        {/* Sensitivity drivers */}
        <Panel className="p-3 md:p-4 space-y-3">
          <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">SENSITIVITY DRIVERS</div>
          <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-pq-text-dim tracking-wide">
                <th className="text-left py-2 pr-4">DRIVER</th>
                <th className="text-center py-2 px-3">BEAR</th>
                <th className="text-center py-2 px-3">BASE</th>
                <th className="text-center py-2 px-3">BULL</th>
              </tr>
            </thead>
            <tbody>
              {(s.sensitivityDrivers ?? []).map((d: Record<string, unknown>, i: number) => {
                const DRIVER_KNOWN = new Set(["driver", "bearValue", "baseValue", "bullValue"]);
                const driverExtras = Object.entries(d).filter(([k]) => !DRIVER_KNOWN.has(k) && !k.startsWith("_"));
                return (
                  <tr key={i} className="border-t border-white/5">
                    <td className="py-2 pr-4 text-pq-text">
                      {String(d.driver)}
                      {driverExtras.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {driverExtras.map(([k, v]) => (
                            <span key={k} className="text-pq-text-dim text-[9px]">{k}: {renderGenericValue(v)}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-pq-red">{String(d.bearValue)}</td>
                    <td className="py-2 px-3 text-center font-mono text-pq-text">{String(d.baseValue)}</td>
                    <td className="py-2 px-3 text-center font-mono text-pq-green">{String(d.bullValue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </Panel>

        {/* Top-level overflow: unknown keys in scenarios data */}
        {topLevelOverflow.length > 0 && (
          <Panel className="p-3 md:p-4 space-y-2">
            {topLevelOverflow.map(([k, v]) => (
              <div key={k}>
                <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-1">{k.replace(/([A-Z])/g, " $1").toUpperCase()}</div>
                {renderGenericValue(v)}
              </div>
            ))}
          </Panel>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      <SectionLabel className="text-pq-text-bright">SCENARIOS</SectionLabel>

      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <Panel className="p-3 text-center">
          <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">CURRENT PRICE</div>
          <div className="text-lg font-bold text-pq-text-dim">—</div>
        </Panel>
        <Panel className="p-3 text-center">
          <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">EXPECTED VALUE</div>
          <div className="text-lg font-bold text-pq-text-dim">—</div>
        </Panel>
        <Panel className="p-3 text-center">
          <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">LAST UPDATED</div>
          <div className="text-sm font-bold text-pq-text-dim">—</div>
        </Panel>
      </div>

      {/* Scenario cards placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {["Bear", "Base", "Bull"].map((label) => (
          <Panel key={label} className="p-3 md:p-4 space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant={scenarioColor(label)}>{label}</Badge>
              <span className="text-[10px] text-pq-text-dim">P: —</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-pq-text-dim">—</span>
              <span className="text-sm font-mono text-pq-text-dim">—</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div><span className="text-pq-text-dim">Rev:</span> <span className="text-pq-text-dim font-mono">—</span></div>
              <div><span className="text-pq-text-dim">Margin:</span> <span className="text-pq-text-dim font-mono">—</span></div>
              <div><span className="text-pq-text-dim">Multiple:</span> <span className="text-pq-text-dim font-mono">—</span></div>
            </div>
            <div className="border-t border-white/5 pt-2">
              <div className="text-[10px] text-pq-text-dim mb-1">KEY ASSUMPTIONS</div>
              <AwaitingData />
            </div>
          </Panel>
        ))}
      </div>

      {/* Sensitivity drivers */}
      <Panel className="p-3 md:p-4 space-y-3">
        <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">SENSITIVITY DRIVERS</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-pq-text-dim tracking-wide">
                <th className="text-left py-2 pr-4">DRIVER</th>
                <th className="text-center py-2 px-3">BEAR</th>
                <th className="text-center py-2 px-3">BASE</th>
                <th className="text-center py-2 px-3">BULL</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-white/5">
                <td colSpan={4} className="py-4 text-center text-[10px] text-pq-text-dim">Awaiting filing analysis</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>

      <TabTemplateFooter tabName="Scenarios" ticker={ticker} detail="Bull/Base/Bear scenarios will be populated from SEC filing analysis." />
    </div>
  );
}
