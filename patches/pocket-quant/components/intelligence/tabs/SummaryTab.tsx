"use client";

import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import { ScoreRing, GaugeBar } from "@/components/shared/DataDisplayComponents";
import {
  COMPANY_DESCRIPTION_FIELDS,
  MOAT_FACTORS,
  RATING_FACTORS,
  RATING_SCALE,
  QUICK_REFERENCE_METRICS,
} from "@/lib/manifests";
import { useStockData } from "@/components/intelligence/StockDataContext";
import { OverflowKeyValues, OverflowSections } from "./shared/OverflowFields";

interface Props { ticker: string }

/** Known keys in the descriptionFields Record */
const KNOWN_DESC_KEYS = new Set<string>(COMPANY_DESCRIPTION_FIELDS);

/** Known moat score keys */
const KNOWN_MOAT_KEYS = new Set<string>(MOAT_FACTORS.map((m) => m.id));

/** Known factor score keys */
const KNOWN_FACTOR_KEYS = new Set<string>(RATING_FACTORS.map((f) => f.id));

/** Known quick reference metric names */
const KNOWN_QR_KEYS = new Set<string>(QUICK_REFERENCE_METRICS.map((m) => m.name));

/** Known top-level keys on the summaryOverview object */
const KNOWN_SO_KEYS = new Set([
  "description", "descriptionFields", "competitors", "moatScores",
  "ratingScore", "ratingVerdict", "factorScores", "quickRef",
]);

/** Map numeric scores to accent colors */
function scoreColor(v?: number): string {
  if (v == null) return "text-pq-text-dim";
  if (v >= 75) return "text-pq-green";
  if (v >= 50) return "text-pq-cyan";
  if (v >= 25) return "text-pq-yellow";
  return "text-pq-red";
}

function scoreBg(v?: number): string {
  if (v == null) return "bg-pq-surface3";
  if (v >= 75) return "bg-pq-green";
  if (v >= 50) return "bg-pq-cyan";
  if (v >= 25) return "bg-pq-yellow";
  return "bg-pq-red";
}

