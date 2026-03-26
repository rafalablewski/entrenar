"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Panel from "@/components/ui/Panel";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { fetcher } from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/api-routes";
import { formatDate } from "@/lib/format";

interface Props { ticker: string }

interface PressItem {
  headline?: string;
  title?: string;
  datetime: string;
  summary?: string;
  description?: string;
  source?: string;
  permalink?: string;
  storyurl?: string;
  _ticker?: string;
  [key: string]: unknown;
}

const PAGE_SIZE = 50;

const PR_KNOWN_FIELDS = new Set([
  "headline", "title", "datetime", "summary", "description",
  "source", "permalink", "storyurl", "_ticker",
]);

/** Extract year from datetime string */
function getItemYear(datetime: string): string {
  try {
    return new Date(datetime).getUTCFullYear().toString();
  } catch {
    return "Unknown";
  }
}

/** Group items by year, sorted newest first */
function groupByYear(items: PressItem[]): { year: string; items: PressItem[] }[] {
  const groups: Record<string, PressItem[]> = {};
  for (const item of items) {
    const year = getItemYear(item.datetime);
    if (!groups[year]) groups[year] = [];
    groups[year].push(item);
  }
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, items]) => ({ year, items }));
}

export function NewsTab({ ticker }: Props) {
  const url = API_ROUTES.PRESS_INTELLIGENCE({ tickers: [ticker], mode: "db" });
  const { data, isLoading } = useSWR<PressItem[]>(url, fetcher, { revalidateOnFocus: false });

  const pressReleases = Array.isArray(data) ? data : [];
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(pressReleases.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = page * PAGE_SIZE;
    return pressReleases.slice(start, start + PAGE_SIZE);
  }, [pressReleases, page]);

  const yearGroups = useMemo(() => groupByYear(pageItems), [pageItems]);

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex items-center justify-between">
        <SectionLabel className="text-pq-text-bright">NEWS &amp; PRESS RELEASES</SectionLabel>
        <Badge variant="default">PRESS INTELLIGENCE</Badge>
      </div>

      {isLoading && (
        <Panel className="p-3 md:p-4">
          <div className="text-xs text-pq-text-dim text-center py-8 animate-pulse">Loading press releases...</div>
        </Panel>
      )}

      {!isLoading && pressReleases.length === 0 && (
        <Panel className="p-3 md:p-4">
          <div className="text-xs text-pq-text-dim text-center py-8">
            No press releases found for {ticker}. Ensure {ticker} is in INTELLIGENCE_TICKERS and run a press refresh.
          </div>
        </Panel>
      )}

      {/* Pagination header */}
      {!isLoading && pressReleases.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-pq-text-dim tracking-wide uppercase">
            {pressReleases.length} PRESS RELEASE{pressReleases.length !== 1 ? "S" : ""}
            {totalPages > 1 && (
              <span className="ml-2 text-pq-text-dim/60">
                &middot; Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, pressReleases.length)}
              </span>
            )}
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <span className="text-[10px] text-pq-text-dim font-mono px-2">
                {page + 1}/{totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* News items grouped by year */}
      {!isLoading && yearGroups.map(({ year, items }) => {
        return (
          <div key={year}>
            {/* Year header */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[11px] font-semibold text-pq-text-dim tracking-widest uppercase">
                {year}
              </span>
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-[10px] text-pq-text-dim/60">
                {items.length}
              </span>
            </div>

            <Panel className="p-3 md:p-4">
              <div className="space-y-0">
                {items.map((pr, i) => {
                  const headline = pr.headline || pr.title || "Untitled";
                  const summary = pr.summary || pr.description || "";
                  const link = pr.permalink || pr.storyurl;

                  const overflowEntries = Object.entries(pr).filter(
                    ([k, v]) => !PR_KNOWN_FIELDS.has(k) && v !== undefined && v !== null && v !== ""
                  );

                  return (
                    <div key={`${pr.datetime}-${i}`} className="border-t border-white/5 py-2.5 first:border-0 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-1.5">
                            <span className="text-xs text-pq-text leading-snug flex-1 min-w-0">
                              {link ? (
                                <a
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-pq-cyan transition-colors"
                                >
                                  {headline}
                                </a>
                              ) : headline}
                            </span>
                            {link && (
                              <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 text-pq-text-dim/40 hover:text-pq-cyan transition-colors mt-0.5"
                                title="Open article"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          {summary && (
                            <div className="text-[10px] text-pq-text-dim mt-1 line-clamp-2">{summary}</div>
                          )}
                          {overflowEntries.length > 0 && (
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                              {overflowEntries.map(([k, v]) => (
                                <span key={k} className="text-pq-text-dim text-[9px]">
                                  {k}: {typeof v === "object" ? JSON.stringify(v) : String(v)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="text-[10px] text-pq-text-dim font-mono whitespace-nowrap">
                            {formatDate(pr.datetime)}
                          </div>
                          {pr.source && (
                            <div className="text-[9px] text-pq-text-dim/60 mt-0.5">{pr.source}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>
        );
      })}

      {/* Bottom pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>
          <span className="text-[10px] text-pq-text-dim font-mono px-2">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
