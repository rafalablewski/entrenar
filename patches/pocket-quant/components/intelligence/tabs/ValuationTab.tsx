"use client";

import { useState, useMemo } from "react";
import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  VALUATION_SCENARIOS,
  DCF_PARAMETERS,
  DCF_OUTPUT_METRICS,
  DCF_ASSUMPTIONS,
} from "@/lib/manifests";
import { useStockData } from "@/components/intelligence/StockDataContext";
import {
  OverflowKeyValues,
  OverflowSections,
} from "./shared/OverflowFields";

interface Props { ticker: string }

/** Known top-level keys on the valuation data object. */
const KNOWN_VALUATION_KEYS: ReadonlySet<string> = new Set([
  "dcfParams", "stockSpecificInputs", "targets", "dcfOutput",
  "stockSpecificOutputs", "assumptions",
]);

export function ValuationTab({ ticker }: Props) {
  const [activeScenario, setActiveScenario] = useState("base");
  const scenario = VALUATION_SCENARIOS.find((s) => s.id === activeScenario) ?? VALUATION_SCENARIOS[2];
  const d = useStockData();

  const dcfParamKeys = useMemo(
    () => new Set(DCF_PARAMETERS.map((p) => p.name)) as ReadonlySet<string>, []
  );
  const dcfOutputKeys = useMemo(
    () => new Set(DCF_OUTPUT_METRICS.map((m) => m.name)) as ReadonlySet<string>, []
  );
  const dcfAssumptionKeys = useMemo(
    () => new Set(DCF_ASSUMPTIONS.map((a) => a.name)) as ReadonlySet<string>, []
  );

  return (
    <div className="space-y-3 md:space-y-4">
      <SectionLabel className="text-pq-text-bright">DCF VALUATION</SectionLabel>
      {/* ── Scenario selector ── */}
      <Panel className="p-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-pq-text-dim tracking-wide uppercase mr-2">SCENARIO</span>
          {VALUATION_SCENARIOS.map((s) => (
            <Button key={s.id} variant="tab" active={activeScenario === s.id}
              onClick={() => setActiveScenario(s.id)}>
              <span className={activeScenario === s.id ? "" : s.color}>{s.label}</span>
            </Button>
          ))}
        </div>
      </Panel>

      {/* ── Parameters ── */}
      <SectionLabel className="text-pq-text-bright">STOCK-SPECIFIC VALUATION PARAMETERS</SectionLabel>
      <Panel className="p-3 md:p-4 space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-2">
          {DCF_PARAMETERS.map((p) => (
            <Row key={p.id} label={p.name} value={d?.valuation?.dcfParams?.[p.name]} />
          ))}
        </div>
        {/* Overflow: extra dcfParams keys not in DCF_PARAMETERS manifest */}
        <OverflowKeyValues
          data={d?.valuation?.dcfParams as Record<string, unknown> | undefined}
          knownKeys={dcfParamKeys}
        />
        <div className="border-t border-white/5 pt-2 mt-2">
          <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-2">STOCK-SPECIFIC INPUTS</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-2">
            {(d?.valuation?.stockSpecificInputs ?? []).length
              ? (d?.valuation?.stockSpecificInputs ?? []).map((item) => (
                  <Row key={item.label} label={item.label} value={item.value} />
                ))
              : <><Row label="—" /><Row label="—" /><Row label="—" /></>
            }
          </div>
        </div>
      </Panel>

      {/* ── DCF Output ── */}
      <div className="flex items-center gap-3">
        <SectionLabel className="text-pq-text-bright">DCF OUTPUT</SectionLabel>
        <Badge variant="default">2030 TERMINAL YEAR</Badge>
        <Badge variant={activeScenario === "base" ? "orange" : "default"}>
          {scenario.label} CASE
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <Panel className={`p-3 md:p-5 text-center border ${scenario.bgActive}`}>
          <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">TARGET PRICE</div>
          <div className={`text-3xl font-bold ${scenario.color}`}>
            {d?.valuation?.targets?.[activeScenario]?.target ?? "—"}
          </div>
        </Panel>
        <Panel className={`p-3 md:p-5 text-center border ${scenario.bgActive}`}>
          <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">IMPLIED UPSIDE</div>
          <div className={`text-3xl font-bold ${scenario.color}`}>
            {d?.valuation?.targets?.[activeScenario]?.upside ?? "—"}
          </div>
        </Panel>
      </div>

      <Panel className="p-3 md:p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-3">
          {DCF_OUTPUT_METRICS.map((m) => (
            <OutputMetric key={m.id} label={m.name} value={d?.valuation?.dcfOutput?.[m.name]} />
          ))}
        </div>
        {/* Overflow: extra dcfOutput keys not in DCF_OUTPUT_METRICS manifest */}
        <OverflowKeyValues
          data={d?.valuation?.dcfOutput as Record<string, unknown> | undefined}
          knownKeys={dcfOutputKeys}
        />
        <div className="border-t border-white/5 mt-3 pt-3">
          <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-2">STOCK-SPECIFIC OUTPUTS</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-3">
            {(d?.valuation?.stockSpecificOutputs ?? []).length
              ? (d?.valuation?.stockSpecificOutputs ?? []).map((item) => (
                  <OutputMetric key={item.label} label={item.label} value={item.value} />
                ))
              : <><OutputMetric label="—" /><OutputMetric label="—" /><OutputMetric label="—" /><OutputMetric label="—" /></>
            }
          </div>
        </div>
      </Panel>

      {/* ── Key Assumptions ── */}
      <SectionLabel className="text-pq-text-bright">KEY ASSUMPTIONS</SectionLabel>
      <Panel className="p-3 md:p-4 space-y-2">
        {DCF_ASSUMPTIONS.map((a) => (
          <Assumption key={a.id} label={a.name}
            description={d?.valuation?.assumptions?.[a.name] ?? a.description ?? ""} />
        ))}
        {/* Overflow: extra assumption keys not in DCF_ASSUMPTIONS manifest */}
        {d?.valuation?.assumptions && (() => {
          const extras = Object.entries(d.valuation.assumptions).filter(
            ([k]) => !dcfAssumptionKeys.has(k) && !k.startsWith("_")
          );
          if (extras.length === 0) return null;
          return extras.map(([k, v]) => (
            <Assumption key={k} label={k} description={typeof v === "string" ? v : JSON.stringify(v)} />
          ));
        })()}
      </Panel>

      {/* ── Methodology ── */}
      <SectionLabel className="text-pq-text-bright">METHODOLOGY</SectionLabel>
      <Panel className="p-3 md:p-4 space-y-3">
        <div className="text-[10px] text-pq-accent font-bold tracking-wide uppercase">
          DCF Valuation &mdash; Gordon Growth Model
        </div>
        <div className="text-[10px] text-pq-text-dim leading-relaxed space-y-2">
          <p>
            Discounted Cash Flow model projects free cash flow through the terminal year (2030),
            then applies a terminal value using the Gordon Growth Model (perpetuity growth) or an
            EV/EBITDA exit multiple, whichever is more appropriate for the business.
          </p>
          <p>
            <span className="text-pq-text">Terminal Value</span> = FCF<sub>terminal</sub> &times; (1 + g) / (WACC &minus; g),
            where g = terminal growth rate.
          </p>
          <p>
            <span className="text-pq-text">Enterprise Value</span> = &Sigma; PV(FCF<sub>t</sub>) + PV(Terminal Value).
            Equity Value = Enterprise Value &minus; Net Debt + Cash.
            Target Price = Equity Value / Diluted Shares.
          </p>
          <p>
            {VALUATION_SCENARIOS.length} scenarios stress-test the model across a range of growth, margin, and multiple assumptions.
            {VALUATION_SCENARIOS.map((s) => (
              <span key={s.id}><span className={s.color}> {s.label}</span></span>
            ))}
          </p>
        </div>
      </Panel>

      {/* ── Top-level overflow: unknown sections on valuation data ── */}
      <OverflowSections
        data={d?.valuation as Record<string, unknown> | undefined}
        knownKeys={KNOWN_VALUATION_KEYS}
      />

      {!d && (
        <div className="text-[10px] text-pq-text-dim border border-white/10 p-3">
          TEMPLATE: Valuation tab for <span className="text-pq-accent">{ticker}</span>. All scenarios, parameters, and outputs will be populated with model data when data is added.
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-white/5 pb-1">
      <span className="text-[10px] text-pq-text-dim">{label}</span>
      <span className="text-xs text-pq-text font-mono">{value ?? "—"}</span>
    </div>
  );
}

function OutputMetric({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-[9px] text-pq-text-dim tracking-wide">{label}</div>
      <div className="text-sm font-bold text-pq-text-bright">{value ?? "—"}</div>
    </div>
  );
}

function Assumption({ label, description }: { label: string; description: string }) {
  return (
    <div className="flex items-start gap-2 border-b border-white/5 pb-2">
      <span className="text-[10px] text-pq-accent font-bold min-w-[140px]">{label}</span>
      <span className="text-[10px] text-pq-text-dim">{description}</span>
    </div>
  );
}
