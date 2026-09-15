# Legal boundary checklist

This repository is an **original** web game inspired by publicly described *systems* and *tone* of school-life + mecha simulation games (including *Gunparade March*). It is **not** a clone, remake, or unofficial port.

**Not affiliated with Sony Interactive Entertainment, Alfa System, J.C.Staff, or any Gunparade March rights holder.**

Use this checklist before merging copy, art, audio, models, or research notes.

## Must never land in the repo

- [ ] Copyrighted *Gunparade March* (or Orchestra) **dialogue, scripts, or voice lines**
- [ ] Playable cast using **original character names** from GPM / related media
- [ ] **Mecha names, unit designations, song titles, or proper nouns** copied from GPM
- [ ] Substantial **plot dumps**, route summaries, or ending reconstructions
- [ ] Ripped **sprites, 3D models, maps, UI chrome, fonts, music, SFX**
- [ ] **ROM / ISO / disc images**, save dumps, or extracted game data
- [ ] Long verbatim quotes from manuals, wikis, or reviews (one-line notes + URL only)

## Allowed

- [ ] High-level summaries of **publicly discussed systems** (calendar, living NPCs, dual daily/combat loop) with source URLs in `docs/research/SOURCES.md`
- [ ] **Original** setting, character names, mecha names, and copy
- [ ] License-clear **VRM** samples (see `docs/design/vrm-slots.md`) or assets we created
- [ ] CC0 / clearly licensed third-party assets, with attribution where required
- [ ] Our own TypeScript / Vite / Three.js code (MIT — see `LICENSE`)

## Characters and avatars

- Characters in *our* game use **swappable VRM models**. Default slots point at **license-clear official samples** (for example VRoid Studio β AvatarSample models under CC0). See `docs/design/vrm-slots.md`.
- Do not ship a VRM whose Hub page or embedded `meta` license forbids redistribution or commercial use unless legal review says otherwise.
- Never use a fan-ripped “GPM lookalike” model as a stand-in for a copyrighted character.

## Research docs

- Research files may summarize **systems and tone** only.
- Every factual claim about the 2000 PlayStation game or the 2003 anime should have a **URL + access date** in `SOURCES.md`.
- Do **not** claim we copied GPM scripts. We did not, and we will not.

## README and marketing

- Public README must keep the **disclaimer** (not affiliated with Sony / GPM).
- Working title **Nuri Term** / **누리학기** is ours. Do not present this project as “Gunparade March on the web.”

## Reviewer sign-off

Before a content PR merges:

1. Search the diff for GPM proper nouns used as *our* cast, units, or locations.
2. Confirm new assets have a license note.
3. Confirm research pages did not paste long quotes.
