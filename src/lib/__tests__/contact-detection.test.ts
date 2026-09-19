import { describe, expect, it } from 'vitest';
import { detectContactInfo } from '@/components/scr003/MateWriteForm';

/**
 * UNIT-CONTACT-DETECTION
 * REQ-FUNC-032 (regex-based client-side contact-info detection)
 *
 * Tests the real exported function from CMP-SCR003-MATE-WRITE. The
 * server-side mirror (`containsContactInfo` in src/app/api/mates/route.ts)
 * uses the identical pattern set by design (documented there) and isn't
 * re-tested separately here.
 *
 * AC target: ≥95% detection on a positive sample set, ≤5% false-positive
 * rate on a negative sample set — asserted as aggregate rates below, plus
 * a few individual cases spot-checked for clarity.
 */

const POSITIVE_SAMPLES = [
  '연락처는 010-1234-5678입니다',
  '제 번호는 01012345678이에요',
  '010.1234.5678로 연락주세요',
  '010 1234 5678 이 번호로 문자주세요',
  '이메일은 traveler@example.com 입니다',
  'contact.me+trip@gmail.com 으로 메일 주세요',
  '카카오톡 아이디는 free_trip 입니다',
  '카톡 아이디 알려주시면 먼저 연락드릴게요',
  '카톡으로 편하게 얘기해요',
  '라인 아이디: mytriplife',
  '텔레그램으로 연락주세요',
  '인스타 DM으로 대화해요',
  '인스타그램 디엠 주세요',
  '제 폰번호 010-9876-5432 저장해두세요',
  '070-1234-5678 로도 연락 가능해요',
];

const NEGATIVE_SAMPLES = [
  '3박4일 일정으로 여행 예정입니다',
  '20대 여성 여행자 환영합니다',
  '맛집 탐방 위주로 다닐 예정이에요',
  '느긋한 일정으로 여유롭게 다니고 싶어요',
  '같이 사진 찍으러 다녀요',
  '오사카 도톤보리와 오사카성을 갈 예정입니다',
  '숙소는 이미 예약했고 항공권만 각자 구매하면 돼요',
  '자유여행 스타일이라 정해진 일정은 없어요',
  '함께 다닐 동행을 구합니다',
  '역사와 미술관에 관심 있는 분이면 좋겠어요',
  '3명 정도 함께하면 좋을 것 같아요',
  '현지 음식을 좋아하는 분과 함께하고 싶어요',
  '아침 일찍 출발해서 저녁 늦게 숙소로 돌아오는 일정이에요',
  '배낭여행 경험이 있으신 분이면 더 좋아요',
  '여행 스타일이 잘 맞았으면 좋겠습니다',
  '트레킹과 액티비티를 좋아합니다',
  '조용한 여행지를 선호해요',
  '첫날은 시내 관광, 둘째날은 근교 투어입니다',
  '사진 찍는 걸 좋아하는 분과 함께하고 싶어요',
  '유적지 위주로 돌아볼 예정입니다',
];

describe('detectContactInfo', () => {
  it('detects phone numbers with various separators', () => {
    expect(detectContactInfo('010-1234-5678')).toBe(true);
    expect(detectContactInfo('01012345678')).toBe(true);
    expect(detectContactInfo('010.1234.5678')).toBe(true);
  });

  it('detects email addresses', () => {
    expect(detectContactInfo('me@example.com')).toBe(true);
  });

  it('detects messenger mentions', () => {
    expect(detectContactInfo('카카오톡 아이디 알려주세요')).toBe(true);
    expect(detectContactInfo('텔레그램으로 연락주세요')).toBe(true);
  });

  it('does not flag ordinary trip-planning text', () => {
    expect(detectContactInfo('3박4일 일정으로 여행 예정입니다')).toBe(false);
    expect(detectContactInfo('맛집 탐방 위주로 다닐 예정이에요')).toBe(false);
  });

  it('achieves >=95% detection rate on the positive sample set', () => {
    const detected = POSITIVE_SAMPLES.filter((s) => detectContactInfo(s)).length;
    const rate = detected / POSITIVE_SAMPLES.length;
    expect(rate).toBeGreaterThanOrEqual(0.95);
  });

  it('achieves <=5% false-positive rate on the negative sample set', () => {
    const falsePositives = NEGATIVE_SAMPLES.filter((s) => detectContactInfo(s)).length;
    const rate = falsePositives / NEGATIVE_SAMPLES.length;
    expect(rate).toBeLessThanOrEqual(0.05);
  });
});
