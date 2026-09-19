import Link from 'next/link';
import { representative } from '@/data/representative';
import { destinations } from '@/data/destinations';

/**
 * Visited Country Chips
 * REQ-FUNC-059
 *
 * Groups the representative's visited countries by real geographic region
 * (Asia / Europe / Africa / Oceania / Americas — the underlying data
 * genuinely spans 5 continents, not the 4 in the task doc's illustrative
 * example) into rounded-full chips, at least 30 countries total.
 * A chip links to the SCR-001 destination grid only when a matching
 * destination actually exists in DATA-DESTINATIONS ("가능한 경우") —
 * otherwise it renders as a plain, non-interactive chip.
 */

const REGION_MAP: Record<string, string[]> = {
  아시아: [
    '대한민국', '태국', '베트남', '캄보디아', '라오스', '미얀마',
    '일본', '중국', '인도', '네팔',
    '조지아', '우즈베키스탄', '카자흐스탄', '아제르바이잔', '터키',
  ],
  유럽: ['포르투갈', '스페인', '프랑스', '이탈리아', '그리스', '크로아티아', '폴란드'],
  아프리카: ['이집트', '모로코', '튀니지', '케냐', '탄자니아', '우간다', '남아프리카공화국'],
  오세아니아: ['뉴질랜드', '호주', '피지', '사모아', '통가', '솔로몬 제도'],
  아메리카: ['멕시코', '페루', '칠레', '브라질'],
};

const destinationCountries = new Set(destinations.map((d) => d.country));

export function CountryChips() {
  const totalCount = representative.visitedCountries.length;

  return (
    <div>
      <p className="mb-md text-body-sm text-muted">방문 국가 {totalCount}개국</p>
      <div className="flex flex-col gap-md">
        {Object.entries(REGION_MAP).map(([region, countries]) => {
          const visited = countries.filter((c) => representative.visitedCountries.includes(c));
          if (visited.length === 0) {
            return null;
          }
          return (
            <div key={region}>
              <p className="mb-xs text-caption font-semibold text-ink">{region}</p>
              <div className="flex flex-wrap gap-xs">
                {visited.map((country) =>
                  destinationCountries.has(country) ? (
                    <Link key={country} href="/" className="chip">
                      {country}
                    </Link>
                  ) : (
                    <span key={country} className="chip pointer-events-none">
                      {country}
                    </span>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
