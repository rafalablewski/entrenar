"use client";

import Panel from "@/components/ui/Panel";
import Badge from "@/components/ui/Badge";
import { OverflowKeyValues } from "../shared/OverflowFields";
import {
  MC_HISTORICAL_METRICS,
  MC_DRIVER_DISTRIBUTIONS,
  MC_MARKET_DATA,
  MC_SIMULATION_OUTPUT,
  MC_SIMULATION_DEFAULTS,
  GBM_CALIBRATION,
  GBM_SIM_PARAMS,
  GBM_OUTPUT,
} from "@/lib/manifests";

/* ── Known-key sets for overflow detection ── */
const HISTORICAL_KEYS: ReadonlySet<string> = new Set(MC_HISTORICAL_METRICS.map((m) => m.name));
const DRIVER_KEYS: ReadonlySet<string> = new Set(MC_DRIVER_DISTRIBUTIONS.map((d) => d.name));
const MARKET_DATA_KEYS: ReadonlySet<string> = new Set(MC_MARKET_DATA.map((m) => m.name));
const SIM_OUTPUT_KEYS: ReadonlySet<string> = new Set(MC_SIMULATION_OUTPUT.map((m) => m.name));
const GBM_CAL_KEYS: ReadonlySet<string> = new Set(GBM_CALIBRATION.map((m) => m.name));
const GBM_PARAM_KEYS: ReadonlySet<string> = new Set(GBM_SIM_PARAMS.map((m) => m.name));
const GBM_OUT_KEYS: ReadonlySet<string> = new Set(GBM_OUTPUT.map((m) => m.name));

/* eslint-disable @typescript-eslint/no-explicit-any */
type McData = Record<string, any> | null;

/**
 * Find a value in a Record by exact or partial key match.
 */
function lookupValue(record: Record<string, string>, name: string): string | undefined {
  if (!record) return undefined;
  if (record[name]) return record[name];
  for (const [key, val] of Object.entries(record)) {
    const lk = key.toLowerCase();
    const ln = name.toLowerCase();
    if (lk.includes(ln) || ln.includes(lk)) return val;
  }
  return undefined;
}

/* ── Shared sub-components ── */

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

function DriverRow({ label, dist, mu, sigma }: { label: string; dist: string; mu?: string; sigma?: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/5 pb-2">
      <span className="text-[10px] text-pq-text-dim flex-1">{label}</span>
      <Badge variant="default">{dist}</Badge>
      <div className="flex items-center gap-2 text-[10px] text-pq-text font-mono">
        <span className="text-pq-text-dim">&mu;</span> <span>{mu ?? "—"}</span>
        <span className="text-pq-text-dim">&sigma;</span> <span>{sigma ?? "—"}</span>
      </div>
    </div>
  );
}

function CalibrationMetric({ label, description, value }: { label: string; description: string; value?: string }) {
  return (
    <div>
      <div className="text-[9px] text-pq-text-dim tracking-wide">{label}</div>
      <div className="text-sm font-bold text-pq-text-bright">{value ?? "—"}</div>
      <div className="text-[8px] text-pq-text-dim">{description}</div>
    </div>
  );
}

/* ── Section components with overflow ── */

export function HistoricalFinancialsSection({ mc }: { mc: McData }) {
  const metrics = mc?.historicalMetrics as Record<string, string> | undefined;
  return (
    <Panel className="p-3 md:p-4">
      <div className="text-[10px] text-pq-text-dim tracking-wide uppercase mb-3">
        {MC_SIMULATION_DEFAULTS.historicalLookbackYears} YEAR LOOKBACK
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-2">
        {MC_HISTORICAL_METRICS.map((m) => (
          <Row key={m.id} label={m.name} value={metrics ? lookupValue(metrics, m.name) : undefined} />
        ))}
      </div>
      <OverflowKeyValues data={metrics} knownKeys={HISTORICAL_KEYS} />
    </Panel>
  );
}

export function DriverDistributionsSection({ mc }: { mc: McData }) {
  const drivers = mc?.driverDistributions as Record<string, { mu?: string; sigma?: string }> | undefined;
  return (
    <Panel className="p-3 md:p-4 space-y-3">
      <div className="text-[10px] text-pq-text-dim leading-relaxed mb-2">
        Each driver is assigned a probability distribution. Every iteration draws random values to run a full DCF.
      </div>
      {MC_DRIVER_DISTRIBUTIONS.map((d) => {
        const dd = drivers?.[d.name];
        return <DriverRow key={d.id} label={d.name} dist={d.distributionType} mu={dd?.mu} sigma={dd?.sigma} />;
      })}
      {/* Overflow: extra driver distribution keys */}
      {drivers && Object.entries(drivers)
        .filter(([k]) => !DRIVER_KEYS.has(k) && !k.startsWith("_"))
        .map(([k, dd]) => (
          <DriverRow key={k} label={k} dist="Unknown" mu={dd?.mu} sigma={dd?.sigma} />
        ))
      }
    </Panel>
  );
}

export function MarketDataSection({ mc }: { mc: McData }) {
  const mktData = mc?.marketData as Record<string, string> | undefined;
  return (
    <Panel className="p-3 md:p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-2">
        {MC_MARKET_DATA.map((m) => (
          <Row key={m.id} label={m.name} value={mktData ? lookupValue(mktData, m.name) : undefined} />
        ))}
      </div>
      <OverflowKeyValues data={mktData} knownKeys={MARKET_DATA_KEYS} />
    </Panel>
  );
}

export function SimulationOutputSection({ mc }: { mc: McData }) {
  const simOut = mc?.simOutput as Record<string, string> | undefined;
  return (
    <Panel className="p-3 md:p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-3">
        {MC_SIMULATION_OUTPUT.map((m) => (
          <OutputMetric key={m.id} label={m.name} value={simOut ? lookupValue(simOut, m.name) : undefined} />
        ))}
      </div>
      <OverflowKeyValues data={simOut} knownKeys={SIM_OUTPUT_KEYS} />
    </Panel>
  );
}

export function GBMCalibrationSection({ mc }: { mc: McData }) {
  const cal = mc?.gbmCalibration as Record<string, string> | undefined;
  return (
    <Panel className="p-3 md:p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-3">
        {GBM_CALIBRATION.map((m) => (
          <CalibrationMetric key={m.id} label={m.name} description={m.description ?? ""} value={cal ? lookupValue(cal, m.name) : undefined} />
        ))}
      </div>
      <OverflowKeyValues data={cal} knownKeys={GBM_CAL_KEYS} />
    </Panel>
  );
}

export function GBMSimParamsSection({ mc }: { mc: McData }) {
  const params = mc?.gbmSimParams as Record<string, string> | undefined;
  return (
    <Panel className="p-3 md:p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-2">
        {GBM_SIM_PARAMS.map((m) => (
          <Row key={m.id} label={m.name} value={params ? lookupValue(params, m.name) : undefined} />
        ))}
      </div>
      <OverflowKeyValues data={params} knownKeys={GBM_PARAM_KEYS} />
    </Panel>
  );
}

export function GBMOutputSection({ mc }: { mc: McData }) {
  const output = mc?.gbmOutput as Record<string, string> | undefined;
  return (
    <Panel className="p-3 md:p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-3">
        {GBM_OUTPUT.map((m) => (
          <OutputMetric key={m.id} label={m.name} value={output ? lookupValue(output, m.name) : undefined} />
        ))}
      </div>
      <OverflowKeyValues data={output} knownKeys={GBM_OUT_KEYS} />
    </Panel>
  );
}
