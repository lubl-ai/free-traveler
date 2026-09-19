'use client';

import { useState } from 'react';
import { destinations, type Destination } from '@/data/destinations';
import { SearchFilterBar } from '@/components/scr001/SearchFilterBar';
import { DestinationCardGrid } from '@/components/scr001/DestinationCardGrid';
import { DestinationDrawer } from '@/components/scr001/DestinationDrawer';

/**
 * PAGE-SCR001 assembly glue
 *
 * SearchFilterBar, DestinationCardGrid and DestinationDrawer each hold their
 * own internal state but need to share filtered results + the selected
 * destination id at the page level. Server Components (page.tsx) can't hold
 * that reactive state themselves, and this coordination is specific to how
 * PAGE-SCR001 composes those three already-built components — not a new
 * screen feature — so it lives here as the minimal client-side wiring the
 * Page Owner needs, colocated with the other SCR-001 components.
 */
export function DestinationSection({ scope }: { scope: 'domestic' | 'international' }) {
  const scopeAll = destinations.filter((d) => (scope === 'domestic' ? d.type === 'domestic' : d.type === 'international'));
  const [filtered, setFiltered] = useState<Destination[]>(scopeAll);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      <SearchFilterBar scope={scope} onFilteredChange={setFiltered} />
      <DestinationCardGrid
        scope={scope}
        destinations={filtered}
        onResetFilters={() => setFiltered(scopeAll)}
        onCardClick={setSelectedId}
      />
      <DestinationDrawer destinationId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  );
}