export function SummaryTab({ ticker }: Props) {
  const d = useStockData();
  const so = d?.summaryOverview;
  return (
    <div className="space-y-4 md:space-y-5">
      {/* -- Company Description -- */}
      <SectionLabel>COMPANY DESCRIPTION</SectionLabel>
      <div className="section-hero p-4 md:p-5 space-y-3">
        <p className="text-xs text-pq-text leading-relaxed relative">
          {so?.description ?? (
            <>
              Company description for <span className="text-pq-cyan font-semibold">{ticker}</span> has not been populated yet.
              This section covers what the company does, its core business segments, revenue model, and market positioning.
            </>
          )}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04] overflow-hidden mt-2">
          {COMPANY_DESCRIPTION_FIELDS.map((label) => (
            <div key={label} className="kv-row px-3 py-2 bg-pq-panel border-none">
              <span className="micro-label">{label}</span>
              <span className="text-xs text-pq-text font-mono">{so?.descriptionFields?.[label] ?? "—"}</span>
            </div>
          ))}
        </div>
        {/* Overflow: extra description fields not in manifest */}
        <OverflowKeyValues
          data={so?.descriptionFields as Record<string, unknown> | undefined}
          knownKeys={KNOWN_DESC_KEYS}
          className="mt-2"
        />
      </div>

      {/* -- Competitors & Unique Value -- */}
      <SectionLabel>COMPETITIVE POSITION</SectionLabel>
      <Panel className="p-3 md:p-4" variant="elevated">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Direct competitors */}
          <div className="space-y-2.5">
            <div className="micro-label">DIRECT COMPETITORS</div>
            {(so?.competitors ?? Array.from({ length: 4 }, (_, i) => `Competitor ${i + 1}`)).map((name, i) => (
              <div key={i} className="flex items-center gap-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-pq-cyan/40 flex-shrink-0" />
                <span className="text-xs text-pq-text">{name}</span>
              </div>
            ))}
          </div>
          {/* Moat scoring with gauge bars */}
          <div className="space-y-3">
            <div className="micro-label">UNIQUE VALUE / MOAT</div>
            {MOAT_FACTORS.map((item) => {
              const raw = so?.moatScores?.[item.id];
              const numVal = raw != null ? (typeof raw === "number" ? raw : parseFloat(String(raw))) : undefined;
              const validNum = numVal != null && !isNaN(numVal) ? numVal : undefined;
              return (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-pq-text">{item.label}</span>
                    <span className={`kpi-value text-xs ${scoreColor(validNum)}`}>{raw ?? "—"}</span>
                  </div>
                  <GaugeBar value={validNum} color={scoreBg(validNum)} />
                </div>
              );
            })}
            {/* Overflow: extra moat scores not in manifest */}
            <OverflowKeyValues
              data={so?.moatScores as Record<string, unknown> | undefined}
              knownKeys={KNOWN_MOAT_KEYS}
              className="mt-2"
            />
          </div>
        </div>
      </Panel>

      {/* -- Quant Rating -- */}
      <SectionLabel>POCKETQUANT RATING</SectionLabel>
      <div className="section-hero p-4 md:p-5 space-y-5">
        {/* Rating header — score ring + details */}
        <div className="flex items-center gap-5">
          <ScoreRing
            value={so?.ratingScore}
            color={scoreColor(so?.ratingScore)}
            label="/ 100"
          />
          <div className="flex-1">
            <div className="text-sm text-pq-text-bright font-semibold tracking-tight">Composite Score</div>
            <div className="micro-label mt-0.5">Weighted multi-factor quantitative rating</div>
            <div className="mt-2">
              <Badge variant={so?.ratingScore != null && so.ratingScore >= 70 ? "green" : so?.ratingScore != null && so.ratingScore >= 40 ? "yellow" : "default"}>
                {so?.ratingVerdict ?? "PENDING COVERAGE"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Factor breakdown with gauge bars */}
        <div className="border-t border-white/[0.06] pt-4 space-y-3">
          <div className="micro-label mb-2">FACTOR BREAKDOWN</div>
          {RATING_FACTORS.map((f) => (
            <RatingFactorRow
              key={f.id}
              label={f.label}
              weight={`${Math.round(f.weight * 100)}%`}
              value={so?.factorScores?.[f.id]}
            />
          ))}
          {/* Overflow: extra factor scores not in manifest */}
          <OverflowKeyValues
            data={so?.factorScores as Record<string, unknown> | undefined}
            knownKeys={KNOWN_FACTOR_KEYS}
            className="mt-2"
          />
        </div>

        {/* Methodology note */}
        <div className="border-t border-white/[0.06] pt-3">
          <p className="text-[10px] text-pq-text-dim leading-relaxed">
            <span className="text-pq-cyan font-semibold">Methodology:</span> Each factor is scored 0–100 based on quantitative
            metrics sourced from financial statements, market data, and SEC filings. Factors are weighted
            by their predictive signal strength. The composite score maps to a rating:
            {RATING_SCALE.map((r) => (
              <span key={r.id} className={r.color}> {r.label}</span>
            ))}.
          </p>
        </div>
      </div>

      {/* -- Quick Reference -- */}
      <SectionLabel>QUICK REFERENCE</SectionLabel>
      <div className="glass-grid-sep grid-cols-2 md:grid-cols-4">
        {QUICK_REFERENCE_METRICS.map((m) => (
          <div key={m.id} className="p-3 md:p-4 text-center">
            <div className="kpi-label mb-1.5">{m.name}</div>
            <div className="kpi-value text-pq-text-bright">{so?.quickRef?.[m.name] ?? "—"}</div>
          </div>
        ))}
      </div>
      {/* Overflow: extra quick reference keys not in manifest */}
      <OverflowKeyValues
        data={so?.quickRef as Record<string, unknown> | undefined}
        knownKeys={KNOWN_QR_KEYS}
      />

      {/* -- Overflow: unknown top-level sections on summaryOverview -- */}
      <OverflowSections
        data={so as Record<string, unknown> | undefined}
        knownKeys={KNOWN_SO_KEYS}
      />

      {/* -- Template note (only when no data) -- */}
      {!so && (
        <div className="text-[10px] text-pq-text-dim border border-white/[0.06] rounded-md p-3">
          TEMPLATE: Summary tab for <span className="text-pq-accent">{ticker}</span>. All sections will be populated with live data and analyst research when data is added.
        </div>
      )}
    </div>
  );
}

function RatingFactorRow({ label, weight, value }: { label: string; weight: string; value?: number }) {
  const color = scoreColor(value);
  const bg = scoreBg(value);
  return (
    <div className="flex items-center gap-3 group">
      <span className="w-24 text-[10px] text-pq-text-bright font-semibold truncate">{label}</span>
      <div className="flex-1">
        <GaugeBar value={value} color={bg} className="group-hover:opacity-90" />
      </div>
      <span className={`text-[11px] font-mono w-8 text-right font-bold ${color}`}>{value ?? "—"}</span>
      <span className="text-[9px] text-pq-text-dim w-8 text-right">({weight})</span>
    </div>
  );
}
