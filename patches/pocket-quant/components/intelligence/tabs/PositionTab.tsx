"use client";

import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import { SectionDivider, TabTemplateFooter } from "@/components/shared/DataDisplayComponents";
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
            {typeof item === "object"
              ? <div className="flex flex-wrap gap-x-3 gap-y-0.5">{Object.entries(item).map(([k, v]) => <span key={k} className="text-pq-text-dim text-[9px]">{k}: {typeof v === "object" ? JSON.stringify(v) : String(v)}</span>)}</div>
              : <span>{String(item)}</span>}
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

const KNOWN_TOP_LEVEL_KEYS = new Set([
  "currentPosition", "sizingMetrics", "entryLevels", "exitLevels", "tradeLog",
]);

const ENTRY_KNOWN = new Set(["label", "price", "action", "size"]);
const EXIT_KNOWN = new Set(["label", "price", "reason"]);
const TRADE_KNOWN = new Set(["date", "action", "shares", "price", "value", "rationale"]);

export function PositionTab({ ticker }: Props) {
  const data = useStockData();
  const p = data?.position;
  if (p) {
    const unknownSections = Object.entries(p).filter(([k]) => !KNOWN_TOP_LEVEL_KEYS.has(k));
    return (
      <div className="space-y-3 md:space-y-4">
        <SectionLabel className="text-pq-text-bright">POSITION</SectionLabel>
        {/* Current position */}
        <Panel className="p-3 md:p-4 space-y-3">
          <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">CURRENT POSITION</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-2">
            {Object.entries(p.currentPosition ?? {}).map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between border-b border-white/5 pb-1">
                <span className="text-[10px] text-pq-text-dim">{k}</span>
                <span className={`text-xs font-mono ${String(v).includes("+") ? "text-pq-green" : String(v).includes("-") ? "text-pq-red" : "text-pq-text-bright"} font-bold`}>{String(v)}</span>
              </div>
            ))}
          </div>
        </Panel>

        {/* Sizing metrics */}
        <Panel className="p-3 md:p-4 space-y-3">
          <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">SIZING METRICS</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-2">
            {Object.entries(p.sizingMetrics ?? {}).map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between border-b border-white/5 pb-1">
                <span className="text-[10px] text-pq-text-dim">{k}</span>
                <span className="text-xs text-pq-text font-mono">{String(v)}</span>
              </div>
            ))}
          </div>
        </Panel>

        {/* Entry / exit levels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <Panel className="p-3 md:p-4 space-y-3">
            <div className="text-[10px] text-pq-green tracking-wide uppercase">ENTRY LEVELS</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] text-pq-text-dim tracking-wide">
                  <th className="text-left py-1">LEVEL</th>
                  <th className="text-right py-1">PRICE</th>
                  <th className="text-left py-1 pl-3">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {(p.entryLevels ?? []).map((e: Record<string, any>, i: number) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="py-2 text-pq-text">{e.label}</td>
                    <td className="py-2 text-right font-mono text-pq-green font-bold">{e.price}</td>
                    <td className="py-2 pl-3 text-pq-text-dim text-[10px]">
                      {e.action} ({e.size})
                      {renderOverflowFields(e, ENTRY_KNOWN)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
          <Panel className="p-3 md:p-4 space-y-3">
            <div className="text-[10px] text-pq-red tracking-wide uppercase">EXIT LEVELS</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] text-pq-text-dim tracking-wide">
                  <th className="text-left py-1">LEVEL</th>
                  <th className="text-right py-1">PRICE</th>
                  <th className="text-left py-1 pl-3">REASON</th>
                </tr>
              </thead>
              <tbody>
                {(p.exitLevels ?? []).map((e: Record<string, any>, i: number) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="py-2 text-pq-text">{e.label}</td>
                    <td className="py-2 text-right font-mono text-pq-accent font-bold">{e.price}</td>
                    <td className="py-2 pl-3 text-pq-text-dim text-[10px]">
                      {e.reason}
                      {renderOverflowFields(e, EXIT_KNOWN)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>

        {/* Trade log */}
        <SectionDivider />
        <SectionLabel className="text-pq-text-bright">TRADE LOG</SectionLabel>
        <Panel className="p-3 md:p-4 space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] text-pq-text-dim tracking-wide">
                  <th className="text-left py-2 pr-4">DATE</th>
                  <th className="text-center py-2 px-3">ACTION</th>
                  <th className="text-right py-2 px-3">SHARES</th>
                  <th className="text-right py-2 px-3">PRICE</th>
                  <th className="text-right py-2 px-3">VALUE</th>
                  <th className="text-left py-2 px-3">RATIONALE</th>
                </tr>
              </thead>
              <tbody>
                {(p.tradeLog ?? []).map((t: Record<string, any>, i: number) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="py-2 pr-4 font-mono text-pq-text-dim whitespace-nowrap">{t.date}</td>
                    <td className="py-2 px-3 text-center">
                      <Badge variant={t.action === "Buy" ? "green" : "red"}>{t.action}</Badge>
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{t.shares}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text-bright">{t.price}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{t.value}</td>
                    <td className="py-2 px-3 text-pq-text-dim">
                      {t.rationale}
                      {renderOverflowFields(t, TRADE_KNOWN)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
      <SectionLabel className="text-pq-text-bright">POSITION</SectionLabel>

      <Panel className="p-3 md:p-4 space-y-3">
        <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">CURRENT POSITION</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-2">
          {["Status", "Shares", "Avg Cost", "Market Value", "P&L", "P&L %"].map((k) => (
            <div key={k} className="flex items-baseline justify-between border-b border-white/5 pb-1">
              <span className="text-[10px] text-pq-text-dim">{k}</span>
              <span className="text-xs text-pq-text-dim font-mono">—</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="p-3 md:p-4 space-y-3">
        <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">SIZING METRICS</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-2">
          {["Portfolio Weight", "Max Position Size", "Risk Budget"].map((k) => (
            <div key={k} className="flex items-baseline justify-between border-b border-white/5 pb-1">
              <span className="text-[10px] text-pq-text-dim">{k}</span>
              <span className="text-xs text-pq-text-dim font-mono">—</span>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <Panel className="p-3 md:p-4 space-y-3">
          <div className="text-[10px] text-pq-green tracking-wide uppercase">ENTRY LEVELS</div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-pq-text-dim tracking-wide">
                <th className="text-left py-1">LEVEL</th>
                <th className="text-right py-1">PRICE</th>
                <th className="text-left py-1 pl-3">ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-white/5">
                <td colSpan={3} className="py-4 text-center text-[10px] text-pq-text-dim">Awaiting data</td>
              </tr>
            </tbody>
          </table>
        </Panel>
        <Panel className="p-3 md:p-4 space-y-3">
          <div className="text-[10px] text-pq-red tracking-wide uppercase">EXIT LEVELS</div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-pq-text-dim tracking-wide">
                <th className="text-left py-1">LEVEL</th>
                <th className="text-right py-1">PRICE</th>
                <th className="text-left py-1 pl-3">REASON</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-white/5">
                <td colSpan={3} className="py-4 text-center text-[10px] text-pq-text-dim">Awaiting data</td>
              </tr>
            </tbody>
          </table>
        </Panel>
      </div>

      <SectionDivider />
      <SectionLabel className="text-pq-text-bright">TRADE LOG</SectionLabel>
      <Panel className="p-3 md:p-4 space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-pq-text-dim tracking-wide">
                <th className="text-left py-2 pr-4">DATE</th>
                <th className="text-center py-2 px-3">ACTION</th>
                <th className="text-right py-2 px-3">SHARES</th>
                <th className="text-right py-2 px-3">PRICE</th>
                <th className="text-right py-2 px-3">VALUE</th>
                <th className="text-left py-2 px-3">RATIONALE</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-white/5">
                <td colSpan={6} className="py-4 text-center text-[10px] text-pq-text-dim">No trades recorded</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>

      <TabTemplateFooter tabName="Position" ticker={ticker} detail="Position sizing, entry/exit levels, and trade log will be populated as positions are managed." />
    </div>
  );
}
