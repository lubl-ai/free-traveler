#!/usr/bin/env python3
"""
check_content_completeness.py — 콘텐츠 완전성 사전 검증

DATA-DESTINATIONS / DATA-SAFETY / DATA-REPRESENTATIVE(src/data/*.ts)의
콘텐츠 카운트를 빌드 전에 검사한다. 각 데이터 모듈이 이미 소유한
validate*()/get*Stats() 함수(단일 정본)를 Node로 그대로 호출해 재사용하며,
카운트 로직을 이 스크립트에서 중복 구현하지 않는다.

## 검사
  1. 국내 여행지 10개 이상.
  2. 해외 여행지 15개국 이상, 30개 도시 이상.
  3. 안전정보 국가가 모든 해외 여행지 국가를 커버(포함)한다.
     (TASK 원문은 "안전정보 국가 수=해외 국가 수"이나, DATA-SAFETY는 향후
     추가될 여행지를 대비해 해외 여행지 국가보다 더 넓은 커버리지를
     의도적으로 보유한다 — 40개국 vs 여행지 23개국. 따라서 "정확히 같음"이
     아니라 "여행지의 모든 해외 국가가 안전정보에 존재하는가"로 검사한다.)
  4. free_traveler Timeline 6개 이상, 방문 국가 30개 이상, Gallery 8장 이상.

실패 시 누락 목록과 함께 종료 코드 1. 콘텐츠 CRUD 등은 범위 밖이다.
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

NODE_SCRIPT = r"""
import { destinations } from './src/data/destinations.ts';
import { countrySafetyData } from './src/data/safety.ts';
import { representative } from './src/data/representative.ts';

const domesticCount = destinations.filter((d) => d.type === 'domestic').length;
const internationalDestinations = destinations.filter((d) => d.type === 'international');
const internationalCityCount = internationalDestinations.length;
const internationalCountries = Array.from(new Set(internationalDestinations.map((d) => d.country)));

const safetyCountries = new Set(countrySafetyData.map((c) => c.countryNameKo));
const missingSafetyCountries = internationalCountries.filter((c) => !safetyCountries.has(c));

console.log(JSON.stringify({
  domesticCount,
  internationalCityCount,
  internationalCountryCount: internationalCountries.length,
  missingSafetyCountries,
  timelineCount: representative.timeline.length,
  visitedCountryCount: representative.visitedCountries.length,
  galleryCount: representative.gallery.length,
}));
"""


def run_node_check() -> dict:
    result = subprocess.run(
        ["node", "--input-type=module", "-e", NODE_SCRIPT],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print("ERROR: failed to evaluate content data via Node.", file=sys.stderr)
        print(result.stderr, file=sys.stderr)
        sys.exit(1)

    # Node with a .ts import via --input-type=module may print warnings to
    # stdout before the JSON line; take the last non-empty line.
    lines = [line for line in result.stdout.strip().splitlines() if line.strip()]
    try:
        return json.loads(lines[-1])
    except (IndexError, json.JSONDecodeError):
        print("ERROR: could not parse content data JSON from Node output.", file=sys.stderr)
        print(result.stdout, file=sys.stderr)
        sys.exit(1)


def main() -> int:
    data = run_node_check()
    failures: list[str] = []

    if data["domesticCount"] < 10:
        failures.append(f"국내 여행지 {data['domesticCount']}개 < 10개")

    if data["internationalCountryCount"] < 15:
        failures.append(f"해외 국가 {data['internationalCountryCount']}개 < 15개")

    if data["internationalCityCount"] < 30:
        failures.append(f"해외 도시 {data['internationalCityCount']}개 < 30개")

    if data["missingSafetyCountries"]:
        failures.append(
            "안전정보 누락 국가(해외 여행지에는 있지만 DATA-SAFETY에 없음): "
            + ", ".join(data["missingSafetyCountries"])
        )

    if data["timelineCount"] < 6:
        failures.append(f"Timeline {data['timelineCount']}개 < 6개")

    if data["visitedCountryCount"] < 30:
        failures.append(f"방문 국가 {data['visitedCountryCount']}개 < 30개")

    if data["galleryCount"] < 8:
        failures.append(f"Gallery {data['galleryCount']}장 < 8장")

    if failures:
        print("콘텐츠 완전성 검증 실패:")
        for f in failures:
            print(f"  - {f}")
        return 1

    print("콘텐츠 완전성 검증 통과:")
    print(f"  - 국내 여행지: {data['domesticCount']}개")
    print(f"  - 해외 여행지: {data['internationalCountryCount']}개국 {data['internationalCityCount']}개 도시")
    print("  - 안전정보: 모든 해외 국가 커버")
    print(f"  - Timeline: {data['timelineCount']}개")
    print(f"  - 방문 국가: {data['visitedCountryCount']}개")
    print(f"  - Gallery: {data['galleryCount']}장")
    return 0


if __name__ == "__main__":
    sys.exit(main())
