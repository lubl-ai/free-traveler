'use client';

import { useState } from 'react';
import { MateFilterBar, type MateFilters } from '@/components/scr004/MateFilterBar';
import { MatePostList } from '@/components/scr004/MatePostList';
import { MateDetailPanel } from '@/components/scr004/MateDetailPanel';
import { ApplicationForm } from '@/components/scr004/ApplicationForm';

/**
 * PAGE-SCR004 assembly glue
 *
 * MateFilterBar, MatePostList, and MateDetailPanel each hold their own
 * internal state but need to share filter criteria, the selected post id,
 * and the live result count at the page level — state a Server Component
 * (page.tsx) can't hold. Same pattern as HomeSections.tsx for SCR-001: this
 * is composition specific to how PAGE-SCR004 wires already-built components
 * together, not a new feature.
 */
export function MateSection() {
  const [filters, setFilters] = useState<MateFilters | undefined>(undefined);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [resultCount, setResultCount] = useState<number | null>(null);
  const [applyForPostId, setApplyForPostId] = useState<string | null>(null);

  function handleSelectPost(postId: string) {
    setSelectedPostId(postId);
    setApplyForPostId(null);
  }

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col gap-sm">
        <MateFilterBar onFilterChange={setFilters} />
        {resultCount !== null ? <p className="text-body-sm text-muted">총 {resultCount}건</p> : null}
      </div>

      <div className="grid grid-cols-1 gap-lg md:grid-cols-[40%_60%]">
        <MatePostList
          filters={filters}
          onResetFilters={() => setFilters(undefined)}
          onSelectPost={handleSelectPost}
          onResultCount={setResultCount}
        />

        <MateDetailPanel
          postId={selectedPostId}
          onClose={() => {
            setSelectedPostId(null);
            setApplyForPostId(null);
          }}
          onRequestApply={setApplyForPostId}
        />
      </div>

      {applyForPostId ? (
        <div id="mate-application-form" className="rounded-md border border-hairline p-lg">
          <h3 className="text-title-sm text-ink mb-md">참가 요청 보내기</h3>
          <ApplicationForm matePostId={applyForPostId} onSubmitted={() => setApplyForPostId(null)} />
        </div>
      ) : null}
    </div>
  );
}
