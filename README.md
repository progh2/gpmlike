# gpmlike — Nuri Term / 누리학기

GPM-*inspired* **original** browser game: a coastal defense academy, living NPCs, and mecha-lite Shoreframes.

건퍼레이드마치에서 **시스템·톤만** 참고한 오리지널 웹게임입니다. 복제·리메이크가 아닙니다.

**Not affiliated with Sony Interactive Entertainment, softhouse-Chara, Alfa System, J.C.Staff, or Gunparade March.**  
소니 / 소프thouse / GPM 권리자와 무관합니다. 원작 대사·캐릭터·에셋·ROM을 넣지 않습니다.

Legal checklist: [docs/LEGAL.md](docs/LEGAL.md) · design lock: [pitch](docs/design/original-pitch.md) · [IA](docs/design/ia.md) · [VRM slots](docs/design/vrm-slots.md)

## Pitch

**KO (짧게):** 누리만 방위학원에서 하루를 보내는 시뮬. NPC는 제 일정으로 움직이고, 전투는 작은 쇼어프레임 당직이다. 얼굴은 라이선스 명확한 VRM으로 갈아끼운다.

**EN (short):** Survive a term at Nuri Bay Defense Academy. NPCs keep their own errands. Combat is compact walkers, not a licensed mecha roster. Avatars are swappable VRM slots.

Setting and original names: [docs/design/original-pitch.md](docs/design/original-pitch.md)

## How to run

Requires Node.js 20+ (this repo was bootstrapped on 22).

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). You should see a Three.js **campus grid**, **three scheduled NPCs** walking IA hub routes (`Talk` `Drill` `Desk` `Bay` `Shop`), idle/walk, the slot dropdown, the **DayHUD** overlay (beat strip, `Voice`, `Trust`), and a **당직 / Sortie** button for the combat-lite prototype.

```bash
npm run build
npm run preview
```

`npm run build` type-checks with `tsc`, runs slot validation, and writes static files to `dist/` (GitHub Pages can publish that folder later).

### How to play the day sim MVP (#9)

Team lock: **one lap** `MORNING` → `BRIEF` → `BLOCK_A` → `MEAL` → `BLOCK_B` → `FREE` → `EOD`. Copy is original Korean/English only — no GPM proper names, no Japanese stat names (`体力` / `気力` / …). The only numbers that move are **`Voice` / 발언** and **`Trust` / 신뢰**.

1. Open the demo. **DayHUD** (right) shows the beat strip, `Voice`, and bidirectional `Trust` for the three walking cadets.
2. **MORNING** — one of two choices: greet 한이슬 (`Talk`, `Trust` up) or write the watch note alone (`Desk`, `Voice` up). The beat will not advance until you pick.
3. Click **다음 비트** through `BRIEF` `BLOCK_A` `MEAL` `BLOCK_B` (flavor only).
4. **FREE** — one of two hub verbs: `Talk` with 리오 (`Voice` down, `Trust` up) or `Shop` (hold `Voice`).
5. Advance into **EOD**. That is the end of the lap (no next day). The session writes to `localStorage` (`nuri-term.day-sim.v2`) **only at EOD**.
6. **Refresh the tab.** If you reached EOD, beat / `Voice` / `Trust` restore. Mid-lap refresh starts the lap over (no checkpoint yet).
7. **새 학기** clears the EOD save.

NPC walk, VRM slot dropdown (`?slot=`), and Hub nodes `Talk` `Drill` `Desk` `Bay` `Shop` stay as they are. The academy clock is player-driven: each beat change sends NPCs to that beat’s hub stop.

### How to start the fight (#10)

One complete **position-based** watch on a 5-cell lane. Original names only — no GPM mechs, IP, or Action Codes.

Locked kinds: **Shoreframe** · **WallScout** · **Seamkin** ([`docs/design/original-pitch.md`](docs/design/original-pitch.md) §8). Units: **브라인니 / Brineknee** (Shoreframe, player) · **켈프워크 / Kelpwalk** (WallScout, Auto ally) · **패덤틱 / Fathomtick** (Seamkin) on **솔트래치 절개 / Saltlatch Cut**.

1. Open the demo. On **DayHUD** (right), click **당직 / Sortie**. Or click the **Bay** hub marker on the campus grid (id stays `Bay` — gear/loadout stays at Bay; no in-fight swap). Shortcut: `?sortie=1`.
2. `CRISIS` opens `SortieLite` as an overlay. The current day beat is remembered and restored on return. `Voice`, `Trust`, and the EOD checkpoint (`nuri-term.day-sim.v2`) are **not** written by the fight.
3. You act, then Kelpwalk acts (Auto), then the Seamkin acts. **Auto 한 턴** (default): strike if adjacent, otherwise step toward the enemy.
4. Manual verbs (not Action Codes): **전진 Advance** / **후퇴 Withdraw** / **타격 Strike** / **대기 Hold**.
5. Drop the Fathomtick to 0 HP to win, or lose if Brineknee hits 0. Then **학원으로 / Return** — overlay closes, previous beat resumes.
6. Hub nodes, VRM slots, NPC schedules, and the day-sim Trust/Voice save stay as they were.

### Swap a VRM (no code change)

Runtime reads [`public/avatar-slots.json`](public/avatar-slots.json). Schema: [`docs/design/vrm-slots.md`](docs/design/vrm-slots.md) + [`vrm-slots.schema.json`](docs/design/vrm-slots.schema.json).

