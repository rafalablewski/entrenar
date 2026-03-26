"use client";

import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import IntelligenceChart from "@/components/intelligence/IntelligenceChart";
import { ProfileRow } from "@/components/shared/DataDisplayComponents";
import { OVERVIEW_METRIC_LABELS } from "@/lib/manifests";
import { useStockData } from "@/components/intelligence/StockDataContext";
import { OverflowKeyValues, OverflowSections } from "./shared/OverflowFields";
import { useMemo } from "react";

interface Props { ticker: string }

/** Known keys in the overview metrics Record */
const KNOWN_METRIC_KEYS = new Set<string>(OVERVIEW_METRIC_LABELS);

/** Known top-level keys on the summaryOverview object */
const KNOWN_OVERVIEW_KEYS = new Set([
  "description", "metrics", "stockSpecific",
]);

export function OverviewTab({ ticker }: Props) {
  const d = useStockData();
  const overview = d?.summaryOverview;

  const metricsData = useMemo(
    () => overview?.metrics as Record<string, unknown> | undefined,
    [overview?.metrics],
  );

  return (
    <div className="space-y-3 md:space-y-4">
      {/* -- Company Description -- */}
      <SectionLabel className="text-pq-text-bright">COMPANY DESCRIPTION</SectionLabel>
      <div className="section-hero p-4 md:p-5">
        <p className="text-xs text-pq-text leading-relaxed relative">
          {overview?.description ?? (
            <>
              Company description for <span className="text-pq-cyan font-semibold">{ticker}</span> has not been populated yet.
            </>
          )}
        </p>
      </div>

      {/* -- Key Metrics -- */}
      <SectionLabel className="text-pq-text-bright">METRICS</SectionLabel>
      <Panel className="p-3 md:p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-2">
          {OVERVIEW_METRIC_LABELS.map((label) => (
            <ProfileRow key={label} label={label} value={overview?.metrics?.[label]} />
          ))}
        </div>
        {/* Overflow: extra metric keys not in OVERVIEW_METRIC_LABELS */}
        <OverflowKeyValues data={metricsData} knownKeys={KNOWN_METRIC_KEYS} className="mt-2 border-t border-white/5 pt-2" />
        <div className="border-t border-white/5 mt-3 pt-3">
          <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-2">STOCK-SPECIFIC</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-2">
            {overview?.stockSpecific ? (
              overview.stockSpecific.map((item) => (
                <ProfileRow key={item.label} label={item.label} value={item.value} />
              ))
            ) : (
              <>
                <ProfileRow label="—" />
                <ProfileRow label="—" />
                <ProfileRow label="—" />
                <ProfileRow label="—" />
              </>
            )}
          </div>
        </div>
      </Panel>

      {/* -- Overflow: unknown top-level sections on summaryOverview -- */}
      <OverflowSections data={overview as Record<string, unknown> | undefined} knownKeys={KNOWN_OVERVIEW_KEYS} />

      {/* -- Stock Chart -- */}
      <SectionLabel className="text-pq-text-bright">STOCK CHART</SectionLabel>
      <IntelligenceChart ticker={ticker} />

      {/* -- Template note (only shown when no data) -- */}
      {!overview && (
        <div className="text-[10px] text-pq-text-dim border border-white/5 p-3">
          TEMPLATE: Overview tab for <span className="text-pq-accent">{ticker}</span>. Metrics and chart will populate with live data when data is added.
        </div>
      )}
    </div>
  );
}
