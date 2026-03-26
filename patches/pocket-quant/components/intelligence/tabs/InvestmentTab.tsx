"use client";

import { useMemo } from "react";
import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import { SectionDivider } from "@/components/shared/DataDisplayComponents";
import { useStockData } from "@/components/intelligence/StockDataContext";
import { OverflowKeyValues, OverflowSections } from "./shared/OverflowFields";
import {
  Expandable,
  DDChecklistPanel,
  ScorecardPanel,
  GrowthDriversTable,
  RiskMatrixPanel,
  PositionTargetsPanel,
  ArchivePanel,
  ProfileRow,
  BulletList,
} from "./investment/InvestmentSubComponents";

interface Props { ticker: string }

/** Known top-level keys on the investment data object. */
const KNOWN_INV_KEYS: ReadonlySet<string> = new Set([
  "dueDiligence", "checklist", "assessment", "scorecard", "compositeScore",
  "thesis", "bullCase", "bearCase", "growthDrivers", "riskMatrix",
  "positionSizing", "priceTargets", "archive",
]);

/** The 6 hardcoded DD profile labels. */
const DD_PROFILE_LABELS = [
  "Coverage Status", "Last Full Review", "Next Scheduled Review",
  "Analyst Confidence", "Data Completeness", "DD Checklist Progress",
];

/** The 4 hardcoded assessment field keys. */
const ASSESSMENT_KNOWN_KEYS: ReadonlySet<string> = new Set(["rating", "conviction", "action", "riskLevel"]);

