import { describe, expect, it } from 'vitest';
import { validateTravelDates } from '@/components/scr003/FlightForm';
import { validateHotelDates } from '@/components/scr003/HotelForm';

/**
 * UNIT-TRAVEL-DATES
 * REQ-FUNC-013,021 (past-date / reversed-date client-side blocking)
 *
 * Exercises the real exported functions from CMP-SCR003-FLIGHT/-HOTEL —
 * not a reimplementation — so this actually tests production logic.
 */

const TODAY = new Date('2026-06-15T00:00:00.000Z');
const YESTERDAY = '2026-06-14';
const TODAY_STR = '2026-06-15';
const TOMORROW = '2026-06-16';
const NEXT_WEEK = '2026-06-22';

describe('validateTravelDates (flight)', () => {
  it('rejects a departure date in the past', () => {
    const result = validateTravelDates(YESTERDAY, NEXT_WEEK, TODAY);
    expect(result.valid).toBe(false);
  });

  it('accepts a departure date of today', () => {
    const result = validateTravelDates(TODAY_STR, NEXT_WEEK, TODAY);
    expect(result.valid).toBe(true);
  });

  it('rejects a return date before the departure date (reversed)', () => {
    const result = validateTravelDates(NEXT_WEEK, TOMORROW, TODAY);
    expect(result.valid).toBe(false);
  });

  it('accepts a same-day round trip (return === departure)', () => {
    const result = validateTravelDates(TOMORROW, TOMORROW, TODAY);
    expect(result.valid).toBe(true);
  });

  it('accepts a normal future date range', () => {
    const result = validateTravelDates(TOMORROW, NEXT_WEEK, TODAY);
    expect(result.valid).toBe(true);
  });

  it('rejects when either date is missing', () => {
    expect(validateTravelDates('', NEXT_WEEK, TODAY).valid).toBe(false);
    expect(validateTravelDates(TOMORROW, '', TODAY).valid).toBe(false);
    expect(validateTravelDates('', '', TODAY).valid).toBe(false);
  });
});

describe('validateHotelDates (hotel)', () => {
  it('rejects a check-in date in the past', () => {
    const result = validateHotelDates(YESTERDAY, NEXT_WEEK, TODAY);
    expect(result.valid).toBe(false);
  });

  it('accepts a check-in date of today', () => {
    const result = validateHotelDates(TODAY_STR, TOMORROW, TODAY);
    expect(result.valid).toBe(true);
  });

  it('rejects check-out equal to check-in (hotel requires at least one night)', () => {
    const result = validateHotelDates(TOMORROW, TOMORROW, TODAY);
    expect(result.valid).toBe(false);
  });

  it('rejects check-out before check-in (reversed)', () => {
    const result = validateHotelDates(NEXT_WEEK, TOMORROW, TODAY);
    expect(result.valid).toBe(false);
  });

  it('accepts check-out strictly after check-in', () => {
    const result = validateHotelDates(TOMORROW, NEXT_WEEK, TODAY);
    expect(result.valid).toBe(true);
  });

  it('rejects when either date is missing', () => {
    expect(validateHotelDates('', NEXT_WEEK, TODAY).valid).toBe(false);
    expect(validateHotelDates(TOMORROW, '', TODAY).valid).toBe(false);
  });
});
