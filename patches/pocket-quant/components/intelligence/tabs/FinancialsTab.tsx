"use client";

import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import {
  FORWARD_QUARTERS,
  INCOME_STATEMENT_METRICS,
  BALANCE_SHEET_METRICS,
  CASH_FLOW_METRICS,
  KEY_RATIO_METRICS,
  CASH_POSITION_METRICS,
  SHARE_COUNT_METRICS,
  MARKET_CAP_METRICS,
  PNL_WATERFALL,
  FINANCIAL_MILESTONES,
  STOCK_KPI_COUNT,
} from "@/lib/manifests";
import { SectionDivider } from "@/components/shared/DataDisplayComponents";
import { useStockData } from "@/components/intelligence/StockDataContext";
import {
  MetricTable,
  RatioTable,
  WaterfallTable,
  LatestSummaryCards,
  BeatMissPanel,
  GuidancePanel,
  StockKPIsPanel,
  MilestonesPanel,
  toDataLabel,
} from "./financials/FinancialSubComponents";
import { OverflowMetricRows, OverflowSections } from "./shared/OverflowFields";
import type { MetricDefinition, QuarterPeriod } from "@/lib/manifests";

interface Props { ticker: string }

const quarters = FORWARD_QUARTERS;

/** Build a Set of manifest metric names for a given MetricDefinition[] */
function metricNameSet(metrics: MetricDefinition[]): Set<string> {
  return new Set(metrics.map((m) => m.name));
}

/** Build quarter label strings that match data keys */
function quarterDataLabels(qs: QuarterPeriod[]): string[] {
  return qs.map((q) => toDataLabel(q));
}

/** Known top-level keys on the financials data object */
const KNOWN_FINANCIALS_KEYS = new Set([
  "incomeStatement", "balanceSheet", "cashFlow", "keyRatios",
  "latestQuarter", "latestSummary", "beatMiss", "guidance",
  "cashPosition", "shareCount", "marketCap", "pnlWaterfall",
  "stockKPIs", "milestones",
]);

