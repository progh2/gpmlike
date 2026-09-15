# original-pitch.md — 누리학기 / Nuri Term

**#3 deliverable.** 제품 픽션은 이 파일만. `docs/research/`는 내부 영감이며 고유명사를 여기로 옮기지 말 것.

Working title for *our* game. **No Gunparade March names.**

---

## 1. One-line pitch · 한 줄

**KO:** 해안 생도학원의 *동료 한 명*으로 짧은 학기를 버티는 오리지널 웹 심 — Voice로 관계와 보급을 다루고, 끼어드는 당직 전투를 넘긴다.

**EN:** An original seasonal web sim: one peer at a coastal cadet academy, spending Voice on people and logistics, surviving interrupt watches — fiction and cast wholly original.

---

## 2. Pillars · 필러 (research-aligned)

조사(`docs/research/day-loop.md`, `design-implications`, `world-tone`)와 맞춘 **잠금 필러**. 구현 이름만 오리지널.

| # | Pillar | 우리 게임에서 |
| --- | --- | --- |
| 1 | **Calendar survival** | 시즌(`SeasonLength` 14–21일)을 버티면 승리. 최종보스 격파가 아님 |
| 2 | **Interrupt combat** | `CRISIS` → `SortieLite`. 일과 중 사이렌. 평소 준비 |
| 3 | **Voice economy** | `BRIEF` 수당·평가·당직 성과로 벌어, 제안·진정에 지출 |
| 4 | **Decaying stats** | `Focus` `Mind` `Presence`는 **날짜마다 −N**. 유지 루프 |
| 5 | **Bidirectional Trust / Bond** | `Trust[A→B] ≠ Trust[B→A]`. 상호성 게이트. `Bond`는 옵트인 |
| 6 | **War heat** | `WarHeat` 0–100. 높이면 `CRISIS` 빈도↑ |
| 7 | **Peer NPCs** | 플레이어는 태양이 아님. NPC가 서로 일정·제안을 돌림 |

---

## 3. Setting sketch · 설정 스케치 (짧음 / 오리지널)

**누리만 (Nuri Bay)** — 중규모 항구 도시. **균열여파 (Rift Wake)** 이후, 먼바다 쪽 기상 단층이 수십 년째 열려 있다. 1945 대체역사·원작 신화도 쓰지 않는다.

**틈새 (Seamkin)** — 단층 아래로 있어야 할 것들이 때로 내륙으로 걷는다. 제국이 아니라 **기상+생물 떼**. 전황은 `WarHeat`로만 읽는다.

**누리만 방위학원 (Nuri Bay Defense Academy)** — 시험도 보는 생도학원. 하루는 수업·작업장·**3번 당직 (Third Watch)** 해벽 로테이션. 학교가 보행 장비를 가지고 있을 뿐이다.

**쇼어프레임 (Shoreframes)** — 2–4m 정비형 보행기. 유명 로봇이 아니라 소금에 강한 관절과 갈아끼우는 팔. 씰을 못 갈면 출격 자랑을 하지 않는다.

당직 허브 노드(코드): `Talk` · `Drill` · `Desk` · `Bay` · `Shop` — [`../research/day-loop.md`](../research/day-loop.md).

---

## 4. Parameter IDs (이미 잠긴 이름)

제품 코드·UI 키는 아래만 쓴다. 원작 일본어 스탯명을 보여 주지 말 것.  
명세: [`stats-and-relations.md`](stats-and-relations.md). 하루 비트: [`../research/day-loop.md`](../research/day-loop.md). 화면: [`ia.md`](ia.md).

| Kind | IDs |
| --- | --- |
| Vitals | `Body` · `Drive` · `Focus` · `Mind` · `Presence` · `Morale` |
| Currency | `Voice` |
| Relations | `Trust` · `Bond` |
| Roles | `Pilot` · `Scout` · `Lead` · `Wrench` · `Ops` · `Medic` |
| Day beats | `MORNING` → `BRIEF` → `BLOCK_A` → `MEAL` → `BLOCK_B` → `FREE` → `EOD` (`CRISIS` interrupt) |
| War | `WarHeat` |

픽션 라벨 ↔ Role ID (표시용, 코드는 ID):

| Role ID | 당직에서 |
| --- | --- |
| `Pilot` | 쇼어프레임 조종 (Frame op) |
| `Scout` | 해벽 보행 정찰 (Wall scout) |
| `Lead` | 당직 지휘 (Watch lead) |
| `Wrench` | 정비·탄약 (Tender) |
| `Ops` | 통신 (Comms) |
| `Medic` | 위생·의무 |

Display copy는 한국어(활력, 영향력 등)를 써도 된다. **코드 ID는 영어 키.**

---

## 5. Original names (draft cast)

**우리 이름만.** 다른 작품 캐스트로 바꾸지 말 것. 얼굴은 VRM 슬롯 — [`vrm-slots.md`](vrm-slots.md).

| Id | Name | Role ID |
| --- | --- | --- |
| `cadet_player` | Seo Haneul / 서하늘 (옵션에서 개명) | player pick |
| `cadet_iseul` | Han Iseul / 한이슬 | `Ops` |
| `cadet_rio` | Rio Vale / 리오 베일 | `Wrench` |
| `cadet_minjae` | Park Minjae / 박민재 | `Wrench` |
| `cadet_arin` | Sol Arin / 솔아린 | `Medic` |
| `cadet_taeho` | Kim Taeho / 김태호 | `Lead` |
| `staff_nari` | Cho Nari / 조나리 | 성인 교관 (연애 라이벌 아님) |

---

## 6. Age / content · 연령·콘텐츠

- 생도는 **18+ 성인 훈련생**으로 두거나, 나이를 그리지 않는 **추상 생도**로 둔다.
- **미성년 성애화 금지.** `Bond`는 옵트인. 교관(`staff_nari`)을 연애 대상으로 쓰지 않는다.
- EN: Avoid sexualization of minors; age-up or abstract cadet framing.

---

## 7. Win / fantasy

학기를 버티고 작업장이 열리며 사람들이 아직 말을 섞으면 된다. 전투 승리는 국지전. “좋은 주회”는 조용한 정비반일 수 있다.

---

## 8. SortieLite units (lock)

`SortieLite` 프로토(#10) **잠긴 유닛 ID**만. GPM 메카·병기 고유명사·Action Code 금지.

| Id | Side |
| --- | --- |
| `Shoreframe` | ally (player) |
| `WallScout` | ally (Auto) |
| `Seamkin` | enemy dummy (one type) |

---

## 9. Disclaimer

소니 / 소프thouse / Alfa System / GPM 권리자와 **무관**합니다. 이 피치는 `gpmlike`의 오리지널 픽션입니다.  
Not affiliated with Sony, softhouse-Chara, Alfa System, or *Gunparade March*.
