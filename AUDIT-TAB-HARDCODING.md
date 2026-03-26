# Tab Hardcoding Vulnerability Audit

**Date:** 2026-03-26
**Scope:** All 21 tabs in pocket-quant
**Root cause:** UI components iterate over hardcoded manifest arrays to render data, silently dropping any AI-extracted fields with non-standard keys.

---

## Severity Summary

| Severity | Tabs | Count |
|----------|------|-------|
| **HIGH** | Capital, Financials, Overview, Timeline, Summary, Valuation, Wall Street, Checklist, Investment, Monte Carlo | 10 |
| **MEDIUM** | Management, Risks, Catalysts, Thesis, Position, News | 6 |
| **LOW** | Industry, SEC, Operations, Competitors, Scenarios | 5 |

---

## HIGH Severity (data silently lost)

### 1. CAPITAL — `CapitalTab.tsx`
**Pattern:** Hardcoded 8 metric labels in JSX array.
**Hardcoded keys:** `SHARES OUTSTANDING`, `FULLY DILUTED SHARES`, `TOTAL DILUTION %`, `FLOAT %`, `INSIDER OWNERSHIP`, `INSTITUTIONAL OWNERSHIP`, `SHORT INTEREST`, `DAYS TO COVER`
**Impact:** AI-extracted metrics like `SERIES A PREFERRED AUTHORIZED` are stored but never rendered. This is the original reported bug.
**Status:** Fix committed — now renders standard metrics first, then appends extra metrics dynamically.

### 2. FINANCIALS — `FinancialsTab.tsx`
**Pattern:** ~9 imported manifest arrays used as key whitelists.
**Hardcoded arrays:**
- `INCOME_STATEMENT_METRICS` (14 metrics)
- `BALANCE_SHEET_METRICS` (10 metrics)
- `CASH_FLOW_METRICS` (8 metrics)
- `KEY_RATIO_METRICS` (9 metrics)
- `CASH_POSITION_METRICS` (8 metrics)
- `MARKET_CAP_METRICS` (8 metrics)
- `SHARE_COUNT_METRICS` (8 metrics)
- `PNL_WATERFALL` (13 metrics)
- `FINANCIAL_MILESTONES` (count-controlled)
**Impact:** Metrics like `Adjusted EBITDA` or `Free Cash Flow Yield` stored but invisible.

### 3. OVERVIEW — `OverviewTab.tsx`
**Pattern:** `OVERVIEW_METRIC_LABELS` manifest array indexes into `overview.metrics`.
**Hardcoded keys:** 8 labels (Price, Market Cap, Enterprise Value, etc.)
**Partial mitigation:** `stockSpecific` section IS dynamic (iterates `item.label`/`item.value`).
**Impact:** Non-standard overview metrics silently dropped.

### 4. TIMELINE — `TimelineTab.tsx`
**Pattern:** Multiple manifest arrays as key whitelists.
**Hardcoded arrays:** `FILING_STATS_LABELS` (8), `TIMELINE_STATS` (fixed label+color), `FILING_TYPES`, `UPCOMING_EVENT_SLOTS`
**Impact:** Filing stats and timeline stats with non-standard keys invisible. Per-item fields also fixed (date, form, title, signal, etc.).

### 5. SUMMARY — `SummaryTab.tsx`
**Pattern:** 4+ manifest arrays gate all sections.
**Hardcoded arrays:**
- `COMPANY_DESCRIPTION_FIELDS` (6: Sector, Founded, HQ, Employees, CEO, IPO Date)
- `MOAT_FACTORS` (4 items)
- `RATING_FACTORS` (6 items with weights)
- `QUICK_REFERENCE_METRICS` (8 items)
**Impact:** Non-standard moat factors, rating factors, or description fields silently lost.

### 6. VALUATION — `ValuationTab.tsx`
**Pattern:** 4 manifest arrays for DCF sections.
**Hardcoded arrays:**
- `DCF_PARAMETERS` (9 items)
- `DCF_OUTPUT_METRICS` (12 items)
- `DCF_ASSUMPTIONS` (with descriptions)
- `VALUATION_SCENARIOS` (fixed scenario IDs)
**Partial mitigation:** `stockSpecificInputs` and `stockSpecificOutputs` arrays are dynamic.
**Impact:** Non-standard DCF parameters or outputs invisible unless routed to stockSpecific arrays.