export function FinancialsTab({ ticker }: Props) {
  const data = useStockData();
  const fin = data?.financials ?? null;
  const qlabels = quarterDataLabels(quarters);

  return (
    <div className="space-y-3 md:space-y-4">

      {/* -- QUARTERLY METRICS -- */}
      <SectionLabel className="text-pq-text-bright">QUARTERLY METRICS</SectionLabel>

      <MetricTable title="INCOME STATEMENT" metrics={INCOME_STATEMENT_METRICS} quarters={quarters} showChange="qoq-yoy" values={fin?.incomeStatement} />
      <OverflowMetricRows values={fin?.incomeStatement} knownMetricNames={metricNameSet(INCOME_STATEMENT_METRICS)} quarterLabels={qlabels} />

      <MetricTable title="BALANCE SHEET" metrics={BALANCE_SHEET_METRICS} quarters={quarters} showChange="qoq" values={fin?.balanceSheet} />
      <OverflowMetricRows values={fin?.balanceSheet} knownMetricNames={metricNameSet(BALANCE_SHEET_METRICS)} quarterLabels={qlabels} />

      <MetricTable title="CASH FLOW" metrics={CASH_FLOW_METRICS} quarters={quarters} showChange="qoq" values={fin?.cashFlow} />
      <OverflowMetricRows values={fin?.cashFlow} knownMetricNames={metricNameSet(CASH_FLOW_METRICS)} quarterLabels={qlabels} />

      <RatioTable title="KEY RATIOS" metrics={KEY_RATIO_METRICS} quarters={quarters} values={fin?.keyRatios} />
      <OverflowMetricRows values={fin?.keyRatios} knownMetricNames={metricNameSet(KEY_RATIO_METRICS)} quarterLabels={qlabels} />

      {/* -- LATEST QUARTER SUMMARY -- */}
      <SectionDivider />
      <div className="flex items-center gap-3">
        <SectionLabel className="text-pq-text-bright">LATEST QUARTER SUMMARY</SectionLabel>
        <Badge variant="orange">{fin?.latestQuarter ?? "—"}</Badge>
      </div>

      <LatestSummaryCards summary={fin?.latestSummary} />
      <BeatMissPanel beatMiss={fin?.beatMiss} />
      <GuidancePanel guidance={fin?.guidance} />

      {/* -- CASH POSITION EVOLUTION -- */}
      <SectionDivider />
      <SectionLabel className="text-pq-text-bright">CASH POSITION EVOLUTION</SectionLabel>
      <MetricTable metrics={CASH_POSITION_METRICS} quarters={quarters} values={fin?.cashPosition} />
      <OverflowMetricRows values={fin?.cashPosition} knownMetricNames={metricNameSet(CASH_POSITION_METRICS)} quarterLabels={qlabels} />

      {/* -- SHARE COUNT -- */}
      <SectionDivider />
      <SectionLabel className="text-pq-text-bright">SHARE COUNT (OUTSTANDING / IMPLIED / FULLY DILUTED)</SectionLabel>
      <MetricTable metrics={SHARE_COUNT_METRICS} quarters={quarters} showChange="yoy" values={fin?.shareCount} />
      <OverflowMetricRows values={fin?.shareCount} knownMetricNames={metricNameSet(SHARE_COUNT_METRICS)} quarterLabels={qlabels} />

      {/* -- MARKET CAP EVOLUTION -- */}
      <SectionDivider />
      <SectionLabel className="text-pq-text-bright">MARKET CAP EVOLUTION ($M)</SectionLabel>
      <MetricTable metrics={MARKET_CAP_METRICS} quarters={quarters} showChange="yoy" values={fin?.marketCap} />
      <OverflowMetricRows values={fin?.marketCap} knownMetricNames={metricNameSet(MARKET_CAP_METRICS)} quarterLabels={qlabels} />

      {/* -- P&L WATERFALL -- */}
      <SectionDivider />
      <SectionLabel className="text-pq-text-bright">NET INCOME / (LOSS)</SectionLabel>
      <WaterfallTable metrics={PNL_WATERFALL} quarters={quarters} values={fin?.pnlWaterfall} />
      <OverflowMetricRows values={fin?.pnlWaterfall} knownMetricNames={metricNameSet(PNL_WATERFALL)} quarterLabels={qlabels} />

      {/* -- STOCK-SPECIFIC KPIs -- */}
      <SectionDivider />
      <div className="flex items-center gap-3">
        <SectionLabel className="text-pq-text-bright">STOCK-SPECIFIC METRICS</SectionLabel>
        <Badge variant="cyan">{ticker}</Badge>
      </div>

      <StockKPIsPanel kpis={fin?.stockKPIs} quarters={quarters} placeholderCount={STOCK_KPI_COUNT} />

      <Panel className="p-3 md:p-4">
        <div className="text-[9px] text-pq-text-dim leading-relaxed">
          <span className="text-pq-accent">*</span> Stock-specific metrics are populated per entity based on sector and business model.
          KPIs are defined in the entity context and rendered dynamically.
        </div>
      </Panel>

      {/* -- FINANCIAL MILESTONES -- */}
      <SectionDivider />
      <SectionLabel className="text-pq-text-bright">KEY FINANCIAL MILESTONES</SectionLabel>
      <MilestonesPanel manifestMilestones={FINANCIAL_MILESTONES} dataMilestones={fin?.milestones} />

      {/* -- OVERFLOW: Unknown top-level sections in financials data -- */}
      <OverflowSections data={fin as Record<string, unknown> | null} knownKeys={KNOWN_FINANCIALS_KEYS} />

      {fin ? (
        <div className="text-[10px] text-pq-text-dim border border-white/5 p-3">
          Financial data for <span className="text-pq-accent">{ticker}</span> as of {fin.latestQuarter}.
          Source: Company filings, earnings releases, consensus estimates.
        </div>
      ) : (
        <div className="text-[10px] text-pq-text-dim border border-white/5 p-3">
          TEMPLATE: Financials tab for <span className="text-pq-accent">{ticker}</span>.
          Quarterly data, share count, market cap evolution, and milestones has not been populated yet.
        </div>
      )}
    </div>
  );
}
