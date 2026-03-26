"use client";

import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import { ScoreRing, SectionDivider, TabTemplateFooter, AwaitingData } from "@/components/shared/DataDisplayComponents";
import { useStockData } from "@/components/intelligence/StockDataContext";
import { renderGenericValue, renderOverflowFields } from "./shared/OverflowFields";

interface Props { ticker: string }

function compositeColor(c?: string): "red" | "orange" | "yellow" | "green" | "default" {
  if (!c) return "default";
  if (c === "High") return "red";
  if (c === "Medium") return "orange";
  if (c.startsWith("Low")) return "green";
  return "default";
}

function compositeHeat(c?: string): string {
  if (!c) return "";
  if (c === "High") return "heat-critical";
  if (c === "Medium") return "heat-high";
  if (c.startsWith("Low")) return "heat-low";
  return "";
}

function riskLevelScore(level?: string): number {
  if (!level) return 0;
  const l = level.toLowerCase();
  if (l.includes("very high") || l.includes("extreme")) return 90;
  if (l.includes("high")) return 70;
  if (l.includes("medium") || l.includes("moderate")) return 50;
  if (l.includes("low")) return 25;
  return 0;
}

function riskColor(level: string): string {
  const s = riskLevelScore(level);
  if (s >= 70) return "text-pq-red";
  if (s >= 50) return "text-pq-orange";
  if (s >= 25) return "text-pq-yellow";
  return "text-pq-green";
}

const KNOWN_TOP_LEVEL_KEYS = new Set([
  "overallRiskLevel", "riskTrend", "riskFactors", "recentChanges",
]);

const RISK_FACTOR_KNOWN = new Set(["category", "risk", "probability", "severity", "composite", "mitigation", "monitoringTrigger"]);
const CHANGE_KNOWN = new Set(["date", "change", "direction"]);

