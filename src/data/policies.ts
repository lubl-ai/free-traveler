/**
 * Policy content — TypeScript static module for Terms, Privacy, Safety rules, and Disclaimers
 * REQ-FUNC-080
 *
 * Single source of truth for policy content and consent version tracking
 */

export interface PolicyContent {
  id: 'terms' | 'privacy' | 'safety' | 'disclaimer';
  title: string;
  titleEn: string;
  version: string;
  lastUpdated: string; // ISO date
  content: string;
  contentEn?: string;
}

export interface ConsentRecord {
  policyId: 'terms' | 'privacy' | 'safety' | 'disclaimer';
  version: string;
  agreedAt: string; // ISO timestamp
}

export const policies: PolicyContent[] = [
  {
    id: 'terms',
    title: 'Free Traveler 이용약관',
    titleEn: 'Free Traveler Terms of Service',
    version: '1.0',
    lastUpdated: '2026-09-17',
    content: `## Free Traveler 이용약관

제1조 목적
이 약관은 free_traveler(이하 "회사")가 제공하는 여행 준비 및 동행 매칭 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 약관의 효력 및 변경
1. 이 약관은 서비스에 가입한 모든 이용자에게 적용됩니다.
2. 회사는 필요한 경우 이 약관을 변경할 수 있으며, 변경 내용은 서비스 공지사항을 통해 30일 이전에 공지됩니다.
3. 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단할 수 있습니다.

제3조 서비스 이용
1. 만 19세 이상의 성인만 가입할 수 있습니다.
2. 이용자는 정확한 정보를 제공하여야 하며, 제공된 정보의 정확성을 유지할 책임이 있습니다.
3. 회사는 이용자의 행동으로 인한 모든 책임을 이용자가 지게 됨을 알립니다.

제4조 서비스 중단 및 계약 해제
1. 회사는 이용자가 본 약관을 위반하는 경우 서비스 이용을 제한하거나 계약을 해제할 수 있습니다.
2. 이용자는 언제든지 서비스 계약을 해제할 수 있습니다.

제5조 면책
회사는 자연재해, 전쟁, 테러, 정부 조치 등 불가항력적 사유로 인한 서비스 중단에 대해 책임지지 않습니다.`,
    contentEn: `## Free Traveler Terms of Service

Article 1 Purpose
These terms regulate the rights, obligations, and responsibilities of the Company and Users regarding the travel preparation and mate-matching service provided by Free Traveler.

Article 2 Effect and Modification
1. These terms apply to all users of the Service.
2. The Company may modify these terms with 30 days' notice via service announcements.
3. If you disagree with modified terms, you may discontinue using the Service.

Article 3 Service Use
1. Only adults 19 years or older can register.
2. Users must provide accurate information and maintain accuracy.
3. Users are responsible for all consequences of their actions.

Article 4 Service Suspension
1. The Company may restrict or terminate service if Users violate these terms.
2. Users may terminate service contracts at any time.

Article 5 Liability Disclaimer
The Company is not responsible for service interruptions due to force majeure events including natural disasters, war, terrorism, or government actions.`,
  },
  {
    id: 'privacy',
    title: 'Free Traveler 개인정보처리방침',
    titleEn: 'Free Traveler Privacy Policy',
    version: '1.0',
    lastUpdated: '2026-09-17',
    content: `## Free Traveler 개인정보처리방침

1. 수집 항목
- 필수: 이메일, 비밀번호, 이름, 생년월일, 휴대폰 번호
- 선택: 프로필 사진, 자기소개, 여행 스타일
- 자동 수집: IP 주소, 방문 기록, 클릭 로그

2. 이용 목적
- 서비스 제공 및 사용자 식별
- 서비스 개선 및 통계 분석
- 보안 및 사기 방지
- 법적 의무 이행

3. 보관 기간
- 서비스 이용 종료 후 30일: 계정 복구를 위한 임시 보관
- 법적 보존 의무가 있는 항목: 관련 법령이 규정하는 기간

4. 이용자 권리
- 개인정보 열람, 수정, 삭제 요청 권리
- 개인정보 처리 동의 철회 권리
- 이의 제기 및 피해 구제 요청 권리

5. 제3자 제공
회사는 다음 경우를 제외하고 개인정보를 제3자에게 제공하지 않습니다:
- 법적 의무가 있는 경우
- 이용자 동의가 있는 경우
- 긴급 상황에서 이용자 보호가 필요한 경우`,
    contentEn: `## Free Traveler Privacy Policy

1. Collected Information
- Required: Email, password, name, date of birth, phone number
- Optional: Profile photo, bio, travel style
- Automatically collected: IP address, visit history, click logs

2. Use Purposes
- Service provision and user identification
- Service improvement and statistical analysis
- Security and fraud prevention
- Legal obligation compliance

3. Retention Period
- 30 days after service termination: Temporary storage for account recovery
- Items with legal retention obligations: As regulated by applicable laws

4. User Rights
- Right to access, modify, or delete personal information
- Right to withdraw consent to personal information processing
- Right to object and request damage compensation

5. Third-Party Disclosure
The Company does not disclose personal information to third parties except:
- When legally required
- With user consent
- In emergency situations requiring user protection`,
  },
  {
    id: 'safety',
    title: 'Free Traveler 동행 안전수칙',
    titleEn: 'Free Traveler Mate Safety Rules',
    version: '1.0',
    lastUpdated: '2026-09-17',
    content: `## Free Traveler 동행 안전수칙

이 안전수칙은 free_traveler 플랫폼에서 안전하고 신뢰할 수 있는 동행 경험을 제공하기 위해 모든 사용자가 준수해야 할 기본 원칙입니다.

### 1. 신원 확인 및 신뢰
- 프로필 정보는 정확하고 최신으로 유지하세요
- 다른 사용자의 신원과 신뢰도를 충분히 검증한 후 동행을 결정하세요
- 개인 정보(주소, 가족 정보, 금융 정보)는 절대 공유하지 마세요

### 2. 여행 전 소통
- 동행을 시작하기 전에 명확한 일정과 비용을 합의하세요
- 대중교통, 숙소, 일정 등에 대해 충분히 논의하세요
- 의사소통이 불편하면 동행을 중단하세요

### 3. 여행 중 안전
- 항상 신뢰할 수 있는 사람에게 여행 계획을 알려주세요
- 대중교통과 숙소의 위치를 주기적으로 확인하세요
- 불편하거나 위험한 상황이 발생하면 즉시 보고하세요
- 밤 늦게 혼자 외출하지 마세요

### 4. 금전 거래
- 모든 비용을 투명하게 정산하세요
- 숙소비, 식사비 등을 미리 합의하고 기록하세요
- 의심스러운 금전 요청은 거절하세요

### 5. 문제 발생 시
- free_traveler에 즉시 신고하세요
- 증거(메시지, 영수증, 사진)를 보관하세요
- 필요시 경찰에 신고하세요
- 다른 사용자들과 안전 정보를 공유하세요

### 6. 금지 사항
- 불건전한 제안이나 강압적 행동
- 개인 정보의 무단 공개
- 금전 사기나 협박
- 성희롱이나 차별
- 불법 활동 조장

이 안전수칙을 준수하지 않는 사용자는 서비스 이용이 제한될 수 있습니다.`,
    contentEn: `## Free Traveler Mate Safety Rules

These safety rules are fundamental principles that all users on the Free Traveler platform must follow to ensure a safe and trustworthy mate-travel experience.

### 1. Identity Verification and Trust
- Keep your profile information accurate and up-to-date
- Thoroughly verify other users' identity and trustworthiness before deciding to travel together
- Never share personal information (address, family details, financial information)

### 2. Pre-Travel Communication
- Agree on a clear itinerary and costs before starting a mate journey
- Discuss transportation, accommodation, and schedule in detail
- Stop communication if it becomes uncomfortable

### 3. Safety During Travel
- Always inform a trusted person of your travel plans
- Periodically verify transportation and accommodation locations
- Report immediately if uncomfortable or dangerous situations arise
- Avoid going out alone late at night

### 4. Financial Transactions
- Settle all expenses transparently
- Pre-agree and record accommodation, meal costs, etc.
- Reject suspicious financial requests

### 5. If Problems Occur
- Report immediately to Free Traveler
- Keep evidence (messages, receipts, photos)
- Report to police if necessary
- Share safety information with other users

### 6. Prohibited Conduct
- Inappropriate proposals or coercive behavior
- Unauthorized disclosure of personal information
- Financial fraud or extortion
- Sexual harassment or discrimination
- Promotion of illegal activities

Users who violate these safety rules may have their service access restricted.`,
  },
  {
    id: 'disclaimer',
    title: 'Free Traveler 콘텐츠 면책 안내',
    titleEn: 'Free Traveler Content Disclaimer',
    version: '1.0',
    lastUpdated: '2026-09-17',
    content: `## Free Traveler 콘텐츠 면책 안내

### 여행지 정보 및 안전 정보
- Free Traveler에서 제공하는 여행지 정보, 안전 정보, 예산 정보는 참고용입니다
- 실제 여행 전에 공식 정부 기관(외교부 여행 안전 정보 등)에서 최신 정보를 확인하세요
- 정보의 정확성, 완전성, 적시성을 보장하지 않습니다
- 제공 정보 사용으로 인한 손해는 책임지지 않습니다

### 사용자 생성 콘텐츠 (동행글, 리뷰)
- 사용자가 작성한 동행글, 리뷰, 피드백은 개인의 주관적 의견입니다
- Free Traveler는 사용자 콘텐츠의 정확성을 보장하지 않습니다
- 사용자는 자신이 작성한 콘텐츠에 대해 전적인 책임을 집니다
- 부정확하거나 해로운 콘텐츠는 신고해 주세요

### 제3자 서비스
- 항공편, 숙소, 버스 예약 등 제3자 서비스로의 링크 제공
- Free Traveler는 제3자 서비스의 품질, 정확성, 안전성을 보장하지 않습니다
- 제3자 서비스 사용으로 인한 문제는 해당 서비스 제공자에게 책임이 있습니다

### 사진 및 미디어
- 제공된 사진, 영상은 참고용이며 실제 상황과 다를 수 있습니다
- 사용자는 사진 사용 시 저작권 및 개인정보 보호법을 준수해야 합니다
- 저작권 침해 또는 개인정보 침해 콘텐츠는 신고해 주세요

### 면책 조항
Free Traveler는 다음에 대해 책임지지 않습니다:
- 정보 제공으로 인한 모든 손해
- 사용자 간 분쟁
- 여행 중 발생한 사고, 질병, 범죄
- 제3자 서비스 장애 또는 손해
- 예측 불가능한 사건(자연재해, 전쟁, 전염병 등)`,
    contentEn: `## Free Traveler Content Disclaimer

### Travel and Safety Information
- Destination information, safety information, and budget data provided by Free Traveler are for reference only
- Verify the latest information from official government agencies (e.g., Ministry of Foreign Affairs travel advisories) before your trip
- We do not guarantee accuracy, completeness, or timeliness of information
- We are not responsible for damages resulting from use of provided information

### User-Generated Content (Mate Posts, Reviews)
- User-written mate posts, reviews, and feedback are subjective personal opinions
- Free Traveler does not guarantee the accuracy of user content
- Users are solely responsible for content they create
- Please report inaccurate or harmful content

### Third-Party Services
- Links to third-party services for flights, accommodations, bus bookings, etc.
- Free Traveler does not guarantee the quality, accuracy, or safety of third-party services
- Problems arising from third-party service use are the responsibility of the respective service provider

### Photos and Media
- Provided photos and videos are for reference only and may differ from actual situations
- Users must comply with copyright and privacy laws when using photos
- Please report copyright or privacy violation content

### Liability Disclaimer
Free Traveler is not responsible for:
- All damages resulting from provided information
- Disputes between users
- Accidents, illness, or crimes occurring during travel
- Third-party service failures or damages
- Unforeseeable events (natural disasters, war, pandemics, etc.)`,
  },
];

/**
 * Get policy content by ID
 */
export function getPolicy(id: 'terms' | 'privacy' | 'safety' | 'disclaimer'): PolicyContent | undefined {
  return policies.find(p => p.id === id);
}

/**
 * Get all policy IDs and versions (for consent tracking)
 */
export function getPolicyVersions(): Record<string, string> {
  const versions: Record<string, string> = {};
  policies.forEach(p => {
    versions[p.id] = p.version;
  });
  return versions;
}

/**
 * Validate consent records - check if all required policies have been consented to with current versions
 */
export function validateConsents(consents: ConsentRecord[]): { valid: boolean; missingPolicies: string[] } {
  const currentVersions = getPolicyVersions();
  const consentedIds = new Set(consents.map(c => c.policyId));
  const missingPolicies: string[] = [];

  Object.keys(currentVersions).forEach(policyId => {
    if (!consentedIds.has(policyId as ConsentRecord['policyId'])) {
      missingPolicies.push(policyId);
    }
  });

  return {
    valid: missingPolicies.length === 0,
    missingPolicies,
  };
}
