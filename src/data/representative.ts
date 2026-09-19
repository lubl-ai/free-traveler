/**
 * Representative data — TypeScript static module for free_traveler profile
 * REQ-FUNC-057,058,059,060,061,062,063
 *
 * Single source of truth for representative profile info across all screens
 */

export interface TimelineEntry {
  year: number;
  title: string;
  description: string;
}

export interface GalleryImage {
  url?: string; // optional — falls back to an empty placeholder box, same as Destination.imageUrl
  alt: string; // must describe the actual place, not generic text
  source: string;
}

export interface Representative {
  name: string;
  nameEn: string;
  tripCount: number; // 50+
  countryCount: number; // 30+
  intro: string;
  philosophy: string;
  timeline: TimelineEntry[]; // 6+
  visitedCountries: string[]; // 30+, country names
  profileImage: {
    url: string;
    alt: string;
    source: string;
  };
  gallery: GalleryImage[]; // 8+
  socialLinks: {
    instagram?: string;
    youtube?: string;
    blog?: string;
    email?: string;
  };
  recommendedDestinations: string[]; // 4-6 destination IDs from destinations.ts
}

export const representative: Representative = {
  name: 'free_traveler',
  nameEn: 'free_traveler',
  tripCount: 57,
  countryCount: 31,
  intro: 'free_traveler는 세계를 무대로 활동하는 여행 큐레이터이자 문화 탐험가입니다. 57번의 장기 여행, 31개 국가의 경험을 통해 "진정한 여행"의 의미를 찾고 공유하고 있습니다.',
  philosophy: '여행은 단순히 장소를 방문하는 것이 아닙니다. 그곳의 문화, 사람, 자연과 깊이 있는 관계를 맺고 나를 다시 발견하는 여정입니다. free_traveler는 이러한 철학 아래 각 목적지의 "그 이면의 이야기"를 한국의 여행자들에게 전달하고자 합니다.',
  timeline: [
    {
      year: 2010,
      title: '첫 배낭 여행 — 동남아시아',
      description: '무일푼에 가까운 상태로 태국, 베트남, 캄보디아를 거쳐 3개월간의 첫 장기 여행을 떠남. "여행은 거창한 준비 없이도 가능하다"는 깨달음을 얻음.'
    },
    {
      year: 2012,
      title: '유럽 횡단 프로젝트 시작',
      description: '포르투갈부터 폴란드까지 유럽 8개국을 6개월간 도보·기차·히치하이킹으로 횡단. 각 도시의 로컬 카페, 박물관, 골목을 통해 문화를 깊이 있게 탐방.'
    },
    {
      year: 2014,
      title: '아프리카 대륙 탐험',
      description: '사하라 사막, 나일강 유역, 케냐의 국립공원을 포함한 아프리카 동부·북부 6개국 순회. 생태계와 부족 문화의 다양성을 기록.'
    },
    {
      year: 2016,
      title: '중앙아시아 Silk Road 프로젝트',
      description: '터키, 조지아, 우즈베키스탄, 카자흐스탄의 Silk Road 일대를 3개월간 탐방. 고대 문명과 현대 실크로드의 만남을 기록.'
    },
    {
      year: 2018,
      title: '태평양 아일랜드 홉핑',
      description: '뉴질랜드, 피지, 사모아, 통가, 솔로몬 제도를 포함한 태평양 7개 섬나라 여행. 해양 생태계와 島 문화의 다양성을 기록.'
    },
    {
      year: 2020,
      title: 'free_traveler 커뮤니티 출범',
      description: '블로그, 유튜브, 인스타그램 채널을 통해 세계 각지의 여행 경험과 문화 이야기를 공유 시작. 5만 명 이상의 한국 여행자 커뮤니티 형성.'
    }
  ],
  visitedCountries: [
    '대한민국', '태국', '베트남', '캄보디아', '라오스', '미얀마',
    '포르투갈', '스페인', '프랑스', '이탈리아', '그리스', '터키', '크로아티아', '폴란드',
    '일본', '중국', '인도', '네팔',
    '이집트', '모로코', '튀니지', '케냐', '탄자니아', '우간다', '남아프리카공화국',
    '조지아', '우즈베키스탄', '카자흐스탄', '아제르바이잔',
    '뉴질랜드', '호주', '피지', '사모아', '통가', '솔로몬 제도',
    '멕시코', '페루', '칠레', '브라질'
  ],
  profileImage: {
    url: '/images/representative-profile.jpg',
    alt: 'free_traveler의 초상 — 세계 여행 큐레이터',
    source: '© free_traveler, 2026'
  },
  gallery: [
    { alt: '교토 후시미 이나리 신사의 붉은 도리이 게이트 터널', source: '© free_traveler, 2020' },
    { alt: '방콕 왓 아룬 사원의 일몰 전경', source: '© free_traveler, 2010' },
    { alt: '포르투갈 리스본 알파마 지구의 좁은 골목과 트램', source: '© free_traveler, 2012' },
    { alt: '이집트 기자 피라미드 앞에서 바라본 사막 지평선', source: '© free_traveler, 2014' },
    { alt: '조지아 카즈베기 게르게티 트리니티 교회와 설산', source: '© free_traveler, 2016' },
    { alt: '뉴질랜드 밀포드 사운드의 피오르 협곡', source: '© free_traveler, 2018' },
    { alt: '페루 마추픽추 잉카 유적 전경', source: '© free_traveler, 2009' },
    { alt: '남아프리카공화국 케이프타운 테이블마운틴에서 본 도시 전경', source: '© free_traveler, 2013' },
    { alt: '우즈베키스탄 사마르칸트 레기스탄 광장의 이슬람 건축물', source: '© free_traveler, 2016' },
    { alt: '호주 그레이트 오션 로드의 트웰브 어포슬 해안 절벽', source: '© free_traveler, 2018' },
  ],
  socialLinks: {
    instagram: 'https://instagram.com/freetraveler',
    youtube: 'https://youtube.com/@freetraveler',
    blog: 'https://blog.freetraveler.kr',
    email: 'hello@freetraveler.kr'
  },
  recommendedDestinations: [
    'dest-jp-001', // Kyoto
    'dest-th-001', // Bangkok
    'dest-pt-001', // Lisbon
    'dest-it-001'  // Rome
  ]
};