### 7. WALL STREET — `WallStreetTab.tsx`
**Pattern:** 9+ manifest arrays — most heavily hardcoded component.
**Hardcoded arrays:**
- `WS_HEADER_METRICS` (3)
- `ANALYST_RATINGS` (5: Strong Buy through Strong Sell)
- `WS_PRICE_TARGET_LABELS` (4)
- `WS_ESTIMATE_PERIODS` (4: FY2025–FY2028E — **will go stale**)
- `WS_CONSENSUS_ESTIMATE_LABELS` (8)
- `ESTIMATE_REVISION_METRICS` (4)
- `WS_COVERAGE_SUMMARY` (fixed label+color)
- `ANALYST_FIRMS` (12 fixed firms)
- `HISTORICAL_QUARTERS` (date-anchored)
**Impact:** Extensive data loss for any non-standard metrics. Fiscal year labels will become stale.

### 8. CHECKLIST — `ChecklistTab.tsx`
**Pattern:** Manifest-driven for DD + Scorecard.
**Hardcoded arrays:**
- `DUE_DILIGENCE_ITEMS` (12 items)
- `SCORECARD_DIMENSIONS` (10 items)
**Partial mitigation:** `preTrade` section uses `Object.entries()` (dynamic).
**Impact:** Summary stats count ALL items (e.g. "15 reviewed") but only 12 manifest items render. User sees a count mismatch with no explanation.

### 9. INVESTMENT — `InvestmentTab.tsx`
**Pattern:** Hardcoded profile labels + manifest sub-components.
**Hardcoded labels:** `Coverage Status`, `Last Full Review`, `Next Scheduled Review`, `Analyst Confidence`, `Data Completeness`, `DD Checklist Progress`
**Hardcoded assessment fields:** `rating`, `conviction`, `action`, `riskLevel`
**Partial mitigation:** Sub-components (DDChecklistPanel, ScorecardPanel, etc.) use `Object.entries()`.
**Impact:** Top-of-tab profile and assessment sections drop non-standard fields.

### 10. MONTE CARLO — `MonteCarloTab.tsx`
**Pattern:** Entirely manifest-driven — worst offender (~66 hardcoded field names).
**Hardcoded arrays:**
- `MC_HISTORICAL_METRICS` (9)
- `MC_DRIVER_DISTRIBUTIONS` (9)
- `MC_MARKET_DATA` (8)
- `MC_SIMULATION_OUTPUT` (12)
- `GBM_CALIBRATION` (8)
- `GBM_SIM_PARAMS` (8)
- `GBM_OUTPUT` (12)
**Mitigation:** `lookupValue()` does fuzzy matching (case-insensitive substring) for minor naming variations.
**Impact:** Any novel quantitative output (e.g. `Sortino Ratio`, `Conditional VaR`) completely invisible.

---

## MEDIUM Severity (partial display)

### 11. MANAGEMENT — `ManagementTab.tsx`
**Pattern:** Direct field access in JSX, not manifest-driven.
**Hardcoded fields:** 7 top-level keys, 7 per-executive fields, 4 per-board-member fields, 3 per-change fields.
**Partial mitigation:** `compensationSummary` and `insiderOwnership` use `Object.entries()` (dynamic).
**Impact:** New top-level sections (e.g. `successionPlan`) or per-item fields (e.g. `education`) invisible.

### 12. RISKS — `RisksTab.tsx`
**Pattern:** Direct field access in JSX.
**Hardcoded fields:** 4 top-level (`overallRiskLevel`, `riskTrend`, `riskFactors`, `recentChanges`), 7 per-risk-factor, 3 per-change.
**Impact:** Additional risk metadata (`source`, `lastUpdated`, `affectedSegment`) dropped. New top-level sections invisible.

### 13. CATALYSTS — `CatalystsTab.tsx`
**Pattern:** Direct field access in JSX.
**Hardcoded fields:** 3 top-level sections (`nearTerm`, `mediumTerm`, `tracker`), 6 per-catalyst fields.
**Impact:** A `longTerm` bucket would be invisible. Per-catalyst extras like `source` or `relatedFiling` dropped.

### 14. THESIS — `ThesisTab.tsx`
**Pattern:** Direct field access in JSX.
**Hardcoded fields:** 10 top-level (`conviction`, `rating`, `timeHorizon`, `lastReviewed`, `statement`, `keyDrivers`, `bullCase`, `bearCase`, `variant`, `catalystPath`), 3 per-driver.
**Hardcoded hero labels:** `CONVICTION`, `RATING`, `TIME HORIZON`, `LAST REVIEWED`.
**Impact:** Fields like `priceTarget`, `riskRewardRatio`, `neutralCase` invisible.

