import { describe, expect, it } from 'vitest';
import { withComputedStatus } from '@/app/api/mates/route';
import { isValidApplicationTransition } from '@/app/api/mates/[id]/applications/route';

/**
 * UNIT-MATE-STATE
 * REQ-FUNC-035,036,037 (mate_post OPEN/CLOSED + mate_application
 * PENDING/ACCEPTED/REJECTED transition rules)
 *
 * Tests the real exported functions from API-MATE-POSTS /
 * API-MATE-APPLICATIONS — not reimplementations. Dates are computed
 * relative to the real current time (no Date mocking) so this test stays
 * valid regardless of when it's run.
 */

function daysFromToday(offset: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

const YESTERDAY = daysFromToday(-1);
const TODAY = daysFromToday(0);
const NEXT_WEEK = daysFromToday(7);

describe('withComputedStatus (mate_post OPEN -> CLOSED)', () => {
  it('keeps status OPEN when end_date is in the future', () => {
    const row = { status: 'OPEN', end_date: NEXT_WEEK };
    expect(withComputedStatus(row).status).toBe('OPEN');
  });

  it('computes CLOSED when end_date has already passed, without mutating the original object', () => {
    const row = { status: 'OPEN', end_date: YESTERDAY };
    const result = withComputedStatus(row);
    expect(result.status).toBe('CLOSED');
    expect(row.status).toBe('OPEN');
  });

  it('leaves an already-CLOSED row as CLOSED regardless of end_date', () => {
    const row = { status: 'CLOSED', end_date: NEXT_WEEK };
    expect(withComputedStatus(row).status).toBe('CLOSED');
  });

  it('treats end_date === today as still OPEN (not yet passed)', () => {
    const row = { status: 'OPEN', end_date: TODAY };
    expect(withComputedStatus(row).status).toBe('OPEN');
  });
});

describe('isValidApplicationTransition (mate_application state machine)', () => {
  it('allows PENDING -> ACCEPTED', () => {
    expect(isValidApplicationTransition('PENDING', 'ACCEPTED')).toBe(true);
  });

  it('allows PENDING -> REJECTED', () => {
    expect(isValidApplicationTransition('PENDING', 'REJECTED')).toBe(true);
  });

  it('rejects ACCEPTED -> REJECTED (terminal state cannot be re-decided)', () => {
    expect(isValidApplicationTransition('ACCEPTED', 'REJECTED')).toBe(false);
  });

  it('rejects REJECTED -> ACCEPTED (terminal state cannot be re-decided)', () => {
    expect(isValidApplicationTransition('REJECTED', 'ACCEPTED')).toBe(false);
  });

  it('rejects ACCEPTED -> ACCEPTED (no-op re-approval also blocked)', () => {
    expect(isValidApplicationTransition('ACCEPTED', 'ACCEPTED')).toBe(false);
  });
});
