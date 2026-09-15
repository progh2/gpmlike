import type { AvatarSlotCatalog } from "./avatarSlots";
import { DAY_BEATS } from "./npcSchedule";
import {
  BEAT_BLURB_KO,
  STAT_IDS,
  STAT_LABEL_KO,
  RELATION_NPC_IDS,
  type DayChoice,
  type DaySession,
  canAdvance,
  choicesFor,
  pickedChoice,
  relationLabel,
} from "./daySim";

export type DayHudElements = {
  date: HTMLElement;
  beats: HTMLElement;
  stats: HTMLElement;
  relations: HTMLElement;
  note: HTMLElement;
  choices: HTMLElement;
  advance: HTMLButtonElement;
  reset: HTMLButtonElement;
};

export function bindDayHud(): DayHudElements {
  const requireEl = <T extends HTMLElement>(id: string): T => {
    const el = document.getElementById(id);
    if (!el) {
      throw new Error(`Day HUD markup is missing: #${id}`);
    }
    return el as T;
  };
  return {
    date: requireEl("day-date"),
    beats: requireEl("day-beats"),
    stats: requireEl("day-stats"),
    relations: requireEl("day-relations"),
    note: requireEl("day-note"),
    choices: requireEl("day-choices"),
    advance: requireEl<HTMLButtonElement>("day-advance"),
    reset: requireEl<HTMLButtonElement>("day-reset"),
  };
}

export function renderDayHud(
  hud: DayHudElements,
  session: DaySession,
  catalog: AvatarSlotCatalog,
  onChoose: (choiceId: string) => void,
): void {
  hud.date.textContent = `학기 ${session.termDay}일 · ${session.beat}`;

  hud.beats.replaceChildren();
  for (const beat of DAY_BEATS) {
    const item = document.createElement("li");
    item.textContent = beat;
    if (beat === session.beat) {
      item.dataset.current = "on";
    }
    if (session.picked[beat]) {
      item.dataset.done = "on";
    }
    hud.beats.append(item);
  }

  hud.stats.replaceChildren();
  for (const id of STAT_IDS) {
    const row = document.createElement("div");
    row.className = "day-stat";
    const label = document.createElement("span");
    label.textContent = `${STAT_LABEL_KO[id]} ${id}`;
    const value = document.createElement("strong");
    value.textContent = String(session.stats[id]);
    row.append(label, value);
    hud.stats.append(row);
  }

  hud.relations.replaceChildren();
  for (const npcId of RELATION_NPC_IDS) {
    const edge = session.relations[npcId];
    const row = document.createElement("li");
    row.textContent = `${relationLabel(catalog, npcId)} · Trust ${edge.trustTo} / ${edge.trustFrom}`;
    hud.relations.append(row);
  }

  const chosen = pickedChoice(session);
  const pending = choicesFor(session.beat);
  hud.note.textContent = session.log || BEAT_BLURB_KO[session.beat];

  hud.choices.replaceChildren();
  if (pending.length === 0) {
    const idle = document.createElement("p");
    idle.className = "day-choices-idle";
    idle.textContent = BEAT_BLURB_KO[session.beat];
    hud.choices.append(idle);
  } else if (chosen) {
    const done = document.createElement("p");
    done.className = "day-choices-idle";
    done.textContent = `선택함 · ${chosen.labelKo}`;
    hud.choices.append(done);
  } else {
    for (const choice of pending) {
      hud.choices.append(renderChoiceButton(choice, session, onChoose));
    }
  }

  const ready = canAdvance(session);
  hud.advance.disabled = !ready;
  hud.advance.textContent = session.beat === "EOD" ? "다음 날로" : "다음 비트";
  if (!ready) {
    hud.advance.title = "이 비트에서 먼저 선택하세요.";
  } else if (session.beat === "EOD") {
    hud.advance.title = "EOD를 정리하고 학기 날짜를 넘깁니다.";
  } else {
    hud.advance.title = "다음 일과 비트로 진행합니다.";
  }
}

function renderChoiceButton(
  choice: DayChoice,
  session: DaySession,
  onChoose: (choiceId: string) => void,
): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "day-choice";
  const blocked = choice.voiceCost !== undefined && session.stats.Voice < choice.voiceCost;
  button.disabled = blocked;

  const title = document.createElement("strong");
  title.textContent = choice.hub ? `${choice.hub} · ${choice.labelKo}` : choice.labelKo;
  const detail = document.createElement("span");
  detail.textContent = blocked ? `Voice ${choice.voiceCost} 필요` : choice.detailKo;
  button.append(title, detail);
  button.addEventListener("click", () => {
    onChoose(choice.id);
  });
  return button;
}
