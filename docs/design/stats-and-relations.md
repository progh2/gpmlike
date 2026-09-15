# Stats and relations (ours)

Original parameter names for **Nuri Term**. Do not paste another game’s labels into code.

Issue #2 asked for a rewrite of the *loop*, not a translation of a stat block.

## Player / NPC vitals

All current values are `0–100` unless noted. `max` can grow slowly (cap `150`).

| Key | KO | Range | Recovers | Used for |
| --- | --- | --- | --- | --- |
| `vigor` | 활력 | 0–max | Sleep, food | Fatigue, light scuffles, scout HP analog |
| `composure` | 침착 | 0–max | Rest, quiet roof | Spending on hard tasks and combat intents |
| `agility` | 민첩 | 0–max | Decays ~1/day if unused | Hit / evade, late-run errands |
| `insight` | 통찰 | 0–max | Decays if unused | Study, repair quality, comms reads |
| `presence` | 존재감 | 0–max | Decays if unused | Talk success; too high → more interruptions |
| `morale` | 전의 | 0–100 | Wins, shared meals | NPC diligence and whether they volunteer |
| `pull` | 영향력 | integer, can go negative | Duty, grades, watches | Spend on briefs and supply asks |

`pull` is social budget, not money. Money (if any) is a separate later `scrip` integer.

## Craft tags (skills)

Integer ranks `0–5`. Unlock duties; do **not** reuse another title’s skill list.

| Key | KO | Unlocks / bonus |
| --- | --- | --- |
| `frameOps` | 프레임운용 | Shoreframe duty |
| `fieldcraft` | 야전술 | Wall scout, night watches |
| `repair` | 정비 | Tender desk, frame seals |
| `firstAid` | 응급 | Clinic shifts |
| `rhetoric` | 설득 | Brief success |
| `nightWatch` | 야간경계 | Alert periods |
| `logistics` | 보급 | Supply asks cost less Pull |

Teaching: if A.rank ≥ B.rank + 1 and they share a drill, B may gain +progress (not an instant rank).

## Relations (directed)

`fromId → toId`. Asymmetric on purpose.

| Key | KO | Range | Meaning |
| --- | --- | --- | --- |
| `familiarity` | 친숙 | 0–100 | How well they can read each other |
| `trust` | 신뢰 | −50–100 | Will they take a risky brief |
| `friction` | 마찰 | 0–100 | Interrupts, rejected talks |
| `dutyBond` | 당직유대 | 0–100 | Shared watches; combat assist chance |

Romance / dating flags are **out of scope** until a later milestone. Do not add a second “love meter” that mirrors another game.

## Example JSON

```json
{
  "id": "cadet_iseul",
  "vitals": {
    "vigor": { "current": 72, "max": 90 },
    "composure": { "current": 64, "max": 80 },
    "agility": 41,
    "insight": 55,
    "presence": 38,
    "morale": 60,
    "pull": 120
  },
  "craft": { "frameOps": 1, "repair": 0, "rhetoric": 2 },
  "relations": {
    "cadet_player": { "familiarity": 12, "trust": 4, "friction": 0, "dutyBond": 8 }
  }
}
```

## Decay and floors (draft)

- `agility`, `insight`, `presence`: −1 at `lights-out` if that stat was not trained that day.
- `vigor` / `composure` current < 10% of max → next `morning` is **forced rest** (skip class).
- `pull` < 0 → briefs fail; gossip penalty (−familiarity from a random NPC).
