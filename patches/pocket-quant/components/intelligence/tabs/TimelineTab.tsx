"use client";

import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import { ProfileRow, SectionDivider } from "@/components/shared/DataDisplayComponents";
import CollapsibleCard from "@/components/ui/CollapsibleCard";
import { useStockData } from "@/components/intelligence/StockDataContext";
import {
  FILING_TYPES,
  UPCOMING_EVENT_SLOTS,
  getEventBadgeVariant,
  FILING_STATS_LABELS,
  TIMELINE_STATS,
  TEMPLATE_ROW_COUNTS,
} from "@/lib/manifests";
import {
  OverflowKeyValues,
  OverflowItemFields,
  OverflowSections,
} from "./shared/OverflowFields";

type BadgeVariant = "green" | "orange" | "blue" | "yellow" | "cyan" | "red" | "default";

interface Props { ticker: string }

/** Known keys on filing array items */
const KNOWN_FILING_KEYS = new Set(["date", "form", "title", "signal", "findings", "status"]);

/** Known keys on upcoming event array items */
const KNOWN_UPCOMING_KEYS = new Set(["date", "type", "event", "impact", "notes"]);

/** Known keys on timeline event array items */
const KNOWN_TIMELINE_EVENT_KEYS = new Set(["date", "type", "title", "signal", "description", "impact"]);

/** Known keys in the filingStats Record */
const KNOWN_FILING_STATS_KEYS = new Set<string>(FILING_STATS_LABELS);

/** Known keys in the timelineStats Record */
const KNOWN_TIMELINE_STATS_KEYS = new Set<string>(TIMELINE_STATS.map((s) => s.label));

/** Known top-level keys on the timeline data object */
const KNOWN_TIMELINE_KEYS = new Set([
  "filings", "filingStats", "upcomingEvents", "timelineEvents", "timelineStats",
]);

