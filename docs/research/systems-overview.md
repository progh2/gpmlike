# systems-overview.md — System mechanics SUMMARY only
# 시스템 개요 (요약만 / no dialogue, no plot dumps)

**Scope:** High-level mechanics for *inspired* original design.  
**범위:** 오리지널 게임 설계용 고수준 메커닉 요약.  
**Sources:** JP/EN Wikipedia, Kimimi review, Ogre Run essay, secondary fan maps (flagged).

---

## 1. Calendar / day loop · 캘린더·일일 루프

### EN
- **Campaign window:** Roughly **1999-03-04 → 1999-05-10/11**. Win condition is primarily **survive** until phantom-beast activity stalls (“natural truce”), not “defeat the final boss.”
- **Day structure:** Accelerated **real-time clock** inside academy mode (not pure menu turns). Day commonly flows: morning prep → homeroom → classes → lunch → classes → free period → sleep. Weekends freer; Mondays pay mentioned in setting notes.
- **Interruptions:** Combat can fire **without a tidy sortie UI** — often surprise call-ups during free time / training / even after “day end” bookkeeping. Prep (loadout, repairs, fitness) must be done *before* the siren.
- **Strategic layer:** End-of-day / status screens track work grades, training, and **regional warfront** control (human vs beast pressure). Success elsewhere changes sortie frequency and enemy pressure.

### KO
- **캠페인 기간:** 대략 **1999년 3/4 → 5/10~11**. 핵심 목표는 최종보스 격파보다 **자연휴전기까지 생존**.
- **하루 구조:** 학원 모드에서 **가속 실시간**으로 시간이 흐름. 아침 준비 → HR → 수업 → 점심 → 수업 → 자유시간 → 취침이 기본형. 주말은 자유도↑.
- **전투 개입:** 정식 “출격 시퀀스” 없이 **갑자기 소집**되는 경우가 많음. 장비·정비·컨디션은 평소에 준비.
- **전략 레이어:** 하루 종료/현황에서 업무 평가·훈련·**지역 전황**을 확인. 전황이 출격 빈도와 난이도에 영향.

**Uncertainty:** Exact clock ratio (review: ~4 real sec ≈ 1 game minute) not in Wikipedia — approximate.  
**불확실:** 실시간 환산비는 리뷰 출처; 위키에 수치 없음.

---

## 2. Stats & progression · 스탯·성장

### Core parameters (summary) · 핵심 파라미터
| Stat | Role (EN) | 역할 (KO) |
| --- | --- | --- |
| Stamina / 体力 | Combat power / scout HP; daily fatigue; fainting if too low | 전투력·스카우트 HP; 일과 소모; 과소 시 기절·강제 휴무 |
| Spirit / 気力 | Combat action cost; daily activity drain | 전투 행동 비용; 일과·훈련 소모 |
| Athletics / 運動力 | Hit/evade; decays over calendar days | 명중·회피; **날짜 경과로 감소** |
| Intellect / 知力 | Command/mechanic efficiency, programs, tests; decays | 지휘·정비·프로그램·시험; **감소** |
| Charm / 魅力 | Proposal success & relationship gains; too high → constant interruptions | 제안·호감 상승; **과다 시 방해 과다** |
| Morale / 士気 | NPC diligence & frontline aggression | NPC 성실도·전선 적극성 |
| Speech power / 発言力 | Soft currency for talk/proposals/petitions; rank income + deeds | 대화·제안·진정의 **소프트 화폐**; 계급·전과·업무로 획득 |

### Skills · 技能 (shape only)
- Learned at **map facilities** (train spots), taught by peers (need higher level), rarely from class/events.
- Skills gate **job transfers** (pilot, mechanic, commander, medic, ops…) and combat bonuses (night fight, sniping, melee, etc.).
- “Genius”-style umbrella skills exist in GPM — for an original game, invent your own skill taxonomy; do not copy names/effects 1:1.

### Fuzzy input · 퍼지 입력
- Training / some actions use a **2-axis “fuzzy” input** (quadrants), not a single “Train +1” button — outcome varies by placement.  
- **Borrow as idea:** skill-check UX with intentional ambiguity; **invent** your own UI.

### Decay & recovery · 감쇠·회복
- Some stats **decay daily**; stamina/spirit recover with food/rest; max raised by training/items.  
- Design takeaway: **maintenance loop**, not only permanent grind-up.

---

## 3. Relationships · 인간관계

### EN (summary)
- **Bidirectional** friendship + romance (affection) scores per pair (A→B ≠ B→A).
- Reciprocity matters: balanced ties unlock teaching of proposals / battle techniques; one-sided crush can be toxic.
- **LoS “gaze beams”:** colored look-lines show interest; getting stared at opens a **reaction micro-menu** (smile, ignore, etc.).
- **Room atmosphere / mood:** who is present (teacher, jealous person, exhausted group…) **locks or unlocks** proposal types.
- **Speech power cost** on most social actions; repeating the same topic same day hurts.
- **Rivalry / jealousy events** if multiple high-affection partners share a map — can tank morale/speech and sour the room.
- NPCs run on **Karel-class AI**: they pursue their own goals, petition transfers, work or slack, form ties **without** the player — player is a peer, not the sun.

