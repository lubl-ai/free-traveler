'use client';

import { useState } from 'react';

/**
 * Block / Unblock Action
 * REQ-FUNC-040
 *
 * Calls API-USER-BLOCKS (/api/blocks). After blocking, mutual posts,
 * profile, and requests are hidden by server-side filtering (RLS +
 * query filters in the endpoints that list/read that data) — this
 * component only toggles the relationship, it does not itself filter
 * anything client-side.
 */

export interface BlockActionProps {
  targetUserId: string;
  initiallyBlocked?: boolean;
  onBlockedChange?: (blocked: boolean) => void;
}

export function BlockAction({ targetUserId, initiallyBlocked = false, onBlockedChange }: BlockActionProps) {
  const [isBlocked, setIsBlocked] = useState(initiallyBlocked);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    setError(null);
    setIsLoading(true);
    try {
      const response = isBlocked
        ? await fetch(`/api/blocks?blocked_id=${encodeURIComponent(targetUserId)}`, { method: 'DELETE' })
        : await fetch('/api/blocks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blocked_id: targetUserId }),
          });

      if (!response.ok && response.status !== 204) {
        setError(isBlocked ? '차단 해제에 실패했습니다.' : '차단에 실패했습니다.');
        return;
      }

      const nextBlocked = !isBlocked;
      setIsBlocked(nextBlocked);
      onBlockedChange?.(nextBlocked);
    } catch {
      setError('요청을 처리하지 못했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-start gap-xs">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        className={`inline-flex h-11 min-w-[88px] items-center justify-center rounded-sm px-md text-body-sm font-medium transition-colors ${
          isBlocked ? 'bg-surface-strong text-body hover:bg-surface-soft' : 'border border-danger text-danger hover:bg-danger/10'
        }`}
      >
        {isBlocked ? '차단 해제' : '차단하기'}
      </button>
      {error ? <p className="text-caption text-danger">{error}</p> : null}
    </div>
  );
}
