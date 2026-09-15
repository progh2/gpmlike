# LEGAL.md — 저작권·제휴 경계

**KO가 기준 문서입니다.** Short EN bullets follow each section.

이 저장소는 *Gunparade March*의 **시스템 형태와 톤**에서만 영감을 받은 **오리지널 웹게임**입니다. 리메이크·팬게임·비공식 이식본이 아닙니다.

This repo is an **original** web game inspired only by publicly described *systems and tone*. It is **not** a remake, fan game, or unofficial port.

---

## 1. 무관 고지 · Unaffiliated

**소니(Sony Interactive Entertainment), 소프thouse(softhouse-Chara 등), Alfa System, J.C.Staff, 기타 GPM 권리자와 제휴·허가·후원 관계가 없습니다.**

- EN: **Not affiliated with** Sony Interactive Entertainment, softhouse-Chara, Alfa System, J.C.Staff, or any Gunparade March rights holder.
- 제품명·스토어 카피·README에서 “공식”, “허가됨”, “spiritual successor of [보호 타이틀]” 같은 **제휴·계승 주장을 만들지 말 것**.
- EN: Do **not** invent affiliation, endorsement, or “official successor” claims.

---

## 2. 허용 에셋 · Allowed assets

제품(UI, 런타임, 배포 빌드)에 넣을 수 있는 것:

- [ ] **라이선스가 명확한 VRM** — 슬롯 메타에 `license` + `licenseUrl` 필수. 공개 라이선스 예: VRoid Studio β AvatarSample **CC0**, 또는 VRM Consortium / `@pixiv/three-vrm` 공식 샘플의 **VRM Public License 1.0**(핫링크, 바이너리 미커밋). → [`docs/design/vrm-slots.md`](design/vrm-slots.md)
- [ ] **CC0** 또는 재배포·사용 조건이 문서로 확인된 서드파티 에셋 (요청된 크레딧 유지)
- [ ] **자체 제작** 텍스트·아트·오디오·모델
- [ ] 우리 TypeScript / Vite / Three.js 코드 (MIT — [`LICENSE`](../LICENSE))

EN allowed: clear-license VRM, CC0, self-made only. No “we found it on a forum” models.

`docs/research/` 조사 노트는 **내부 영감**입니다. 제품 픽션·고유명사는 [`docs/design/original-pitch.md`](design/original-pitch.md)만 사용합니다.

---

## 3. 금지 · Forbidden (product UI / copy / assets)

다음을 **제품 UI, 카피, 커밋된 에셋, 플레이스홀더**에 넣지 않습니다.

| 금지 · Forbidden | 이유 |
| --- | --- |
| 원작 **대사·스크립트·음성** | 저작권 대사 |
| GPM / 관련 매체 **캐릭터 고유명사** | 팬게임화 |
| GPM **메카·부대·병기 고유명사** | 상표·설정 복제 |
| **Action Code** 알파벳 표 전체/부분 이식 | 전투 문법 복제 |
| 원작 **맵 상표·실제 상점 브랜드**를 게임 IP처럼 사용 | 상표 |
| **ROM / ISO / 세이브 / 추출 데이터** | 불법 복제물 |
| 립 **스프라이트·3D·UI·폰트·OST·SFX** | 에셋 도용 |
| 조사 중 캡처한 **저작권 아트 스크린샷**을 인게임 플레이스홀더로 커밋 | 여전히 원작 아트 |
| UI에 GPM 일본어 스탯명 (`体力` / `気力` / `運動力` 원문 등) | 제품은 오리지널 ID만 |

EN forbidden: original dialogue; character/mech proper nouns; Action Code tables; map trademarks; ROM/rips; shipping research screenshots of copyrighted art as placeholders; GPM Japanese stat names in UI.

조사 문서에 **장문 인용**을 붙이지 말 것. URL + 한 줄 요약만 (`docs/research/SOURCES.md`).

---

## 4. 연령·콘텐츠 · Age / content

- 미성년자를 **성애화하지 말 것**.
- 생도(cadet) 프레이밍은 **18+로 연령을 올리거나**, 나이를 특정하지 않는 **추상 생도**로 둘 것.
- `Bond` 축은 옵트인 성인 콘텐츠 플래그 — 기본 프로필에 강요하지 말 것.
- EN: Avoid sexualization of minors; age-up or abstract cadet framing.

---

## 5. PR 팀 체크리스트 · Team checklist (paste into PRs)

콘텐츠·카피·에셋이 있는 PR은 머지 전에 아래를 모두 확인합니다.

- [ ] UI / 인게임 카피에 **GPM 캐릭터명·메카명·고유명사 없음**
- [ ] UI에 **GPM 일본어 스탯명** (`体力` / `気力` / …) 없음 — `Body` `Drive` `Focus` `Mind` `Presence` `Morale` `Voice` `Trust` `Bond` `Roles`만
- [ ] **원작 대사**, **Action Code 표**, **맵 상표명** 없음
- [ ] **ROM / 립 에셋 / OST** 없음
- [ ] 저작권 아트 **조사 스크린샷을 플레이스홀더로 커밋하지 않음**
- [ ] VRM을 추가·교체했다면 PR 본문에 **`license` + `licenseUrl` (+ 출처)** 를 적음
- [ ] 기본 샘플 VRM은 **공개 라이선스 / CC0 / 자체** — GPM 룩어라이크 모델 없음
- [ ] 미성년 **성애화 없음**; 생도는 연령 상향 또는 추상 프레이밍
- [ ] 소니 / 소프thouse / GPM 권리자 **제휴 주장 없음**
- [ ] 새 고유명사는 [`original-pitch.md`](design/original-pitch.md)와 맞음 (`docs/research/`에서 제품 이름을 끌어오지 않음)

EN review: no GPM names in UI, no ripped assets, VRM license note in the PR, no affiliation claims.

---

## 6. 리뷰어 절차 · Reviewer steps

1. diff에서 GPM 고유명사가 *우리* 캐스트·기체·지명으로 쓰였는지 검색한다.
2. 새 바이너리/모델에 라이선스 노트가 있는지 확인한다.
3. research 페이지가 장문 인용·원작 아트 임베드를 하지 않았는지 확인한다.

Questions → keep the asset out of the product until legal review.