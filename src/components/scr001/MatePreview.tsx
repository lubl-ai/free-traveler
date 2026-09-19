import Link from 'next/link';
import { createServerDbClient } from '@/lib/db/client';

/**
 * Recent Mate Posts Preview
 * REQ-FUNC-030,033,037
 *
 * Server Component: reads directly via the DB-ACCESS server client (RLS
 * already allows public SELECT on mate_post — no auth required to browse).
 * Shows at most 3 OPEN posts whose end_date hasn't passed, most recent
 * first. Only non-sensitive mate_post columns are selected — no
 * applicant/contact data is joined in (that lives in mate_application,
 * never queried here).
 */

interface PreviewPost {
  id: string;
  title: string;
  country: string;
  region: string | null;
  start_date: string;
  end_date: string;
  max_participants: number;
  style: string | null;
}

async function getRecentOpenPosts(): Promise<PreviewPost[]> {
  // A public homepage section should never take down the whole page because
  // the backend is unreachable or unconfigured (e.g. Supabase env vars not
  // yet set — see docs/ARCHITECTURE.md §14 bootstrap blockers). Any failure
  // here — including createServerDbClient() throwing before a query is even
  // attempted — degrades to the empty state instead of throwing past this
  // Suspense boundary.
  try {
    const supabase = await createServerDbClient();
    const today = new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from('mate_post')
      .select('id, title, country, region, start_date, end_date, max_participants, style')
      .eq('status', 'OPEN')
      .gte('end_date', today)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error || !data) {
      return [];
    }

    return data as PreviewPost[];
  } catch {
    return [];
  }
}

function formatDateRange(start: string, end: string): string {
  const formatter = new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric' });
  return `${formatter.format(new Date(start))} - ${formatter.format(new Date(end))}`;
}

export async function MatePreview() {
  const posts = await getRecentOpenPosts();

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-md rounded-md border border-hairline bg-surface-soft px-lg py-xl text-center">
        <div>
          <p className="text-title-sm text-ink mb-xs">아직 모집 중인 동행글이 없어요</p>
          <p className="text-body-sm text-body">
            free_traveler에서는 같은 일정으로 여행하는 사람들과 동행 글을 통해 서로 만날 수 있어요. 국가, 기간, 조건을
            적어 글을 올리면 다른 여행자가 참가 요청을 보낼 수 있습니다.
          </p>
        </div>
        <Link href="/travel-tools" className="btn-primary">
          동행글 작성하기
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-md md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href="/mates" className="card block rounded-md p-md transition-shadow hover:shadow-floating">
            <p className="text-caption text-muted mb-xxs">
              {post.country}
              {post.region ? ` · ${post.region}` : ''}
            </p>
            <h3 className="text-title-sm text-ink mb-xs">{post.title}</h3>
            <p className="text-body-sm text-body mb-sm">{formatDateRange(post.start_date, post.end_date)}</p>
            <div className="flex items-center justify-between text-caption text-muted">
              <span>최대 {post.max_participants}명</span>
              {post.style ? <span>{post.style}</span> : null}
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-md text-center">
        <Link href="/mates" className="text-body-sm font-medium text-coral hover:text-coral-active">
          동행 더 보기 →
        </Link>
      </div>
    </div>
  );
}
