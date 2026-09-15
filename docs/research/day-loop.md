# Day loop (issue #2 stub)

Original schedule for **Nuri Term**. Inspired by the *idea* of a full campus day with autonomous NPCs, not by any titled time table from another game.

## Periods

| Id | Approx. clock | Default player options |
| --- | --- | --- |
| `dawn` | 06:30 | Rest, extra drill, workshop sneak |
| `morning` | 08:30 | Class, duty desk, skip (costs Pull / morale) |
| `midday` | 12:10 | Lunch, talk, clinic, roof |
| `afternoon` | 13:40 | Class, frame drill, repair shift |
| `evening` | 17:00 | Free roam, part-time node, study |
| `lights-out` | 21:30 | Sleep (recover vigor/composure) or overtime |

## Resolution order (planned)

1. Advance `termDay`.
2. Roll **seam forecast** (quiet / watch / alert).
3. NPCs pick period goals from their role + needs.
4. Player picks one intent.
5. Apply stat / relation deltas (`stats-and-relations.md`).
6. If `watch` or `alert`, jump to combat proto (issue #10) after the current period.
7. Autosave to `localStorage` (issue #9).

## Non-goals for this stub

- Do not encode another game’s 08:30 start or named holiday calendar.
- Do not list their medals, songs, or classroom scripts.
