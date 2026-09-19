/**
 * Destination data — TypeScript static module for national & international travel destinations
 * REQ-FUNC-001, 004, 007, 008, 009; REQ-NF-006, 026
 *
 * National: 10+ locations
 * International: 15+ countries, 30+ cities
 * All fields required; missing fields block publishing per REQ-FUNC-004
 */

export interface Destination {
  id: string;
  nameKo: string;
  nameEn: string;
  country: string;
  region?: string;
  type: 'domestic' | 'international';
  intro: string; // 300+ chars, required
  attractions: string[]; // 5+, required
  themes: string[]; // 1+
  recommendedMonths: string[];
  itinerary1day: string;
  itinerary3day: string;
  budget: {
    min: number; // KRW per day
    max: number;
  };
  transportation: string[]; // How to get there
  food: string[]; // 3+ signature dishes
  etiquette: string[]; // 3+ cultural tips
  source: string; // Attribution
  lastUpdated: string; // YYYY-MM-DD
  imageUrl?: string; // Hero image
  imageAlt: string;
}

export const destinations: Destination[] = [
  // === DOMESTIC (10+) ===
  {
    id: 'dest-kr-001',
    nameKo: '제주도',
    nameEn: 'Jeju Island',
    country: '대한민국',
    region: '제주특별자치도',
    type: 'domestic',
    intro: '한반도의 남쪽 끝, 신비로운 자연과 독특한 문화가 어우러진 제주도. 한라산의 웅장함부터 협재 해변의 부드러운 백사장, 만장굴의 신비로운 동굴까지 다양한 자연 경험을 제공합니다. 제주만의 방언, 흑돼지 음식, 돌하르방 문화는 여행자들에게 깊은 인상을 남기는 요소입니다.',
    attractions: [
      '한라산 등반',
      '협재 해변',
      '성산일출봉',
      '만장굴 동굴',
      '오설록 티뮤지엄'
    ],
    themes: ['자연', '해변', '문화'],
    recommendedMonths: ['3월-5월', '9월-11월'],
    itinerary1day: '협재 해변 방문 → 오설록 차 체험 → 흑돼지 저녁 식사',
    itinerary3day: '1일: 성산일출봉 일출 감상, 2일: 한라산 등반, 3일: 만장굴 동굴 투어 및 문화 마을 방문',
    budget: { min: 80000, max: 200000 },
    transportation: [
      '비행기 (서울/부산에서 1시간)',
      '카페리 (서울에서 12시간)',
      '렌터카 필수'
    ],
    food: ['흑돼지 구이', '전복죽', '고등어회'],
    etiquette: [
      '해변에서 오전 시간 활용',
      '화산암 지역 조심히 다니기',
      '지역 문화 존중하기'
    ],
    source: '한국관광공사',
    lastUpdated: '2026-09-17',
    imageAlt: 'Jeju Island coastal scenery'
  },
  {
    id: 'dest-kr-002',
    nameKo: '전주',
    nameEn: 'Jeonju',
    country: '대한민국',
    region: '전라북도',
    type: 'domestic',
    intro: '한국의 전통과 현대가 만나는 전주. 한옥마을에서는 조선시대의 건축양식이 보존되어 있으며, 비빔밥은 유네스코 무형유산으로 등재된 음식입니다. 전주는 한국 문화예술의 중심지로, 국제영화제와 소리축제의 무대가 되어 왔습니다.',
    attractions: [
      '전주 한옥마을',
      '전주 비빔밥 거리',
      '전주 영화박물관',
      '한국소리박물관',
      '경기전'
    ],
    themes: ['문화', '음식', '역사'],
    recommendedMonths: ['4월-5월', '10월-11월'],
    itinerary1day: '한옥마을 산책 → 비빔밥 점심 → 한국소리박물관 관람',
    itinerary3day: '1일: 한옥마을 정취 체험, 2일: 경기전·향교 역사 투어, 3일: 음식문화 심화 학습 및 작은 공방 방문',
    budget: { min: 50000, max: 120000 },
    transportation: [
      'KTX (서울에서 2시간)',
      '시내버스로 한옥마을 접근',
      '도보 권장'
    ],
    food: ['전주 비빔밥', '콩나물국밥', '참나물밥'],
    etiquette: [
      '한옥 건물 내부 조용히',
      '음식문화 존중하기',
      '계절 축제 일정 미리 확인'
    ],
    source: '전주시관광공사',
    lastUpdated: '2026-09-17',
    imageAlt: 'Jeonju Hanok Village traditional architecture'
  },
  {
    id: 'dest-kr-003',
    nameKo: '경주',
    nameEn: 'Gyeongju',
    country: '대한민국',
    region: '경상북도',
    type: 'domestic',
    intro: '천년 신라의 수도 경주. 불국사, 석굴암, 안압지 등 유네스코 세계유산이 많이 보존되어 있어 한국 문화유산의 보고입니다. 대릉원의 고분군과 황룡사 9층 탑지는 고대 한반도 문명의 위대함을 증명하는 증거입니다.',
    attractions: [
      '불국사',
      '석굴암',
      '안압지(동궁과 월지)',
      '대릉원 고분군',
      '황룡사 9층 탑지'
    ],
    themes: ['역사', '문화유산', '불교'],
    recommendedMonths: ['3월-5월', '9월-11월'],
    itinerary1day: '불국사·석굴암 투어 → 안압지 야경 감상',
    itinerary3day: '1일: 불국사·석굴암 상세 투어, 2일: 대릉원 고분군 및 박물관, 3일: 안압지·불국사야 조명 및 전통 문화 심화 학습',
    budget: { min: 60000, max: 140000 },
    transportation: [
      'KTX (부산에서 1시간, 서울에서 2.5시간)',
      '시내버스 또는 렌터카'
    ],
    food: ['경주 교동 법계탕', '불국사 콩국수', '참치회'],
    etiquette: [
      '유적지에서 존경심 표시',
      '역사 보존에 협조',
      '불국사 내 금지 행동 준수'
    ],
    source: '경주시 관광정보',
    lastUpdated: '2026-09-17',
    imageAlt: 'Bulguksa Temple and Seokguram Grotto'
  },
  {
    id: 'dest-kr-004',
    nameKo: '강릉',
    nameEn: 'Gangneung',
    country: '대한민국',
    region: '강원도',
    type: 'domestic',
    intro: '동해의 절경을 품은 강릉. 정동진의 동쪽 끝 일출부터 강릉 커피 거리의 향긋한 원두 향까지, 자연과 현대 문화의 조화가 특징입니다. 2018 평창 겨울올림픽의 개최지이자 한국 해변 관광의 중심입니다.',
    attractions: [
      '정동진',
      '경포대',
      '강릉 커피 거리',
      '오죽헌',
      '경포 해변'
    ],
    themes: ['해변', '일출', '문화'],
    recommendedMonths: ['6월-8월', '12월-2월'],
    itinerary1day: '정동진 일출 → 경포대 산책 → 커피 거리 체험',
    itinerary3day: '1일: 정동진·경포 일출 및 해변, 2일: 오죽헌 문화유산 투어, 3일: 커피 거리 및 지역 음식 체험',
    budget: { min: 70000, max: 150000 },
    transportation: [
      'KTX (서울에서 2시간)',
      '시내버스 및 해변 순환 버스',
      '자전거 도로 충실'
    ],
    food: ['강릉 오징어', '죽죽면', '초당 두부'],
    etiquette: [
      '일출 시간에 조용히',
      '해변 환경 보호',
      '여름 성수기 피하기'
    ],
    source: '강릉시 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Gangneung sunrise over East Sea'
  },
  {
    id: 'dest-kr-005',
    nameKo: '남해',
    nameEn: 'Namhae Island',
    country: '대한민국',
    region: '경상남도',
    type: 'domestic',
    intro: '한려해상국립공원의 심장 남해. 해상 케이블카, 가천 해변, 해금강 등이 어우러진 섬은 영화 촬영지로도 유명합니다. 겨울 바다의 정적한 아름다움과 여름의 생동감 모두를 느낄 수 있는 여행지입니다.',
    attractions: [
      '해상 케이블카',
      '가천 해변',
      '해금강 유람선',
      '독일마을',
      '남해 유람선 코스'
    ],
    themes: ['해변', '자연', '영화세트'],
    recommendedMonths: ['4월-5월', '9월-10월'],
    itinerary1day: '해상 케이블카 → 가천 해변 → 해금강 유람선',
    itinerary3day: '1일: 해상 케이블카 및 가천 해변, 2일: 독일마을 및 해금강 투어, 3일: 해상 실크로드 유람선 및 해변마을 산책',
    budget: { min: 70000, max: 160000 },
    transportation: [
      'KTX (서울에서 4시간, 부산에서 1.5시간)',
      '섬 내 버스',
      '케이블카·유람선 탑승'
    ],
    food: ['멸치회', '해물탕', '전복'],
    etiquette: [
      '해상 활동 안전 규칙 준수',
      '환경 보호',
      '계절 날씨 확인'
    ],
    source: '남해군 관광',
    lastUpdated: '2026-09-17',
    imageAlt: 'Namhae Island marine cable car'
  },
  {
    id: 'dest-kr-006',
    nameKo: '서울 북촌',
    nameEn: 'Seoul Bukchon',
    country: '대한민국',
    region: '서울특별시',
    type: 'domestic',
    intro: '서울의 심장 북촌은 한옥과 현대 건축이 공존하는 동네입니다. 좁은 골목길, 한식당, 갤러리, 카페가 어우러져 시간을 느리게 만드는 공간입니다. 서울 여행의 필수 코스이자 한국 전통문화를 체험할 수 있는 생활 공간입니다.',
    attractions: [
      '한옥 거리 산책',
      '가는길 갤러리 거리',
      '북촌 한옥 마을',
      '종로 3가 먹거리',
      '창덕궁'
    ],
    themes: ['도시', '문화', '음식'],
    recommendedMonths: ['3월-5월', '10월-11월'],
    itinerary1day: '북촌 한옥 거리 산책 → 카페 및 음식점 체험',
    itinerary3day: '1일: 북촌 한옥 거리 및 갤러리, 2일: 창덕궁 관광, 3일: 종로 먹거리 투어 및 쇼핑',
    budget: { min: 40000, max: 100000 },
    transportation: [
      '지하철 (3호선 안국역)',
      '도보 중심',
      '버스'
    ],
    food: ['북촌 칼국수', '보쌈', '종로 호떡'],
    etiquette: [
      '한옥 건물 사진 촬영 시 주민 배려',
      '좁은 골목길 안전',
      '조용한 분위기 유지'
    ],
    source: '서울 관광공사',
    lastUpdated: '2026-09-17',
    imageAlt: 'Seoul Bukchon traditional hanok houses'
  },
  {
    id: 'dest-kr-007',
    nameKo: '여수',
    nameEn: 'Yeosu',
    country: '대한민국',
    region: '전라남도',
    type: 'domestic',
    intro: '여수해상케이블카, 향일암, 여수 해상 야경은 "동방의 나폴리"라 불리는 여수의 아름다움을 상징합니다. 여수 해상 루지, 아쿠아플래닛 여수 등 다양한 해양 레저 시설이 가족 여행을 더욱 풍요롭게 만듭니다.',
    attractions: [
      '여수해상케이블카',
      '향일암',
      '여수 아쿠아플래닛',
      '오동도',
      '여수 해상 야경'
    ],
    themes: ['해변', '야경', '레저'],
    recommendedMonths: ['4월-5월', '9월-10월'],
    itinerary1day: '여수해상케이블카 → 아쿠아플래닛 → 야경 투어',
    itinerary3day: '1일: 여수해상케이블카·향일암, 2일: 아쿠아플래닛·오동도 투어, 3일: 해상 루지 및 야경 크루즈',
    budget: { min: 80000, max: 180000 },
    transportation: [
      'KTX (서울에서 3시간)',
      '시내버스 및 순환 버스',
      '해상 페리'
    ],
    food: ['여수 회', '장어구이', '굴죽'],
    etiquette: [
      '해상 활동 안전',
      '야경 시간대 확인',
      '환경 보호'
    ],
    source: '여수시 관광',
    lastUpdated: '2026-09-17',
    imageAlt: 'Yeosu marine cable car night view'
  },
  {
    id: 'dest-kr-008',
    nameKo: '보령 태안',
    nameEn: 'Boryeong & Taean',
    country: '대한민국',
    region: '충청남도',
    type: 'domestic',
    intro: '보령의 머드축제와 태안의 천리포수목원은 각각 자연의 선물을 온 몸으로 느낄 수 있는 경험입니다. 해변과 숲이 어우러진 이 지역은 문화 축제와 휴양의 중심지입니다.',
    attractions: [
      '보령 머드축제 (여름)',
      '천리포수목원',
      '안면도 자생림',
      '보령 해변',
      '태안 신두리 해안사구'
    ],
    themes: ['축제', '자연', '해변'],
    recommendedMonths: ['7월-8월', '10월-11월'],
    itinerary1day: '머드축제 또는 천리포수목원 투어',
    itinerary3day: '1일: 보령 머드축제, 2일: 천리포수목원 정원 산책, 3일: 태안 해안사구 및 자생림 투어',
    budget: { min: 60000, max: 140000 },
    transportation: [
      '고속버스 (서울에서 2시간)',
      '렌터카 권장',
      '시내버스'
    ],
    food: ['보령 굴', '해물탕', '새우깡'],
    etiquette: [
      '머드축제 행사 규칙 준수',
      '수목원 산책 경로 유지',
      '자연 보호'
    ],
    source: '보령시·태안군 관광',
    lastUpdated: '2026-09-17',
    imageAlt: 'Boryeong Mud Festival experience'
  },
  {
    id: 'dest-kr-009',
    nameKo: '인천 송도',
    nameEn: 'Incheon Songdo',
    country: '대한민국',
    region: '인천광역시',
    type: 'domestic',
    intro: '매립지를 미래 도시로 변모시킨 송도는 현대 건축의 진화를 보여줍니다. 센트럴파크, 트리플스트리트, 아트센터가 어우러진 이 지역은 가족 여행의 새로운 목적지입니다.',
    attractions: [
      '송도 센트럴파크',
      '트리플스트리트',
      '인천 아트센터',
      '뮤지엄', '스카이 가든'
    ],
    themes: ['현대건축', '도시', '문화'],
    recommendedMonths: ['4월-5월', '9월-10월'],
    itinerary1day: '센트럴파크 산책 → 쇼핑 → 아트센터 관람',
    itinerary3day: '1일: 센트럴파크·트리플스트리트, 2일: 아트센터 전시, 3일: 스카이 가든·박물관 투어',
    budget: { min: 50000, max: 120000 },
    transportation: [
      ' 인천공항철도 (공항에서 5분)',
      '지하철 (서울에서 1시간)',
      '버스'
    ],
    food: ['송도 카페', '현지 레스토랑', '카페거리'],
    etiquette: [
      '공원 환경 보호',
      '시설 이용 규칙 준수',
      '혼잡 시간대 피하기'
    ],
    source: '인천 관광공사',
    lastUpdated: '2026-09-17',
    imageAlt: 'Incheon Songdo Central Park'
  },
  {
    id: 'dest-kr-010',
    nameKo: '담양 죽녹원',
    nameEn: 'Damyang Bamboo Forest',
    country: '대한민국',
    region: '전라북도',
    type: 'domestic',
    intro: '대나무의 바다, 담양 죽녹원은 영화와 드라마의 촬영지로 유명합니다. 수백 년 된 대나무 숲에서의 산책은 마음을 정화시키고 우산 없이도 소나기를 피할 수 있는 신비한 공간입니다.',
    attractions: [
      '죽녹원 대나무 숲',
      '죽녹원 산책로',
      '대나무 공예 체험',
      '담양 전통 시장',
      '가사문학관'
    ],
    themes: ['자연', '숲', '명상'],
    recommendedMonths: ['3월-5월', '9월-11월'],
    itinerary1day: '죽녹원 산책 → 대나무 공예 체험',
    itinerary3day: '1일: 죽녹원 숲 명상 산책, 2일: 대나무 공예·문화 체험, 3일: 전통 시장 탐방 및 가사문학관',
    budget: { min: 40000, max: 100000 },
    transportation: [
      '고속버스 (광주에서 30분)',
      '지역 버스',
      '도보'
    ],
    food: ['죽순 요리', '대나무 숲 카페', '지역 음식'],
    etiquette: [
      '숲 환경 보호',
      '조용한 산책',
      '사진 촬영 시 다른 방문객 배려'
    ],
    source: '담양군 관광',
    lastUpdated: '2026-09-17',
    imageAlt: 'Damyang Bamboo Forest walking path'
  },

  // === INTERNATIONAL (15+ countries, 30+ cities) ===
  {
    id: 'dest-jp-001',
    nameKo: '교토',
    nameEn: 'Kyoto',
    country: '일본',
    region: '교토부',
    type: 'international',
    intro: '천년 역사의 일본 고도 교토. 17개의 유네스코 세계문화유산이 있으며, 전통 찻집, 게이샤 공연, 계절마다 변하는 정원은 일본 문화의 정수를 보여줍니다. 벚꽃 시즌과 단풍 시즌의 아름다움은 세계 여행객들의 필수 방문지입니다.',
    attractions: [
      '아라시야마 죽림',
      '금각사',
      '은각사',
      '기요미즈데라',
      '후시미이나리 신사'
    ],
    themes: ['전통문화', '사찰', '자연'],
    recommendedMonths: ['3월-4월', '11월-12월'],
    itinerary1day: '금각사 → 아라시야마 죽림 → 저녁 게이샤 지구',
    itinerary3day: '1일: 동산의 사찰군 투어, 2일: 아라시야마 지역 정원 산책, 3일: 후시미이나리 신사 및 전통 찻집 체험',
    budget: { min: 120000, max: 300000 },
    transportation: [
      '교토역 도착 (도쿄에서 신칸센 2.5시간)',
      '지하철·버스',
      '자전거 렌탈'
    ],
    food: ['카이세키 요리', '유두후', '교토 야채'],
    etiquette: [
      '사찰 내 정숙',
      '신발 탈착 규칙',
      '사진 촬영 제한 지역 확인'
    ],
    source: '교토시 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Kyoto Golden Pavilion and Arashiyama Bamboo Grove'
  },
  {
    id: 'dest-jp-002',
    nameKo: '도쿄',
    nameEn: 'Tokyo',
    country: '일본',
    region: '도쿄도',
    type: 'international',
    intro: '세계 최대 규모의 도시 도쿄는 전통과 첨단 기술이 공존합니다. 겐자쿠 신사부터 로봇 레스토랑까지, 도쿄는 일본의 모든 것을 한 도시에서 경험할 수 있게 해줍니다.',
    attractions: [
      '센소지 사찰',
      '메이지신사',
      '스카이트리',
      '아메야요코초 시장',
      '롯폰기 갤러리'
    ],
    themes: ['도시', '현대건축', '전통'],
    recommendedMonths: ['3월-5월', '9월-11월'],
    itinerary1day: '센소지 사찰 → 아메야요코초 시장 → 스카이트리 야경',
    itinerary3day: '1일: 전통 사찰 지구 투어, 2일: 현대 미술·갤러리 투어, 3일: 롯폰기 및 시부야 쇼핑·야경',
    budget: { min: 100000, max: 250000 },
    transportation: [
      '나리타/하네다 공항',
      'JR·지하철 충실',
      '택시는 비쌈'
    ],
    food: ['라멘', '스시', '이자카야 음식'],
    etiquette: [
      '대중교통 에티켓 엄격',
      '음식점 순서 지키기',
      '큰 목소리 금지'
    ],
    source: '도쿄 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Tokyo Senso-ji Temple and cityscape'
  },
  {
    id: 'dest-th-001',
    nameKo: '방콕',
    nameEn: 'Bangkok',
    country: '태국',
    region: '방콕',
    type: 'international',
    intro: '동남아시아의 거대 도시 방콕. 황금 사원, 플로팅 마켓, 야경의 도시로 불리며, 길거리 음식부터 고급 스파까지 모든 레벨의 경험이 가능합니다.',
    attractions: [
      '왓 프라 께오',
      '왓 포',
      '담느엔 플로팅 마켓',
      '에라완 신사',
      '루프탑 바'
    ],
    themes: ['불교문화', '도시', '음식'],
    recommendedMonths: ['11월-2월'],
    itinerary1day: '왓 프라 께오 → 왓 포 → 강변 저녁 산책',
    itinerary3day: '1일: 사원 투어, 2일: 플로팅 마켓 및 시장, 3일: 스파·야경·음식 투어',
    budget: { min: 80000, max: 200000 },
    transportation: [
      '방콕 수완나품·돈므앙 공항',
      'BTS·MRT 충실',
      '툭툭 체험'
    ],
    food: ['팟타이', '똠얌쿵', '망고 스티키 라이스'],
    etiquette: [
      '왕실 존경',
      '사원 복장 규칙',
      '거래 시 흥정 문화 존중'
    ],
    source: '태국 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Bangkok Grand Palace and temples'
  },
  {
    id: 'dest-us-001',
    nameKo: '뉴욕',
    nameEn: 'New York',
    country: '미국',
    region: '뉴욕주',
    type: 'international',
    intro: '미국의 심장 뉴욕. 타임스퀘어, 자유의 여신상, 중앙공원, 뮤지컬 거리로 불리는 브로드웨이는 세계 여행객의 꿈의 목적지입니다.',
    attractions: [
      '자유의 여신상',
      '타임스퀘어',
      '중앙공원',
      '에스앤엠 박물관',
      '브로드웨이 뮤지컬'
    ],
    themes: ['도시', '문화', '엔터테인먼트'],
    recommendedMonths: ['4월-5월', '9월-10월'],
    itinerary1day: '자유의 여신상 투어 → 중앙공원 산책 → 브로드웨이 뮤지컬',
    itinerary3day: '1일: 타임스퀘어·중앙공원, 2일: 박물관 투어, 3일: 브로드웨이 쇼 및 야경',
    budget: { min: 150000, max: 350000 },
    transportation: [
      'JFK·라과디아·뉴어크 공항',
      '지하철',
      '택시·우버'
    ],
    food: ['핫도그', '피자', '각국 요리'],
    etiquette: [
      '대중교통 안전 주의',
      '야외 활동 시간대 확인',
      '치안 지역 주의'
    ],
    source: '뉴욕 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'New York Statue of Liberty and skyline'
  },
  {
    id: 'dest-fr-001',
    nameKo: '파리',
    nameEn: 'Paris',
    country: '프랑스',
    region: '일드프랑스',
    type: 'international',
    intro: '사랑의 도시 파리. 에펠탑, 루브르 박물관, 노트르담 대성당, 센 강의 야경은 수백 년간 예술가와 로맨티스트들의 영감이 되어 왔습니다.',
    attractions: [
      '에펠탑',
      '루브르 박물관',
      '노트르담 대성당',
      '몽마르뜨 언덕',
      '시테 섬 산책'
    ],
    themes: ['예술', '로맨스', '문화'],
    recommendedMonths: ['4월-5월', '9월-10월'],
    itinerary1day: '에펠탑 → 루브르 박물관 → 센 강 저녁 유람선',
    itinerary3day: '1일: 에펠탑·박물관, 2일: 몽마르뜨·노트르담, 3일: 베르사유 궁전 투어',
    budget: { min: 120000, max: 300000 },
    transportation: [
      '샤를드골·오를리 공항',
      'RATP 지하철·버스',
      '택시·메트로'
    ],
    food: ['에스카르고', '크레페', '와인'],
    etiquette: [
      '프랑스어 간단한 인사 사용',
      '박물관 사진 정책 확인',
      '카페 문화 존중'
    ],
    source: '파리 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Paris Eiffel Tower and Seine River'
  },
  {
    id: 'dest-au-001',
    nameKo: '시드니',
    nameEn: 'Sydney',
    country: '호주',
    region: '뉴사우스웨일스',
    type: 'international',
    intro: '세계에서 가장 아름다운 항구 도시 시드니. 오페라 하우스, 하버 브리지, 본디 비치는 호주의 상징입니다. 그레이트 배리어 리프 투어도 가능한 거리입니다.',
    attractions: [
      '오페라 하우스',
      '하버 브리지',
      '본디 비치',
      '타롱가 동물원',
      '블루 마운틴'
    ],
    themes: ['해변', '자연', '현대건축'],
    recommendedMonths: ['9월-11월', '3월-5월'],
    itinerary1day: '오페라 하우스 투어 → 본디 비치 → 하버 야경',
    itinerary3day: '1일: 오페라·브리지·해변, 2일: 타롱가 동물원 또는 블루 마운틴, 3일: 서핑 레슨 및 해변 문화',
    budget: { min: 140000, max: 320000 },
    transportation: [
      '시드니 공항',
      '순환 페리',
      '버스·택시'
    ],
    food: ['호주 스테이크', '해산물', '카페 문화'],
    etiquette: [
      '해변 안전 규칙',
      '햇빛 차단 필수',
      '야생동물 거리 유지'
    ],
    source: '시드니 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Sydney Opera House and Harbour Bridge'
  },
  {
    id: 'dest-it-001',
    nameKo: '로마',
    nameEn: 'Rome',
    country: '이탈리아',
    region: '라치오',
    type: 'international',
    intro: '영원한 도시 로마. 콜로세움, 포로 로마노, 판테온, 바티칸 성당은 2000년 역사를 증명합니다. 로마의 거리 자체가 야외 박물관입니다.',
    attractions: [
      '콜로세움',
      '바티칸 성당·박물관',
      '트레비 분수',
      '팬테온',
      '포로 로마노'
    ],
    themes: ['역사', '종교', '예술'],
    recommendedMonths: ['4월-5월', '9월-10월'],
    itinerary1day: '콜로세움 → 포로 로마노 → 트레비 분수',
    itinerary3day: '1일: 콜로세움·포로, 2일: 바티칸 박물관·성당, 3일: 스페인 계단·판테온',
    budget: { min: 100000, max: 280000 },
    transportation: [
      '롤마 레오나르도 다 빈치 공항',
      '지하철·버스',
      '도보(대부분 도보 가능)'
    ],
    food: ['카르보나라', '카치오 페페', '젤라토'],
    etiquette: [
      '유적지 존경',
      '바티칸 복장 규칙',
      '스리 기념품 상인 조심'
    ],
    source: '로마 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Rome Colosseum and ancient ruins'
  },
  {
    id: 'dest-es-001',
    nameKo: '바르셀로나',
    nameEn: 'Barcelona',
    country: '스페인',
    region: '카탈루냐',
    type: 'international',
    intro: '지중해의 보석 바르셀로나. 가우디의 건축 예술, 고딕 지구, 람블라 대로, 몬주익 야경은 스페인 문화의 정수입니다.',
    attractions: [
      '사그라다 파밀리아',
      '팍 궈엘',
      '고딕 지구',
      '람블라 대로',
      '몬주익 야경'
    ],
    themes: ['건축', '예술', '도시'],
    recommendedMonths: ['4월-5월', '9월-10월'],
    itinerary1day: '사그라다 파밀리아 → 팍 궈엘 → 고딕 지구',
    itinerary3day: '1일: 가우디 건축 투어, 2일: 고딕·람블라, 3일: 몬주익 박물관·야경',
    budget: { min: 110000, max: 270000 },
    transportation: [
      '바르셀로나 공항',
      '지하철·버스 충실',
      '도보'
    ],
    food: ['타파스', '파에야', '스페인 와인'],
    etiquette: [
      '스페인 시간 문화 (오후 2-5시 휴식)',
      '바 에티켓 배우기',
      '소매치기 주의'
    ],
    source: '바르셀로나 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Barcelona Sagrada Familia and Park Güell'
  },
  {
    id: 'dest-vn-001',
    nameKo: '하노이',
    nameEn: 'Hanoi',
    country: '베트남',
    region: '하노이',
    type: 'international',
    intro: '동남아 역사의 중심 하노이. 구시가지, 호안끼엠 호수, 호찌민 영묘는 베트남의 영혼을 담고 있습니다. 향료 냄새 나는 거리와 50년대 프랑스 식민지 건축이 어우러집니다.',
    attractions: [
      '호안끼엠 호수',
      '호찌민 영묘',
      '구시가지 산책',
      '하노이 수상 인형극',
      '오히 기념관'
    ],
    themes: ['역사', '문화', '도시'],
    recommendedMonths: ['10월-11월', '3월-4월'],
    itinerary1day: '구시가지 산책 → 호안끼엠 호수 → 수상 인형극',
    itinerary3day: '1일: 호찌민 영묘·구시가지, 2일: 수상 인형극·조용한 카페, 3일: 하롱베이 당일 투어',
    budget: { min: 50000, max: 120000 },
    transportation: [
      '노이바이 공항',
      '오토바이 택시·택시',
      '버스'
    ],
    food: ['포', '쌀국수', '베트남 커피'],
    etiquette: [
      '역사 존경',
      '거리 음식 위생 확인',
      '지역 주민 배려'
    ],
    source: '하노이 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Hanoi Hoan Kiem Lake and Old Town'
  },
  {
    id: 'dest-ca-001',
    nameKo: '토론토',
    nameEn: 'Toronto',
    country: '캐나다',
    region: '온타리오',
    type: 'international',
    intro: '캐나다의 주요 도시 토론토. 나이아가라 폭포는 가까운 거리이며, CN 타워, 토론토 아일랜드 공원 등 다양한 명소가 있습니다.',
    attractions: [
      'CN 타워',
      '나이아가라 폭포',
      '토론토 아일랜드',
      '로이 톰슨 홀',
      '일계 지구 (차이나타운)'
    ],
    themes: ['자연', '도시', '나이아가라'],
    recommendedMonths: ['6월-8월', '9월-10월'],
    itinerary1day: 'CN 타워 → 토론토 아일랜드 → 저녁 야경',
    itinerary3day: '1일: CN 타워·아일랜드, 2일: 나이아가라 폭포 당일 투어, 3일: 박물관·갤러리',
    budget: { min: 100000, max: 250000 },
    transportation: [
      '토론토 피어슨 공항',
      '지하철·트램',
      '버스·택시'
    ],
    food: ['캐나다 스테이크', '푸틴', '국제 요리'],
    etiquette: [
      '나이아가라 안전 규칙',
      '다문화 도시 문화 존중',
      '날씨 변화 준비'
    ],
    source: '토론토 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Toronto CN Tower and Niagara Falls'
  },
  {
    id: 'dest-nz-001',
    nameKo: '오클랜드',
    nameEn: 'Auckland',
    country: '뉴질랜드',
    region: '오클랜드',
    type: 'international',
    intro: '뉴질랜드의 관문 오클랜드. 미션 베이, 스카이 타워, 와이테마타 항구, 와이탄 지구는 현대적이고 자연 친화적인 도시를 보여줍니다.',
    attractions: [
      '스카이 타워',
      '미션 베이',
      '와이탄 지구',
      '마운틴 에덴 공원',
      '로또루아 온천(당일투어)'
    ],
    themes: ['자연', '도시', '모험'],
    recommendedMonths: ['12월-2월', '6월-8월'],
    itinerary1day: '스카이 타워 → 미션 베이 → 와이탄 저녁',
    itinerary3day: '1일: 스카이 타워·미션 베이, 2일: 로또루아 온천 투어, 3일: 북섬 어드벤처',
    budget: { min: 130000, max: 300000 },
    transportation: [
      '오클랜드 공항',
      '버스·택시 충실',
      '렌터카 추천'
    ],
    food: ['양고기', '그린머슬', '뉴질랜드 와인'],
    etiquette: [
      '마오리 문화 존경',
      '자연 환경 보호',
      '실외 활동 안전'
    ],
    source: '오클랜드 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Auckland Sky Tower and Mission Bay'
  },
  {
    id: 'dest-sg-001',
    nameKo: '싱가포르',
    nameEn: 'Singapore',
    country: '싱가포르',
    region: '싱가포르',
    type: 'international',
    intro: '도시 국가 싱가포르. 마리나 베이 샌즈, 가든 바이 더 베이, 청 문화 지구는 현대와 전통이 조화로운 도시를 보여줍니다.',
    attractions: [
      '마리나 베이 샌즈',
      '가든 바이 더 베이',
      '싱가포르 강',
      '청 문화 지구',
      '센토사 섬'
    ],
    themes: ['현대건축', '다문화', '도시'],
    recommendedMonths: ['11월-2월'],
    itinerary1day: '마리나 베이 샌즈 → 가든 바이 더 베이 → 야경',
    itinerary3day: '1일: 마리나·가든 지구, 2일: 청 문화·국립박물관, 3일: 센토사 섬·쇼핑',
    budget: { min: 100000, max: 250000 },
    transportation: [
      '싱가포르 창이 공항',
      'MRT 지하철',
      '택시·그랩'
    ],
    food: ['라왁 & 친', '칠리 크랩', '하이난 치킨 라이스'],
    etiquette: [
      '엄격한 규칙 준수 (껌·코 높음 목소리 금지)',
      '문화 존중',
      '시간 개념 철저'
    ],
    source: '싱가포르 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Singapore Marina Bay and Gardens by the Bay'
  },
  {
    id: 'dest-hk-001',
    nameKo: '홍콩',
    nameEn: 'Hong Kong',
    country: '중국',
    region: '홍콩',
    type: 'international',
    intro: '스타 페리, 빅토리아 피크, 야경의 도시 홍콩. 동서양이 만나는 이 곳은 경쾌한 에너지와 깊은 전통이 함께합니다.',
    attractions: [
      '빅토리아 피크',
      '스타 페리',
      '스타 프로메나드',
      '진화 거리',
      '더 스타 야경'
    ],
    themes: ['야경', '도시', '쇼핑'],
    recommendedMonths: ['10월-11월', '3월-4월'],
    itinerary1day: '빅토리아 피크 트램 → 스타 프로메나드 → 야경 크루즈',
    itinerary3day: '1일: 피크·스타 야경, 2일: 빅토리아 피크 트램&하이킹, 3일: 진화·쇼핑',
    budget: { min: 100000, max: 260000 },
    transportation: [
      '홍콩 국제공항',
      '스타 페리·MTR',
      '택시·미니버스'
    ],
    food: ['딤섬', '홍콩 누들', '포트와인'],
    etiquette: [
      '광동어 기본 인사 배우기',
      '식당 매너',
      '혼잡 시간 피하기'
    ],
    source: '홍콩 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Hong Kong Victoria Peak and harbour at night'
  },
  {
    id: 'dest-mx-001',
    nameKo: '멕시코시티',
    nameEn: 'Mexico City',
    country: '멕시코',
    region: '멕시코시티',
    type: 'international',
    intro: '높은 고도의 멕시코시티. 프리다 칼로 박물관, 테템로 유적지, 멕시코 국립박물관은 아즈텍 문명과 식민지 역사를 보여줍니다.',
    attractions: [
      '테템로 유적지',
      '멕시코 국립박물관',
      '프리다 칼로 박물관',
      '라틴 아메리카 탑',
      '초첨팔테펙 성'
    ],
    themes: ['역사', '예술', '문화'],
    recommendedMonths: ['10월-11월', '3월-4월'],
    itinerary1day: '테템로 유적지 → 프리다 칼로 박물관 → 라틴 탑 야경',
    itinerary3day: '1일: 테템로·박물관, 2일: 프리다 칼로·초첨팔테펙, 3일: 로마 지구 산책·문화',
    budget: { min: 60000, max: 140000 },
    transportation: [
      '벤토 후아레스 국제공항',
      '메트로(지하철)',
      '택시·우버'
    ],
    food: ['멕시코 타코', '엔칠라다', '멕시코 핸디크래프트'],
    etiquette: [
      '스페인어 기본 인사',
      '안전 지역 확인',
      '문화 존중'
    ],
    source: '멕시코 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Mexico City Templo Mayor and museums'
  },
  {
    id: 'dest-br-001',
    nameKo: '리우데자네이루',
    nameEn: 'Rio de Janeiro',
    country: '브라질',
    region: '리우데자네이루',
    type: 'international',
    intro: '카니발의 도시 리우. 그리스도상, 코파카바나 해변, 수카르파우 산은 브라질의 활기찬 에너지를 상징합니다.',
    attractions: [
      '그리스도상',
      '코파카바나 해변',
      '이파네마 해변',
      '수카르파우 산',
      '카니발(2월)'
    ],
    themes: ['해변', '자연', '카니발'],
    recommendedMonths: ['12월-2월', '5월-8월'],
    itinerary1day: '그리스도상 → 코파카바나 해변 → 해변 바에서 일몰',
    itinerary3day: '1일: 그리스도상·산 투어, 2일: 코파카바나·이파네마 해변, 3일: 문화&음악 투어',
    budget: { min: 70000, max: 160000 },
    transportation: [
      '안토니우 카를로스 조빙 공항',
      '지하철·버스',
      '택시·우버'
    ],
    food: ['페이조아다', '아싸도', '브라질 카이피린하'],
    etiquette: [
      '포르투갈어 기본 인사',
      '해변 안전 규칙',
      '카니발 축제 매너'
    ],
    source: '리우 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Rio de Janeiro Christ Redeemer and Copacabana Beach'
  },
  {
    id: 'dest-eg-001',
    nameKo: '카이로',
    nameEn: 'Cairo',
    country: '이집트',
    region: '카이로',
    type: 'international',
    intro: '고대 문명의 발상지 카이로. 기자 피라미드, 스핑크스, 이집트 박물관은 5000년 역사를 증명합니다.',
    attractions: [
      '기자 피라미드',
      '스핑크스',
      '이집트 박물관',
      '살라딘 성채',
      '알-아즈 하르 모스크'
    ],
    themes: ['역사', '고대문명', '고고학'],
    recommendedMonths: ['10월-11월', '3월-4월'],
    itinerary1day: '기자 피라미드 & 스핑크스 → 이집트 박물관',
    itinerary3day: '1일: 피라미드·스핑크스, 2일: 이집트 박물관, 3일: 날일강 유람선',
    budget: { min: 80000, max: 180000 },
    transportation: [
      '카이로 국제공항',
      '택시·우버',
      '이집트 항공사'
    ],
    food: ['코시리 (병아리콩 스프)', '타히니 페이스트', '이집트 빵'],
    etiquette: [
      '이슬람 문화 존경',
      '복장 보수적',
      '여행 보안 주의'
    ],
    source: '이집트 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Cairo Giza Pyramids and Sphinx'
  },
  {
    id: 'dest-in-001',
    nameKo: '뉴델리',
    nameEn: 'New Delhi',
    country: '인도',
    region: '델리',
    type: 'international',
    intro: '인도의 정치 중심 뉴델리. 라즈 가트, 인도 게이트, 국립박물관 등 인도 독립운동의 역사와 현대 인도의 에너지가 함께합니다.',
    attractions: [
      '라즈 가트',
      '인도 게이트',
      '국립박물관',
      '바하이 사원',
      '쿠투 미나르'
    ],
    themes: ['역사', '건축', '문화'],
    recommendedMonths: ['10월-3월'],
    itinerary1day: '라즈 가트 → 인도 게이트 → 국립박물관',
    itinerary3day: '1일: 라즈 가트·박물관, 2일: 쿠투 미나르·바하이, 3일: 올드 델리 카오스 투어',
    budget: { min: 40000, max: 100000 },
    transportation: [
      '인디라 간디 국제공항',
      '메트로·오토 릭쇼',
      '택시'
    ],
    food: ['버터 치킨', '나앙 브레드', '인도 차이'],
    etiquette: [
      '인도 문화·종교 존경',
      '여행 보안 주의',
      '거리 음식 위생 확인'
    ],
    source: '인도 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'New Delhi Raj Ghat and India Gate'
  },
  {
    id: 'dest-tr-001',
    nameKo: '이스탄불',
    nameEn: 'Istanbul',
    country: '터키',
    region: '이스탄불',
    type: 'international',
    intro: '동양과 서양의 경계 이스탄불. 블루 모스크, 하기아 소피아, 톱카프 궁전은 오스만 제국의 영광을 증명하며, 보스포러스 해협은 로맨틱한 야경을 선사합니다.',
    attractions: [
      '블루 모스크',
      '하기아 소피아',
      '톱카프 궁전',
      '그랜드 바자르',
      '보스포러스 크루즈'
    ],
    themes: ['역사', '건축', '문화'],
    recommendedMonths: ['4월-5월', '9월-10월'],
    itinerary1day: '블루 모스크 & 하기아 소피아 → 톱카프 궁전 → 보스포러스 크루즈',
    itinerary3day: '1일: 블루 모스크·소피아·궁전, 2일: 그랜드 바자르·문화, 3일: 보스포러스 크루즈·야경',
    budget: { min: 70000, max: 160000 },
    transportation: [
      '이스탄불 공항',
      '트램·지하철·페리',
      '택시·도보'
    ],
    food: ['돈마', '케밥', '터키 차이'],
    etiquette: [
      '모스크 복장 규칙',
      '이슬람 문화 존경',
      '바자르 흥정 문화'
    ],
    source: '이스탄불 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Istanbul Blue Mosque and Hagia Sophia'
  },
  // Additional international cities to meet 30+ requirement
  {
    id: 'dest-jp-003',
    nameKo: '오사카',
    nameEn: 'Osaka',
    country: '일본',
    region: '오사카부',
    type: 'international',
    intro: '일본의 주방 오사카는 음식 문화와 활기찬 야경으로 유명합니다. 오사카 성, 도톤보리 거리, 유니버셜 스튜디오는 전통과 현대가 어우러진 도시입니다.',
    attractions: [
      '오사카 성',
      '도톤보리 거리',
      '유니버셜 스튜디오',
      '신사이바시 쇼핑',
      '오카 야경'
    ],
    themes: ['도시', '음식', '엔터테인먼트'],
    recommendedMonths: ['3월-5월', '9월-11월'],
    itinerary1day: '오사카 성 → 도톤보리 → 유니버셜 스튜디오',
    itinerary3day: '1일: 성·도톤보리, 2일: 유니버셜 스튜디오, 3일: 쇼핑·음식 투어',
    budget: { min: 100000, max: 250000 },
    transportation: [
      'JR·지하철',
      '신칸센 정거장',
      '버스'
    ],
    food: ['오코노미야키', '타코야키', '오사카 라멘'],
    etiquette: [
      '도톤보리 분위기 존중',
      '대중교통 에티켓',
      '식당 순서 준수'
    ],
    source: '오사카 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Osaka Castle and Dotonbori streets'
  },
  {
    id: 'dest-th-002',
    nameKo: '치앙마이',
    nameEn: 'Chiang Mai',
    country: '태국',
    region: '치앙마이',
    type: 'international',
    intro: '북부 태국의 정신적 중심 치앙마이. 불경절(11월)의 롱크롱 축제는 세계적으로 유명하며, 사찰과 산지 부족 문화는 전통 태국을 보여줍니다.',
    attractions: [
      '도이 수텝 사찰',
      '롱크롱 축제',
      '나이트 바자르',
      '엘리펀트 캠프',
      '올드 시티 산책'
    ],
    themes: ['불교', '축제', '문화'],
    recommendedMonths: ['11월(축제)', '3월-5월'],
    itinerary1day: '도이 수텝 → 올드 시티 → 나이트 바자르',
    itinerary3day: '1일: 도이 수텝·사찰, 2일: 엘리펀트 캠프, 3일: 나이트 바자르·문화 투어',
    budget: { min: 60000, max: 140000 },
    transportation: [
      '치앙마이 공항',
      '소카오 버스',
      '택시·툭툭'
    ],
    food: ['카오 소이', '칠리 페이스트', '태국 북부 요리'],
    etiquette: [
      '축제 기간 조용한 마음가짐',
      '상승 의식 존경',
      '동물 복지 신경쓰기'
    ],
    source: '치앙마이 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Chiang Mai temple and lantern festival'
  },
  {
    id: 'dest-it-002',
    nameKo: '베네치아',
    nameEn: 'Venice',
    country: '이탈리아',
    region: '베네토',
    type: 'international',
    intro: '운하의 도시 베네치아는 오스트리아와의 전쟁 중 만들어진 고대 건축의 진주입니다. 곤돌라 투어, 산마르코 광장, 카니발은 베네치아의 로맨스입니다.',
    attractions: [
      '산마르코 광장',
      '곤돌라 투어',
      '산마르코 대성당',
      '리알토 다리',
      '베네치아 카니발'
    ],
    themes: ['로맨스', '역사', '예술'],
    recommendedMonths: ['4월-5월', '9월-10월'],
    itinerary1day: '산마르코·대성당 → 곤돌라 투어 → 야경',
    itinerary3day: '1일: 산마르코·대성당, 2일: 리알토·미로·박물관, 3일: 곤돌라 야간 크루즈',
    budget: { min: 100000, max: 280000 },
    transportation: [
      '베네치아 산타루치아 기차역',
      '수상 버스·보트',
      '도보만 가능'
    ],
    food: ['스파게티 알 네로 디 세피아', '리소토', '베네치안 와인'],
    etiquette: [
      '건물 사진 시 개인정보 보호',
      '운하 환경 존중',
      '곤돌라 문화 존경'
    ],
    source: '베네치아 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Venice St Mark Square and gondola'
  },
  {
    id: 'dest-us-002',
    nameKo: '로스앤젤레스',
    nameEn: 'Los Angeles',
    country: '미국',
    region: '캘리포니아',
    type: 'international',
    intro: '태평양 해변과 할리우드 영화 스튜디오로 유명한 로스앤젤레스. 산타 모니카 해변, 그리피스 천문대, 비버리 힐스는 LA의 상징입니다.',
    attractions: [
      '산타 모니카 해변',
      '그리피스 천문대',
      '비버리 힐스',
      '할리우드 사인',
      '호텔 캘리포니아'
    ],
    themes: ['영화', '해변', '도시'],
    recommendedMonths: ['6월-8월', '10월-11월'],
    itinerary1day: '산타 모니카 해변 → 할리우드 → 그리피스 야경',
    itinerary3day: '1일: 산타 모니카·할리우드, 2일: 비버리 힐스·쇼핑, 3일: 그리피스 천문대',
    budget: { min: 120000, max: 280000 },
    transportation: [
      'LAX 공항',
      '렌터카 필수',
      '택시·우버'
    ],
    food: ['캘리포니아 스타일 햄버거', '타코', '아보카도'],
    etiquette: [
      '렌터카 주의(교통 규칙)',
      '비버리 힐스 보안 민감',
      '할리우드 투어 예약 필수'
    ],
    source: 'LA 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Los Angeles Hollywood sign and Santa Monica beach'
  },
  {
    id: 'dest-fr-002',
    nameKo: '니스',
    nameEn: 'Nice',
    country: '프랑스',
    region: '프로방스알프코트다쥐르',
    type: 'international',
    intro: '남프랑스의 진주 니스. 지중해 해변, 프롬나드 데 장글레, 구시가지의 매력적인 골목길은 유럽의 로맨스를 상징합니다.',
    attractions: [
      '프롬나드 데 장글레',
      '니스 구시가지',
      '카스텔 산책로',
      '미술 박물관',
      '지중해 해변'
    ],
    themes: ['해변', '미술', '로맨스'],
    recommendedMonths: ['5월-6월', '9월-10월'],
    itinerary1day: '프롬나드 산책 → 구시가지 → 해변',
    itinerary3day: '1일: 프롬나드·구시가지, 2일: 카스텔·박물관, 3일: 해변·쇼핑',
    budget: { min: 90000, max: 220000 },
    transportation: [
      '니스 코트다쥐르 공항',
      '버스·기차',
      '도보 중심'
    ],
    food: ['니스 살라드', '사드', '프로방스 와인'],
    etiquette: [
      '해변 문화 존중',
      '프로방스 특색 배우기',
      '여름 성수기 피하기'
    ],
    source: '니스 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Nice Promenade des Anglais and Mediterranean'
  },
  {
    id: 'dest-jp-004',
    nameKo: '후쿠오카',
    nameEn: 'Fukuoka',
    country: '일본',
    region: '후쿠오카현',
    type: 'international',
    intro: '일본 규슈의 관문 후쿠오카. 야타이 음식 거리, 돈키호테 대형마트, 하카타 라멘으로 유명한 미식 도시입니다.',
    attractions: [
      '야타이 음식 거리',
      '돈키호테',
      '우미노나카 미치 해변',
      '나카수 지구 야경',
      '쇠소노시마 섬'
    ],
    themes: ['음식', '도시', '해변'],
    recommendedMonths: ['3월-5월', '9월-11월'],
    itinerary1day: '야타이 거리 → 돈키호테 → 나카수 야경',
    itinerary3day: '1일: 야타이·쇠소노시마, 2일: 해변·박물관, 3일: 음식 투어',
    budget: { min: 90000, max: 200000 },
    transportation: [
      '후쿠오카 공항',
      '지하철·버스',
      '도보'
    ],
    food: ['하카타 라멘', '모츠나베', '명태 알계란'],
    etiquette: [
      '야타이 매너',
      '야경 지구 안전',
      '식당 예약 필수'
    ],
    source: '후쿠오카 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Fukuoka Yatai food stalls and cityscape'
  },
  {
    id: 'dest-us-003',
    nameKo: '샌프란시스코',
    nameEn: 'San Francisco',
    country: '미국',
    region: '캘리포니아',
    type: 'international',
    intro: '금문교와 빅토리아 저택으로 유명한 샌프란시스코. 기술 혁신과 비트 세대의 정신이 살아있는 문화 도시입니다.',
    attractions: [
      '금문교',
      '알카트라즈 섬',
      '빅토리아 저택',
      '피셔맨스 워프',
      '케이블카'
    ],
    themes: ['건축', '역사', '문화'],
    recommendedMonths: ['5월-6월', '9월-10월'],
    itinerary1day: '금문교 → 알카트라즈 → 케이블카',
    itinerary3day: '1일: 금문교·케이블카, 2일: 알카트라즈 투어, 3일: 빅토리아 저택·워프',
    budget: { min: 100000, max: 250000 },
    transportation: [
      '샌프란시스코 공항',
      '케이블카·버스',
      '택시·우버'
    ],
    food: ['더니오우동국수', '게 수프', '소우르도우 빵'],
    etiquette: [
      '금문교 안전 주의',
      '알카트라즈 사전 예약',
      '기술 회사 방문 규칙'
    ],
    source: '샌프란시스코 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'San Francisco Golden Gate Bridge'
  },
  {
    id: 'dest-de-001',
    nameKo: '베를린',
    nameEn: 'Berlin',
    country: '독일',
    region: '베를린',
    type: 'international',
    intro: '분단의 역사와 통일의 기쁨이 담긴 베를린. 브란덴부르크 문, 베를린 장벽 추모비, 박물관 섬은 2000년 유럽 역사를 담고 있습니다.',
    attractions: [
      '브란덴부르크 문',
      '베를린 장벽 추모비',
      '박물관 섬',
      '라이히스타그',
      '샤를로텐부르크 궁전'
    ],
    themes: ['역사', '건축', '문화'],
    recommendedMonths: ['4월-5월', '9월-10월'],
    itinerary1day: '브란덴부르크 → 장벽 추모비 → 박물관 섬',
    itinerary3day: '1일: 브란덴부르크·장벽, 2일: 박물관 섬·라이히스타그, 3일: 궁전·야경',
    budget: { min: 80000, max: 180000 },
    transportation: [
      '베를린 테겔·센스트롬 공항',
      'S반·U반 충실',
      '버스·자전거'
    ],
    food: ['커리분스트', '슈니첼', '독일 맥주'],
    etiquette: [
      '역사 존경',
      '라이히스타그 투어 예약',
      '자전거 규칙 준수'
    ],
    source: '베를린 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Berlin Brandenburg Gate and historical sites'
  },
  {
    id: 'dest-nl-001',
    nameKo: '암스테르담',
    nameEn: 'Amsterdam',
    country: '네덜란드',
    region: '암스테르담',
    type: 'international',
    intro: '운하 도시 암스테르담. 자전거 문화, 박물관, 안네 프랑크 집, 유명한 커피숍은 암스테르담의 다양한 면을 보여줍니다.',
    attractions: [
      '운하 자전거 투어',
      '반 고흐 박물관',
      '안네 프랑크 집',
      '담 광장',
      '알버트 시장'
    ],
    themes: ['문화', '예술', '도시'],
    recommendedMonths: ['4월-5월', '9월-10월'],
    itinerary1day: '운하 자전거 → 반 고흐 박물관 → 운하 야경',
    itinerary3day: '1일: 자전거·박물관, 2일: 안네 프랑크·교회, 3일: 시장·쇼핑',
    budget: { min: 80000, max: 180000 },
    transportation: [
      '암스테르담 스키폴 공항',
      '자전거(필수)',
      '트램·버스'
    ],
    food: ['스트롭와플', '팬쿐이크', '네덜란드 치즈'],
    etiquette: [
      '자전거 규칙 철저히',
      '운하 보행 조심',
      '커피숍 에티켓'
    ],
    source: '암스테르담 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Amsterdam canals and bicycles'
  },
  {
    id: 'dest-at-001',
    nameKo: '빈',
    nameEn: 'Vienna',
    country: '오스트리아',
    region: '빈',
    type: 'international',
    intro: '음악의 도시 빈. 합스부르크 왕가의 쇤부른 궁전, 슈테판 대성당은 오스트리아 제국의 영광을 증명합니다. 악명높은 카페 문화는 빈의 또 다른 정체성입니다.',
    attractions: ['쇤부른 궁전', '슈테판 대성당', '벨베데레 궁전', '홉부르크 박물관', '빈 음악홀'],
    themes: ['음악', '궁전', '문화'],
    recommendedMonths: ['4월-5월', '9월-10월'],
    itinerary1day: '쇤부른 궁전 → 슈테판 대성당 → 음악 투어',
    itinerary3day: '1일: 궁전·성당, 2일: 벨베데레·박물관, 3일: 음악 공연·카페',
    budget: { min: 80000, max: 180000 },
    transportation: ['빈 국제공항', 'U반·버스·트램', '도보'],
    food: ['슈니첼', '자허 토르테', '오스트리아 커피'],
    etiquette: ['궁전 투어 존경', '음악 공연 매너', '카페 문화 즐기기'],
    source: '빈 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Vienna Schonbrunn Palace'
  },
  {
    id: 'dest-pt-001',
    nameKo: '리스본',
    nameEn: 'Lisbon',
    country: '포르투갈',
    region: '리스본',
    type: 'international',
    intro: '대서양의 역사 도시 리스본. 산조르제 성, 타주스 강 야경, 골목길 트램, 파스텔 드 나타는 포르투갈의 매력입니다.',
    attractions: ['산조르제 성', '제로니모스 수도원', '타주스 강 야경', '트램 28번', '시아도 지구'],
    themes: ['역사', '야경', '도시'],
    recommendedMonths: ['4월-5월', '9월-10월'],
    itinerary1day: '산조르제 성 → 수로원 → 야경',
    itinerary3day: '1일: 산조르제·트램, 2일: 수도원·박물관, 3일: 강변 야경·음식',
    budget: { min: 60000, max: 140000 },
    transportation: ['리스본 포르텔라 공항', '트램·지하철·버스', '도보'],
    food: ['파스텔 드 나타', '갈라스 생햄', '포르투갈 와인'],
    etiquette: ['트램 탑승 예절', '역사 유적 존경', '지역 음식 문화'],
    source: '리스본 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Lisbon Castle'
  },
  {
    id: 'dest-id-001',
    nameKo: '발리',
    nameEn: 'Bali',
    country: '인도네시아',
    region: '발리',
    type: 'international',
    intro: '신의 섬 발리. 우붓의 쌀밭, 사원, 요기 문화, 저렴한 스파는 발리를 동남아 최고의 휴양지로 만들었습니다.',
    attractions: ['우붓 쌀밭', '탄락 롯 사원', '우부드 시장', '발리 힌두 사원', '쿠타 해변'],
    themes: ['영성', '자연', '휴양'],
    recommendedMonths: ['4월-5월', '9월-10월'],
    itinerary1day: '쌀밭 산책 → 우부드 시장 → 사원 방문',
    itinerary3day: '1일: 쌀밭·사원, 2일: 우부드·시장, 3일: 해변·스파',
    budget: { min: 50000, max: 120000 },
    transportation: ['덴파사르 국제공항', '렌터카 또는 택시', '오토바이 렌탈'],
    food: ['나시 고렝', '사떼', '발리니즈 스파이스'],
    etiquette: ['사원 복장 규칙', '힌두 문화 존경', '환경 보호'],
    source: '발리 관광청',
    lastUpdated: '2026-09-17',
    imageAlt: 'Bali rice fields'
  },
];