/**
 * 데이터 검증: 최소 요구사항 확인
 * REQ-FUNC-057~063 구현 — 타임라인·국가 수 확인
 */
export function validateRepresentative(): string[] {
  const errors: string[] = [];

  if (representative.tripCount < 50) {
    errors.push('Trip count < 50');
  }
  if (representative.countryCount < 30) {
    errors.push('Country count < 30');
  }
  if (!representative.timeline || representative.timeline.length < 6) {
    errors.push(`Timeline < 6 entries (currently ${representative.timeline?.length || 0})`);
  }
  if (!representative.visitedCountries || representative.visitedCountries.length < 30) {
    errors.push(`Visited countries < 30 (currently ${representative.visitedCountries?.length || 0})`);
  }
  if (!representative.name || !representative.intro || !representative.philosophy) {
    errors.push('Missing required basic fields (name, intro, philosophy)');
  }
  if (!representative.profileImage || !representative.profileImage.alt) {
    errors.push('Missing profile image or alt text');
  }
  if (!representative.recommendedDestinations || representative.recommendedDestinations.length < 4 || representative.recommendedDestinations.length > 6) {
    errors.push(`Recommended destinations not 4-6 (currently ${representative.recommendedDestinations?.length || 0})`);
  }
  if (!representative.gallery || representative.gallery.length < 8) {
    errors.push(`Gallery < 8 images (currently ${representative.gallery?.length || 0})`);
  }
  representative.gallery?.forEach((image, idx) => {
    if (!image.alt || !image.source) {
      errors.push(`Gallery image ${idx}: missing alt or source`);
    }
  });

  return errors;
}

/**
 * 대표 정보 통계
 * REQ-FUNC-060 실현 — "30+ Countries" 및 "50+ Trips" 보증
 */
export function getRepresentativeStats() {
  return {
    trips: representative.tripCount,
    countries: representative.countryCount,
    timeline_entries: representative.timeline.length,
    visited_countries_list: representative.visitedCountries.length,
    recommended_destinations: representative.recommendedDestinations.length,
    validation_errors: validateRepresentative(),
  };
}
