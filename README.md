# gpmlike — Nuri Term / 누리학기

GPM-*inspired* **original** browser game: a coastal defense academy, living NPCs, and mecha-lite Shoreframes.

건퍼레이드마치에서 **시스템·톤만** 참고한 오리지널 웹게임입니다. 복제·리메이크가 아닙니다.

**Not affiliated with Sony Interactive Entertainment, Alfa System, J.C.Staff, or Gunparade March.**  
소니 / GPM 권리자와 무관합니다. 원작 대사·캐릭터·에셋·ROM을 넣지 않습니다.

Legal checklist: [docs/LEGAL.md](docs/LEGAL.md)

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

Open the URL Vite prints (usually `http://localhost:5173`). You should see an empty Three.js scene and a **ground grid**.

```bash
npm run build
npm run preview
```

`npm run build` type-checks with `tsc` and writes static files to `dist/` (GitHub Pages can publish that folder later).

## Docs

| Path | What |
| --- | --- |
| [docs/LEGAL.md](docs/LEGAL.md) | Copyright boundary checklist |
| [docs/research/SOURCES.md](docs/research/SOURCES.md) | Public URLs + access dates (#1) |
| [docs/research/systems-overview.md](docs/research/systems-overview.md) | Calendar / stats / relations / combat / map |
| [docs/research/world-tone.md](docs/research/world-tone.md) | Tone & pressure (no cast names) |
| [docs/research/anime-vs-game.md](docs/research/anime-vs-game.md) | Game vs 2003 TV |
| [docs/research/day-loop.md](docs/research/day-loop.md) | Reference shape + original beats (#2) |
| [docs/design/design-implications.md](docs/design/design-implications.md) | Borrow vs invent |
| [docs/design/original-pitch.md](docs/design/original-pitch.md) | Nuri Term setting (original names) |
| [docs/design/stats-and-relations.md](docs/design/stats-and-relations.md) | Original parameter IDs (#2) |
| [docs/design/vrm-slots.md](docs/design/vrm-slots.md) | Avatar JSON convention (#5) |

## License

**Our code** is [MIT](LICENSE). Research notes are ours; they do not grant rights to any third-party game or anime. VRM samples stay under **their** licenses (default: CC0 VRoid β samples — see the slots doc).