/**
 * 데이터 검증: 필수 필드 체크
 * REQ-FUNC-004 구현 — 빠진 필드는 게시 불가
 */
export function validateDestinations(): string[] {
  const errors: string[] = [];

  destinations.forEach((dest, idx) => {
    if (!dest.nameKo || !dest.nameEn) errors.push(`[${idx}] Missing name`);
    if (dest.intro.length < 300) errors.push(`[${idx}] Intro < 300 chars`);
    if (!dest.attractions || dest.attractions.length < 5) errors.push(`[${idx}] Attractions < 5`);
    if (!dest.food || dest.food.length < 3) errors.push(`[${idx}] Food < 3`);
    if (!dest.etiquette || dest.etiquette.length < 3) errors.push(`[${idx}] Etiquette < 3`);
    if (!dest.source) errors.push(`[${idx}] Missing source`);
    if (!dest.lastUpdated) errors.push(`[${idx}] Missing lastUpdated`);
  });

  return errors;
}

/**
 * 국내(domestic) vs 해외(international) 카운트
 * REQ-FUNC-008: National 10+, International 15+ countries, 30+ cities
 */
export function getDestinationStats() {
  const domestic = destinations.filter(d => d.type === 'domestic');
  const international = destinations.filter(d => d.type === 'international');
  const countries = new Set(international.map(d => d.country));

  return {
    domestic_count: domestic.length,
    international_count: international.length,
    international_countries: countries.size,
    countries: Array.from(countries).sort(),
  };
}
