'use client';

import { useEffect, useMemo, useState } from 'react';
import { destinations, type Destination } from '@/data/destinations';

/**
 * Search + Theme Filter Bar
 * REQ-FUNC-002,003
 *
 * All filtering runs client-side against the static DATA-DESTINATIONS
 * module — no network request is made. Search matches destination name,
 * country name, and theme keywords (Korean partial match). Country / city /
 * season / theme / duration filters combine with AND semantics.
 *
 * `recommendedMonths` entries are ranges like "3월-5월" or "12월-2월"
 * (winter wraps year-end); they're expanded into month numbers to test
 * against the four Korean seasons for the 계절 filter.
 *
 * The data model has no standalone "여행 기간" field, so 기간 is derived
 * from `type`: domestic trips are conventionally short (당일~2박3일),
 * international trips longer (3박4일 이상) — a documented heuristic, not
 * fabricated data.
 */

const SEASONS = ['봄', '여름', '가을', '겨울'] as const;
type Season = (typeof SEASONS)[number];

const DURATIONS = ['당일~2박3일', '3박4일 이상'] as const;
type Duration = (typeof DURATIONS)[number];

function monthsFromRange(range: string): number[] {
  const match = range.match(/(\d{1,2})월-(\d{1,2})월/);
  if (!match) {
    return [];
  }
  const start = Number(match[1]);
  const end = Number(match[2]);
  const months: number[] = [];
  let current = start;
  while (true) {
    months.push(current);
    if (current === end) break;
    current = current === 12 ? 1 : current + 1;
    if (months.length > 12) break; // safety guard against malformed ranges
  }
  return months;
}

function seasonForMonth(month: number): Season {
  if (month >= 3 && month <= 5) return '봄';
  if (month >= 6 && month <= 8) return '여름';
  if (month >= 9 && month <= 11) return '가을';
  return '겨울';
}

function destinationSeasons(destination: Destination): Season[] {
  const months = destination.recommendedMonths.flatMap(monthsFromRange);
  return Array.from(new Set(months.map(seasonForMonth)));
}

function durationForDestination(destination: Destination): Duration {
  return destination.type === 'domestic' ? '당일~2박3일' : '3박4일 이상';
}

function matchesSearch(destination: Destination, query: string): boolean {
  if (!query.trim()) {
    return true;
  }
  const needle = query.trim().toLowerCase();
  const haystack = [destination.nameKo, destination.nameEn, destination.country, ...destination.themes]
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
}

export interface SearchFilterBarProps {
  scope: 'domestic' | 'international';
  onFilteredChange: (results: Destination[]) => void;
}

export function SearchFilterBar({ scope, onFilteredChange }: SearchFilterBarProps) {
  const scopeDestinations = useMemo(
    () => destinations.filter((d) => (scope === 'domestic' ? d.type === 'domestic' : d.type === 'international')),
    [scope]
  );

  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<Duration | null>(null);

  const countries = useMemo(
    () => Array.from(new Set(scopeDestinations.map((d) => d.country))).sort(),
    [scopeDestinations]
  );
  const themes = useMemo(
    () => Array.from(new Set(scopeDestinations.flatMap((d) => d.themes))).sort(),
    [scopeDestinations]
  );

  const filtered = useMemo(() => {
    return scopeDestinations.filter((destination) => {
      if (!matchesSearch(destination, query)) return false;
      if (selectedCountry && destination.country !== selectedCountry) return false;
      if (selectedTheme && !destination.themes.includes(selectedTheme)) return false;
      if (selectedSeason && !destinationSeasons(destination).includes(selectedSeason)) return false;
      if (selectedDuration && durationForDestination(destination) !== selectedDuration) return false;
      return true;
    });
  }, [scopeDestinations, query, selectedCountry, selectedTheme, selectedSeason, selectedDuration]);

  useEffect(() => {
    onFilteredChange(filtered);
  }, [filtered, onFilteredChange]);

  const hasActiveFilters = Boolean(query || selectedCountry || selectedTheme || selectedSeason || selectedDuration);

  function resetAll() {
    setQuery('');
    setSelectedCountry(null);
    setSelectedTheme(null);
    setSelectedSeason(null);
    setSelectedDuration(null);
  }

  return (
    <div className="flex flex-col gap-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="여행지, 국가, 테마로 검색"
          className="h-14 w-full rounded-full border border-hairline bg-canvas px-lg text-body-md text-ink placeholder:text-muted-soft focus:border-ink focus:outline-none"
          aria-label="여행지 검색"
        />
      </div>

      <div className="flex flex-col gap-sm">
        <FilterChipGroup
          label="국가"
          options={countries}
          selected={selectedCountry}
          onSelect={setSelectedCountry}
        />
        <FilterChipGroup label="테마" options={themes} selected={selectedTheme} onSelect={setSelectedTheme} />
        <FilterChipGroup
          label="계절"
          options={[...SEASONS]}
          selected={selectedSeason}
          onSelect={(value) => setSelectedSeason(value as Season | null)}
        />
        <FilterChipGroup
          label="기간"
          options={[...DURATIONS]}
          selected={selectedDuration}
          onSelect={(value) => setSelectedDuration(value as Duration | null)}
        />
      </div>

      {hasActiveFilters ? (
        <button type="button" onClick={resetAll} className="self-start text-body-sm font-medium text-coral hover:text-coral-active">
          필터 전체 초기화
        </button>
      ) : null}
    </div>
  );
}

function FilterChipGroup({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}) {
  if (options.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-xs">
      <span className="text-caption text-muted mr-xs">{label}</span>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(selected === option ? null : option)}
          className={`chip ${selected === option ? 'selected' : ''}`}
          aria-pressed={selected === option}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
