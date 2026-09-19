/**
 * Safety information for international destinations
 * TypeScript static module for country-level safety guidance
 * REQ-FUNC-046,047,048,049,051,052,053,054; REQ-NF-027,028
 *
 * Single source of truth for safety alerts and travel advisories
 */

export interface SafetyAlert {
  category: string;
  level: 'green' | 'yellow' | 'orange' | 'red';
  description: string;
}

export interface CountrySafety {
  countryCode: string;
  countryNameKo: string;
  countryNameEn: string;
  scopeType: 'all' | 'region' | 'city';
  scopeText: string;
  alerts: SafetyAlert[]; // 8 categories
  verified_at: string; // ISO date
  source: string;
}

export const countrySafetyData: CountrySafety[] = [
  {
    countryCode: 'JP',
    countryNameKo: '일본',
    countryNameEn: 'Japan',
    scopeType: 'all',
    scopeText: '전국',
    alerts: [
      { category: '질병', level: 'green', description: '일반적인 감염병 주의. 계절 독감 예방 권장' },
      { category: '자연재해', level: 'yellow', description: '지진 및 태풍 위험. 대피 경로 숙지 권장' },
      { category: '범죄', level: 'green', description: '전반적으로 안전. 소매치기는 관광지에서만 주의' },
      { category: '교통', level: 'green', description: '대중교통 안전. 차량 운전 시 우측 통행 확인' },
      { category: '테러', level: 'green', description: '낮은 위험. 특별한 제약 없음' },
      { category: '정치안정', level: 'green', description: '안정적. 시위나 집회 피할 것' },
      { category: '약물', level: 'green', description: '불법 약물 엄격히 금지. 심각한 법적 처벌' },
      { category: '기타', level: 'green', description: '음식 안전 양호. 일반적인 위생 주의로 충분' }
    ],
    verified_at: '2026-09-17',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'TH',
    countryNameKo: '태국',
    countryNameEn: 'Thailand',
    scopeType: 'region',
    scopeText: '방콕, 치앙마이, 푸켓, 크라비',
    alerts: [
      { category: '질병', level: 'yellow', description: '뎅기열, 말라리아 위험. 모기 퇴치제 사용 권장' },
      { category: '자연재해', level: 'green', description: '몬순 계절 수해 주의(5-10월)' },
      { category: '범죄', level: 'yellow', description: '관광지에서 소매치기·사기 주의. 야간 외출 제한' },
      { category: '교통', level: 'yellow', description: '교통 혼잡 및 사고 위험. 좌측 통행' },
      { category: '테러', level: 'yellow', description: '남부 지역(얄라, 나라티왓, 파타니) 피할 것' },
      { category: '정치안정', level: 'green', description: '대체로 안정. 대규모 집회 피하기' },
      { category: '약물', level: 'orange', description: '불법 약물 극히 엄격히 금지. 밀수 시 사형 가능' },
      { category: '기타', level: 'yellow', description: '음식·물 안전 주의. 정제수 마실 것' }
    ],
    verified_at: '2026-09-15',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'US',
    countryNameKo: '미국',
    countryNameEn: 'United States',
    scopeType: 'region',
    scopeText: '뉴욕, 로스앤젤레스, 샌프란시스코, 라스베이거스, 마이애미',
    alerts: [
      { category: '질병', level: 'green', description: '일반적인 감염병만 주의. 의료 시설 우수' },
      { category: '자연재해', level: 'yellow', description: '토네이도(남부·중부), 허리케인(해안), 지진(서부)' },
      { category: '범죄', level: 'yellow', description: '도시 중심부 야간 외출 제한. 소지품 관리 필수' },
      { category: '교통', level: 'green', description: '자동차 운전 시 면허증·보험증 소지 필수' },
      { category: '테러', level: 'green', description: '낮은 위험. 공항·대형 행사장 경계 수준' },
      { category: '정치안정', level: 'green', description: '안정적. 대규모 시위는 피하기' },
      { category: '약물', level: 'yellow', description: '불법 약물 금지. 일부 주에서 대마초 합법' },
      { category: '기타', level: 'green', description: '식수 안전. 응급 의료 비용 시 보험 필수' }
    ],
    verified_at: '2026-09-16',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'FR',
    countryNameKo: '프랑스',
    countryNameEn: 'France',
    scopeType: 'region',
    scopeText: '파리, 리용, 마르세유, 니스',
    alerts: [
      { category: '질병', level: 'green', description: '일반적인 감염병 주의. 의료 시설 우수' },
      { category: '자연재해', level: 'green', description: '알프스 산악지역 눈사태 위험(겨울)' },
      { category: '범죄', level: 'yellow', description: '파리·마르세유 관광지 소매치기 주의. 야간 제한' },
      { category: '교통', level: 'green', description: '대중교통 안전. 우측 통행' },
      { category: '테러', level: 'yellow', description: '테러 위험 수준 상향. 공항·터미널 경계' },
      { category: '정치안정', level: 'green', description: '대체로 안정. 시위·파업 피하기' },
      { category: '약물', level: 'yellow', description: '불법 약물 엄격히 금지' },
      { category: '기타', level: 'green', description: '식수 안전. 숙박·음식 품질 우수' }
    ],
    verified_at: '2026-09-14',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'AU',
    countryNameKo: '호주',
    countryNameEn: 'Australia',
    scopeType: 'all',
    scopeText: '전국',
    alerts: [
      { category: '질병', level: 'green', description: '일반적인 감염병 주의. 의료 시설 우수' },
      { category: '자연재해', level: 'yellow', description: '산불(여름), 사이클론(북부), 홍수 주의' },
      { category: '범죄', level: 'green', description: '안전. 야간 외출 시 기본 주의만 필수' },
      { category: '교통', level: 'green', description: '좌측 통행. 교통 안전 양호' },
      { category: '테러', level: 'green', description: '낮은 위험' },
      { category: '정치안정', level: 'green', description: '안정적' },
      { category: '약물', level: 'yellow', description: '불법 약물 엄격히 금지' },
      { category: '기타', level: 'green', description: '식수·음식 안전. 야생동물 주의(뱀, 악어)' }
    ],
    verified_at: '2026-09-17',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'IT',
    countryNameKo: '이탈리아',
    countryNameEn: 'Italy',
    scopeType: 'region',
    scopeText: '로마, 밀라노, 베네치아, 피렌체, 나폴리',
    alerts: [
      { category: '질병', level: 'green', description: '일반적인 감염병 주의' },
      { category: '자연재해', level: 'yellow', description: '남부·시칠리아 지진 위험. 베수비오 화산' },
      { category: '범죄', level: 'yellow', description: '나폴리·로마 관광지 소매치기 주의' },
      { category: '교통', level: 'yellow', description: '우측 통행. 도시 혼잡 운전 주의' },
      { category: '테러', level: 'green', description: '낮은 위험' },
      { category: '정치안정', level: 'green', description: '안정적' },
      { category: '약물', level: 'yellow', description: '불법 약물 금지' },
      { category: '기타', level: 'green', description: '식수·음식 안전. 역사 유적지 안전' }
    ],
    verified_at: '2026-09-16',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'ES',
    countryNameKo: '스페인',
    countryNameEn: 'Spain',
    scopeType: 'region',
    scopeText: '마드리드, 바르셀로나, 세비야, 말라가',
    alerts: [
      { category: '질병', level: 'green', description: '일반적인 감염병 주의' },
      { category: '자연재해', level: 'green', description: '홍수 위험(남부, 가을)' },
      { category: '범죄', level: 'yellow', description: '바르셀로나·마드리드 관광지 소매치기 주의' },
      { category: '교통', level: 'green', description: '우측 통행. 대중교통 안전' },
      { category: '테러', level: 'green', description: '낮은 위험' },
      { category: '정치안정', level: 'green', description: '안정적' },
      { category: '약물', level: 'yellow', description: '불법 약물 금지' },
      { category: '기타', level: 'green', description: '식수·음식 안전. 해변 안전' }
    ],
    verified_at: '2026-09-15',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'VN',
    countryNameKo: '베트남',
    countryNameEn: 'Vietnam',
    scopeType: 'region',
    scopeText: '하노이, 호찌민시, 다낭, 하롱베이',
    alerts: [
      { category: '질병', level: 'yellow', description: '뎅기열, 독감 주의. 모기 퇴치제 필수' },
      { category: '자연재해', level: 'yellow', description: '태풍(7-11월), 홍수 위험' },
      { category: '범죄', level: 'yellow', description: '소매치기, 오토바이 날치기 주의' },
      { category: '교통', level: 'yellow', description: '혼란스러운 교통. 횡단보도 주의' },
      { category: '테러', level: 'green', description: '낮은 위험' },
      { category: '정치안정', level: 'green', description: '안정적' },
      { category: '약물', level: 'orange', description: '불법 약물 극히 엄격히 금지. 사형 위험' },
      { category: '기타', level: 'yellow', description: '식수·음식 안전 주의. 정제수 마실 것' }
    ],
    verified_at: '2026-09-14',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'CA',
    countryNameKo: '캐나다',
    countryNameEn: 'Canada',
    scopeType: 'all',
    scopeText: '전국',
    alerts: [
      { category: '질병', level: 'green', description: '일반적인 감염병 주의' },
      { category: '자연재해', level: 'yellow', description: '눈사태(산악), 홍수(봄), 산불(여름)' },
      { category: '범죄', level: 'green', description: '안전. 야간 외출 기본 주의' },
      { category: '교통', level: 'green', description: '우측 통행. 겨울 도로 조건 주의' },
      { category: '테러', level: 'green', description: '낮은 위험' },
      { category: '정치안정', level: 'green', description: '안정적' },
      { category: '약물', level: 'green', description: '대마초 합법(일부 주). 기타 불법 약물 금지' },
      { category: '기타', level: 'green', description: '식수·음식 안전. 의료 시설 우수' }
    ],
    verified_at: '2026-09-17',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'NZ',
    countryNameKo: '뉴질랜드',
    countryNameEn: 'New Zealand',
    scopeType: 'all',
    scopeText: '전국',
    alerts: [
      { category: '질병', level: 'green', description: '일반적인 감염병 주의' },
      { category: '자연재해', level: 'yellow', description: '지진(북섬), 화산 활동(토나가리로) 주의' },
      { category: '범죄', level: 'green', description: '안전. 야간 외출 기본 주의' },
      { category: '교통', level: 'green', description: '좌측 통행. 교통 안전' },
      { category: '테러', level: 'green', description: '낮은 위험' },
      { category: '정치안정', level: 'green', description: '안정적' },
      { category: '약물', level: 'yellow', description: '불법 약물 금지' },
      { category: '기타', level: 'green', description: '식수·음식 안전. 야생동물 주의' }
    ],
    verified_at: '2026-09-17',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'SG',
    countryNameKo: '싱가포르',
    countryNameEn: 'Singapore',
    scopeType: 'all',
    scopeText: '전국',
    alerts: [
      { category: '질병', level: 'yellow', description: '지카, 뎅기열 주의. 모기 퇴치제 필수' },
      { category: '자연재해', level: 'green', description: '몬순 시 폭우(11-3월)' },
      { category: '범죄', level: 'green', description: '안전. 기본 주의만 필요' },
      { category: '교통', level: 'green', description: '좌측 통행. 대중교통 안전' },
      { category: '테러', level: 'yellow', description: '테러 위험 주의. 종교·정치 민감' },
      { category: '정치안정', level: 'green', description: '안정적' },
      { category: '약물', level: 'orange', description: '불법 약물 극히 엄격히 금지. 사형 가능' },
      { category: '기타', level: 'green', description: '식수·음식 안전. 의료 시설 우수' }
    ],
    verified_at: '2026-09-16',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'HK',
    countryNameKo: '홍콩',
    countryNameEn: 'Hong Kong',
    scopeType: 'all',
    scopeText: '전국',
    alerts: [
      { category: '질병', level: 'yellow', description: '지카, 뎅기열 주의' },
      { category: '자연재해', level: 'yellow', description: '태풍(8-10월) 위험' },
      { category: '범죄', level: 'green', description: '안전. 기본 주의만 필요' },
      { category: '교통', level: 'green', description: '좌측 통행. 대중교통 우수' },
      { category: '테러', level: 'green', description: '낮은 위험' },
      { category: '정치안정', level: 'yellow', description: '정치적 긴장. 대규모 시위 피하기' },
      { category: '약물', level: 'yellow', description: '불법 약물 금지' },
      { category: '기타', level: 'green', description: '식수·음식 안전. 의료 시설 우수' }
    ],
    verified_at: '2026-09-15',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'MX',
    countryNameKo: '멕시코',
    countryNameEn: 'Mexico',
    scopeType: 'region',
    scopeText: '칸쿤, 푸에르토 바야르타, 로스카보스, 멕시코시티',
    alerts: [
      { category: '질병', level: 'yellow', description: '지카, 뎅기열, 말라리아 주의' },
      { category: '자연재해', level: 'yellow', description: '허리케인(카리브해), 지진(태평양) 위험' },
      { category: '범죄', level: 'orange', description: '마약 범죄 조직 활동. 밤 외출 제한' },
      { category: '교통', level: 'yellow', description: '우측 통행. 도로 안전 주의' },
      { category: '테러', level: 'green', description: '낮은 위험' },
      { category: '정치안정', level: 'yellow', description: '대체로 안정. 북부 일부 지역 피할 것' },
      { category: '약물', level: 'orange', description: '불법 약물 극히 엄격히 금지' },
      { category: '기타', level: 'yellow', description: '식수·음식 안전 주의. 정제수 마실 것' }
    ],
    verified_at: '2026-09-14',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'BR',
    countryNameKo: '브라질',
    countryNameEn: 'Brazil',
    scopeType: 'region',
    scopeText: '상파울루, 리오데자네이로, 살바도르, 레시페',
    alerts: [
      { category: '질병', level: 'yellow', description: '지카, 뎅기열, 말라리아 주의(북부/북동부)' },
      { category: '자연재해', level: 'green', description: '홍수 위험(여름)' },
      { category: '범죄', level: 'orange', description: '도시 빈곤층 지역 야간 외출 금지' },
      { category: '교통', level: 'yellow', description: '우측 통행. 교통 혼잡·안전 주의' },
      { category: '테러', level: 'green', description: '낮은 위험' },
      { category: '정치안정', level: 'green', description: '대체로 안정' },
      { category: '약물', level: 'orange', description: '불법 약물 극히 엄격히 금지' },
      { category: '기타', level: 'yellow', description: '식수·음식 안전 주의. 신용카드 사기 주의' }
    ],
    verified_at: '2026-09-13',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'EG',
    countryNameKo: '이집트',
    countryNameEn: 'Egypt',
    scopeType: 'region',
    scopeText: '카이로, 기자, 럭소르, 아스완, 알렉산드리아',
    alerts: [
      { category: '질병', level: 'yellow', description: '위장질환, 말라리아 주의. 예방약 고려' },
      { category: '자연재해', level: 'green', description: '사막 폭풍(봄) 주의' },
      { category: '범죄', level: 'yellow', description: '야간 외출 제한. 소매치기 주의' },
      { category: '교통', level: 'yellow', description: '우측 통행. 교통 혼잡·안전 주의' },
      { category: '테러', level: 'orange', description: '테러 위협 높음. 대형 집회 피하기' },
      { category: '정치안정', level: 'yellow', description: '정치적 긴장. 시위 피하기' },
      { category: '약물', level: 'orange', description: '불법 약물 극히 엄격히 금지' },
      { category: '기타', level: 'yellow', description: '식수·음식 안전 주의. 정제수 마실 것' }
    ],
    verified_at: '2026-09-12',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'IN',
    countryNameKo: '인도',
    countryNameEn: 'India',
    scopeType: 'region',
    scopeText: '델리, 뭄바이, 방갈로르, 자이푸르, 고아',
    alerts: [
      { category: '질병', level: 'yellow', description: '말라리아, 데니그열, 장티푸스 주의. 예방약 필수' },
      { category: '자연재해', level: 'yellow', description: '몬순(6-10월) 홍수 위험' },
      { category: '범죄', level: 'yellow', description: '야간 외출 제한. 여성은 특히 주의' },
      { category: '교통', level: 'yellow', description: '좌측 통행. 교통 혼잡·안전 주의' },
      { category: '테러', level: 'yellow', description: '테러 위협 중간. 공항·터미널 경계' },
      { category: '정치안정', level: 'green', description: '대체로 안정. 종교·정치 민감' },
      { category: '약물', level: 'yellow', description: '불법 약물 금지' },
      { category: '기타', level: 'yellow', description: '식수·음식 안전 주의. 정제수 마실 것' }
    ],
    verified_at: '2026-09-13',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'TR',
    countryNameKo: '터키',
    countryNameEn: 'Turkey',
    scopeType: 'region',
    scopeText: '이스탄불, 앙카라, 이즈미르, 카파도키아, 보드룸',
    alerts: [
      { category: '질병', level: 'green', description: '일반적인 감염병 주의' },
      { category: '자연재해', level: 'yellow', description: '지진 위험(동부, 북부)' },
      { category: '범죄', level: 'yellow', description: '관광지 소매치기 주의. 야간 외출 제한' },
      { category: '교통', level: 'yellow', description: '우측 통행. 교통 혼잡 주의' },
      { category: '테러', level: 'yellow', description: '테러 위협 중간. 공항·터미널 경계' },
      { category: '정치안정', level: 'yellow', description: '정치적 긴장. 대규모 시위 피하기' },
      { category: '약물', level: 'orange', description: '불법 약물 극히 엄격히 금지' },
      { category: '기타', level: 'green', description: '식수·음식 안전. 의료 시설 우수' }
    ],
    verified_at: '2026-09-14',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'DE',
    countryNameKo: '독일',
    countryNameEn: 'Germany',
    scopeType: 'all',
    scopeText: '전국',
    alerts: [
      { category: '질병', level: 'green', description: '일반적인 감염병 주의' },
      { category: '자연재해', level: 'green', description: '홍수 위험(여름)' },
      { category: '범죄', level: 'yellow', description: '관광지 소매치기 주의' },
      { category: '교통', level: 'green', description: '우측 통행. 대중교통 안전' },
      { category: '테러', level: 'green', description: '낮은 위험' },
      { category: '정치안정', level: 'green', description: '안정적' },
      { category: '약물', level: 'yellow', description: '불법 약물 금지' },
      { category: '기타', level: 'green', description: '식수·음식 안전. 의료 시설 우수' }
    ],
    verified_at: '2026-09-16',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'NL',
    countryNameKo: '네덜란드',
    countryNameEn: 'Netherlands',
    scopeType: 'all',
    scopeText: '전국',
    alerts: [
      { category: '질병', level: 'green', description: '일반적인 감염병 주의' },
      { category: '자연재해', level: 'green', description: '홍수 위험(저지대)' },
      { category: '범죄', level: 'yellow', description: '암스테르담 소매치기 주의' },
      { category: '교통', level: 'green', description: '우측 통행. 자전거 운전 주의' },
      { category: '테러', level: 'green', description: '낮은 위험' },
      { category: '정치안정', level: 'green', description: '안정적' },
      { category: '약물', level: 'green', description: '일부 약물 허용(대마초). 기타 불법 금지' },
      { category: '기타', level: 'green', description: '식수·음식 안전. 의료 시설 우수' }
    ],
    verified_at: '2026-09-16',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'AT',
    countryNameKo: '오스트리아',
    countryNameEn: 'Austria',
    scopeType: 'all',
    scopeText: '전국',
    alerts: [
      { category: '질병', level: 'green', description: '일반적인 감염병 주의' },
      { category: '자연재해', level: 'yellow', description: '눈사태(겨울), 홍수(봄)' },
      { category: '범죄', level: 'green', description: '안전. 기본 주의만 필요' },
      { category: '교통', level: 'green', description: '우측 통행. 겨울 도로 조건 주의' },
      { category: '테러', level: 'green', description: '낮은 위험' },
      { category: '정치안정', level: 'green', description: '안정적' },
      { category: '약물', level: 'yellow', description: '불법 약물 금지' },
      { category: '기타', level: 'green', description: '식수·음식 안전. 의료 시설 우수' }
    ],
    verified_at: '2026-09-16',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'PT',
    countryNameKo: '포르투갈',
    countryNameEn: 'Portugal',
    scopeType: 'all',
    scopeText: '전국',
    alerts: [
      { category: '질병', level: 'green', description: '일반적인 감염병 주의' },
      { category: '자연재해', level: 'green', description: '산불(여름), 홍수(겨울) 주의' },
      { category: '범죄', level: 'yellow', description: '리스본·포르투 관광지 소매치기 주의' },
      { category: '교통', level: 'green', description: '우측 통행. 대중교통 안전' },
      { category: '테러', level: 'green', description: '낮은 위험' },
      { category: '정치안정', level: 'green', description: '안정적' },
      { category: '약물', level: 'yellow', description: '불법 약물 금지' },
      { category: '기타', level: 'green', description: '식수·음식 안전. 의료 시설 우수' }
    ],
    verified_at: '2026-09-15',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'ID',
    countryNameKo: '인도네시아',
    countryNameEn: 'Indonesia',
    scopeType: 'region',
    scopeText: '자카르타, 발리, 자그자카르타, 수라바야',
    alerts: [
      { category: '질병', level: 'yellow', description: '뎅기열, 말라리아 주의(동부). 예방약 고려' },
      { category: '자연재해', level: 'yellow', description: '지진, 화산 활동, 해일 위험' },
      { category: '범죄', level: 'yellow', description: '소매치기, 사기 주의. 야간 외출 제한' },
      { category: '교통', level: 'yellow', description: '좌측 통행. 교통 혼잡·안전 주의' },
      { category: '테러', level: 'yellow', description: '테러 위협 중간. 공항·터미널 경계' },
      { category: '정치안정', level: 'green', description: '대체로 안정. 종교·정치 민감' },
      { category: '약물', level: 'orange', description: '불법 약물 극히 엄격히 금지. 사형 가능' },
      { category: '기타', level: 'yellow', description: '식수·음식 안전 주의. 정제수 마실 것' }
    ],
    verified_at: '2026-09-13',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'LA',
    countryNameKo: '라오스',
    countryNameEn: 'Laos',
    scopeType: 'region',
    scopeText: '비엔티안, 루앙프라방, 방비엥',
    alerts: [
      { category: '질병', level: 'yellow', description: '뎅기열, 말라리아 주의. 모기 퇴치제 필수' },
      { category: '자연재해', level: 'yellow', description: '몬순(5-10월) 홍수 위험' },
      { category: '범죄', level: 'yellow', description: '소매치기, 사기 주의' },
      { category: '교통', level: 'yellow', description: '우측 통행. 교통 안전 주의' },
      { category: '테러', level: 'green', description: '낮은 위험' },
      { category: '정치안정', level: 'green', description: '안정적' },
      { category: '약물', level: 'orange', description: '불법 약물 극히 엄격히 금지' },
      { category: '기타', level: 'yellow', description: '식수·음식 안전 주의. 정제수 마실 것' }
    ],
    verified_at: '2026-09-12',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'MM',
    countryNameKo: '미얀마',
    countryNameEn: 'Myanmar',
    scopeType: 'region',
    scopeText: '양곤, 만달레이, 바간',
    alerts: [
      { category: '질병', level: 'yellow', description: '뎅기열, 말라리아 주의. 예방약 고려' },
      { category: '자연재해', level: 'yellow', description: '몬순(5-10월) 홍수 위험' },
      { category: '범죄', level: 'yellow', description: '소매치기 주의' },
      { category: '교통', level: 'yellow', description: '우측 통행. 교통 안전 주의' },
      { category: '테러', level: 'yellow', description: '테러 위협 중간. 동북부 피하기' },
      { category: '정치안정', level: 'orange', description: '정치적 불안정. 대규모 시위 피하기' },
      { category: '약물', level: 'orange', description: '불법 약물 극히 엄격히 금지' },
      { category: '기타', level: 'yellow', description: '식수·음식 안전 주의. 정제수 마실 것' }
    ],
    verified_at: '2026-09-11',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'KH',
    countryNameKo: '캄보디아',
    countryNameEn: 'Cambodia',
    scopeType: 'region',
    scopeText: '프놈펜, 시엠립, 씨하누크빌',
    alerts: [
      { category: '질병', level: 'yellow', description: '뎅기열, 말라리아 주지(시엠립). 예방약 고려' },
      { category: '자연재해', level: 'yellow', description: '몬순(5-10월) 홍수 위험' },
      { category: '범죄', level: 'yellow', description: '소매치기, 강도 주의. 야간 외출 제한' },
      { category: '교통', level: 'yellow', description: '우측 통행. 교통 안전 주의' },
      { category: '테러', level: 'yellow', description: '테러 위협 중간' },
      { category: '정치안정', level: 'green', description: '대체로 안정' },
      { category: '약물', level: 'orange', description: '불법 약물 극히 엄격히 금지' },
      { category: '기타', level: 'yellow', description: '식수·음식 안전 주의. 정제수 마실 것' }
    ],
    verified_at: '2026-09-10',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'ZA',
    countryNameKo: '남아프리카공화국',
    countryNameEn: 'South Africa',
    scopeType: 'region',
    scopeText: '요하네스버그, 케이프타운, 프리토리아, 더반',
    alerts: [
      { category: '질병', level: 'yellow', description: '말라리아(동부 저지대) 주의. 예방약 고려' },
      { category: '자연재해', level: 'green', description: '홍수 위험(여름)' },
      { category: '범죄', level: 'orange', description: '도시 중심부 야간 외출 금지. 강도 위협' },
      { category: '교통', level: 'yellow', description: '좌측 통행. 교통 안전 주의' },
      { category: '테러', level: 'green', description: '낮은 위험' },
      { category: '정치안정', level: 'yellow', description: '대체로 안정. 시위 피하기' },
      { category: '약물', level: 'yellow', description: '불법 약물 금지' },
      { category: '기타', level: 'yellow', description: '식수·음식 안전. 의료 시설 우수' }
    ],
    verified_at: '2026-09-12',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'GE',
    countryNameKo: '조지아',
    countryNameEn: 'Georgia',
    scopeType: 'all',
    scopeText: '전국',
    alerts: [
      { category: '질병', level: 'green', description: '일반적인 감염병 주의' },
      { category: '자연재해', level: 'yellow', description: '산악지역 눈사태(겨울), 홍수(봄)' },
      { category: '범죄', level: 'green', description: '안전. 기본 주의만 필요' },
      { category: '교통', level: 'yellow', description: '우측 통행. 산악도로 안전 주의' },
      { category: '테러', level: 'green', description: '낮은 위험' },
      { category: '정치안정', level: 'yellow', description: '정치적 긴장. 북부 지역 피할 것' },
      { category: '약물', level: 'yellow', description: '불법 약물 금지' },
      { category: '기타', level: 'green', description: '식수·음식 안전. 의료 시설 양호' }
    ],
    verified_at: '2026-09-15',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'UZ',
    countryNameKo: '우즈베키스탄',
    countryNameEn: 'Uzbekistan',
    scopeType: 'region',
    scopeText: '타슈켄트, 사마르칸드, 부하라',
    alerts: [
      { category: '질병', level: 'green', description: '일반적인 감염병 주의' },
      { category: '자연재해', level: 'green', description: '사막 폭풍(봄) 주의' },
      { category: '범죄', level: 'green', description: '안전. 기본 주의만 필요' },
      { category: '교통', level: 'yellow', description: '우측 통행. 도로 안전 주의' },
      { category: '테러', level: 'yellow', description: '테러 위협 중간' },
      { category: '정치안정', level: 'yellow', description: '정치적 권위주의. 시위 피하기' },
      { category: '약물', level: 'orange', description: '불법 약물 극히 엄격히 금지' },
      { category: '기타', level: 'yellow', description: '식수·음식 안전 주의. 정제수 마실 것' }
    ],
    verified_at: '2026-09-14',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'KZ',
    countryNameKo: '카자흐스탄',
    countryNameEn: 'Kazakhstan',
    scopeType: 'all',
    scopeText: '전국',
    alerts: [
      { category: '질병', level: 'green', description: '일반적인 감염병 주의' },
      { category: '자연재해', level: 'green', description: '극한 날씨(겨울, 사막 폭풍)' },
      { category: '범죄', level: 'green', description: '안전. 기본 주의만 필요' },
      { category: '교통', level: 'yellow', description: '우측 통행. 광활한 도로 안전 주의' },
      { category: '테러', level: 'yellow', description: '테러 위협 중간' },
      { category: '정치안정', level: 'yellow', description: '정치적 권위주의' },
      { category: '약물', level: 'yellow', description: '불법 약물 금지' },
      { category: '기타', level: 'green', description: '식수·음식 안전 주의. 의료 시설 양호' }
    ],
    verified_at: '2026-09-14',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'AZ',
    countryNameKo: '아제르바이잔',
    countryNameEn: 'Azerbaijan',
    scopeType: 'all',
    scopeText: '전국',
    alerts: [
      { category: '질병', level: 'green', description: '일반적인 감염병 주의' },
      { category: '자연재해', level: 'yellow', description: '지진 위험(코카서스 지역)' },
      { category: '범죄', level: 'green', description: '안전. 기본 주의만 필요' },
      { category: '교통', level: 'yellow', description: '우측 통행. 도로 안전 주의' },
      { category: '테러', level: 'yellow', description: '테러 위협 중간' },
      { category: '정치안정', level: 'yellow', description: '정치적 긴장. 아르메니아 국경 피하기' },
      { category: '약물', level: 'yellow', description: '불법 약물 금지' },
      { category: '기타', level: 'green', description: '식수·음식 안전' }
    ],
    verified_at: '2026-09-13',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'CN',
    countryNameKo: '중국',
    countryNameEn: 'China',
    scopeType: 'region',
    scopeText: '베이징, 상하이, 시안, 쓰촨, 광저우',
    alerts: [
      { category: '질병', level: 'yellow', description: '호흡기 질환 주의(겨울)' },
      { category: '자연재해', level: 'yellow', description: '지진(서부), 홍수(여름) 위험' },
      { category: '범죄', level: 'green', description: '안전. 기본 주의만 필요' },
      { category: '교통', level: 'green', description: '우측 통행. 대중교통 안전' },
      { category: '테러', level: 'green', description: '낮은 위험' },
      { category: '정치안정', level: 'yellow', description: '정치적 권위주의. 종교·정치 민감' },
      { category: '약물', level: 'orange', description: '불법 약물 극히 엄격히 금지. 사형 가능' },
      { category: '기타', level: 'yellow', description: '공기질 주의(겨울). 의료 시설 양호' }
    ],
    verified_at: '2026-09-15',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'NP',
    countryNameKo: '네팔',
    countryNameEn: 'Nepal',
    scopeType: 'region',
    scopeText: '카트만두, 포카라, 에베레스트 베이스캠프',
    alerts: [
      { category: '질병', level: 'yellow', description: '고산병, 말라리아(테라이) 주의. 예방약 고려' },
      { category: '자연재해', level: 'yellow', description: '몬순(6-9월) 홍수, 산사태 위험' },
      { category: '범죄', level: 'yellow', description: '소매치기, 사기 주의. 야간 외출 제한' },
      { category: '교통', level: 'yellow', description: '좌측 통행. 산악도로 안전 주의' },
      { category: '테러', level: 'yellow', description: '테러 위협 중간' },
      { category: '정치안정', level: 'yellow', description: '정치적 긴장. 시위 피하기' },
      { category: '약물', level: 'yellow', description: '불법 약물 금지' },
      { category: '기타', level: 'yellow', description: '식수·음식 안전 주의. 정제수 마실 것' }
    ],
    verified_at: '2026-09-11',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'CR',
    countryNameKo: '코스타리카',
    countryNameEn: 'Costa Rica',
    scopeType: 'region',
    scopeText: '산호세, 산이사블로, 몬테베르데, 마누엘 안토니오',
    alerts: [
      { category: '질병', level: 'yellow', description: '뎅기열, 말라리아(태평양 해안) 주의' },
      { category: '자연재해', level: 'yellow', description: '태풍(9-10월), 화산 활동, 홍수 위험' },
      { category: '범죄', level: 'yellow', description: '소매치기, 강도 주의. 야간 외출 제한' },
      { category: '교통', level: 'yellow', description: '우측 통행. 도로 안전 주의' },
      { category: '테러', level: 'green', description: '낮은 위험' },
      { category: '정치안정', level: 'green', description: '안정적' },
      { category: '약물', level: 'yellow', description: '불법 약물 금지' },
      { category: '기타', level: 'yellow', description: '식수·음식 안전 주의' }
    ],
    verified_at: '2026-09-10',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'PE',
    countryNameKo: '페루',
    countryNameEn: 'Peru',
    scopeType: 'region',
    scopeText: '리마, 쿠스코, 마추픽추, 우루밤바 계곡',
    alerts: [
      { category: '질병', level: 'yellow', description: '고산병, 말라리아(아마존) 주의. 예방약 고려' },
      { category: '자연재해', level: 'yellow', description: '산사태, 홍수(우기: 11-3월) 위험' },
      { category: '범죄', level: 'yellow', description: '리마·쿠스코 소매치기, 강도 주의' },
      { category: '교통', level: 'yellow', description: '우측 통행. 산악도로 안전 주의' },
      { category: '테러', level: 'yellow', description: '테러 위협 중간(산악 지역)' },
      { category: '정치안정', level: 'yellow', description: '정치적 불안정. 시위 피하기' },
      { category: '약물', level: 'orange', description: '불법 약물 극히 엄격히 금지' },
      { category: '기타', level: 'yellow', description: '식수·음식 안전 주의. 정제수 마실 것' }
    ],
    verified_at: '2026-09-09',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'CL',
    countryNameKo: '칠레',
    countryNameEn: 'Chile',
    scopeType: 'all',
    scopeText: '전국',
    alerts: [
      { category: '질병', level: 'green', description: '일반적인 감염병 주의' },
      { category: '자연재해', level: 'yellow', description: '지진, 화산 활동 위험(남부)' },
      { category: '범죄', level: 'yellow', description: '산티아고 소매치기 주의. 야간 외출 제한' },
      { category: '교통', level: 'green', description: '우측 통행. 교통 안전' },
      { category: '테러', level: 'green', description: '낮은 위험' },
      { category: '정치안정', level: 'yellow', description: '정치적 긴장. 시위 피하기' },
      { category: '약물', level: 'yellow', description: '불법 약물 금지' },
      { category: '기타', level: 'green', description: '식수·음식 안전. 의료 시설 우수' }
    ],
    verified_at: '2026-09-10',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'MA',
    countryNameKo: '모로코',
    countryNameEn: 'Morocco',
    scopeType: 'region',
    scopeText: '카사블랑카, 마라케시, 페즈, 아가디르, 탕헤르',
    alerts: [
      { category: '질병', level: 'yellow', description: '말라리아(남부) 주의. 예방약 고려' },
      { category: '자연재해', level: 'green', description: '지진 위험(낮음)' },
      { category: '범죄', level: 'yellow', description: '관광지 소매치기, 사기 주의' },
      { category: '교통', level: 'yellow', description: '우측 통행. 교통 혼잡 주의' },
      { category: '테러', level: 'yellow', description: '테러 위협 중간' },
      { category: '정치안정', level: 'green', description: '대체로 안정. 종교·정치 민감' },
      { category: '약물', level: 'orange', description: '불법 약물 극히 엄격히 금지' },
      { category: '기타', level: 'yellow', description: '식수·음식 안전 주의. 정제수 마실 것' }
    ],
    verified_at: '2026-09-12',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'TN',
    countryNameKo: '튀니지',
    countryNameEn: 'Tunisia',
    scopeType: 'region',
    scopeText: '튀니스, 수스, 제르바섬, 토즈르, 사하라',
    alerts: [
      { category: '질병', level: 'yellow', description: '말라리아(남부) 주의. 예방약 고려' },
      { category: '자연재해', level: 'green', description: '사막 폭풍(봄) 주의' },
      { category: '범죄', level: 'yellow', description: '관광지 소매치기 주의' },
      { category: '교통', level: 'yellow', description: '우측 통행. 교통 혼잡 주의' },
      { category: '테러', level: 'yellow', description: '테러 위협 중간(국경 지역)' },
      { category: '정치안정', level: 'yellow', description: '정치적 긴장. 시위 피하기' },
      { category: '약물', level: 'orange', description: '불법 약물 극히 엄격히 금지' },
      { category: '기타', level: 'yellow', description: '식수·음식 안전 주의' }
    ],
    verified_at: '2026-09-11',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'KE',
    countryNameKo: '케냐',
    countryNameEn: 'Kenya',
    scopeType: 'region',
    scopeText: '나이로비, 몸바사, 마사이 마라, 나쿠루',
    alerts: [
      { category: '질병', level: 'yellow', description: '말라리아, 황열병 주의. 예방약 필수' },
      { category: '자연재해', level: 'yellow', description: '가뭄(가끔), 홍수(우기) 위험' },
      { category: '범죄', level: 'orange', description: '도시 중심부 야간 외출 금지. 강도 위협' },
      { category: '교통', level: 'yellow', description: '좌측 통행. 교통 안전 주의' },
      { category: '테러', level: 'yellow', description: '테러 위협 중간(소말리아 국경)' },
      { category: '정치안정', level: 'yellow', description: '정치적 긴장(선거 후). 시위 피하기' },
      { category: '약물', level: 'yellow', description: '불법 약물 금지' },
      { category: '기타', level: 'yellow', description: '식수·음식 안전 주의. 야생동물 안전 가이드 필수' }
    ],
    verified_at: '2026-09-10',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'TZ',
    countryNameKo: '탄자니아',
    countryNameEn: 'Tanzania',
    scopeType: 'region',
    scopeText: '다르에살람, 아루샤, 킬리만자로, 잔지바르',
    alerts: [
      { category: '질병', level: 'yellow', description: '말라리아, 황열병 주의. 예방약 필수' },
      { category: '자연재해', level: 'green', description: '화산 활동(키리만자로) 관찰' },
      { category: '범죄', level: 'yellow', description: '도시 야간 외출 제한. 소매치기 주의' },
      { category: '교통', level: 'yellow', description: '좌측 통행. 도로 안전 주의' },
      { category: '테러', level: 'yellow', description: '테러 위협 중간' },
      { category: '정치안정', level: 'green', description: '대체로 안정' },
      { category: '약물', level: 'yellow', description: '불법 약물 금지' },
      { category: '기타', level: 'yellow', description: '식수·음식 안전 주의. 야생동물 안전 가이드 필수' }
    ],
    verified_at: '2026-09-10',
    source: '외교부 여행 안전 정보'
  },
  {
    countryCode: 'UG',
    countryNameKo: '우간다',
    countryNameEn: 'Uganda',
    scopeType: 'region',
    scopeText: '캄팔라, 포르탈, 퀸엘리자베스 국립공원',
    alerts: [
      { category: '질병', level: 'yellow', description: '말라리아, 황열병 주의. 예방약 필수' },
      { category: '자연재해', level: 'yellow', description: '홍수(우기: 3-5월, 10-11월) 위험' },
      { category: '범죄', level: 'orange', description: '도시 야간 외출 금지. 강도 위협' },
      { category: '교통', level: 'yellow', description: '좌측 통행. 도로 안전 주의' },
      { category: '테러', level: 'yellow', description: '테러 위협 중간(국경 지역)' },
      { category: '정치안정', level: 'yellow', description: '정치적 권위주의' },
      { category: '약물', level: 'yellow', description: '불법 약물 금지' },
      { category: '기타', level: 'yellow', description: '식수·음식 안전 주의. 의료 시설 제한' }
    ],
    verified_at: '2026-09-09',
    source: '외교부 여행 안전 정보'
  }
];