Review bar (#7):

1. **Do not rename slot `id`s.** Only edit `vrmUrl` / `vrmPath`.
2. **Every slot must keep `license` + `licenseUrl`.** Missing = FAIL (`npm run validate:slots` / `npm run build`).
3. **Do not commit `.vrm` binaries.** Load from a documented `https://` CDN/URL.
4. Follow the slots doc + schema.

Steps:

1. Get a **license-clear** `.vrm` URL (official sample, CC0, or self-made). **No GPM IP or ripped models.**
2. Put that `https://` link on the existing slot's `vrmUrl` (CORS must allow the origin).
3. Update that same slot's `license` + `licenseUrl` (+ source) to match the file you actually load.
4. Refresh. Switch faces with the HUD dropdown, or open `?slot=cadet_iseul` (any locked catalog `id`).

`*.vrm` is gitignored. Local `vrmPath` is for private experiments only — never commit the binary.

### Tweak NPC schedules (no code change)

Runtime reads [`public/npc-schedules.json`](public/npc-schedules.json). This file is **not** the avatar catalog — keep `id` / `vrmUrl` / `license` in [`public/avatar-slots.json`](public/avatar-slots.json).

1. **`clock.realSecondsPerBeat`** — beat length used by the academy clock. The day-sim MVP pauses auto-loop; the player advances beats, then NPCs walk to that beat’s stops.
2. **`clock.beats`** — order of the academy day. Use the locked IDs only: `MORNING` `BRIEF` `BLOCK_A` `MEAL` `BLOCK_B` `FREE` `EOD`.
3. **`waypoints`** — **only** the locked Hub node IDs from [`docs/design/ia.md`](docs/design/ia.md): `Talk` `Drill` `Desk` `Bay` `Shop`. No extra place/screen ids (no Classroom / Roof / Gate, no GPM names). You may move `position` `[x, y, z]` or change `label` / `color` / `kind` (`ring` pole or `box` marker) — do not rename the `id`.
4. **`agents`** — one entry per walking NPC. `slotId` **must** be a locked cast id (`cadet_iseul`, `cadet_rio`, …). `stops` maps each day beat (`MORNING` → `EOD`) → one of those five hub ids. Give each agent a **different** route. Optional per-agent `walkSpeed` (m/s) overrides the file-level `walkSpeed`.
5. **`arriveRadius`** — how close is “arrived” (then they **idle** until the next beat).

Refresh the demo after edits. Slot faces still swap via `vrmUrl` only; schedules never rename slot ids and never load a `.vrm` from git.

### Sample models in this demo

The default catalog hot-links official **VRM Consortium** samples via jsDelivr (same files `@pixiv/three-vrm` uses). We do **not** vendor the binaries.

| Sample | License | Source |
| --- | --- | --- |
| [VRM1_Constraint_Twist_Sample](https://github.com/vrm-c/vrm-specification/tree/master/samples/VRM1_Constraint_Twist_Sample) | [VRM Public License 1.0](https://vrm.dev/licenses/1.0/) | pixiv Inc. (c) 2022 |
| [Seed-san](https://github.com/vrm-c/vrm-specification/tree/master/samples/Seed-san) | [VRM Public License 1.0](https://vrm.dev/licenses/1.0/) | VirtualCast, Inc. |

These are implementation samples, not our cast. Slot `displayName` values stay original (서하늘 / …). A later local CC0 / self-made file can replace `vrmUrl` without changing `id`.

## Docs

| Path | What |
| --- | --- |
| [docs/LEGAL.md](docs/LEGAL.md) | Copyright boundary + PR checklist (#3) |
| [docs/research/SOURCES.md](docs/research/SOURCES.md) | Public URLs + access dates (#1) |
| [docs/research/systems-overview.md](docs/research/systems-overview.md) | Calendar / stats / relations / combat / map |
| [docs/research/world-tone.md](docs/research/world-tone.md) | Tone & pressure (no cast names) |
| [docs/research/anime-vs-game.md](docs/research/anime-vs-game.md) | Game vs 2003 TV |
| [docs/research/day-loop.md](docs/research/day-loop.md) | Reference shape + original beats (#2) |
| [docs/research/design-implications.md](docs/research/design-implications.md) | Borrow vs invent (research copy) |
| [docs/design/design-implications.md](docs/design/design-implications.md) | Borrow vs invent |
| [docs/design/original-pitch.md](docs/design/original-pitch.md) | Nuri Term pitch + pillars (#3) |
| [docs/design/stats-and-relations.md](docs/design/stats-and-relations.md) | Original parameter IDs (#2) |
| [docs/design/ia.md](docs/design/ia.md) | M2 screen map (#4) |
| [docs/design/vrm-slots.md](docs/design/vrm-slots.md) | Avatar slot convention (#5) |
| [docs/design/vrm-slots.schema.json](docs/design/vrm-slots.schema.json) | Slot JSON schema (#5) |
| [public/npc-schedules.json](public/npc-schedules.json) | NPC routes + day-beat clock (#8) |
| `src/daySim.ts` | Day sim session + localStorage (#9) |
| `src/sortieLite.ts` | SortieLite one-battle prototype (#10) |

## License

**Our code** is [MIT](LICENSE). Research notes are ours; they do not grant rights to any third-party game or anime. VRM samples stay under **their** licenses (demo default: VRM Public License 1.0 Consortium samples — see the table above and [vrm-slots.md](docs/design/vrm-slots.md)).