export function TimelineTab({ ticker }: Props) {
  const d = useStockData();
  const filings = d?.timeline?.filings;
  const upcomingEvents = d?.timeline?.upcomingEvents;
  const timelineEvents = d?.timeline?.timelineEvents;
  const hasData = !!d?.timeline;

  return (
    <div className="space-y-3 md:space-y-4">

      {/* -- SEC FILINGS (ANALYSED) -- */}
      <SectionLabel className="text-pq-text-bright">SEC FILINGS (ANALYSED)</SectionLabel>
      <Panel className="p-3 md:p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-pq-text-dim tracking-wide">
                <th className="text-left py-2 pr-4 whitespace-nowrap">DATE</th>
                <th className="text-left py-2 px-3 whitespace-nowrap">FORM</th>
                <th className="text-left py-2 px-3 min-w-[180px]">TITLE / DESCRIPTION</th>
                <th className="text-center py-2 px-3 whitespace-nowrap">SIGNAL</th>
                <th className="text-left py-2 px-3 min-w-[200px]">KEY FINDINGS</th>
                <th className="text-center py-2 px-3 whitespace-nowrap">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filings && filings.length > 0
                ? filings.map((f: Record<string, unknown>, i: number) => (
                    <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-2 pr-4 font-mono text-pq-text-dim whitespace-nowrap">{String(f.date ?? "")}</td>
                      <td className="py-2 px-3 whitespace-nowrap"><Badge variant="cyan">{String(f.form ?? "")}</Badge></td>
                      <td className="py-2 px-3 text-pq-text">
                        {String(f.title ?? "")}
                        <OverflowItemFields item={f} knownKeys={KNOWN_FILING_KEYS} />
                      </td>
                      <td className="py-2 px-3 text-center"><Badge variant={getEventBadgeVariant(f.signal as string) as BadgeVariant}>{String(f.signal ?? "")}</Badge></td>
                      <td className="py-2 px-3 text-pq-text-dim">{String(f.findings ?? "")}</td>
                      <td className="py-2 px-3 text-center"><Badge variant="default">{String(f.status ?? "")}</Badge></td>
                    </tr>
                  ))
                : FILING_TYPES.map((f, i) => (
                    <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-2 pr-4 font-mono text-pq-text-dim">—</td>
                      <td className="py-2 px-3"><Badge variant="cyan">{f.form}</Badge></td>
                      <td className="py-2 px-3 text-pq-text">{f.description}</td>
                      <td className="py-2 px-3 text-center"><Badge variant="default">—</Badge></td>
                      <td className="py-2 px-3 text-pq-text-dim">—</td>
                      <td className="py-2 px-3 text-center"><Badge variant="default">—</Badge></td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Filing Statistics + overflow */}
      <Panel className="p-3 md:p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-2">
          {FILING_STATS_LABELS.map((label) => (
            <ProfileRow key={label} label={label} value={d?.timeline?.filingStats?.[label]} />
          ))}
        </div>
        <OverflowKeyValues
          data={d?.timeline?.filingStats as Record<string, unknown> | undefined}
          knownKeys={KNOWN_FILING_STATS_KEYS}
          className="mt-2 border-t border-white/5 pt-2"
        />
      </Panel>

      {/* -- UPCOMING EVENTS -- */}
      <SectionDivider />
      <SectionLabel className="text-pq-text-bright">UPCOMING EVENTS</SectionLabel>
      {upcomingEvents && upcomingEvents.length > 0
        ? (
          <div className="space-y-2">
            {upcomingEvents.map((evt: Record<string, unknown>, i: number) => (
              <CollapsibleCard
                key={i}
                defaultOpen={i === 0}
                summary={
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-pq-text-dim whitespace-nowrap">{String(evt.date ?? "")}</span>
                    <Badge variant={getEventBadgeVariant(evt.type as string) as BadgeVariant}>
                      {(String(evt.type ?? "")).toUpperCase()}
                    </Badge>
                    <span className="text-xs text-pq-text-bright truncate">{String(evt.event ?? "")}</span>
                    <Badge variant={getEventBadgeVariant(evt.impact as string) as BadgeVariant}>{String(evt.impact ?? "")}</Badge>
                  </div>
                }
              >
                <div className="space-y-2 pt-2">
                  <div>
                    <div className="text-[9px] text-pq-accent tracking-wide font-bold uppercase mb-1">NOTES</div>
                    <div className="text-[11px] text-pq-text leading-relaxed">{String(evt.notes ?? "")}</div>
                  </div>
                  <div className="flex items-center gap-4 pt-1">
                    <span className="text-[9px] text-pq-text-dim">Expected Impact: <span className="text-pq-text font-mono font-bold">{String(evt.impact ?? "")}</span></span>
                    <span className="text-[9px] text-pq-text-dim">Type: <span className="text-pq-text font-mono">{String(evt.type ?? "")}</span></span>
                  </div>
                  <OverflowItemFields item={evt} knownKeys={KNOWN_UPCOMING_KEYS} />
                </div>
              </CollapsibleCard>
            ))}
          </div>
        )
        : (
          <Panel className="p-3 md:p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[10px] text-pq-text-dim tracking-wide">
                    <th className="text-left py-2 pr-4 whitespace-nowrap">DATE</th>
                    <th className="text-left py-2 px-3 whitespace-nowrap">TYPE</th>
                    <th className="text-left py-2 px-3 min-w-[160px]">EVENT</th>
                    <th className="text-center py-2 px-3 whitespace-nowrap">IMPACT</th>
                    <th className="text-left py-2 px-3 min-w-[200px]">NOTES</th>
                  </tr>
                </thead>
                <tbody>
                  {UPCOMING_EVENT_SLOTS.map((evt, i) => (
                    <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-2 pr-4 font-mono text-pq-text-dim">—</td>
                      <td className="py-2 px-3">
                        <Badge variant={getEventBadgeVariant(evt.type) as BadgeVariant}>
                          {(evt.type ?? "").toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-pq-text">{evt.label}</td>
                      <td className="py-2 px-3 text-center"><Badge variant="default">—</Badge></td>
                      <td className="py-2 px-3 text-pq-text-dim">—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        )
      }

      {/* -- EVENT TIMELINE -- */}
      <SectionDivider />
      <SectionLabel className="text-pq-text-bright">EVENT TIMELINE</SectionLabel>

      {timelineEvents && timelineEvents.length > 0
        ? (
          <div className="space-y-2">
            {timelineEvents.map((evt: Record<string, unknown>, i: number) => (
              <CollapsibleCard
                key={i}
                defaultOpen={i === 0}
                summary={
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-pq-text-dim whitespace-nowrap">{String(evt.date ?? "")}</span>
                    <Badge variant={getEventBadgeVariant(evt.type as string) as BadgeVariant}>{String(evt.type ?? "")}</Badge>
                    <span className="text-xs text-pq-text-bright truncate">{String(evt.title ?? "")}</span>
                    <Badge variant={getEventBadgeVariant(evt.signal as string) as BadgeVariant}>{String(evt.signal ?? "")}</Badge>
                  </div>
                }
              >
                <div className="space-y-2 pt-2">
                  <div>
                    <div className="text-[9px] text-pq-accent tracking-wide font-bold uppercase mb-1">DESCRIPTION</div>
                    <div className="text-[11px] text-pq-text leading-relaxed">{String(evt.description ?? "")}</div>
                  </div>
                  <div className="flex items-center gap-4 pt-1">
                    <span className="text-[9px] text-pq-text-dim">Impact: <span className="text-pq-text font-mono font-bold">{String(evt.impact ?? "")}</span></span>
                    <span className="text-[9px] text-pq-text-dim">Signal: <span className="text-pq-text font-mono font-bold">{String(evt.signal ?? "")}</span></span>
                    <span className="text-[9px] text-pq-text-dim">Type: <span className="text-pq-text font-mono">{String(evt.type ?? "")}</span></span>
                  </div>
                  <OverflowItemFields item={evt} knownKeys={KNOWN_TIMELINE_EVENT_KEYS} />
                </div>
              </CollapsibleCard>
            ))}
          </div>
        )
        : (
          <Panel className="p-3 md:p-4">
            <div className="space-y-0">
              {Array.from({ length: TEMPLATE_ROW_COUNTS.timelineEvents }, (_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-20 shrink-0 text-right pt-2">
                    <span className="text-[10px] text-pq-text-dim font-mono">—</span>
                  </div>
                  <div className="flex flex-col items-center shrink-0">
                    <div className="timeline-dot mt-2.5" />
                    {i < TEMPLATE_ROW_COUNTS.timelineEvents - 1 && <div className="timeline-line flex-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="glass-sm rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Badge variant="default">—</Badge>
                        <span className="text-xs text-pq-text-bright">—</span>
                      </div>
                      <div className="text-[10px] text-pq-text-dim leading-relaxed">—</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        )
      }

      {/* -- Timeline Stats + overflow -- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {TIMELINE_STATS.map((s) => (
          <Panel key={s.label} className="p-3 text-center">
            <div className="text-[10px] text-pq-text-dim tracking-wide mb-1">{s.label}</div>
            <div className={`text-lg font-bold ${s.color}`}>
              {d?.timeline?.timelineStats?.[s.label] ?? "—"}
            </div>
          </Panel>
        ))}
      </div>
      {/* Overflow stats not in TIMELINE_STATS manifest */}
      <OverflowKeyValues
        data={d?.timeline?.timelineStats as Record<string, unknown> | undefined}
        knownKeys={KNOWN_TIMELINE_STATS_KEYS}
      />

      {/* -- Overflow: unknown top-level sections on timeline data -- */}
      <OverflowSections
        data={d?.timeline as Record<string, unknown> | undefined}
        knownKeys={KNOWN_TIMELINE_KEYS}
      />

      {/* -- Template note (only when no data) -- */}
      {!hasData && (
        <div className="text-[10px] text-pq-text-dim border border-white/5 p-3">
          TEMPLATE: Timeline tab for <span className="text-pq-accent">{ticker}</span>.
          Events are append-only — past entries are never modified or deleted.
        </div>
      )}
    </div>
  );
}
