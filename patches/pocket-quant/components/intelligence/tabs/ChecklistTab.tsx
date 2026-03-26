"use client";

import { useMemo } from "react";
import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import CollapsibleCard from "@/components/ui/CollapsibleCard";
import { SectionDivider, TabTemplateFooter, AwaitingData } from "@/components/shared/DataDisplayComponents";
import { useStockData } from "@/components/intelligence/StockDataContext";
import { OverflowSections } from "./shared/OverflowFields";
import { DUE_DILIGENCE_ITEMS, SCORECARD_DIMENSIONS } from "@/lib/manifests";

interface Props { ticker: string }

const STATUS_CONFIG = {
  pass:    { label: "PASS",    variant: "green"   as const, icon: "✓" },
  fail:    { label: "FAIL",    variant: "red"     as const, icon: "✗" },
  warn:    { label: "WARNING", variant: "yellow"  as const, icon: "!" },
  pending: { label: "PENDING", variant: "default" as const, icon: "?" },
};

/** Known top-level keys on the checklist data object. */
const KNOWN_CL_KEYS: ReadonlySet<string> = new Set([
  "dueDiligence", "scorecard", "compositeScore", "compositeVerdict",
  "preTrade", "lastReviewed",
]);

function statusIcon(status: string) {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
}

export function ChecklistTab({ ticker }: Props) {
  const data = useStockData();
  const cl = data?.checklist;

  const ddManifestLabels = useMemo(() => new Set(DUE_DILIGENCE_ITEMS.map((i) => i.label)), []);
  const scManifestLabels = useMemo(() => new Set(SCORECARD_DIMENSIONS.map((d) => d.label)), []);

  if (!cl) {
    return (
      <div className="space-y-3 md:space-y-4">
        <SectionLabel className="text-pq-text-bright">DUE DILIGENCE CHECKLIST</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[{ l: "ITEMS REVIEWED", v: "0" }, { l: "PASSED", v: "—" }, { l: "WARNINGS", v: "—" }, { l: "FAILED", v: "—" }].map((s) => (
            <Panel key={s.l} className="p-3 text-center">
              <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">{s.l}</div>
              <div className="text-lg font-bold text-pq-text-dim">{s.v}</div>
            </Panel>
          ))}
        </div>
        <div className="space-y-2">
          {DUE_DILIGENCE_ITEMS.map((item) => (
            <Panel key={item.id} className="p-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 bg-white/10 text-pq-text-dim">?</span>
                <span className="text-xs text-pq-text-dim flex-1">{item.label}</span>
                <Badge variant="default">PENDING</Badge>
              </div>
            </Panel>
          ))}
        </div>
        <SectionDivider />
        <div className="flex items-center gap-3">
          <SectionLabel className="text-pq-text-bright">INVESTMENT SCORECARD</SectionLabel>
          <Badge variant="default">—/100</Badge>
        </div>
        <Panel className="p-3 md:p-4 space-y-3">
          <div className="border-t border-white/[0.06] pt-3 space-y-2">
            {SCORECARD_DIMENSIONS.map((dim) => (
              <Panel key={dim.id} className="p-2">
                <div className="flex items-center gap-3">
                  <span className="w-32 text-[10px] text-pq-text-dim font-semibold truncate">{dim.label}</span>
                  <div className="flex-1 h-1.5 bg-pq-surface2 rounded-full overflow-hidden" />
                  <span className="text-[10px] text-pq-text-dim font-mono w-8 text-right">—</span>
                </div>
              </Panel>
            ))}
          </div>
        </Panel>
        <SectionDivider />
        <SectionLabel className="text-pq-text-bright">PRE-TRADE CHECKLIST</SectionLabel>
        <Panel className="p-3 md:p-4"><AwaitingData text="Awaiting assessment" /></Panel>
        <TabTemplateFooter tabName="Checklist" ticker={ticker} detail="Due diligence, scorecard, and pre-trade checklist will be populated from filing analysis." />
      </div>
    );
  }

  /* ── Compute DD summary stats ── */
  const ddEntries = Object.entries(cl.dueDiligence ?? {});
  const ddPass = ddEntries.filter(([, v]) => v.status === "pass").length;
  const ddWarn = ddEntries.filter(([, v]) => v.status === "warn").length;
  const ddFail = ddEntries.filter(([, v]) => v.status === "fail").length;

  /* ── Overflow DD items: keys in data but not in manifest ── */
  const overflowDDItems = ddEntries.filter(([label]) => !ddManifestLabels.has(label));

  /* ── Compute scorecard weighted total ── */
  const scEntries = Object.entries(cl.scorecard ?? {});
  const totalWeight = scEntries.reduce((s, [, v]) => s + v.weight, 0);

  /* ── Overflow scorecard dims: keys in data but not in manifest ── */
  const overflowScDims = scEntries.filter(([label]) => !scManifestLabels.has(label));

  /* ── Pre-trade stats ── */
  const ptEntries = Object.entries(cl.preTrade ?? {});
  const ptChecked = ptEntries.filter(([, v]) => v.checked).length;

  return (
    <div className="space-y-3 md:space-y-4">
      {/* ── Header stats ── */}
      <SectionLabel className="text-pq-text-bright">DUE DILIGENCE CHECKLIST</SectionLabel>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Panel className="p-3 text-center">
          <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">ITEMS REVIEWED</div>
          <div className="text-lg font-bold text-pq-text-bright">{ddEntries.length}</div>
        </Panel>
        <Panel className="p-3 text-center">
          <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">PASSED</div>
          <div className="text-lg font-bold text-pq-green">{ddPass}</div>
        </Panel>
        <Panel className="p-3 text-center">
          <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">WARNINGS</div>
          <div className="text-lg font-bold text-pq-yellow">{ddWarn}</div>
        </Panel>
        <Panel className="p-3 text-center">
          <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">FAILED</div>
          <div className="text-lg font-bold text-pq-red">{ddFail}</div>
        </Panel>
      </div>

      {/* ── DD Items (expandable) ── */}
      <div className="space-y-2">
        {DUE_DILIGENCE_ITEMS.map((item) => {
          const d = cl.dueDiligence?.[item.label];
          const cfg = d ? statusIcon(d.status) : STATUS_CONFIG.pending;
          return <DDItemCard key={item.id} label={item.label} cfg={cfg} notes={d?.notes} defaultOpen={d?.status === "warn" || d?.status === "fail"} />;
        })}
        {/* Overflow: DD items from data not in manifest */}
        {overflowDDItems.map(([label, d]) => {
          const cfg = statusIcon(d.status);
          return <DDItemCard key={label} label={label} cfg={cfg} notes={d?.notes} defaultOpen={d?.status === "warn" || d?.status === "fail"} />;
        })}
      </div>

      {/* ── INVESTMENT SCORECARD ── */}
      <SectionDivider />
      <div className="flex items-center gap-3">
        <SectionLabel className="text-pq-text-bright">INVESTMENT SCORECARD</SectionLabel>
        <Badge variant="orange">{cl.compositeScore}/100</Badge>
      </div>

      <Panel className="p-3 md:p-4 space-y-3">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-pq-surface2 border border-white/[0.06] flex items-center justify-center">
            <span className="kpi-value text-2xl text-pq-text-bright">{cl.compositeScore}</span>
          </div>
          <div className="flex-1">
            <div className="text-sm text-pq-text-bright font-semibold tracking-tight">Composite Score</div>
            <div className="micro-label mt-0.5">Weighted multi-factor investment scorecard</div>
          </div>
          <Badge variant="green">{cl.compositeVerdict}</Badge>
        </div>

        <div className="border-t border-white/[0.06] pt-3 space-y-2">
          {SCORECARD_DIMENSIONS.map((dim) => (
            <ScorecardDimRow key={dim.id} label={dim.label} sc={cl.scorecard?.[dim.label]} />
          ))}
          {/* Overflow: scorecard dimensions from data not in manifest */}
          {overflowScDims.map(([label, sc]) => (
            <ScorecardDimRow key={label} label={label} sc={sc} />
          ))}
        </div>

        <div className="border-t border-white/[0.06] pt-2 text-[9px] text-pq-text-dim">
          Total weight: {totalWeight}%. Last reviewed: {cl.lastReviewed}.
        </div>
      </Panel>

      {/* ── PRE-TRADE CHECKLIST ── */}
      <SectionDivider />
      <div className="flex items-center gap-3">
        <SectionLabel className="text-pq-text-bright">PRE-TRADE CHECKLIST</SectionLabel>
        <Badge variant={ptChecked === ptEntries.length ? "green" : "yellow"}>
          {ptChecked}/{ptEntries.length} COMPLETE
        </Badge>
      </div>

      <Panel className="p-3 md:p-4">
        <div className="space-y-1">
          {ptEntries.map(([label, item]) => (
            <CollapsibleCard key={label} summary={
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded border flex items-center justify-center text-[9px] shrink-0 ${
                  item.checked ? "bg-pq-green/15 border-pq-green/40 text-pq-green" : "bg-transparent border-white/20 text-pq-text-dim"
                }`}>{item.checked ? "✓" : ""}</span>
                <span className={`text-xs ${item.checked ? "text-pq-text" : "text-pq-text-dim"}`}>{label}</span>
              </div>
            }>
              <div className="pt-2"><div className="text-[11px] text-pq-text leading-relaxed">{item.notes}</div></div>
            </CollapsibleCard>
          ))}
        </div>
      </Panel>

      {/* ── Top-level overflow ── */}
      <OverflowSections data={cl as unknown as Record<string, unknown>} knownKeys={KNOWN_CL_KEYS} />

      <div className="text-[10px] text-pq-text-dim border border-white/5 p-3">
        Checklist for <span className="text-pq-accent">{ticker}</span>.
        Last reviewed: {cl.lastReviewed}. Due diligence items are assessed against SEC filings, management disclosures, and independent research.
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function DDItemCard({ label, cfg, notes, defaultOpen }: {
  label: string;
  cfg: { label: string; variant: "green" | "red" | "yellow" | "default"; icon: string };
  notes?: string;
  defaultOpen?: boolean;
}) {
  return (
    <CollapsibleCard defaultOpen={defaultOpen} summary={
      <div className="flex items-center gap-2">
        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
          cfg.variant === "green" ? "bg-pq-green/15 text-pq-green" :
          cfg.variant === "red" ? "bg-pq-red/15 text-pq-red" :
          cfg.variant === "yellow" ? "bg-pq-yellow/15 text-pq-yellow" :
          "bg-white/10 text-pq-text-dim"
        }`}>{cfg.icon}</span>
        <span className="text-xs text-pq-text-bright flex-1">{label}</span>
        <Badge variant={cfg.variant}>{cfg.label}</Badge>
      </div>
    }>
      <div className="pt-2"><div className="text-[11px] text-pq-text leading-relaxed">{notes ?? "Not yet assessed"}</div></div>
    </CollapsibleCard>
  );
}

function ScorecardDimRow({ label, sc }: {
  label: string;
  sc?: { score: number; weight: number; notes?: string };
}) {
  const score = sc?.score ?? 0;
  const weight = sc?.weight ?? 0;
  return (
    <CollapsibleCard summary={
      <div className="flex items-center gap-3">
        <span className="w-32 text-[10px] text-pq-text-bright font-semibold truncate">{label}</span>
        <div className="flex-1 h-1.5 bg-pq-surface2 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${
            score >= 75 ? "bg-pq-green/60" : score >= 50 ? "bg-pq-yellow/60" : "bg-pq-red/60"
          }`} style={{ width: `${score}%` }} />
        </div>
        <span className="text-[10px] text-pq-text font-mono w-8 text-right">{score}</span>
        <span className="text-[9px] text-pq-text-dim w-10 text-right">({weight}%)</span>
      </div>
    }>
      <div className="pt-2"><div className="text-[11px] text-pq-text leading-relaxed">{sc?.notes ?? "Not yet assessed"}</div></div>
    </CollapsibleCard>
  );
}
