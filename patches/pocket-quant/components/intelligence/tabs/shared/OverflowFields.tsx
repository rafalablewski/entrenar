"use client";

import Panel from "@/components/ui/Panel";
import { ProfileRow } from "@/components/shared/DataDisplayComponents";

/**
 * Renders key-value pairs for any data keys NOT present in the known set.
 * Skips keys starting with "_" (internal/meta fields).
 */
export function OverflowKeyValues({
  data,
  knownKeys,
  className = "",
}: {
  data: Record<string, unknown> | undefined | null;
  knownKeys: ReadonlySet<string>;
  className?: string;
}) {
  if (!data) return null;
  const extras = Object.entries(data).filter(
    ([k]) => !knownKeys.has(k) && !k.startsWith("_"),
  );
  if (extras.length === 0) return null;
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-2 ${className}`}>
      {extras.map(([k, v]) => (
        <ProfileRow key={k} label={k} value={formatValue(v)} />
      ))}
    </div>
  );
}

/**
 * Renders overflow fields for a single array item as small dim key-value pairs.
 */
export function OverflowItemFields({
  item,
  knownKeys,
}: {
  item: Record<string, unknown>;
  knownKeys: ReadonlySet<string>;
}) {
  const extras = Object.entries(item).filter(
    ([k]) => !knownKeys.has(k) && !k.startsWith("_"),
  );
  if (extras.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
      {extras.map(([k, v]) => (
        <span key={k} className="text-pq-text-dim text-[9px]">
          <span className="text-pq-text-dim/60">{k}:</span>{" "}
          <span className="text-pq-text font-mono">{formatValue(v)}</span>
        </span>
      ))}
    </div>
  );
}

/**
 * Renders unknown top-level sections from a data object.
 * string -> text, array -> list, object -> key-value grid, else toString.
 */
export function OverflowSections({
  data,
  knownKeys,
}: {
  data: Record<string, unknown> | undefined | null;
  knownKeys: ReadonlySet<string>;
}) {
  if (!data) return null;
  const extras = Object.entries(data).filter(
    ([k]) => !knownKeys.has(k) && !k.startsWith("_"),
  );
  if (extras.length === 0) return null;
  return (
    <>
      {extras.map(([key, value]) => (
        <Panel key={key} className="p-3 md:p-4">
          <div className="text-[10px] text-pq-accent tracking-wide uppercase font-bold mb-2">
            {formatSectionTitle(key)}
          </div>
          <SectionValue value={value} />
        </Panel>
      ))}
    </>
  );
}

/**
 * Renders overflow rows inside an existing MetricTable-style table body.
 * Returns <tr> elements for any metric keys in the data not covered by the manifest.
 */
export function OverflowMetricRows({
  values,
  knownMetricNames,
  quarterLabels,
}: {
  values: Record<string, Record<string, string>> | undefined;
  knownMetricNames: ReadonlySet<string>;
  quarterLabels: string[];
}) {
  if (!values) return null;
  const extraKeys = Object.keys(values).filter(
    (k) => !knownMetricNames.has(k) && !k.startsWith("_"),
  );
  if (extraKeys.length === 0) return null;
  return (
    <Panel className="p-3 md:p-4">
      <div className="text-[10px] text-pq-text-dim tracking-wide uppercase font-bold mb-2">ADDITIONAL METRICS</div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <tbody>
            {extraKeys.map((metricName) => (
              <tr key={metricName} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-2 pr-4 text-pq-text-dim text-[10px]">{metricName}</td>
                {quarterLabels.map((ql) => (
                  <td key={ql} className="py-2 px-3 text-right font-mono text-pq-text">
                    {values[metricName]?.[ql] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* -- Internal helpers -- */

function formatValue(v: unknown): string {
  if (v == null) return "—";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.map(formatValue).join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function formatSectionTitle(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .trim()
    .toUpperCase();
}

function SectionValue({ value }: { value: unknown }) {
  if (value == null) return <span className="text-xs text-pq-text-dim">—</span>;

  if (typeof value === "string") {
    return <p className="text-xs text-pq-text leading-relaxed">{value}</p>;
  }

  if (Array.isArray(value)) {
    return (
      <ul className="space-y-1">
        {value.map((item, i) => (
          <li key={i} className="text-xs text-pq-text">
            {typeof item === "object" && item !== null ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1">
                {Object.entries(item as Record<string, unknown>).map(([k, v]) => (
                  <ProfileRow key={k} label={k} value={formatValue(v)} />
                ))}
              </div>
            ) : (
              <span className="text-pq-text font-mono">{formatValue(item)}</span>
            )}
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-2">
        {entries.map(([k, v]) => (
          <ProfileRow key={k} label={k} value={formatValue(v)} />
        ))}
      </div>
    );
  }

  return <span className="text-xs text-pq-text font-mono">{String(value)}</span>;
}
