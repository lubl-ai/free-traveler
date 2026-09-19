'use client';

import { useEffect, useState } from 'react';

/**
 * Report Dialog
 * REQ-FUNC-039
 *
 * Modal/Drawer, Esc-to-close. On submit, shows a receipt number + submitted
 * timestamp (POST /api/reports already responds well under 3s — no
 * artificial delay is added here). Reporter/reported detail visibility is
 * enforced entirely server-side by RLS (DB-RLS-BASE) — this component only
 * submits the report, it has no access to anyone else's report data.
 */

const REASON_CODES: { value: string; label: string }[] = [
  { value: 'INAPPROPRIATE_CONTENT', label: '부적절한 내용' },
  { value: 'SPAM', label: '스팸/광고' },
  { value: 'HARASSMENT', label: '괴롭힘/혐오 발언' },
  { value: 'FRAUD', label: '사기 의심' },
  { value: 'FAKE_PROFILE', label: '허위 프로필' },
  { value: 'OTHER', label: '기타' },
];

export interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reportedUserId?: string;
  reportedMatePostId?: string;
}

export function ReportDialog({ isOpen, onClose, reportedUserId, reportedMatePostId }: ReportDialogProps) {
  const [reasonCode, setReasonCode] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{ id: string; submittedAt: string } | null>(null);

  function handleClose() {
    // Reset here (an event handler), not in an effect watching `isOpen` —
    // this component stays mounted across open/close since the parent
    // conditionally renders its content, not the component instance itself.
    setReasonCode('');
    setDescription('');
    setError(null);
    setReceipt(null);
    onClose();
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason_code: reasonCode,
          description: description || undefined,
          reported_user_id: reportedUserId,
          reported_mate_post_id: reportedMatePostId,
        }),
      });

      if (!response.ok) {
        setError('신고 접수에 실패했습니다. 다시 시도해주세요.');
        return;
      }

      const data = (await response.json()) as { report_id: string; submitted_at: string };
      setReceipt({ id: data.report_id, submittedAt: data.submitted_at });
    } catch {
      setError('신고 접수에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div className="absolute inset-0 bg-[var(--shadow-scrim)]" onClick={handleClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="신고하기"
        className="relative z-10 max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-lg bg-canvas shadow-floating md:rounded-lg"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-hairline bg-canvas px-lg py-md">
          <h2 className="text-title-md text-ink">신고하기</h2>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-surface-soft"
            aria-label="닫기"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="px-lg py-md">
          {receipt ? (
            <div className="flex flex-col gap-sm text-center">
              <p className="text-title-sm text-ink">신고가 접수되었습니다</p>
              <p className="text-body-sm text-body">접수번호: {receipt.id}</p>
              <p className="text-body-sm text-body">
                접수 시각: {new Date(receipt.submittedAt).toLocaleString('ko-KR')}
              </p>
              <button type="button" onClick={handleClose} className="btn-primary mt-sm self-center">
                닫기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
              <label className="flex flex-col gap-xs">
                <span className="text-body-sm font-medium text-ink">신고 사유</span>
                <select
                  value={reasonCode}
                  onChange={(e) => setReasonCode(e.target.value)}
                  required
                  className="h-14 rounded-sm border border-border-strong bg-canvas px-md text-body-md text-ink"
                >
                  <option value="">사유 선택</option>
                  {REASON_CODES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-xs">
                <span className="text-body-sm font-medium text-ink">상세 설명 (선택)</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={1000}
                  rows={4}
                  className="rounded-sm border border-border-strong bg-canvas px-md py-sm text-body-md text-ink"
                />
              </label>

              {error ? <p className="text-body-sm font-medium text-danger">{error}</p> : null}

              <button type="submit" disabled={!reasonCode || isSubmitting} className="btn-primary self-start">
                신고 접수하기
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
