"use client";

import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import { useStockData } from "@/components/intelligence/StockDataContext";
import { TabTemplateFooter, AwaitingData } from "@/components/shared/DataDisplayComponents";
import { renderGenericValue, renderOverflowFields } from "./shared/OverflowFields";

interface Props { ticker: string }

const KNOWN_TOP_LEVEL_KEYS = new Set([
  "executives", "boardMembers", "compensationSummary",
  "insiderOwnership", "governanceScore", "governanceNotes", "recentChanges",
]);

const EXEC_KNOWN = new Set(["name", "title", "since", "compensation", "shares", "pctOwnership", "background"]);
const BOARD_KNOWN = new Set(["name", "role", "independent", "committees"]);
const CHANGE_KNOWN = new Set(["date", "change", "impact"]);

export function ManagementTab({ ticker }: Props) {
  const data = useStockData();
  const mgmt = data?.management;

  if (mgmt) {
    const unknownSections = Object.entries(mgmt).filter(([k]) => !KNOWN_TOP_LEVEL_KEYS.has(k));
    return (
      <div className="space-y-3 md:space-y-4">
        <SectionLabel className="text-pq-text-bright">MANAGEMENT</SectionLabel>

        {/* Key executives */}
        <Panel className="p-3 md:p-4 space-y-3">
          <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">KEY EXECUTIVES</div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] text-pq-text-dim tracking-wide">
                  <th className="text-left py-2 pr-4">NAME</th>
                  <th className="text-left py-2 px-3">TITLE</th>
                  <th className="text-left py-2 px-3">SINCE</th>
                  <th className="text-right py-2 px-3">COMPENSATION</th>
                  <th className="text-right py-2 px-3">SHARES</th>
                  <th className="text-right py-2 px-3">% OWN</th>
                </tr>
              </thead>
              <tbody>
                {(mgmt.executives ?? []).map((e: Record<string, any>, i: number) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="py-2 pr-4 text-pq-text-bright font-bold">{e.name}</td>
                    <td className="py-2 px-3 text-pq-text-dim">{e.title}</td>
                    <td className="py-2 px-3 font-mono text-pq-text-dim">{e.since}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{e.compensation}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text-dim text-[10px]">{e.shares}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">
                      {e.pctOwnership}
                      {renderOverflowFields(e, EXEC_KNOWN)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Executive backgrounds */}
        <Panel className="p-3 md:p-4 space-y-3">
          <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">BACKGROUNDS</div>
          {(mgmt.executives ?? []).map((e: Record<string, any>, i: number) => (
            <div key={i} className="border-b border-white/5 pb-2">
              <span className="text-xs text-pq-accent font-bold">{e.name}</span>
              <span className="text-[10px] text-pq-text-dim ml-2">{e.title}</span>
              <div className="text-[10px] text-pq-text leading-relaxed mt-1">{e.background}</div>
            </div>
          ))}
        </Panel>

        {/* Board */}
        <Panel className="p-3 md:p-4 space-y-3">
          <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">BOARD OF DIRECTORS</div>
          <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-pq-text-dim tracking-wide">
                <th className="text-left py-2 pr-4">NAME</th>
                <th className="text-left py-2 px-3">ROLE</th>
                <th className="text-center py-2 px-3">INDEPENDENT</th>
                <th className="text-left py-2 px-3">COMMITTEES</th>
              </tr>
            </thead>
            <tbody>
              {(mgmt.boardMembers ?? []).map((b: Record<string, any>, i: number) => (
                <tr key={i} className="border-t border-white/5">
                  <td className="py-2 pr-4 text-pq-text">{b.name}</td>
                  <td className="py-2 px-3 text-pq-text-dim">{b.role}</td>
                  <td className="py-2 px-3 text-center">
                    <Badge variant={b.independent ? "green" : "default"}>{b.independent ? "Yes" : "No"}</Badge>
                  </td>
                  <td className="py-2 px-3 text-pq-text-dim text-[10px]">
                    {(b.committees ?? []).join(", ") || "—"}
                    {renderOverflowFields(b, BOARD_KNOWN)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Panel>

        {/* Compensation + ownership + governance in grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <Panel className="p-3 md:p-4 space-y-2">
            <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">COMPENSATION SUMMARY</div>
            {Object.entries(mgmt.compensationSummary ?? {}).map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between border-b border-white/5 pb-1">
                <span className="text-[10px] text-pq-text-dim">{k}</span>
                <span className="text-xs text-pq-text font-mono">{v}</span>
              </div>
            ))}
          </Panel>
          <Panel className="p-3 md:p-4 space-y-2">
            <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">INSIDER OWNERSHIP</div>
            {Object.entries(mgmt.insiderOwnership ?? {}).map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between border-b border-white/5 pb-1">
                <span className="text-[10px] text-pq-text-dim">{k}</span>
                <span className="text-xs text-pq-text font-mono">{v}</span>
              </div>
            ))}
          </Panel>
        </div>

        {/* Governance */}
        <Panel className="p-3 md:p-4 space-y-2">
          <div className="flex items-center gap-3">
            <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">GOVERNANCE</div>
            <Badge variant="blue">{mgmt.governanceScore}</Badge>
          </div>
          <ul className="text-xs text-pq-text space-y-1">
            {(mgmt.governanceNotes ?? []).map((n: string, i: number) => <li key={i} className="flex gap-2"><span className="text-pq-text-dim">•</span>{n}</li>)}
          </ul>
        </Panel>

        {/* Recent changes */}
        <Panel className="p-3 md:p-4 space-y-3">
          <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">RECENT CHANGES</div>
          {(mgmt.recentChanges ?? []).map((c: Record<string, any>, i: number) => (
            <div key={i} className="border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-pq-text-dim font-mono">{c.date}</span>
                <span className="text-xs text-pq-text">{c.change}</span>
              </div>
              <div className="text-[10px] text-pq-text-dim mt-1">{c.impact}</div>
              {renderOverflowFields(c, CHANGE_KNOWN)}
            </div>
          ))}
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
      <SectionLabel className="text-pq-text-bright">MANAGEMENT</SectionLabel>

      <Panel className="p-3 md:p-4 space-y-3">
        <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">KEY EXECUTIVES</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-pq-text-dim tracking-wide">
                <th className="text-left py-2 pr-4">NAME</th>
                <th className="text-left py-2 px-3">TITLE</th>
                <th className="text-left py-2 px-3">SINCE</th>
                <th className="text-right py-2 px-3">COMPENSATION</th>
                <th className="text-right py-2 px-3">SHARES</th>
                <th className="text-right py-2 px-3">% OWN</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-white/5">
                <td colSpan={6} className="py-4 text-center text-[10px] text-pq-text-dim">Awaiting filing analysis</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel className="p-3 md:p-4 space-y-3">
        <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">BOARD OF DIRECTORS</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-pq-text-dim tracking-wide">
                <th className="text-left py-2 pr-4">NAME</th>
                <th className="text-left py-2 px-3">ROLE</th>
                <th className="text-center py-2 px-3">INDEPENDENT</th>
                <th className="text-left py-2 px-3">COMMITTEES</th>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <Panel className="p-3 md:p-4 space-y-2">
          <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">COMPENSATION SUMMARY</div>
          <AwaitingData />
        </Panel>
        <Panel className="p-3 md:p-4 space-y-2">
          <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">INSIDER OWNERSHIP</div>
          <AwaitingData />
        </Panel>
      </div>

      <Panel className="p-3 md:p-4 space-y-2">
        <div className="flex items-center gap-3">
          <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">GOVERNANCE</div>
          <Badge variant="default">—</Badge>
        </div>
        <AwaitingData />
      </Panel>

      <Panel className="p-3 md:p-4 space-y-3">
        <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">RECENT CHANGES</div>
        <AwaitingData />
      </Panel>

      <TabTemplateFooter tabName="Management" ticker={ticker} detail="All sections will be populated from SEC filing analysis (10-K, DEF 14A, Form 4)." />
    </div>
  );
}
