import React from "react";
import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import type { CapitalData } from "@/data/shared/types";
import {
  SHARE_CLASSES,
  CAPITAL_EVENT_TYPES,
  SBC_METRICS,
  FORWARD_QUARTERS,
  TEMPLATE_ROW_COUNTS,
} from "@/lib/manifests";
import { MetricCard, ProfileRow } from "./CapitalHelpers";

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

/** Known share class column keys */
const KNOWN_SHARE_CLASS_KEYS = new Set([
  "Shares Out", "% of Total", "Par Value", "Dividend Rights", "Liquidation Pref",
  "Votes Per Share", "Total Votes", "% of Voting Power",
]);

/** Known divergence keys */
const KNOWN_DIVERGENCE_KEYS = new Set([
  "Dual-Class Structure", "Founder Voting Control", "Divergence Ratio",
  "Sunset Provision", "Conversion Trigger", "Governance Risk",
]);

/** Known ownership breakdown keys */
const KNOWN_OWNERSHIP_KEYS = new Set(["INSIDERS", "INSTITUTIONS", "RETAIL", "RETAIL / OTHER", "STRATEGIC / CROSSHOLDINGS"]);

/** Known SBC burn rate keys */
const KNOWN_SBC_BURN_KEYS = new Set(["Annual Burn Rate", "3-Year Avg Burn Rate", "Peer Median Burn Rate"]);

/** Known fields for a major holder item */
const KNOWN_HOLDER_FIELDS = new Set([
  "holder", "type", "shares", "pctOut", "pctVoting", "change", "filingDate",
]);

/** Known fields for a capital event item */
const KNOWN_EVENT_FIELDS = new Set([
  "date", "type", "description", "sharesImpact", "priceImpact", "dilution",
]);

/* -- SHARE CLASSES -- */

