import { representative } from '@/data/representative';

/**
 * Travel Timeline
 * REQ-FUNC-060
 *
 * Vertical step list of year + place/event + one-line summary, at least 6
 * entries. Renders a visible warning (never a blank section) if the data
 * ever drops below 6.
 */

const MIN_TIMELINE_ENTRIES = 6;

export function Timeline() {
  const entries = representative.timeline;

  if (entries.length < MIN_TIMELINE_ENTRIES) {
    return (
      <p className="rounded-sm bg-warning/10 px-md py-sm text-body-sm font-medium text-warning">
        타임라인 항목이 {entries.length}개로 최소 기준({MIN_TIMELINE_ENTRIES}개)에 못 미칩니다. 데이터를 보완해야
        합니다.
      </p>
    );
  }

  return (
    <ol className="flex flex-col gap-lg">
      {entries.map((entry) => (
        <li key={entry.year} className="relative border-l-2 border-hairline pl-lg">
          <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-coral" aria-hidden="true" />
          <p className="text-caption font-semibold text-coral">{entry.year}</p>
          <h3 className="text-title-sm text-ink mb-xxs">{entry.title}</h3>
          <p className="text-body-sm text-body">{entry.description}</p>
        </li>
      ))}
    </ol>
  );
}
