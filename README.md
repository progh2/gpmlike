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

Open the URL Vite prints (usually `http://localhost:5173`). You should see a Three.js **ground grid**, one **sample VRM**, a slot dropdown, and empty waypoint / box stubs for later NPC schedules.

```bash
npm run build
npm run preview
```

`npm run build` type-checks with `tsc` and writes static files to `dist/` (GitHub Pages can publish that folder later).

### Swap a VRM (no code change)

Runtime reads [`public/avatar-slots.json`](public/avatar-slots.json) (`id` → URL/path). Schema: [`docs/design/vrm-slots.md`](docs/design/vrm-slots.md).

1. Get a **license-clear** `.vrm` (official sample URL, CC0, or self-made). **No GPM IP or ripped models.**
2. Either set that slot's `vrmUrl` to an `https://` link (CORS must allow the origin), **or** drop the file under `public/models/samples/` and set `vrmPath` (example: `/models/samples/default-cadet.vrm`).
3. If both are set, **`vrmUrl` wins**. Keep `license` + `licenseUrl` (+ source) in sync with the file you actually load.
4. Restart / refresh. Switch faces with the HUD dropdown, or open `?slot=cadet_iseul` (any catalog `id`).

`*.vrm` is gitignored. Do not commit binaries unless redistribution is explicitly allowed **and** the PR lists `license` + `licenseUrl`.

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

## License

**Our code** is [MIT](LICENSE). Research notes are ours; they do not grant rights to any third-party game or anime. VRM samples stay under **their** licenses (demo default: VRM Public License 1.0 Consortium samples — see the table above and [vrm-slots.md](docs/design/vrm-slots.md)).