export function ShareClassesSection({ ticker, cap }: { ticker: string; cap: CapitalData | null }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <SectionLabel className="text-pq-text-bright">SHARE CLASS STRUCTURE</SectionLabel>
        <Badge variant="orange">{ticker}</Badge>
      </div>

      <SectionLabel className="text-pq-text-bright">ECONOMIC OWNERSHIP</SectionLabel>
      <Panel className="p-3 md:p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-pq-text-dim tracking-wide">
                <th className="text-left py-2 pr-4">SHARE CLASS</th>
                <th className="text-right py-2 px-3">SHARES OUT</th>
                <th className="text-right py-2 px-3">% OF TOTAL</th>
                <th className="text-right py-2 px-3">PAR VALUE</th>
                <th className="text-right py-2 px-3">DIVIDEND RIGHTS</th>
                <th className="text-right py-2 px-3">LIQUIDATION PREF</th>
              </tr>
            </thead>
            <tbody>
              {SHARE_CLASSES.map((cls) => {
                const sc = cap?.shareClasses?.[cls];
                const extraKeys = sc ? Object.entries(sc).filter(([k]) => !KNOWN_SHARE_CLASS_KEYS.has(k)) : [];
                return (
                  <React.Fragment key={cls}>
                  <tr className="border-t border-white/5">
                    <td className="py-2 pr-4 text-pq-text">{cls}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{sc?.["Shares Out"] ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{sc?.["% of Total"] ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{sc?.["Par Value"] ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{sc?.["Dividend Rights"] ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{sc?.["Liquidation Pref"] ?? "—"}</td>
                  </tr>
                  {extraKeys.length > 0 && (
                    <tr className="border-t border-white/5">
                      <td colSpan={6} className="py-1 px-4">
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                          {extraKeys.map(([k, v]) => (
                            <span key={k} className="text-pq-text-dim text-[9px]">{k}: {renderGenericValue(v)}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <SectionLabel className="text-pq-text-bright">VOTING POWER</SectionLabel>
      <Panel className="p-3 md:p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-pq-text-dim tracking-wide">
                <th className="text-left py-2 pr-4">SHARE CLASS</th>
                <th className="text-right py-2 px-3">VOTES / SHARE</th>
                <th className="text-right py-2 px-3">TOTAL VOTES</th>
                <th className="text-right py-2 px-3">% VOTING POWER</th>
                <th className="text-right py-2 px-3">CONVERSION RATIO</th>
                <th className="text-right py-2 px-3">SUNSET PROVISION</th>
              </tr>
            </thead>
            <tbody>
              {SHARE_CLASSES.map((cls) => {
                const sc = cap?.shareClasses?.[cls];
                const vp = cap?.votingPower?.[cls] ?? cap?.votingPower?.[cls.replace(" Common", "")];
                return (
                  <tr key={cls} className="border-t border-white/5">
                    <td className="py-2 pr-4 text-pq-text">{cls}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{sc?.["Votes Per Share"] ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{vp?.["Total Votes"] ?? sc?.["Total Votes"] ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{vp?.["% of Aggregate Votes"] ?? sc?.["% of Voting Power"] ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{vp?.["Conversion Ratio"] ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{vp?.["Sunset Provision"] ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <SectionLabel className="text-pq-text-bright">ECONOMIC vs VOTING DIVERGENCE</SectionLabel>
      <Panel className="p-3 md:p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-2">
          {[
            { label: "Dual-Class Structure", key: "Dual-Class Structure" },
            { label: "Founder Voting Control %", key: "Founder Voting Control" },
            { label: "Economic / Voting Ratio", key: "Divergence Ratio" },
            { label: "Sunset Trigger", key: "Sunset Provision" },
            { label: "Anti-Dilution Provisions", key: "Conversion Trigger" },
            { label: "Governance Risk Rating", key: "Governance Risk" },
          ].map(({ label, key }) => (
            <ProfileRow key={label} label={label} value={cap?.divergence?.[key]} />
          ))}
          {/* Overflow: extra divergence keys */}
          {cap?.divergence && (() => {
            const extras = Object.entries(cap.divergence).filter(([k]) => !KNOWN_DIVERGENCE_KEYS.has(k));
            if (extras.length === 0) return null;
            return extras.map(([k, v]) => (
              <ProfileRow key={k} label={k} value={v} />
            ));
          })()}
        </div>
      </Panel>
    </>
  );
}

/* -- MAJOR HOLDERS -- */

export function MajorHoldersSection({ cap }: { cap: CapitalData | null }) {
  const holders = cap?.majorHolders;
  return (
    <>
      <SectionLabel className="text-pq-text-bright">MAJOR HOLDERS</SectionLabel>
      <Panel className="p-3 md:p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-pq-text-dim tracking-wide">
                <th className="text-left py-2 pr-4">HOLDER</th>
                <th className="text-left py-2 px-3">TYPE</th>
                <th className="text-right py-2 px-3">SHARES</th>
                <th className="text-right py-2 px-3">% OUTSTANDING</th>
                <th className="text-right py-2 px-3">% VOTING</th>
                <th className="text-right py-2 px-3">CHANGE (QoQ)</th>
                <th className="text-right py-2 px-3">FILING DATE</th>
              </tr>
            </thead>
            <tbody>
              {holders && holders.length > 0
                ? holders.map((h: Record<string, unknown>, i: number) => {
                    const overflow = Object.entries(h).filter(([k]) => !KNOWN_HOLDER_FIELDS.has(k));
                    return (
                      <tr key={i} className="border-t border-white/5">
                        <td className="py-2 pr-4 text-pq-text">
                          {String(h.holder)}
                          {overflow.length > 0 && (
                            <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                              {overflow.map(([k, v]) => (
                                <span key={k} className="text-pq-text-dim text-[9px]">{k}: {String(v)}</span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3"><Badge variant="default">{String(h.type)}</Badge></td>
                        <td className="py-2 px-3 text-right font-mono text-pq-text">{String(h.shares)}</td>
                        <td className="py-2 px-3 text-right font-mono text-pq-text">{String(h.pctOut)}</td>
                        <td className="py-2 px-3 text-right font-mono text-pq-text">{String(h.pctVoting)}</td>
                        <td className="py-2 px-3 text-right font-mono text-pq-text">{String(h.change)}</td>
                        <td className="py-2 px-3 text-right font-mono text-pq-text-dim">{String(h.filingDate)}</td>
                      </tr>
                    );
                  })
                : Array.from({ length: TEMPLATE_ROW_COUNTS.majorHolders }, (_, i) => (
                    <tr key={i} className="border-t border-white/5">
                      <td className="py-2 pr-4 text-pq-text">—</td>
                      <td className="py-2 px-3"><Badge variant="default">—</Badge></td>
                      <td className="py-2 px-3 text-right font-mono text-pq-text">—</td>
                      <td className="py-2 px-3 text-right font-mono text-pq-text">—</td>
                      <td className="py-2 px-3 text-right font-mono text-pq-text">—</td>
                      <td className="py-2 px-3 text-right font-mono text-pq-text">—</td>
                      <td className="py-2 px-3 text-right font-mono text-pq-text-dim">—</td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </Panel>

      <SectionLabel className="text-pq-text-bright">OWNERSHIP BREAKDOWN</SectionLabel>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {["INSIDERS", "INSTITUTIONS", "RETAIL / OTHER", "STRATEGIC / CROSSHOLDINGS"].map((label) => {
          const key = label === "RETAIL / OTHER" ? "RETAIL" : label;
          return <MetricCard key={label} label={label} value={cap?.ownershipBreakdown?.[key]} />;
        })}
        {/* Overflow: extra ownership breakdown keys */}
        {cap?.ownershipBreakdown && (() => {
          const extras = Object.entries(cap.ownershipBreakdown).filter(([k]) => !KNOWN_OWNERSHIP_KEYS.has(k));
          if (extras.length === 0) return null;
          return extras.map(([k, v]) => (
            <MetricCard key={k} label={k} value={v} />
          ));
        })()}
      </div>
    </>
  );
}

/* -- CAPITAL EVENTS -- */

export function CapitalEventsSection({ cap }: { cap: CapitalData | null }) {
  const events = cap?.capitalEvents;
  return (
    <>
      <SectionLabel className="text-pq-text-bright">CAPITAL EVENTS HISTORY</SectionLabel>
      <Panel className="p-3 md:p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-pq-text-dim tracking-wide">
                <th className="text-left py-2 pr-4">DATE</th>
                <th className="text-left py-2 px-3">EVENT TYPE</th>
                <th className="text-left py-2 px-3">DESCRIPTION</th>
                <th className="text-right py-2 px-3">SHARES IMPACT</th>
                <th className="text-right py-2 px-3">PRICE IMPACT</th>
                <th className="text-right py-2 px-3">DILUTION %</th>
              </tr>
            </thead>
            <tbody>
              {events && events.length > 0
                ? events.map((evt: Record<string, unknown>, i: number) => {
                    const overflow = Object.entries(evt).filter(([k]) => !KNOWN_EVENT_FIELDS.has(k));
                    return (
                      <tr key={i} className="border-t border-white/5">
                        <td className="py-2 pr-4 font-mono text-pq-text-dim">{String(evt.date)}</td>
                        <td className="py-2 px-3"><Badge variant="cyan">{String(evt.type)}</Badge></td>
                        <td className="py-2 px-3 text-pq-text">
                          {String(evt.description)}
                          {overflow.length > 0 && (
                            <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                              {overflow.map(([k, v]) => (
                                <span key={k} className="text-pq-text-dim text-[9px]">{k}: {String(v)}</span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-pq-text">{String(evt.sharesImpact)}</td>
                        <td className="py-2 px-3 text-right font-mono text-pq-text">{String(evt.priceImpact)}</td>
                        <td className="py-2 px-3 text-right font-mono text-pq-text">{String(evt.dilution)}</td>
                      </tr>
                    );
                  })
                : CAPITAL_EVENT_TYPES.map((evt, i) => (
                    <tr key={i} className="border-t border-white/5">
                      <td className="py-2 pr-4 font-mono text-pq-text-dim">—</td>
                      <td className="py-2 px-3"><Badge variant="cyan">{evt}</Badge></td>
                      <td className="py-2 px-3 text-pq-text">—</td>
                      <td className="py-2 px-3 text-right font-mono text-pq-text">—</td>
                      <td className="py-2 px-3 text-right font-mono text-pq-text">—</td>
                      <td className="py-2 px-3 text-right font-mono text-pq-text">—</td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

/* -- SBC QUARTERS -- */

export function SbcQuartersSection({ cap }: { cap: CapitalData | null }) {
  const quarters = FORWARD_QUARTERS;
  return (
    <>
      <SectionLabel className="text-pq-text-bright">STOCK-BASED COMPENSATION — QUARTERLY</SectionLabel>
      <Panel className="p-3 md:p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-pq-text-dim tracking-wide">
                <th className="text-left py-2 pr-4">METRIC</th>
                {quarters.map((q) => <th key={q.label} className="text-right py-2 px-3">{q.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {SBC_METRICS.map((metric) => {
                const row = cap?.sbcQuarterly?.[metric.name];
                return (
                  <tr key={metric.id} className="border-t border-white/5">
                    <td className="py-2 pr-4 text-pq-text-dim text-[10px]">{metric.name}</td>
                    {quarters.map((q) => (
                      <td key={q.label} className="py-2 px-3 text-right font-mono text-pq-text">
                        {row?.[q.label] ?? "—"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <SectionLabel className="text-pq-text-bright">SBC BURN RATE</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {[
          { label: "ANNUAL BURN RATE %", key: "Annual Burn Rate" },
          { label: "3-YR AVG BURN RATE", key: "3-Year Avg Burn Rate" },
          { label: "PEER MEDIAN BURN RATE", key: "Peer Median Burn Rate" },
        ].map(({ label, key }) => (
          <MetricCard key={label} label={label} value={cap?.sbcBurnRate?.[key]} />
        ))}
        {/* Overflow: extra SBC burn rate keys */}
        {cap?.sbcBurnRate && (() => {
          const extras = Object.entries(cap.sbcBurnRate).filter(([k]) => !KNOWN_SBC_BURN_KEYS.has(k));
          if (extras.length === 0) return null;
          return extras.map(([k, v]) => (
            <MetricCard key={k} label={k} value={v} />
          ));
        })()}
      </div>
    </>
  );
}
