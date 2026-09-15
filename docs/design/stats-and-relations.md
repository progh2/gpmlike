# stats-and-relations.md — Original parameters for gpmlike
# 스탯·관계 (오리지널 이름·범위)

**#2 deliverable.** Inspired by GPM *shapes* (JP Wikipedia systems + Kimimi).  
**Do not** ship GPM Japanese stat names (体力/気力/…) or cast names in product UI.

Fiction / academy names: [`original-pitch.md`](original-pitch.md). Day beats: [`../research/day-loop.md`](../research/day-loop.md).

---

## 1. Core vitals · 핵심 바이탈

| ID | Range | Recover | Decay | Used for |
| --- | --- | --- | --- | --- |
| `Body` | 0–1000 (soft cap 100) | Rest, food | Duty/drill/fight spend | Scout HP; fight power; faint if &lt;10% max → forced rest day |
| `Drive` | 0–1000 (soft cap 100) | Rest | Actions, programs, heavy talk | Sortie action budget; daily activity |
| `Focus` | 0–100 | Drill, study | **−N per calendar day** | Hit/evade; desk efficiency |
| `Mind` | 0–100 | Study, desk work | **−N per day** | Command/mechanic quality; exams |
| `Presence` | 0–100 | Social drill | **−N per day** | Proposal success & bond gains; **too high → constant interrupts** |
| `Morale` | 0–100 | Wins, pep proposals, items | Losses, jealousy, punishment | NPC diligence & frontline aggression |

**Design note:** Soft cap ~100 for readable web UI; allow overflow items later like GPM’s high ceilings without copying numbers 1:1.

---

## 2. Soft currency · 소프트 화폐

| ID | Earn | Spend | Floor effect |
| --- | --- | --- | --- |
| `Voice` | Rank stipend each BRIEF, good duty grades, sortie results, medals(*original*) | Talk proposals, petitions, pressure in meetings | `Voice &lt; 0` → cannot propose; rumor penalty risk |

**Anti-snowball:** daily stipend capped by rank; repeated same topic same day costs more / lowers success.

---

## 3. Skills (shape only) · 스킬 골격

- Learned at **hub nodes** (Drill spots), peer teach (teacher level ≥ learner+1), rare class rolls.  
- Gate **Role** transfers: `Pilot` / `Scout` / `Lead` / `Wrench` / `Ops` / `Medic`.  
- Invent skill IDs (`NightEye`, `CloseQuarters`, `Rally`, `PatchKit`…) — never port GPM skill proper names.

---

## 4. Relationships · 관계

### Axes (bidirectional)

| Edge | Type | Notes |
| --- | --- | --- |
| `Trust[A→B]` | −100…+100 | Friendship / reliability |
| `Bond[A→B]` | 0…100 | Romance-capable axis (opt-in content flag) |

- `Trust[A→B] ≠ Trust[B→A]`.  
- **Reciprocity gate:** unlock teach-proposal / teach-sortie-verb only if both Trust (or Bond) within Δ of each other.  
- One-sided high Bond → jealousy risk when both targets share a map node (`Clash` event): Morale−, Voice−, mood→`Awkward`.

### Gaze (UI)

- Colored look-lines (interest / cold / warm). Being stared at opens micro-reactions: smile / nod / ignore / leave.  
- Privacy toggle for accessibility.

### Scene mood tags (original labels)

`Neutral` · `Serious` · `Bright` · `Low` · `Drained` · `Awkward` · `Intimate`

Presence of roles/moods **locks** some proposal verbs (e.g. Serious blocks “goof off date”).

---

## 5. Roles · 역할

| Role | Day verbs | Sortie verbs |
| --- | --- | --- |
| `Pilot` | Bay tune | Unit control |
| `Scout` | Ground drill | Fragile high-agency infantry |
| `Lead` | Desk + petition | Support car / orders |
| `Wrench` | Repair / upgrade | Indirect readiness |
| `Ops` | Comms | Watch + callouts |
| `Medic` | Hygiene / aid | Support |

Caps per role → chain reassignment when petitions succeed (politics).

---

## 6. Mapping from research → ours (internal only)

| Research concept (do not show in UI) | gpmlike ID |
| --- | --- |
| Stamina / 体力 | `Body` |
| Spirit / 気力 | `Drive` |
| Athletics / 運動力 | `Focus` |
| Intellect / 知力 | `Mind` |
| Charm / 魅力 | `Presence` |
| Morale / 士気 | `Morale` |
| Speech power / 発言力 | `Voice` |
| Friendship / affection | `Trust` / `Bond` |

---

## 7. Out of scope for this file

- Exact medal tables, item lists, Action Code alphabets  
- Named romance routes  
- Full Karel AI spec (see systems-overview + design-implications)
