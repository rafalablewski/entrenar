"use client";

import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import { MetricCard, SectionDivider, TabTemplateFooter, AwaitingData } from "@/components/shared/DataDisplayComponents";
import { useStockData } from "@/components/intelligence/StockDataContext";
import { renderGenericValue, renderOverflowFields } from "./shared/OverflowFields";

interface Props { ticker: string }

function convictionColor(c?: string): string {
  if (!c) return "text-pq-text-dim";
  const l = c.toLowerCase();
  if (l === "high" || l === "very high") return "text-pq-green";
  if (l === "medium") return "text-pq-yellow";
  return "text-pq-red";
}

function driverHeatClass(impact: string): string {
  if (impact === "Very High") return "heat-critical";
  if (impact === "High") return "heat-high";
  if (impact === "Medium") return "heat-medium";
  return "heat-low";
}

const KNOWN_TOP_LEVEL_KEYS = new Set([
  "conviction", "rating", "timeHorizon", "lastReviewed",
  "statement", "keyDrivers", "bullCase", "bearCase",
  "variant", "catalystPath",
]);

const DRIVER_KNOWN = new Set(["driver", "impact", "confidence"]);

export function ThesisTab({ ticker }: Props) {
  const data = useStockData();
  const t = data?.thesis;
  if (t) {
    const unknownSections = Object.entries(t).filter(([k]) => !KNOWN_TOP_LEVEL_KEYS.has(k));
    return (
      <div className="space-y-3 md:space-y-4">
        <SectionLabel className="text-pq-text-bright">INVESTMENT THESIS</SectionLabel>
        {/* Hero metrics strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="section-hero p-3 md:p-4 text-center">
            <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">CONVICTION</div>
            <div className={`text-lg font-bold font-mono stat-hero ${convictionColor(t.conviction)}`}>{t.conviction}</div>
          </div>
          <MetricCard label="RATING" value={t.rating} size="sm" />
          <MetricCard label="TIME HORIZON" value={t.timeHorizon} size="sm" />
          <MetricCard label="LAST REVIEWED" value={t.lastReviewed} size="sm" />
        </div>

        {/* Thesis statement */}
        <div className="section-hero p-4 md:p-5 space-y-2">
          <div className="text-[10px] text-pq-cyan tracking-wide uppercase font-semibold">THESIS STATEMENT</div>
          <div className="text-sm text-pq-text-bright leading-relaxed font-medium">{t.statement}</div>
        </div>

        {/* Key drivers */}
        <Panel className="p-3 md:p-4 space-y-3" variant="elevated">
          <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">KEY DRIVERS</div>
          <div className="space-y-1">
            {(t.keyDrivers ?? []).map((d: Record<string, any>, i: number) => (
              <div key={i} className={`flex flex-col py-2.5 px-3 rounded-md ${driverHeatClass(d.impact)} transition-all`}>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-pq-text flex-1">{d.driver}</span>
                  <Badge variant={d.impact === "High" ? "orange" : d.impact === "Very High" ? "red" : "default"}>{d.impact}</Badge>
                  <Badge variant={d.confidence === "High" ? "green" : "yellow"}>{d.confidence}</Badge>
                </div>
                {renderOverflowFields(d, DRIVER_KNOWN)}
              </div>
            ))}
          </div>
        </Panel>

        {/* Bull / Bear */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="glass-hero-positive p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pq-green glow-green" />
              <span className="text-[10px] text-pq-green tracking-wide uppercase font-bold">BULL CASE</span>
            </div>
            <ul className="text-xs text-pq-text space-y-2">
              {(t.bullCase ?? []).map((b: string, i: number) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <span className="text-pq-green mt-0.5 text-[10px]">&#9650;</span>
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-hero-negative p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pq-red glow-red" />
              <span className="text-[10px] text-pq-red tracking-wide uppercase font-bold">BEAR CASE</span>
            </div>
            <ul className="text-xs text-pq-text space-y-2">
              {(t.bearCase ?? []).map((b: string, i: number) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <span className="text-pq-red mt-0.5 text-[10px]">&#9660;</span>
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <SectionDivider />

        {/* Variant perception */}
        <Panel className="p-3 md:p-4 space-y-2" variant="elevated">
          <div className="text-[10px] text-pq-violet tracking-wide uppercase font-semibold">VARIANT PERCEPTION</div>
          <div className="text-xs text-pq-text leading-relaxed">{t.variant}</div>
        </Panel>

        {/* Catalyst path */}
        <Panel className="p-3 md:p-4 space-y-2" variant="elevated">
          <div className="text-[10px] text-pq-cyan tracking-wide uppercase font-semibold">CATALYST PATH</div>
          <div className="text-xs text-pq-text leading-relaxed">{t.catalystPath}</div>
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
      <SectionLabel className="text-pq-text-bright">INVESTMENT THESIS</SectionLabel>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="section-hero p-3 md:p-4 text-center">
          <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">CONVICTION</div>
          <div className="text-lg font-bold font-mono text-pq-text-dim">—</div>
        </div>
        <MetricCard label="RATING" value="—" size="sm" />
        <MetricCard label="TIME HORIZON" value="—" size="sm" />
        <MetricCard label="LAST REVIEWED" value="—" size="sm" />
      </div>

      <div className="section-hero p-4 md:p-5 space-y-2">
        <div className="text-[10px] text-pq-cyan tracking-wide uppercase font-semibold">THESIS STATEMENT</div>
        <AwaitingData />
      </div>

      <Panel className="p-3 md:p-4 space-y-3" variant="elevated">
        <div className="text-[10px] text-pq-text-dim tracking-wide uppercase">KEY DRIVERS</div>
        <AwaitingData />
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="glass-hero-positive p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pq-green glow-green" />
            <span className="text-[10px] text-pq-green tracking-wide uppercase font-bold">BULL CASE</span>
          </div>
          <AwaitingData />
        </div>
        <div className="glass-hero-negative p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pq-red glow-red" />
            <span className="text-[10px] text-pq-red tracking-wide uppercase font-bold">BEAR CASE</span>
          </div>
          <AwaitingData />
        </div>
      </div>

      <SectionDivider />

      <Panel className="p-3 md:p-4 space-y-2" variant="elevated">
        <div className="text-[10px] text-pq-violet tracking-wide uppercase font-semibold">VARIANT PERCEPTION</div>
        <div className="text-xs text-pq-text-dim leading-relaxed">—</div>
      </Panel>

      <Panel className="p-3 md:p-4 space-y-2" variant="elevated">
        <div className="text-[10px] text-pq-cyan tracking-wide uppercase font-semibold">CATALYST PATH</div>
        <div className="text-xs text-pq-text-dim leading-relaxed">—</div>
      </Panel>

      <TabTemplateFooter tabName="Investment Thesis" ticker={ticker} detail="All sections will be populated from SEC filing analysis." />
    </div>
  );
}
