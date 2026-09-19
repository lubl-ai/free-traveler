'use client';

import { useEffect, useState } from 'react';
import { createBrowserDbClient } from '@/lib/supabase/client';

/**
 * Admin: Report Status + Outbound URL Settings
 * REQ-FUNC-041,042,077
 *
 * Renders nothing at all for non-admin users (not just visually hidden) —
 * and even if it did render, API-REPORTS' PATCH and API-ADMIN-SETTINGS'
 * POST both re-verify `role = 'admin'` server-side, so a non-admin can't
 * act on this tab's requests either way.
 */

type ReportStatus = 'OPEN' | 'RESOLVED' | 'DISMISSED';

interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string | null;
  reported_mate_post_id: string | null;
  reason_code: string;
  description: string | null;
  status: ReportStatus;
  created_at: string;
}

export function AdminTab() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createBrowserDbClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          if (!cancelled) setIsAdmin(false);
          return;
        }
        const { data } = await supabase.from('user_profile').select('role').eq('id', user.id).single();
        if (!cancelled) setIsAdmin(data?.role === 'admin');
      } catch {
        if (!cancelled) setIsAdmin(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isAdmin === null) {
    return <div className="h-40 animate-pulse rounded-md bg-surface-soft" aria-hidden="true" />;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex flex-col gap-xl">
      <ReportManagement />
      <OutboundSettings />
    </div>
  );
}

function ReportManagement() {
  const [reports, setReports] = useState<Report[] | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | ReportStatus>('ALL');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/reports')
      .then((res) => {
        if (!res.ok) throw new Error('failed');
        return res.json();
      })
      .then((data: { reports: Report[] }) => setReports(data.reports))
      .catch(() => setError('신고 목록을 불러오지 못했습니다.'));
  }, []);

  async function updateStatus(id: string, status: ReportStatus) {
    const response = await fetch('/api/reports', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (response.ok && reports) {
      setReports(reports.map((r) => (r.id === id ? { ...r, status } : r)));
    }
  }

  const visible = reports?.filter((r) => statusFilter === 'ALL' || r.status === statusFilter) ?? [];

  return (
    <section>
      <h3 className="text-title-sm text-ink mb-md">신고 관리</h3>

      <div className="mb-md flex gap-xs">
        {(['ALL', 'OPEN', 'RESOLVED', 'DISMISSED'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            aria-pressed={statusFilter === s}
            className={`chip ${statusFilter === s ? 'selected' : ''}`}
          >
            {s === 'ALL' ? '전체' : s}
          </button>
        ))}
      </div>

      {error ? <p className="text-body-sm font-medium text-danger">{error}</p> : null}

      {!reports && !error ? (
        <div className="flex flex-col gap-sm" aria-hidden="true">
          {[0, 1].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-sm bg-surface-soft" />
          ))}
        </div>
      ) : null}

      {reports && visible.length === 0 ? <p className="text-body-sm text-muted">표시할 신고가 없습니다.</p> : null}

      <div className="flex flex-col gap-sm">
        {visible.map((report) => (
          <div key={report.id} className="rounded-sm border border-hairline p-sm">
            <div className="mb-xs flex items-center justify-between">
              <span className="text-body-sm font-semibold text-ink">{report.reason_code}</span>
              <span className="text-caption text-muted">{new Date(report.created_at).toLocaleString('ko-KR')}</span>
            </div>
            {report.description ? <p className="mb-sm text-body-sm text-body">{report.description}</p> : null}
            <div className="flex items-center gap-sm">
              <select
                value={report.status}
                onChange={(e) => updateStatus(report.id, e.target.value as ReportStatus)}
                className="h-9 rounded-sm border border-border-strong bg-canvas px-sm text-body-sm text-ink"
              >
                <option value="OPEN">OPEN</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="DISMISSED">DISMISSED</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function OutboundSettings() {
  const [flightUrl, setFlightUrl] = useState('');
  const [hotelUrl, setHotelUrl] = useState('');
  const [message, setMessage] = useState<{ key: string; text: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings/outbound?key=FLIGHT_OUTBOUND_URL')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { value: string } | null) => data && setFlightUrl(data.value));
    fetch('/api/admin/settings/outbound?key=HOTEL_OUTBOUND_URL')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { value: string } | null) => data && setHotelUrl(data.value));
  }, []);

  async function save(key: 'FLIGHT_OUTBOUND_URL' | 'HOTEL_OUTBOUND_URL', value: string) {
    if (!isHttpsUrl(value)) {
      setMessage({ key, text: 'https:// 로 시작하는 URL만 저장할 수 있습니다.', ok: false });
      return;
    }
    const response = await fetch('/api/admin/settings/outbound', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    setMessage(
      response.ok
        ? { key, text: '저장되었습니다.', ok: true }
        : { key, text: '저장에 실패했습니다.', ok: false }
    );
  }

  return (
    <section>
      <h3 className="text-title-sm text-ink mb-md">외부 URL 설정</h3>
      <div className="flex flex-col gap-md">
        <div className="flex flex-col gap-xs">
          <label className="flex flex-col gap-xs">
            <span className="text-body-sm font-medium text-ink">항공편 검색 사이트</span>
            <input
              type="url"
              value={flightUrl}
              onChange={(e) => setFlightUrl(e.target.value)}
              placeholder="https://..."
              className="h-14 rounded-sm border border-border-strong bg-canvas px-md text-body-md text-ink"
            />
          </label>
          <button
            type="button"
            onClick={() => save('FLIGHT_OUTBOUND_URL', flightUrl)}
            className="btn-primary self-start"
          >
            저장
          </button>
          {message?.key === 'FLIGHT_OUTBOUND_URL' ? (
            <p className={`text-body-sm font-medium ${message.ok ? 'text-success' : 'text-danger'}`}>
              {message.text}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-xs">
          <label className="flex flex-col gap-xs">
            <span className="text-body-sm font-medium text-ink">숙소 검색 사이트</span>
            <input
              type="url"
              value={hotelUrl}
              onChange={(e) => setHotelUrl(e.target.value)}
              placeholder="https://..."
              className="h-14 rounded-sm border border-border-strong bg-canvas px-md text-body-md text-ink"
            />
          </label>
          <button type="button" onClick={() => save('HOTEL_OUTBOUND_URL', hotelUrl)} className="btn-primary self-start">
            저장
          </button>
          {message?.key === 'HOTEL_OUTBOUND_URL' ? (
            <p className={`text-body-sm font-medium ${message.ok ? 'text-success' : 'text-danger'}`}>
              {message.text}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