### KO (요약)
- **쌍방향** 우정·애정. A→B ≠ B→A.
- **상호성**이 중요: 균형 잡힌 관계에서 제안/전투 커맨드 전수. 일방 호감은 독이 될 수 있음.
- **시선 빔:** 관심 시각화 → 피시선 시 반응 선택.
- **장 분위기:** 같은 맵의 인물 구성이 가능한 제안 종류를 제한.
- 대부분 소셜에 **발언력 비용**; 같은 날 같은 화제 반복 페널티.
- 복수 연애 대상이 같은 맵에 있으면 **쟁탈/질투** 이벤트 가능.
- NPC는 독자 AI로 움직이며, 플레이어는 **동료 중 한 명**.

**Do not copy:** specific romance routes, dialogue, or named “rivalry” event scripts.  
**금지:** 개별 연애 루트·대사·이벤트 스크립트 복제.

---

## 4. Battle · 전투

### EN (summary)
- **Turn-based SLG** on **hexless** abstract 3D / situation-map field; units as directional markers; height + LoS matter.
- Player typically controls **one unit** (or tandem cockpit as two seats); allies/enemies act autonomously.
- **Steps** per turn scale with **weight/loadout** (lighter → more steps; roughly capped high/low).
- **Auto mode:** coarse Move/Attack. **Manual mode:** string **Action Codes** (letter chains); longer codes = heavier actions; **overlapping shared letters** compress combos; leftover code can carry to next turn.
- Roles: mecha pilot, scout (powered suit / fragile HP), commander vehicle (support/jam/smoke/request aid), rear staff watch via ops.
- **Permanent death** of allies in real combat for that playthrough.
- Force threshold (~20% losses) can trigger **retreat races** to map edge; singing the march (setting-specific) can force fight-to-annihilation — **invent your own “no retreat” stakes** if borrowing the *idea*.
- Optional relay/cinematic cut-ins for drama without full interactive 3D control.

### KO (요약)
- **헥스 없는** 추상 전장 + 방향 마커; 고저·시야 중요.
- 보통 **자기 유닛(또는 복좌)만** 조작, 아군/적은 자율.
- 턴 내 **스텝**은 중량/장비에 좌우.
- **자동** vs **수동 액션코드**(문자열 조합·중복 압축·턴 이월).
- 역할: 기체 파일럿 / 스카우트 / 지휘차 지원 / 후방.
- **영구 전사**(해당 주회).
- 전력 일정 비율 손실 시 **철수** 연출; 특수 조건으로 전멸전까지 강요 가능(설정 고유 — 오리지널에선 개념만 차용).

**Uncertainty:** Exact step caps (wiki: max ~10 / min ~4) and force % are Wikipedia-sourced; verify in play if implementing similar numbers.  
**불확실:** 스텝 상한·전력 %는 위키 수치; 구현 시 재검증.

---

## 5. Maps · 맵

### Academy / city hub · 학원·시내 허브
- Hub is a **school-as-base** plus nearby city nodes (library, park, eatery, black market, hangars, classrooms, offices…).
- Each node bundles **train / work / shop / talk** affordances — navigation *is* progression.
- Real Kumamoto landmarks inspired layout (public tourism articles) — for original games: **invent fictional city**, optionally “inspired by real density,” never copy trademarked venue names as gameplay IP.

### Strategic / war map · 전략·전황 맵
- Wider region abstracted as **control values** / fronts; battles resolve local pressure; beasts can shift fronts → future ambush risk.

### Battle maps · 전투 맵
- Abstract blocks for terrain; not photoreal streets. Tactical readability > spectacle.

---

## 6. Roles, petitions, meetings · 역할·진정·회의

- **Job board:** commander, pilots, scouts, mechanics, ops, medic/driver slots with caps → chain reassignments.
- **Petitions (HQ phone):** spend large speech power for supplies/transfers; NPCs can petition too.
- **Ops meeting:** vote agenda items (training week, camp, punish, armor change…) — outcomes skewed by **relationships**, chair can override.

---

## 7. Endings / NG+ shape · 엔딩·뉴게임플러스 형태

- Survival to end date → rank bands (S–E style) from **survivors + war situation + PC fate**.
- Clear data boosts next run stats/items; unlock alternate PCs; second loop reveals more (e.g. voice) — **borrow NG+ structure**, invent your own unlock fiction.

---

## 8. What this is *not* documenting · 문서화하지 않는 것

- Named character bios, dialogue, CG lists  
- Full Action Code dictionaries  
- Exact medal tables / item drop lists  
- Complete enemy bestiary stats  

Use those only as *existence proofs* that depth exists — redesign for the original web game.
