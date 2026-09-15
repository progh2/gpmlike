# design-implications.md — What OUR original web game should borrow / invent
# 디자인 함의 — 오리지널 웹게임이 빌릴 것 / 새로 만들 것

**Project stance:** Inspired by *systems*, not a GPM remake / fan game.  
**프로젝트 입장:** *시스템*에서 영감 — GPM 리메이크·팬게임이 아님.  
No copyrighted names of characters, songs, specific medals, Action Code tables, or dialogue.

Product lock (fiction / IA / VRM): [`../design/original-pitch.md`](../design/original-pitch.md) · [`../design/ia.md`](../design/ia.md) · [`../design/vrm-slots.md`](../design/vrm-slots.md). Same borrow-vs-invent text: [`../design/design-implications.md`](../design/design-implications.md).

---

## A. Borrow as *systems* (patterns) · 시스템으로 빌려올 패턴

### 1. Dual-loop: life clock + interrupt combat · 이중 루프
- **Borrow:** Accelerated day clock + social/train/work affordances; combat as **interrupting event**, not only scheduled missions.
- **Why:** Creates tension between “study with friends” and “sirens.”
- **Web fit:** Tick-based client clock with pause; mobile-friendly “time skip to next beat” option for accessibility.

### 2. Soft currency for social power · 소셜용 소프트 화폐
- **Borrow:** A resource like “voice / influence” spent to propose, petition, interrupt politics — earned via work, rank, battle, reputation.
- **Invent:** Name, economy curve, and anti-snowball (decay, taxes, cooldowns) for web multiplayer or single-player balance.

### 3. Bidirectional relationships + reciprocity gates · 쌍방향 관계 + 상호성 게이트
- **Borrow:** A→B / B→A matrices; teaching/unlocks need **mutual** thresholds; one-sided affection has costs.
- **Invent:** Your own relationship dimensions (trust / rivalry / duty) beyond friendship/romance if tone differs.

### 4. Visible social attention · 가시적 관심(시선)
- **Borrow:** Ambient “who is looking at whom” as UI — not only menu affection meters.
- **Web invent:** Lightweight VFX (beams, icons) that don’t require PS1-era full map density; privacy toggle.

### 5. Room / scene mood gates · 장면 분위기 게이트
- **Borrow:** Presence composition changes available actions (serious / awkward / exhausted).
- **Invent:** Mood tags driven by your cast AI, not GPM’s named atmospheres.

### 6. Jobs as playstyles · 직업 = 플레이스타일
- **Borrow:** Pilot / scout / commander / mechanic as **different verbs** toward the same survival goal.
- **Invent:** Job caps, chain-reassignment politics, and how non-combat jobs still affect sortie readiness.

### 7. Manual “combo language” optional depth · 선택적 심화 전투 언어
- **Borrow:** Easy Auto + deep Manual string/combo layer with overlap compression.
- **Invent:** Your own grammar (cards, glyphs, beat lanes) — **do not** copy letter-code tables. Web UX: virtual keypad, shareable combo presets.

### 8. Weight / loadout ↔ action economy · 중량·로드아웃 ↔ 행동경제
- **Borrow:** Heavier gear → fewer actions; preparation in hub matters more than mid-fight shopping.
- **Invent:** Equipment taxonomy fitting your fiction (drones, exos, boats…) not GPM mechs.

### 9. Permanent stakes · 영구 스테이크
- **Borrow:** Ally loss persists for the run; changes social graph and war pressure.
- **Web invent:** Soften for audience (ironman toggle, “memorial” mode, limited revive tokens) while keeping teeth.

### 10. Warfront as feedback, not only score · 전황 피드백
- **Borrow:** Local wins/losses alter regional pressure and future ambush rates.
- **Invent:** Simpler web map (district heat) + readable forecasts.

### 11. Survive-the-calendar win · 캘린더 생존 승리
- **Borrow:** Finite season; ranking from survivors + strategic outcome + PC fate.
- **Invent:** Your season length (e.g. 14–30 in-game days for web session budgets).

### 12. Peer, not protagonist-sun · 동료형 플레이어
- **Borrow:** NPCs act on each other; player can be ignored, interrupted, or sidelined.
- **Invent:** Karel-lite: utility AI + schedules + relationship weights — full Karel is research-heavy; ship a thinner agent loop first.

### 13. NG+ / alt PC · 뉴게임플러스
- **Borrow:** Clear ranks seed next run; play as former NPC to reframe the same systems.
- **Invent:** Unlock fiction that doesn’t rely on GPM multiverse lore.

---

## B. Invent (do not port) · 새로 만들 것 (이식 금지)

| Do NOT copy · 복제 금지 | Invent instead · 대신 창작 |
| --- | --- |
| Character names, designs, voice lines | Original cast bible |
| Phantom beasts / Black Moon / specific medals | Original threat + honor economy |
| Shikon/HWT names, wardress labels, Action Code strings | New vehicles + your combo grammar |
| Exact Kumamoto school map / real shop brands as IP | Fictional city with *inspired* density |
| Sock-hunter gag routes / specific romance scripts | Original side activities + consent-forward romance |
| Karel trademark / GPM UI chrome | Your AI name + web UI kit |
| Full plot / ending texts | Original scenarios; systems produce *your* stories |

---

## C. Web-game constraints · 웹게임 제약에 맞춘 권고

1. **Scope ladder:** Ship “day loop + 6 agents + Auto combat” → add Manual grammar → add petitions/meetings → add warfront heat.  
2. **Session length:** Target 15–25 min “one day” chunks with cloud save; full season optional binge.  
3. **Netcode:** Prefer single-player systemic sim first; if multiplayer, do **async** platoon (shared warfront, private social graphs) to avoid Karel-in-realtime hell.  
4. **Accessibility:** Time-skip, Auto combat default, colorblind LoS modes, reduce permadeath by default on first profile.  
5. **Legal/IP hygiene:** No GPM assets, OST, screenshots-as-placeholders from copyrighted art, or “spiritual successor” marketing that lists protected titles in the product name. Inspiration docs stay internal (this folder).  
6. **Content tone:** Student-soldier themes are sensitive — invent ages/setting carefully; avoid sexualization of minors; keep romance adult-cast or age-up if web-store rated.

---

## D. Recommended “pillars” for OUR game · 우리 게임 추천 필러

1. **Calendar survival** with interrupt crises  
2. **Influence currency** tying talk ↔ logistics ↔ battle  
3. **Mutual relationships** that unlock verbs  
4. **Role identity** (front / support / wrench / desk)  
5. **Readable tactics** with optional deep combo language  
6. **Emergent peer AI** (lite) over branching VN flags alone  

Everything else (fiction, art, audio, specific enemies) should be **original**.

---

## E. Uncertainty & next research · 불확실·후속

- Exact combat numbers / skill lists: redesign from scratch; don’t scrape fan databases into code.  
- If designers need Shibamura/Karel primary interview quotes: fetch Den Fami Nico Gamer 2023 article directly and paraphrase.  
- Playable reference (legal owned copy / archive streaming if available) beats wiki for feel — still no asset extraction.

---

## F. One-line brief for pitch decks · 피치용 한 줄

**EN:** A seasonal web sim where you are one peer in a stressed unit: spend influence to shape relationships and logistics, then survive interrupt battles with optional deep action grammar — fiction and cast wholly original.  
**KO:** 압박받는 부대의 *동료 한 명*으로 계절을 버티는 웹 심: 영향력으로 관계·보급을 다루고, 끼어드는 전투를 선택적 심화 문법으로 돌파 — 설정·캐스트는 완전 오리지널.