export function InvestmentTab({ ticker }: Props) {
  const data = useStockData();
  const inv = data?.investment ?? null;

  const ddProfileKeySet = useMemo(
    () => new Set(DD_PROFILE_LABELS) as ReadonlySet<string>, []
  );

  /* ── Compute checklist progress ── */
  const checklistEntries = inv ? Object.entries(inv.checklist ?? {}) : [];
  const checklistChecked = checklistEntries.filter(([, v]) => v).length;
  const checklistTotal = checklistEntries.length;
  const ddChecklistProgress = inv
    ? `${checklistChecked}/${checklistTotal} (${Math.round((checklistChecked / checklistTotal) * 100)}%)`
    : null;

  const ddValues: Record<string, string | null> = {};
  for (const label of DD_PROFILE_LABELS) {
    ddValues[label] = inv?.dueDiligence?.[label] ?? null;
  }
  if (ddChecklistProgress) ddValues["DD Checklist Progress"] = ddChecklistProgress;

  /* ── Assessment cards ── */
  const assessmentCards = [
    { label: "OVERALL RATING", key: "rating", value: inv?.assessment.rating ?? null, sub: inv ? `${inv.compositeScore} / 100` : "— / 100", border: "border-pq-accent/30" },
    { label: "CONVICTION", key: "conviction", value: inv?.assessment.conviction ?? null, sub: "LOW / MED / HIGH", border: "border-white/5" },
    { label: "ACTION", key: "action", value: inv?.assessment.action ?? null, sub: "BUY / HOLD / SELL", border: "border-white/5" },
    { label: "RISK LEVEL", key: "riskLevel", value: inv?.assessment.riskLevel ?? null, sub: "1–5 scale", border: "border-white/5" },
  ];

  return (
    <div className="space-y-3 md:space-y-4">

      {/* ── DUE DILIGENCE ── */}
      <SectionLabel className="text-pq-text-bright">DUE DILIGENCE</SectionLabel>
      <Panel className="p-3 md:p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-2">
          {DD_PROFILE_LABELS.map((label) => (
            <ProfileRow key={label} label={label} value={ddValues[label] ?? undefined} />
          ))}
        </div>
        {/* Overflow: extra DD profile keys not in the 6 hardcoded labels */}
        <OverflowKeyValues
          data={inv?.dueDiligence as Record<string, unknown> | undefined}
          knownKeys={ddProfileKeySet}
        />
      </Panel>

      <DDChecklistPanel checklist={inv?.checklist ?? null} />

      {/* ── CURRENT ASSESSMENT ── */}
      <SectionDivider />
      <SectionLabel className="text-pq-text-bright">CURRENT ASSESSMENT</SectionLabel>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {assessmentCards.map((card) => (
          <Panel key={card.label} className={`p-3 md:p-4 text-center border ${card.border}`}>
            <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">{card.label}</div>
            <div className="text-2xl font-bold text-pq-text-bright">{card.value ?? "—"}</div>
            <div className="text-[9px] text-pq-text-dim mt-1">{card.sub}</div>
          </Panel>
        ))}
        {/* Overflow: extra assessment fields not in the 4 hardcoded keys */}
        {inv?.assessment && Object.entries(inv.assessment)
          .filter(([k]) => !ASSESSMENT_KNOWN_KEYS.has(k) && !k.startsWith("_"))
          .map(([k, v]) => (
            <Panel key={k} className="p-3 md:p-4 text-center border border-white/5">
              <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">
                {k.replace(/([A-Z])/g, " $1").toUpperCase()}
              </div>
              <div className="text-2xl font-bold text-pq-text-bright">
                {typeof v === "string" ? v : JSON.stringify(v)}
              </div>
            </Panel>
          ))
        }
      </div>

      {/* ── INVESTMENT SCORECARD ── */}
      <SectionDivider />
      <SectionLabel className="text-pq-text-bright">INVESTMENT SCORECARD</SectionLabel>
      <ScorecardPanel scorecard={inv?.scorecard ?? null} compositeScore={inv?.compositeScore ?? null} />

      {/* ── INVESTMENT THESIS ── */}
      <SectionDivider />
      <SectionLabel className="text-pq-text-bright">INVESTMENT THESIS</SectionLabel>

      <Expandable title="INVESTMENT SUMMARY" badge="+">
        <Panel className="p-3 md:p-4 space-y-3">
          <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-1">CORE THESIS (1-3 SENTENCES)</div>
          <div className="text-xs text-pq-text leading-relaxed border-l-2 border-pq-accent/30 pl-3">
            {inv?.thesis ?? "—"}
          </div>
        </Panel>
        <Panel className="p-3 md:p-4 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <div className="text-[10px] text-pq-green tracking-wide uppercase font-bold mb-2">BULL CASE</div>
              <BulletList items={inv?.bullCase ?? null} count={4} color="text-pq-green" />
            </div>
            <div>
              <div className="text-[10px] text-pq-red tracking-wide uppercase font-bold mb-2">BEAR CASE</div>
              <BulletList items={inv?.bearCase ?? null} count={4} color="text-pq-red" />
            </div>
          </div>
        </Panel>
      </Expandable>

      {/* ── Growth Drivers ── */}
      <Expandable title="GROWTH DRIVERS" badge="+">
        <GrowthDriversTable drivers={inv?.growthDrivers ?? null} />
      </Expandable>

      {/* ── RISK ASSESSMENT ── */}
      <SectionDivider />
      <SectionLabel className="text-pq-text-bright">RISK ASSESSMENT</SectionLabel>

      <Expandable title="RISK MATRIX" badge="+">
        <RiskMatrixPanel riskMatrix={inv?.riskMatrix ?? null} />
      </Expandable>

      {/* ── Position Sizing ── */}
      <Expandable title="POSITION SIZING &amp; PRICE TARGETS" badge="+">
        <PositionTargetsPanel inv={inv} />
      </Expandable>

      {/* ── HISTORICAL ANALYSIS ── */}
      <SectionDivider />
      <SectionLabel className="text-pq-text-bright">HISTORICAL ANALYSIS</SectionLabel>

      <Expandable title="ANALYSIS ARCHIVE" badge="+">
        <ArchivePanel inv={inv} />
      </Expandable>

      {/* ── Top-level overflow: unknown sections on investment data ── */}
      <OverflowSections
        data={inv as unknown as Record<string, unknown>}
        knownKeys={KNOWN_INV_KEYS}
      />

      {!inv && (
        <div className="text-[10px] text-pq-text-dim border border-white/10 p-3">
          TEMPLATE: Investment Analysis tab for <span className="text-pq-accent">{ticker}</span>.
        </div>
      )}
    </div>
  );
}
