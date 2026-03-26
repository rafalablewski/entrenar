import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import type { CapitalData } from "@/data/shared/types";
import {
  DILUTION_CATEGORIES,
  DILUTION_WATERFALL,
  COVERAGE_RATIO_METRICS,
  TEMPLATE_ROW_COUNTS,
} from "@/lib/manifests";
import { MetricCard, ProfileRow } from "./CapitalHelpers";

/** Known keys rendered explicitly in dilutionCategories */
const KNOWN_DILUTION_CAT_NAMES = new Set(DILUTION_CATEGORIES.map((c) => c.name));

/** Known keys rendered explicitly in dilutionWaterfall */
const KNOWN_WATERFALL_LABELS = new Set(DILUTION_WATERFALL.map((b) => b.label));

/** Known keys rendered explicitly in liquidityMetrics */
const KNOWN_LIQUIDITY_KEYS = new Set([
  "Cash & Equivalents", "Total Debt", "Net Cash", "Net Debt / EBITDA",
]);

/** Known keys rendered explicitly in coverageRatios */
const KNOWN_COVERAGE_NAMES = new Set(COVERAGE_RATIO_METRICS.map((m) => m.name));

/** Known fields for a debt schedule item */
const KNOWN_DEBT_FIELDS = new Set([
  "instrument", "outstanding", "coupon", "maturity", "rating",
]);

/** Known fields for an insider transaction item */
const KNOWN_INSIDER_TXN_FIELDS = new Set([
  "date", "insider", "title", "type", "shares", "price", "value", "filing",
]);

/** Known keys rendered explicitly in insiderSentiment */
const KNOWN_SENTIMENT_KEYS = new Set([
  "buys", "buyValue", "sells", "sellValue", "ratio", "signal",
]);

/* -- TOTAL DILUTION -- */