export function RisksTab({ ticker }: Props) {
  const data = useStockData();
  const r = data?.risks;
  if (r) {
    const unknownSections = Object.entries(r).filter(([k]) => !KNOWN_TOP_LEVEL_KEYS.has(k));
    return (
      <div className="space-y-3 md:space-y-4">
        <SectionLabel className="text-pq-text-bright">RISKS</SectionLabel>
        {/* Overall risk hero */}
        <div className="section-hero p-5 md:p-6">
          <div className="flex items-center gap-6 md:gap-8">
            <ScoreRing
              value={riskLevelScore(r.overallRiskLevel)}
              color={riskColor(r.overallRiskLevel)}
              label="RISK"
              size={90}
            />
            <div className="flex-1 space-y-2">
              <div className="text-[10px] text-pq-text-dim tracking-wide">OVERALL RISK LEVEL</div>
              <div className={`text-2xl font-bold stat-hero ${riskColor(r.overallRiskLevel ?? "")}`}>{r.overallRiskLevel ?? "—"}</div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-pq-text-dim">Trend:</span>
                <Badge variant={(r.riskTrend ?? "").toLowerCase().includes("improv") || (r.riskTrend ?? "").toLowerCase().includes("decreas") ? "green" : (r.riskTrend ?? "").toLowerCase().includes("stable") ? "yellow" : "red"}>
                  {r.riskTrend ?? "—"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Risk matrix */}
        <Panel className="p-3 md:p-4 space-y-2" variant="elevated">
          <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-2">RISK MATRIX</div>
          {(r.riskFactors ?? []).map((rf: Record<string, any>, i: number) => (
            <div key={i} className={`rounded-md px-3 py-2.5 ${compositeHeat(rf.composite)} transition-all`}>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="default">{rf.category}</Badge>
                <span className="text-xs text-pq-text-bright font-medium flex-1">{rf.risk}</span>
                <div className="flex items-center gap-1.5">
                  <Badge variant={rf.probability === "Medium" ? "yellow" : "green"}>{rf.probability}</Badge>
                  <Badge variant={rf.severity === "High" ? "red" : "yellow"}>{rf.severity}</Badge>
                  <Badge variant={compositeColor(rf.composite)}>{rf.composite}</Badge>
                </div>
              </div>
              {renderOverflowFields(rf, RISK_FACTOR_KNOWN)}
            </div>
          ))}
        </Panel>

        <SectionDivider />

        {/* Mitigations */}
        <SectionLabel className="text-pq-text-bright">MITIGATIONS &amp; TRIGGERS</SectionLabel>
        <div className="space-y-2">
          {(r.riskFactors ?? []).map((rf: Record<string, any>, i: number) => (
            <Panel key={i} className={`p-3 space-y-1.5 ${compositeHeat(rf.composite)}`}>
              <div className="flex items-center gap-2">
                <Badge variant={compositeColor(rf.composite)}>{rf.composite}</Badge>
                <span className="text-xs text-pq-text-bright font-semibold">{rf.risk}</span>
              </div>
              <div className="text-[10px] text-pq-text-dim pl-1">
                <span className="text-pq-green font-semibold">Mitigation:</span> {rf.mitigation}
              </div>
              <div className="text-[10px] text-pq-text-dim pl-1">
                <span className="text-pq-cyan font-semibold">Trigger:</span> {rf.monitoringTrigger}
              </div>
            </Panel>
          ))}
        </div>

        {/* Recent risk changes */}
        <SectionLabel className="text-pq-text-bright">RECENT RISK CHANGES</SectionLabel>
        <Panel className="p-3 md:p-4" variant="elevated">
          <div className="space-y-0">
            {(r.recentChanges ?? []).map((c: Record<string, any>, i: number) => (
              <div key={i} className="flex items-start gap-3 pb-3 last:pb-0 relative">
                {i < (r.recentChanges ?? []).length - 1 && (
                  <div className="timeline-line absolute left-[4px] top-[14px] bottom-0" />
                )}
                <div className={`${c.direction === "De-risked" ? "timeline-dot-completed" : "timeline-dot-pending"} timeline-dot mt-0.5`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] text-pq-text-dim font-mono">{c.date}</span>
                    <Badge variant={c.direction === "De-risked" ? "green" : "red"}>{c.direction}</Badge>
                  </div>
                  <span className="text-xs text-pq-text">{c.change}</span>
                  {renderOverflowFields(c, CHANGE_KNOWN)}
                </div>
              </div>
            ))}
          </div>
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
      <SectionLabel className="text-pq-text-bright">RISKS</SectionLabel>

      <div className="section-hero p-5 md:p-6">
        <div className="flex items-center gap-6 md:gap-8">
          <ScoreRing value={0} color="text-pq-text-dim" label="RISK" size={90} />
          <div className="flex-1 space-y-2">
            <div className="text-[10px] text-pq-text-dim tracking-wide">OVERALL RISK LEVEL</div>
            <div className="text-2xl font-bold text-pq-text-dim">—</div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-pq-text-dim">Trend:</span>
              <Badge variant="default">—</Badge>
            </div>
          </div>
        </div>
      </div>

      <Panel className="p-3 md:p-4 space-y-2" variant="elevated">
        <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-2">RISK MATRIX</div>
        <AwaitingData />
      </Panel>

      <SectionDivider />

      <SectionLabel className="text-pq-text-bright">MITIGATIONS &amp; TRIGGERS</SectionLabel>
      <Panel className="p-3 md:p-4">
        <AwaitingData />
      </Panel>

      <SectionLabel className="text-pq-text-bright">RECENT RISK CHANGES</SectionLabel>
      <Panel className="p-3 md:p-4" variant="elevated">
        <AwaitingData />
      </Panel>

      <TabTemplateFooter tabName="Risks" ticker={ticker} detail="Risk matrix, mitigations, and monitoring triggers will be populated from SEC filing analysis." />
    </div>
  );
}
