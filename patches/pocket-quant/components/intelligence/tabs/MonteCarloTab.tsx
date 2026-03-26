"use client";

import { useState } from "react";
import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useStockData } from "@/components/intelligence/StockDataContext";
import { OverflowSections } from "./shared/OverflowFields";
import {
  THREE_POINT_SCENARIOS,
  MC_INSTITUTIONAL_NUANCES,
  MC_ADVANCED_MODELS,
  MC_DATA_SOURCES,
  MC_SIMULATION_DEFAULTS,
} from "@/lib/manifests";
import {
  HistoricalFinancialsSection,
  DriverDistributionsSection,
  MarketDataSection,
  SimulationOutputSection,
  GBMCalibrationSection,
  GBMSimParamsSection,
  GBMOutputSection,
} from "./montecarlo/MonteCarloSubComponents";

interface Props { ticker: string }

/** Known top-level keys on the monteCarlo data object. */
const KNOWN_MC_KEYS: ReadonlySet<string> = new Set([
  "medianFV", "probUndervalued", "percentiles",
  "historicalMetrics", "driverDistributions", "marketData",
  "simOutput", "gbmCalibration", "gbmSimParams", "gbmOutput",
]);

export function MonteCarloTab({ ticker }: Props) {
  const [activeScenario, setActiveScenario] = useState("base");
  const scenario = THREE_POINT_SCENARIOS.find((s) => s.id === activeScenario) ?? THREE_POINT_SCENARIOS[1];
  const data = useStockData();
  const mc = data?.monteCarlo ?? null;

  return (
    <div className="space-y-3 md:space-y-4">
      <SectionLabel className="text-pq-text-bright">MONTE CARLO SIMULATION</SectionLabel>

      {/* ── Scenario selector ── */}
      <Panel className="p-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-pq-text-dim tracking-wide uppercase mr-2">SCENARIO</span>
          {THREE_POINT_SCENARIOS.map((s) => (
            <Button key={s.id} variant="tab" active={activeScenario === s.id}
              onClick={() => setActiveScenario(s.id)}>
              <span className={activeScenario === s.id ? "" : s.color}>{s.label}</span>
            </Button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="default">{MC_SIMULATION_DEFAULTS.iterations.toLocaleString()} ITERATIONS</Badge>
            <Badge variant={activeScenario === "base" ? "orange" : "default"}>
              {scenario.label} CASE
            </Badge>
          </div>
        </div>
      </Panel>

      {/* ── Key Output Metrics — Hero treatment ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className={`section-hero p-5 md:p-6 text-center border ${scenario.bgActive}`}>
          <div className="text-[10px] text-pq-text-dim tracking-wide mb-2">MEDIAN FAIR VALUE</div>
          <div className={`text-4xl font-bold stat-hero ${scenario.color}`}>{mc?.medianFV ?? "—"}</div>
        </div>
        <div className={`section-hero p-5 md:p-6 text-center border ${scenario.bgActive}`}>
          <div className="text-[10px] text-pq-text-dim tracking-wide mb-2">PROB. UNDERVALUED</div>
          <div className={`text-4xl font-bold stat-hero ${scenario.color}`}>{mc?.probUndervalued ?? "—"}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {MC_SIMULATION_DEFAULTS.percentiles.map((p) => (
          <Panel key={p} className="p-3 text-center">
            <div className="text-[9px] text-pq-text-dim tracking-wide mb-1">{p}</div>
            <div className="text-base font-bold text-pq-text-bright">{mc?.percentiles?.[p] ?? "—"}</div>
          </Panel>
        ))}
      </div>

      {/* ── Distribution ── */}
      <SectionLabel className="text-pq-text-bright">FAIR VALUE DISTRIBUTION</SectionLabel>
      <Panel className="p-3 md:p-4" variant="elevated">
        <div className="h-48 flex items-center justify-center border border-white/5 rounded-lg relative overflow-hidden">
          <div className="absolute inset-x-4 bottom-4 flex items-end gap-[2px] opacity-20">
            {Array.from({ length: 40 }, (_, i) => {
              const h = Math.sin((i / 40) * Math.PI) * 80 + Math.random() * 20;
              return <div key={i} className="flex-1 bg-pq-cyan rounded-t-sm" style={{ height: `${h}%` }} />;
            })}
          </div>
          <span className="text-xs text-pq-text-dim relative z-10">
            Histogram of {MC_SIMULATION_DEFAULTS.iterations.toLocaleString()} simulated intrinsic values will render here.
          </span>
        </div>
        <div className="flex items-center justify-between mt-3 text-[9px] text-pq-text-dim">
          <span>5th percentile</span><span className="text-pq-text-bright">Median</span><span>95th percentile</span>
        </div>
      </Panel>

      {/* ── Historical Financials with overflow ── */}
      <SectionLabel className="text-pq-text-bright">HISTORICAL FINANCIALS (INPUT DATA)</SectionLabel>
      <HistoricalFinancialsSection mc={mc} />

      {/* ── Driver Distributions with overflow ── */}
      <SectionLabel className="text-pq-text-bright">KEY DRIVER DISTRIBUTIONS</SectionLabel>
      <DriverDistributionsSection mc={mc} />

      {/* ── Market Data with overflow ── */}
      <SectionLabel className="text-pq-text-bright">CURRENT MARKET DATA</SectionLabel>
      <MarketDataSection mc={mc} />

      {/* ── Simulation Output with overflow ── */}
      <SectionLabel className="text-pq-text-bright">SIMULATION OUTPUT</SectionLabel>
      <SimulationOutputSection mc={mc} />

      {/* ── Institutional Nuances ── */}
      <SectionLabel className="text-pq-text-bright">INSTITUTIONAL-LEVEL PARAMETERS</SectionLabel>
      <Panel className="p-3 md:p-4 space-y-3">
        {MC_INSTITUTIONAL_NUANCES.map((n) => (
          <div key={n.id} className="flex items-start gap-2 border-b border-white/5 pb-2">
            <span className="text-[10px] text-pq-accent font-bold min-w-[120px]">{n.label}</span>
            <span className="text-[10px] text-pq-text-dim">{n.description}</span>
          </div>
        ))}
      </Panel>

      {/* ── Methodology ── */}
      <SectionLabel className="text-pq-text-bright">METHODOLOGY</SectionLabel>
      <Panel className="p-3 md:p-4 space-y-3">
        <div className="text-[10px] text-pq-accent font-bold tracking-wide uppercase">
          Monte Carlo DCF &mdash; Stochastic Fair Value Estimation
        </div>
        <div className="text-[10px] text-pq-text-dim leading-relaxed space-y-2">
          <p>Produces a distribution of fair values rather than a single point estimate.</p>
          <p>
            <span className="text-pq-text">Process:</span> (1) Build 5-10 year forecast model.
            (2) Assign probability distributions to every uncertain driver.
            (3) Run {MC_SIMULATION_DEFAULTS.iterations.toLocaleString()}+ iterations. (4) Output histogram.
          </p>
          <p>
            Three scenario overlays ({THREE_POINT_SCENARIOS.map((s) => (
              <span key={s.id} className={s.color}> {s.label}</span>
            ))}) shift distribution parameters to stress-test under different assumptions.
          </p>
        </div>
      </Panel>

      {/* ── GBM SECTION ── */}
      <div className="section-divider" />
      <div className="flex items-center gap-3">
        <SectionLabel className="text-pq-text-bright">STOCK PRICE PATH SIMULATION</SectionLabel>
        <Badge variant="orange">GBM</Badge>
      </div>

      <SectionLabel className="text-pq-text-bright">CALIBRATION DATA</SectionLabel>
      <GBMCalibrationSection mc={mc} />

      <SectionLabel className="text-pq-text-bright">GBM SIMULATION PARAMETERS</SectionLabel>
      <GBMSimParamsSection mc={mc} />

      <SectionLabel className="text-pq-text-bright">SIMULATED PRICE PATHS</SectionLabel>
      <Panel className="p-3 md:p-4" variant="elevated">
        <div className="h-48 flex items-center justify-center border border-white/5 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 400 180" className="w-full h-full" preserveAspectRatio="none">
              {Array.from({ length: 8 }, (_, i) => {
                const spread = (i + 1) * 12;
                return (
                  <path key={i} d={`M0,90 Q100,${90 - spread / 2} 200,${90 - spread / 3} T400,${90 - spread}`}
                    stroke="var(--pq-cyan)" fill="none" strokeWidth="1" opacity={0.6 - i * 0.06} />
                );
              })}
              {Array.from({ length: 8 }, (_, i) => {
                const spread = (i + 1) * 12;
                return (
                  <path key={`b${i}`} d={`M0,90 Q100,${90 + spread / 2} 200,${90 + spread / 3} T400,${90 + spread}`}
                    stroke="var(--pq-cyan)" fill="none" strokeWidth="1" opacity={0.6 - i * 0.06} />
                );
              })}
            </svg>
          </div>
          <span className="text-xs text-pq-text-dim relative z-10">
            Fan chart: 100 sample paths + percentile bands. Current price at left edge.
          </span>
        </div>
      </Panel>

      <SectionLabel className="text-pq-text-bright">GBM OUTPUT</SectionLabel>
      <GBMOutputSection mc={mc} />

      {/* ── Advanced Models ── */}
      <SectionLabel className="text-pq-text-bright">ADVANCED MODELS</SectionLabel>
      <Panel className="p-3 md:p-4 space-y-3">
        <div className="text-[10px] text-pq-text-dim mb-2">
          Extensions beyond basic GBM used on institutional trading floors.
        </div>
        {MC_ADVANCED_MODELS.map((m) => (
          <div key={m.id} className="flex items-start gap-3 border-b border-white/5 pb-2">
            <div className="flex-1">
              <div className="text-[10px] text-pq-text-bright font-bold">{m.name}</div>
              <div className="text-[9px] text-pq-text-dim">{m.params}</div>
            </div>
            <Badge variant={m.status === "Available" ? "green" : "default"}>{m.status}</Badge>
          </div>
        ))}
      </Panel>

      {/* ── Data Sources ── */}
      <SectionLabel className="text-pq-text-bright">INSTITUTIONAL DATA SOURCES</SectionLabel>
      <Panel className="p-3 md:p-4 space-y-2">
        {MC_DATA_SOURCES.map((src) => (
          <div key={src} className="flex items-baseline gap-2 border-b border-white/5 pb-1">
            <span className="text-[10px] text-pq-accent font-bold">{src}</span>
          </div>
        ))}
      </Panel>

      {/* ── GBM Methodology ── */}
      <SectionLabel className="text-pq-text-bright">GBM METHODOLOGY</SectionLabel>
      <Panel className="p-3 md:p-4 space-y-3">
        <div className="text-[10px] text-pq-accent font-bold tracking-wide uppercase">
          Geometric Brownian Motion &mdash; Stock Price Path Simulation
        </div>
        <div className="text-[10px] text-pq-text-dim leading-relaxed space-y-2">
          <p>Simulates thousands of possible future price paths to estimate terminal stock price distribution.</p>
          <p>
            <span className="text-pq-text">GBM Formula:</span>{" "}
            S<sub>t+&Delta;t</sub> = S<sub>t</sub> &times; exp((&mu; &minus; &sigma;&sup2;/2) &times; &Delta;t + &sigma; &times; &radic;&Delta;t &times; Z)
          </p>
        </div>
      </Panel>

      {/* ── Top-level overflow: unknown sections on monteCarlo data ── */}
      <OverflowSections
        data={mc as Record<string, unknown> | null}
        knownKeys={KNOWN_MC_KEYS}
      />

      {!mc && (
        <div className="text-[10px] text-pq-text-dim border border-white/10 p-3">
          TEMPLATE: Monte Carlo tab for <span className="text-pq-accent">{ticker}</span>. All parameters has not been populated yet.
        </div>
      )}
    </div>
  );
}
