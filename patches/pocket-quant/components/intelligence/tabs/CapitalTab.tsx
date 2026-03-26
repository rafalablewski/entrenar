"use client";

import { useState } from "react";
import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import { useStockData } from "@/components/intelligence/StockDataContext";
import { CAPITAL_SECTIONS } from "@/lib/manifests";
import { MetricCard } from "./capital/CapitalHelpers";
import {
  ShareClassesSection,
  MajorHoldersSection,
  CapitalEventsSection,
  SbcQuartersSection,
} from "./capital/CapitalSections";
import {
  TotalDilutionSection,
  LiquiditySection,
  InsiderActivitySection,
} from "./capital/CapitalSectionsMore";

/**
 * Standard metric labels always shown in the key metrics grid (in order).
 * Any additional keyMetrics from AI extraction are appended below these.
 */
const STANDARD_METRICS = [
  "SHARES OUTSTANDING",
  "FULLY DILUTED SHARES",
  "TOTAL DILUTION %",
  "FLOAT %",
  "INSIDER OWNERSHIP",
  "INSTITUTIONAL OWNERSHIP",
  "SHORT INTEREST",
  "DAYS TO COVER",
] as const;

interface Props {
  ticker: string;
}

export function CapitalTab({ ticker }: Props) {
  const [activeSection, setActiveSection] = useState(CAPITAL_SECTIONS[0].id);
  const data = useStockData();
  const cap = data?.capital ?? null;

  // Collect additional keyMetrics beyond the standard 8
  const extraMetricLabels: string[] = [];
  if (cap?.keyMetrics) {
    const standardSet = new Set<string>(STANDARD_METRICS);
    for (const key of Object.keys(cap.keyMetrics)) {
      if (!standardSet.has(key)) {
        extraMetricLabels.push(key);
      }
    }
  }

  return (
    <div className="space-y-3 md:space-y-4">
      <SectionLabel className="text-pq-text-bright">KEY METRICS</SectionLabel>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {STANDARD_METRICS.map((label) => (
          <MetricCard
            key={label}
            label={label}
            value={cap?.keyMetrics?.[label]}
          />
        ))}
        {extraMetricLabels.map((label) => (
          <MetricCard
            key={label}
            label={label}
            value={cap?.keyMetrics?.[label]}
          />
        ))}
      </div>

      <SectionLabel className="text-pq-text-bright">NAVIGATION</SectionLabel>
      <Panel className="p-3">
        <div className="flex items-center gap-2 flex-wrap">
          {CAPITAL_SECTIONS.map((s) => (
            <Button
              key={s.id}
              variant="tab"
              active={activeSection === s.id}
              onClick={() => setActiveSection(s.id)}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </Panel>

      {activeSection === "share-classes" && (
        <ShareClassesSection ticker={ticker} cap={cap} />
      )}
      {activeSection === "major-holders" && (
        <MajorHoldersSection cap={cap} />
      )}
      {activeSection === "capital-events" && (
        <CapitalEventsSection cap={cap} />
      )}
      {activeSection === "sbc-quarters" && <SbcQuartersSection cap={cap} />}
      {activeSection === "total-dilution" && (
        <TotalDilutionSection cap={cap} />
      )}
      {activeSection === "liquidity" && <LiquiditySection cap={cap} />}
      {activeSection === "insider-activity" && (
        <InsiderActivitySection cap={cap} />
      )}

      {!cap && (
        <div className="text-[10px] text-pq-text-dim border border-white/10 p-3">
          TEMPLATE: Capital Structure &amp; Ownership tab for{" "}
          <span className="text-pq-accent">{ticker}</span>.
        </div>
      )}
    </div>
  );
}
