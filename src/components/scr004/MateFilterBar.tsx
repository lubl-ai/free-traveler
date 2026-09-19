'use client';

import { useEffect, useMemo, useState } from 'react';
import { destinations } from '@/data/destinations';

/**
 * Mate Post Search Filter
 * REQ-FUNC-030
 *
 * Country/region/date-range/status/style filters against MATE_POST — all
 * fields that actually exist on the table (see supabase/migrations/0001_schema.sql).
 * The schema has no structured age-range or gender column (authors put that
 * kind of detail into the free-text `conditions` field instead, e.g.
 * "20-30대 선호"), so 연령대/성별 fold into a single free-text keyword search
 * against `conditions`/`style` rather than fabricating dropdowns with no
 * real backing data.
 *
 * Blocked-user exclusion is NOT done here — it's enforced server-side in
 * GET /api/mates (API-MATE-POSTS), since that's the only place block
 * relationships can be checked safely (this component has no access to the
 * caller's block list, nor should it).
 */

const COUNTRY_REGIONS: Record<string, string[]> = (() => {
  const map: Record<string, Set<string>> = {};
  for (const d of destinations) {
    if (!map[d.country]) {
      map[d.country] = new Set();
    }
    if (d.region) {
      map[d.country].add(d.region);
    }
  }
  return Object.fromEntries(Object.entries(map).map(([country, regions]) => [country, Array.from(regions).sort()]));
})();

const COUNTRIES = Object.keys(COUNTRY_REGIONS).sort();

export interface MateFilters {
  country: string;
  region: string;
  dateFrom: string;
  dateTo: string;
  status: '' | 'OPEN' | 'CLOSED';
  keyword: string;
}

const EMPTY_FILTERS: MateFilters = { country: '', region: '', dateFrom: '', dateTo: '', status: '', keyword: '' };

export interface MateFilterBarProps {
  onFilterChange: (filters: MateFilters) => void;
}

export function MateFilterBar({ onFilterChange }: MateFilterBarProps) {
  const [filters, setFilters] = useState<MateFilters>(EMPTY_FILTERS);
  const regionOptions = filters.country ? COUNTRY_REGIONS[filters.country] ?? [] : [];

  useEffect(() => {
    onFilterChange(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const hasActiveFilters = useMemo(() => Object.values(filters).some((v) => v !== ''), [filters]);

  function update<K extends keyof MateFilters>(key: K, value: MateFilters[K]) {
    setFilters((prev) => (key === 'country' ? { ...prev, country: value as string, region: '' } : { ...prev, [key]: value }));
  }

  return (
    <div className="flex flex-col gap-sm sm:flex-row sm:flex-wrap sm:items-end">
      <label className="flex flex-col gap-xs">
        <span className="text-caption text-muted">국가</span>
        <select
          value={filters.country}
          onChange={(e) => update('country', e.target.value)}
          className="h-11 rounded-sm border border-border-strong bg-canvas px-sm text-body-sm text-ink"
        >
          <option value="">전체</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-xs">
        <span className="text-caption text-muted">지역</span>
        <select
          value={filters.region}
          onChange={(e) => update('region', e.target.value)}
          disabled={!filters.country}
          className="h-11 rounded-sm border border-border-strong bg-canvas px-sm text-body-sm text-ink disabled:bg-surface-soft disabled:text-muted-soft"
        >
          <option value="">전체</option>
          {regionOptions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-xs">
        <span className="text-caption text-muted">시작일 이후</span>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => update('dateFrom', e.target.value)}
          className="h-11 rounded-sm border border-border-strong bg-canvas px-sm text-body-sm text-ink"
        />
      </label>

      <label className="flex flex-col gap-xs">
        <span className="text-caption text-muted">종료일 이전</span>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => update('dateTo', e.target.value)}
          className="h-11 rounded-sm border border-border-strong bg-canvas px-sm text-body-sm text-ink"
        />
      </label>

      <label className="flex flex-col gap-xs">
        <span className="text-caption text-muted">모집 상태</span>
        <select
          value={filters.status}
          onChange={(e) => update('status', e.target.value as MateFilters['status'])}
          className="h-11 rounded-sm border border-border-strong bg-canvas px-sm text-body-sm text-ink"
        >
          <option value="">전체</option>
          <option value="OPEN">모집중</option>
          <option value="CLOSED">마감</option>
        </select>
      </label>

      <label className="flex flex-1 flex-col gap-xs">
        <span className="text-caption text-muted">조건 검색 (연령대·성별·스타일 등)</span>
        <input
          type="text"
          value={filters.keyword}
          onChange={(e) => update('keyword', e.target.value)}
          placeholder="예: 20대, 여성, 맛집 탐방"
          className="h-11 rounded-sm border border-border-strong bg-canvas px-sm text-body-sm text-ink"
        />
      </label>

      {hasActiveFilters ? (
        <button
          type="button"
          onClick={() => setFilters(EMPTY_FILTERS)}
          className="h-11 whitespace-nowrap text-body-sm font-medium text-coral hover:text-coral-active"
        >
          필터 초기화
        </button>
      ) : null}
    </div>
  );
}