/**
 * 안전정보 검증: 국가 수 확인
 * REQ-FUNC-046~054 구현 — 해외 국가별 안전정보 보증
 */
export function validateCountrySafety(): string[] {
  const errors: string[] = [];
  const uniqueCountries = new Set(countrySafetyData.map(c => c.countryCode));

  if (countrySafetyData.length < 23) {
    errors.push(`Country count < 23 (currently ${countrySafetyData.length})`);
  }
  if (uniqueCountries.size !== countrySafetyData.length) {
    errors.push(`Duplicate countryCode entries found (${countrySafetyData.length} rows, ${uniqueCountries.size} unique)`);
  }

  countrySafetyData.forEach((country, idx) => {
    if (!country.countryCode || !country.countryNameKo || !country.countryNameEn) {
      errors.push(`Entry ${idx}: Missing country name fields`);
    }
    if (!country.alerts || country.alerts.length !== 8) {
      errors.push(`Entry ${idx} (${country.countryCode}): Must have exactly 8 alert categories (has ${country.alerts?.length || 0})`);
    }
    if (!country.verified_at || !/^\d{4}-\d{2}-\d{2}$/.test(country.verified_at)) {
      errors.push(`Entry ${idx} (${country.countryCode}): verified_at must be ISO date format`);
    }
    if (!country.source) {
      errors.push(`Entry ${idx} (${country.countryCode}): Missing source`);
    }
    if (!country.scopeType || !country.scopeText) {
      errors.push(`Entry ${idx} (${country.countryCode}): Missing scope information`);
    }
  });

  return errors;
}

/**
 * 안전정보 통계
 * REQ-FUNC-049 실현 — 모든 해외 국가의 안전정보 단일 소스 보증
 */
export function getCountrySafetyStats() {
  return {
    total_countries: countrySafetyData.length,
    unique_countries: new Set(countrySafetyData.map(c => c.countryCode)).size,
    countries_list: countrySafetyData.map(c => c.countryNameEn).sort(),
    alerts_per_country: countrySafetyData[0]?.alerts.length || 0,
    validation_errors: validateCountrySafety(),
  };
}
