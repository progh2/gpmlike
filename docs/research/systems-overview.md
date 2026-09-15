# Systems overview (public knowledge → our adaptations)

High-level map of **publicly described** school + mecha simulation loops, then how *Nuri Term* will differ. No original proper nouns as our cast, no scripts.

Sources: `SOURCES.md`.

## What public writeups agree on

The 2000 PlayStation title is widely described as a **dual-loop** game: a free-roam **academy / daily-life** mode and a **turn-based combat** mode. The player’s only hard goal is often summarized as **surviving until a calendar date**, not clearing a single main quest. NPCs are repeatedly described as **AI-driven**, with schedules and relationships that continue when the player is elsewhere. Combat is described as a **map of unit symbols** plus optional **manual command codes**, then a playback of the turn. Reviews contrast the **near-continuous in-game clock** with games that spend one action per morning/afternoon/night.

Those are *genre systems*. They are not our plot.

## Calendar / day

**Public pattern:** A weekday starts in the morning; time flows while the player walks the school and town; classes, jobs, and free time compete; sorties can interrupt the day; a campaign window is measured in in-game dates.

**Our adaptation (Nuri Term):**

- Discrete **periods**, not a 24-hour real-time clone: `dawn` → `morning` → `midday` → `afternoon` → `evening` → `lights-out`.
- One player **intent** per period (study, drill, repair, talk, rest, explore).
- NPCs still **move and choose** on their own clocks (issue #8).
- Campaign: one **term** (about 40 academy days) until a weather/Rift lull — our fiction, not their armistice date.
- Sorties are **scheduled watches** plus rare **seam alerts**, so the day is readable in a browser session.

See also the #2 stub: `day-loop.md`.

## Stats

**Public pattern:** Resource pools (body / will), aptitudes that rise with training and **decay** if ignored, a **social currency** for proposals and requisitions, and **skills** that unlock jobs or combat options.

**Our adaptation:** original names and ranges in `docs/design/stats-and-relations.md`.

- We do **not** reuse their stat or skill labels.
- Soft caps and decay stay, because they make a living campus feel hungry — but values and copy are ours.
- Social currency is **Pull** (영향력), spent on briefs and supply requests, not a 1:1 clone of any named resource.

## Relations

**Public pattern:** Directed, asymmetric scores (friendship vs romance); NPCs evaluate *each other*; permadeath (where present) rewrites the social graph; conversation success depends on mood, place, and timing.

**Our adaptation:**

- Directed edges: `familiarity`, `trust`, `friction`, `dutyBond`.
- Romance is **optional and later**; M1–M2 only need familiarity / trust / friction.
- Mentorship: training together transfers **craft** more than raw stats.
- No “collect everyone’s socks” joke content; keep the *idea* that NPCs have private inventories and habits.

## Combat

**Public pattern:** Turn / step resolution on an abstract map; facing matters; Auto menus vs Manual letter codes; roles include pilot, infantry, commander, support that does not deploy.

**Our adaptation (mecha-lite):**

- **Shoreframes** are compact walkers, not named original machines.
- One **player-controlled** frame or foot team per watch in the first proto (issue #10).
- Commands are a short **intent queue** (`advance`, `brace`, `mark`, `recover`) — not their Action Code alphabet.
- Support roles (repair, comms, medic) affect the **next** watch via campus work, not a full replica of every desk job.

## Map

**Public pattern:** A walkable campus plus nearby town nodes (classrooms, hangar, shops, parks) where skills are trained and NPCs loiter.

**Our adaptation:**

- First 3D shell is an **empty ground grid** (this PR / issue #6).
- Later dummy waypoints: `quad`, `hall`, `workshop`, `roof`, `clinic`, `gate` — original layout, not a real-world city replica.
- Town is a **handful of nodes**, not an open-world Kumamoto tourist map.

## What we explicitly drop

| Publicly known hook | Why we drop or replace it |
| --- | --- |
| Letter-string Action Codes | Too signature; we use readable intents |
| Dense medal / rank trees | Later, under our names only |
| Full 24-hour continuous clock | Poor fit for short web sessions |
| Their 1945 / phantom-beast lore | Replaced by the Rift Wake (see `original-pitch.md`) |
| Their AI product name | We will name our scheduler something else when we write it |