export function TotalDilutionSection({ cap }: { cap: CapitalData | null }) {
  /* Detect extra dilutionCategories keys beyond the manifest */
  const extraDilutionCats = cap?.dilutionCategories
    ? Object.entries(cap.dilutionCategories).filter(([k]) => !KNOWN_DILUTION_CAT_NAMES.has(k))
    : [];

  /* Detect extra dilutionWaterfall keys beyond the manifest */
  const extraWaterfall = cap?.dilutionWaterfall
    ? Object.entries(cap.dilutionWaterfall).filter(([k]) => !KNOWN_WATERFALL_LABELS.has(k))
    : [];

  return (
    <>
      <SectionLabel className="text-pq-text-bright">TOTAL DILUTION ANALYSIS</SectionLabel>
      <Panel className="p-3 md:p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-2">
          {DILUTION_CATEGORIES.map((cat) => (
            <ProfileRow key={cat.id} label={cat.name} value={cap?.dilutionCategories?.[cat.name]} />
          ))}
          {/* Overflow: extra dilution category keys */}
          {extraDilutionCats.map(([k, v]) => (
            <ProfileRow key={k} label={k} value={String(v)} />
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <Panel className="p-3 md:p-5 text-center border border-pq-accent/30">
          <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">FULLY DILUTED SHARES</div>
          <div className="text-3xl font-bold text-pq-accent">{cap?.fullyDilutedShares ?? "—"}</div>
        </Panel>
        <Panel className="p-3 md:p-5 text-center border border-pq-red/30">
          <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">TOTAL DILUTION %</div>
          <div className="text-3xl font-bold text-pq-red">{cap?.totalDilutionPct ?? "—"}</div>
        </Panel>
      </div>

      <SectionLabel className="text-pq-text-bright">DILUTION WATERFALL</SectionLabel>
      <Panel className="p-3 md:p-4">
        <div className="space-y-2">
          {DILUTION_WATERFALL.map((bar) => {
            const val = cap?.dilutionWaterfall?.[bar.label];
            const numericVal = val ? parseFloat(val.replace(/[^0-9.]/g, "")) : 0;
            const maxShares = cap?.fullyDilutedShares
              ? parseFloat(cap.fullyDilutedShares.replace(/[^0-9.]/g, ""))
              : 1;
            const widthPct = maxShares > 0 ? Math.min((numericVal / maxShares) * 100, 100) : 0;
            return (
              <div key={bar.id} className="flex items-center gap-3">
                <span className="text-[10px] text-pq-text-dim w-24 shrink-0">{bar.label}</span>
                <div className="flex-1 h-4 bg-white/5 rounded overflow-hidden">
                  <div className={`h-full ${bar.color} opacity-40`} style={{ width: val ? `${widthPct}%` : "0%" }} />
                </div>
                <span className="text-[10px] font-mono text-pq-text w-16 text-right">{val ?? "—"}</span>
              </div>
            );
          })}
          {/* Overflow: extra waterfall keys */}
          {extraWaterfall.map(([k, v]) => (
            <div key={k} className="flex items-center gap-3">
              <span className="text-pq-text-dim text-[9px]">{k}: {String(v)}</span>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

/* -- LIQUIDITY -- */

export function LiquiditySection({ cap }: { cap: CapitalData | null }) {
  /* Detect extra liquidityMetrics keys */
  const extraLiquidity = cap?.liquidityMetrics
    ? Object.entries(cap.liquidityMetrics).filter(([k]) => !KNOWN_LIQUIDITY_KEYS.has(k))
    : [];

  /* Detect extra coverageRatios keys */
  const extraCoverage = cap?.coverageRatios
    ? Object.entries(cap.coverageRatios).filter(([k]) => !KNOWN_COVERAGE_NAMES.has(k))
    : [];

  return (
    <>
      <SectionLabel className="text-pq-text-bright">LIQUIDITY PROFILE</SectionLabel>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "CASH & EQUIVALENTS", key: "Cash & Equivalents" },
          { label: "TOTAL DEBT", key: "Total Debt" },
          { label: "NET DEBT", key: "Net Cash" },
          { label: "NET DEBT / EBITDA", key: "Net Debt / EBITDA" },
        ].map(({ label, key }) => (
          <MetricCard key={label} label={label} value={cap?.liquidityMetrics?.[key]} />
        ))}
        {/* Overflow: extra liquidity metric keys */}
        {extraLiquidity.map(([k, v]) => (
          <MetricCard key={k} label={k} value={String(v)} />
        ))}
      </div>

      <SectionLabel className="text-pq-text-bright">DEBT MATURITY SCHEDULE</SectionLabel>
      <Panel className="p-3 md:p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-pq-text-dim tracking-wide">
                <th className="text-left py-2 pr-4">INSTRUMENT</th>
                <th className="text-right py-2 px-3">OUTSTANDING</th>
                <th className="text-right py-2 px-3">COUPON</th>
                <th className="text-right py-2 px-3">MATURITY</th>
                <th className="text-right py-2 px-3">RATING</th>
              </tr>
            </thead>
            <tbody>
              {cap?.debtSchedule && cap.debtSchedule.length > 0
                ? cap.debtSchedule.map((d: Record<string, unknown>, i: number) => {
                    const overflow = Object.entries(d).filter(([k]) => !KNOWN_DEBT_FIELDS.has(k));
                    return (
                      <tr key={i} className="border-t border-white/5">
                        <td className="py-2 pr-4 text-pq-text">
                          {String(d.instrument)}
                          {overflow.length > 0 && (
                            <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                              {overflow.map(([k, v]) => (
                                <span key={k} className="text-pq-text-dim text-[9px]">{k}: {String(v)}</span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-pq-text">{String(d.outstanding)}</td>
                        <td className="py-2 px-3 text-right font-mono text-pq-text">{String(d.coupon)}</td>
                        <td className="py-2 px-3 text-right font-mono text-pq-text-dim">{String(d.maturity)}</td>
                        <td className="py-2 px-3 text-right"><Badge variant="default">{String(d.rating)}</Badge></td>
                      </tr>
                    );
                  })
                : Array.from({ length: TEMPLATE_ROW_COUNTS.debtInstruments }, (_, i) => (
                    <tr key={i} className="border-t border-white/5">
                      <td className="py-2 pr-4 text-pq-text">—</td>
                      <td className="py-2 px-3 text-right font-mono text-pq-text">—</td>
                      <td className="py-2 px-3 text-right font-mono text-pq-text">—</td>
                      <td className="py-2 px-3 text-right font-mono text-pq-text-dim">—</td>
                      <td className="py-2 px-3 text-right"><Badge variant="default">—</Badge></td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </Panel>

      <SectionLabel className="text-pq-text-bright">COVERAGE RATIOS</SectionLabel>
      <Panel className="p-3 md:p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-2">
          {COVERAGE_RATIO_METRICS.map((m) => (
            <ProfileRow key={m.id} label={m.name} value={cap?.coverageRatios?.[m.name]} />
          ))}
          {/* Overflow: extra coverage ratio keys */}
          {extraCoverage.map(([k, v]) => (
            <ProfileRow key={k} label={k} value={String(v)} />
          ))}
        </div>
      </Panel>
    </>
  );
}

/* -- INSIDER ACTIVITY -- */

export function InsiderActivitySection({ cap }: { cap: CapitalData | null }) {
  const txns = cap?.insiderTransactions;
  const sentiment = cap?.insiderSentiment;

  /* Detect extra insiderSentiment keys */
  const extraSentiment = sentiment
    ? Object.entries(sentiment).filter(([k]) => !KNOWN_SENTIMENT_KEYS.has(k))
    : [];

  return (
    <>
      <SectionLabel className="text-pq-text-bright">INSIDER TRANSACTIONS (LAST 12 MONTHS)</SectionLabel>
      <Panel className="p-3 md:p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-pq-text-dim tracking-wide">
                <th className="text-left py-2 pr-4">DATE</th>
                <th className="text-left py-2 px-3">INSIDER</th>
                <th className="text-left py-2 px-3">TITLE</th>
                <th className="text-left py-2 px-3">TYPE</th>
                <th className="text-right py-2 px-3">SHARES</th>
                <th className="text-right py-2 px-3">AVG PRICE</th>
                <th className="text-right py-2 px-3">VALUE</th>
                <th className="text-right py-2 px-3">FILING</th>
              </tr>
            </thead>
            <tbody>
              {txns && txns.length > 0
                ? txns.map((t: Record<string, unknown>, i: number) => {
                    const overflow = Object.entries(t).filter(([k]) => !KNOWN_INSIDER_TXN_FIELDS.has(k));
                    return (
                      <tr key={i} className="border-t border-white/5">
                        <td className="py-2 pr-4 font-mono text-pq-text-dim">{String(t.date)}</td>
                        <td className="py-2 px-3 text-pq-text">
                          {String(t.insider)}
                          {overflow.length > 0 && (
                            <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                              {overflow.map(([k, v]) => (
                                <span key={k} className="text-pq-text-dim text-[9px]">{k}: {String(v)}</span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3 text-pq-text-dim">{String(t.title)}</td>
                        <td className="py-2 px-3"><Badge variant="default">{String(t.type)}</Badge></td>
                        <td className="py-2 px-3 text-right font-mono text-pq-text">{String(t.shares)}</td>
                        <td className="py-2 px-3 text-right font-mono text-pq-text">{String(t.price)}</td>
                        <td className="py-2 px-3 text-right font-mono text-pq-text">{String(t.value)}</td>
                        <td className="py-2 px-3 text-right font-mono text-pq-text-dim">{String(t.filing)}</td>
                      </tr>
                    );
                  })
                : Array.from({ length: TEMPLATE_ROW_COUNTS.insiderTransactions }, (_, i) => (
                    <tr key={i} className="border-t border-white/5">
                      <td className="py-2 pr-4 font-mono text-pq-text-dim">—</td>
                      <td className="py-2 px-3 text-pq-text">—</td>
                      <td className="py-2 px-3 text-pq-text-dim">—</td>
                      <td className="py-2 px-3"><Badge variant="default">—</Badge></td>
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

      <SectionLabel className="text-pq-text-bright">INSIDER SENTIMENT SUMMARY</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <Panel className="p-3 md:p-4 text-center border border-pq-green/30">
          <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">BUYS (12M)</div>
          <div className="text-2xl font-bold text-pq-green">{sentiment?.buys ?? "—"}</div>
          <div className="text-[10px] text-pq-text-dim mt-1">{sentiment ? `${sentiment.buyValue} total value` : "$— total value"}</div>
        </Panel>
        <Panel className="p-3 md:p-4 text-center border border-pq-red/30">
          <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">SELLS (12M)</div>
          <div className="text-2xl font-bold text-pq-red">{sentiment?.sells ?? "—"}</div>
          <div className="text-[10px] text-pq-text-dim mt-1">{sentiment ? `${sentiment.sellValue} total value` : "$— total value"}</div>
        </Panel>
        <Panel className="p-3 md:p-4 text-center border border-white/5">
          <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">NET BUY/SELL RATIO</div>
          <div className="text-2xl font-bold text-pq-text-bright">{sentiment?.ratio ?? "—"}</div>
          <div className="text-[10px] text-pq-text-dim mt-1">{sentiment?.signal ?? "— signal"}</div>
        </Panel>
      </div>
      {/* Overflow: extra insider sentiment keys */}
      {extraSentiment.length > 0 && (
        <Panel className="p-3 md:p-4">
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {extraSentiment.map(([k, v]) => (
              <span key={k} className="text-pq-text-dim text-[9px]">{k}: {String(v)}</span>
            ))}
          </div>
        </Panel>
      )}
    </>
  );
}
