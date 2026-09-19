'use client';

import { useState } from 'react';
import { destinations, type Destination } from '@/data/destinations';
import { isFavorite, toggleFavorite } from '@/lib/favorites';

/**
 * Destination Card Grid
 * REQ-FUNC-001,004,005,007,009
 *
 * Renders a scope-filtered (domestic/international) grid of destination
 * cards, at least 6 per scope (guaranteed by DATA-DESTINATIONS' minimums).
 * Accepts an optional pre-filtered `destinations` list so a parent (e.g. the
 * Page Owner wiring in SearchFilterBar's results) can narrow what's shown
 * without this component needing to know about search/filter state itself.
 */

export interface DestinationCardGridProps {
  scope: 'domestic' | 'international';
  /** Pre-filtered subset to render. Defaults to every destination in `scope`. */
  destinations?: Destination[];
  /** Called when the caller's active filters should be cleared (e.g. from SearchFilterBar). */
  onResetFilters?: () => void;
  /** Called with a destination's id when its card is activated (e.g. to open DestinationDrawer). */
  onCardClick?: (destinationId: string) => void;
}

function FavoriteToggle({ destinationId }: { destinationId: string }) {
  const [favorited, setFavorited] = useState(() => isFavorite(destinationId));

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setFavorited(toggleFavorite(destinationId));
      }}
      className="absolute top-sm right-sm z-10 flex h-11 w-11 items-center justify-center rounded-full bg-canvas/90 shadow-floating transition-colors hover:bg-canvas"
      aria-pressed={favorited}
      aria-label={favorited ? '즐겨찾기 해제' : '즐겨찾기 추가'}
    >
      <svg
        className={favorited ? 'h-5 w-5 fill-coral stroke-coral' : 'h-5 w-5 fill-none stroke-ink'}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path d="M12 21s-7.5-4.9-10-9.3C.5 8.1 2.3 4.5 6 4c2-.3 3.7.8 6 3 2.3-2.2 4-3.3 6-3 3.7.5 5.5 4.1 4 7.7C19.5 16.1 12 21 12 21z" />
      </svg>
    </button>
  );
}

function DestinationCard({ destination, onClick }: { destination: Destination; onClick?: () => void }) {
  return (
    <div
      className={`card group relative overflow-hidden rounded-md${onClick ? ' cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <FavoriteToggle destinationId={destination.id} />
      <div className="aspect-[4/3] w-full bg-surface-strong" aria-hidden="true">
        {destination.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={destination.imageUrl}
            alt={destination.imageAlt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="p-md">
        <p className="text-caption text-muted mb-xxs">{destination.country}</p>
        <h3 className="text-title-sm text-ink mb-xxs">{destination.nameKo}</h3>
        <p className="text-body-sm text-body line-clamp-2">{destination.intro}</p>
        <div className="mt-sm flex flex-wrap gap-xs">
          {destination.themes.slice(0, 3).map((theme) => (
            <span key={theme} className="chip pointer-events-none">
              {theme}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DestinationCardGrid({ scope, destinations: providedDestinations, onResetFilters, onCardClick }: DestinationCardGridProps) {
  const scopeAll = destinations.filter((d) => (scope === 'domestic' ? d.type === 'domestic' : d.type === 'international'));
  const list = providedDestinations ?? scopeAll;

  if (list.length === 0) {
    const suggestions = scopeAll.slice(0, 6);
    return (
      <div className="flex flex-col items-center gap-lg py-xl text-center">
        <div>
          <p className="text-title-sm text-ink mb-xs">조건에 맞는 여행지를 찾지 못했습니다</p>
          <p className="text-body-sm text-body">검색어나 필터 조건을 완화해 다시 시도해보세요.</p>
        </div>
        {onResetFilters ? (
          <button type="button" onClick={onResetFilters} className="btn-secondary">
            필터 전체 초기화
          </button>
        ) : null}
        {suggestions.length > 0 ? (
          <div className="w-full mt-lg">
            <p className="text-body-sm font-medium text-ink mb-md text-left">이런 여행지는 어떠세요?</p>
            <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  onClick={onCardClick ? () => onCardClick(destination.id) : undefined}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
      {list.map((destination) => (
        <DestinationCard
          key={destination.id}
          destination={destination}
          onClick={onCardClick ? () => onCardClick(destination.id) : undefined}
        />
      ))}
    </div>
  );
}