### 15. POSITION — `PositionTab.tsx`
**Pattern:** Mixed — dynamic for main sections, rigid for sub-objects.
**Dynamic:** `currentPosition` and `sizingMetrics` use `Object.entries()`.
**Hardcoded:** Entry/exit levels expect `{label, price, action, size}`, trade log expects `{date, action, shares, price, value, rationale}`.
**Impact:** Extra trade fields like `commission`, `slippage` dropped.

### 16. NEWS — `NewsTab.tsx`
**Pattern:** Dynamic with flexible field fallbacks.
**Flexible:** `pr.headline || pr.title`, `pr.summary || pr.description`, `pr.permalink || pr.storyurl`.
**Impact:** Core content renders. Supplementary metadata (sentiment, relevanceScore, category) dropped.

---

## LOW Severity (works correctly)

### 17. INDUSTRY — `IndustryTab.tsx`
**Pattern:** `Object.entries()` throughout — best practice.
**Dynamic sections:** `tamSamSom`, `growthDrivers`, `secularTrends`, `marketShare`, `positioning`, `regulatoryEnvironment`.
**Impact:** All AI-extracted keys render automatically.

### 18. SEC — `SecTab.tsx`
**Pattern:** Data-driven from API.
**Impact:** Filing data renders dynamically. Sub-components (FilingRow, CrossCheckPanel) may have some fixed fields.

### 19. OPERATIONS — `OperationsTab.tsx`
**Pattern:** Dynamic array iteration (`kpis.map()`, `milestones.map()`).
**Impact:** All data displays as long as objects have `{label, value, change, period}` shape.

### 20. COMPETITORS — `CompetitorsTab.tsx`
**Pattern:** `Object.entries()` when data present; hardcoded labels only in empty-state fallback.
**Impact:** All AI-extracted fields render correctly.

### 21. SCENARIOS — `ScenariosTab.tsx`
**Pattern:** Dynamic array iteration for scenarios.
**Limited hardcoding:** Per-scenario only shows `revenue`, `margin`, `multiple` (3 slots). Extra metrics like `earningsGrowth` would be stored but not shown.
**Impact:** Minor — scenario objects render but with limited metric slots.

---

## Architectural Vulnerabilities

### A. Temporal staleness in manifests
- `WS_ESTIMATE_PERIODS`: Hardcoded to `FY2025–FY2028E` — will go stale
- `FORWARD_QUARTERS`: Anchored to 2025 Q1 — stale after 2026
- `HISTORICAL_QUARTERS`: Anchored to 2024 Q3 — stale

### B. 11 tabs have empty manifest configs
`thesis`, `industry`, `management`, `scenarios`, `operations`, `risks`, `catalysts`, `sec`, `news`, `checklist`, `position` all have `sections: [], metrics: []` in `TAB_MANIFEST_CONFIGS`. The prompt system's `getManifestSummary()` filters to tabs with sections, meaning these 11 tabs are invisible to auto-generated prompts.

### C. No runtime validation on merged data
`StockDataContext` merges DB + static data with no validation that keys conform to current manifest versions. Stale DB keys from old manifests silently produce invalid data.

### D. Capital section ID mismatch
`CAPITAL_SECTIONS` uses ids like `"share-classes"` while `TAB_SECTIONS` uses `"cap-share-classes"`. Potential confusion about which ID format is authoritative.

### E. Dead reference
Overview tab manifest references `"mc-enterprise-value"` — no metric with this ID exists anywhere.

### F. `ANALYST_FIRMS` fixed at 12
`firmCoverage` is keyed by firm name. Coverage from firms outside the 12-firm list cannot be represented.

---

## Recommended Fix Pattern

For every HIGH-severity tab, apply the same pattern used in the Capital tab fix:

```tsx
// 1. Render standard/manifest metrics first (preserves curated layout)
{MANIFEST_ARRAY.map((label) => (
  <MetricCard key={label} label={label} value={data?.[label]} />
))}

// 2. Append any extra keys from data not in the manifest
{Object.entries(data ?? {})
  .filter(([key]) => !manifestSet.has(key))
  .filter(([key]) => !key.startsWith("_"))  // skip metadata like _latestFilingDate
  .map(([key, value]) => (
    <MetricCard key={key} label={key} value={String(value)} />
  ))}
```

This preserves the curated display order for known fields while ensuring no AI-extracted data is silently lost.

**Model tabs to follow:** `IndustryTab` and `CompetitorsTab` — both use `Object.entries()` and render all data dynamically.
