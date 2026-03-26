"use client";

import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import { SectionDivider } from "@/components/shared/DataDisplayComponents";
import { useStockData } from "@/components/intelligence/StockDataContext";
import { OverflowSections } from "./shared/OverflowFields";
import {
  HeaderMetrics,
  RatingDistribution,
  PriceTargets,
  AnalystActionsTable,
  ConsensusEstimatesTable,
  EstimateRevisionsTable,
  EarningsSurpriseTable,
  CoverageSummary,
} from "./wallstreet/WallStreetSubComponents";

interface Props { ticker: string }

/** Known top-level keys on the wallStreet data object. */
const KNOWN_WS_KEYS: ReadonlySet<string> = new Set([
  "headerMetrics", "ratingDistribution", "priceTargets",
  "analystActions", "consensusEstimates", "estimateRevisions",
  "earningsSurprise", "firmCoverage", "coverageSummary",
]);

export function WallStreetTab({ ticker }: Props) {
  const d = useStockData();
  const ws = d?.wallStreet;
  const firms = ws?.firmCoverage ? Object.keys(ws.firmCoverage) : [];

  return (
    <div className="space-y-3 md:space-y-4">
      <SectionLabel className="text-pq-text-bright">WALL STREET CONSENSUS</SectionLabel>

      <HeaderMetrics ws={ws} />
      <RatingDistribution ws={ws} />
      <PriceTargets ws={ws} />
      <AnalystActionsTable ws={ws} />

      {/* ── CONSENSUS SNAPSHOT ── */}
      <SectionDivider />
      <SectionLabel className="text-pq-text-bright">CONSENSUS SNAPSHOT</SectionLabel>

      <ConsensusEstimatesTable ws={ws} />
      <EstimateRevisionsTable ws={ws} />
      <EarningsSurpriseTable ws={ws} />

      {/* ── COVERAGE BY FIRM ── */}
      <SectionDivider />
      <SectionLabel className="text-pq-text-bright">COVERAGE BY FIRM</SectionLabel>

      <Panel className="p-3 md:p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-pq-text-dim tracking-wide">
                <th className="text-left py-2 pr-4">FIRM</th>
                <th className="text-left py-2 px-3">ANALYST</th>
                <th className="text-center py-2 px-3">RATING</th>
                <th className="text-right py-2 px-3">PRICE TARGET</th>
                <th className="text-right py-2 px-3">EPS EST (FY)</th>
                <th className="text-right py-2 px-3">REV EST (FY, $M)</th>
                <th className="text-left py-2 px-3">LAST ACTION</th>
                <th className="text-left py-2 px-3">DATE</th>
              </tr>
            </thead>
            <tbody>
              {firms.map((firm) => {
                const fc = ws?.firmCoverage?.[firm];
                return (
                  <tr key={firm} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-2 pr-4 text-pq-text">{firm}</td>
                    <td className="py-2 px-3 text-pq-text-dim">{fc?.analyst ?? "—"}</td>
                    <td className="py-2 px-3 text-center"><Badge variant="default">{fc?.rating ?? "—"}</Badge></td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text-bright">{fc?.pt ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{fc?.epsEst ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono text-pq-text">{fc?.revEst ?? "—"}</td>
                    <td className="py-2 px-3"><Badge variant="default">{fc?.lastAction ?? "—"}</Badge></td>
                    <td className="py-2 px-3 font-mono text-pq-text-dim">{fc?.date ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <CoverageSummary ws={ws} />

      {/* ── Top-level overflow: unknown sections on wallStreet data ── */}
      <OverflowSections data={ws as Record<string, unknown> | undefined} knownKeys={KNOWN_WS_KEYS} />

      {/* ── Template note (only when no data) ── */}
      {!ws && (
        <div className="text-[10px] text-pq-text-dim border border-white/5 p-3">
          TEMPLATE: Wall Street tab for <span className="text-pq-accent">{ticker}</span>.
          Analyst consensus, estimates, revisions, and firm-level coverage has not been populated yet.
        </div>
      )}
    </div>
  );
}
