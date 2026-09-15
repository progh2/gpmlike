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

Open the URL Vite prints (usually `http://localhost:5173`). You should see a Three.js **campus grid**, **three scheduled NPCs** walking different routes (idle/walk), dummy **Classroom / Roof / Gate** boxes plus hub rings, and the slot dropdown (focus a walking NPC, or preview any other catalog face).

```bash
npm run build
npm run preview
```

`npm run build` type-checks with `tsc` and writes static files to `dist/` (GitHub Pages can publish that folder later).

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

1. **`clock.realSecondsPerBeat`** — how long each day beat lasts in real seconds (looping timer). Smaller = NPCs change destination more often.
2. **`clock.beats`** — order of the academy day. Use the locked IDs only: `MORNING` `BRIEF` `BLOCK_A` `MEAL` `BLOCK_B` `FREE` `EOD`.
3. **`waypoints`** — dummy school nodes. Move `position` `[x, y, z]`, change `label` / `color`, or set `kind` to `ring` (hub pole) or `box` (Classroom / Roof / Gate massing). Existing hub ids from the IA lock: `Talk` `Drill` `Desk` `Bay` `Shop`.
4. **`agents`** — one entry per walking NPC. `slotId` **must** be a locked cast id (`cadet_iseul`, `cadet_rio`, …). `stops` maps each beat → a waypoint `id`. Give each agent a **different** route so paths stay readable. Optional per-agent `walkSpeed` (m/s) overrides the file-level `walkSpeed`.
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

## License

**Our code** is [MIT](LICENSE). Research notes are ours; they do not grant rights to any third-party game or anime. VRM samples stay under **their** licenses (demo default: VRM Public License 1.0 Consortium samples — see the table above and [vrm-slots.md](docs/design/vrm-slots.md)).
