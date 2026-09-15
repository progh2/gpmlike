import type { AvatarSlotCatalog } from "./avatarSlots";
import { DAY_BEATS } from "./npcSchedule";
import {
  BEAT_BLURB_KO,
  RELATION_NPC_IDS,
  type DayChoice,
  type DaySession,
  canAdvance,
  choicesFor,
  isLapComplete,
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
  const done = isLapComplete(session);
  hud.date.textContent = done ? `일과 끝 · ${session.beat}` : `일과 · ${session.beat}`;

  hud.beats.replaceChildren();
  for (const beat of DAY_BEATS) {
    const item = document.createElement("li");
    item.textContent = beat;
    if (beat === session.beat) {
      item.dataset.current = "on";
      item.setAttribute("aria-current", "step");
    }
    if (session.picked[beat]) {
      item.dataset.done = "on";
    }
    hud.beats.append(item);
  }

  hud.stats.replaceChildren();
  const voiceRow = document.createElement("div");
  voiceRow.className = "day-stat";
  voiceRow.dataset.voice = session.voice <= 0 ? "empty" : session.voice < 3 ? "low" : "ok";
  const voiceLabel = document.createElement("span");
  voiceLabel.textContent = "발언 Voice";
  const voiceValue = document.createElement("strong");
  voiceValue.textContent = String(session.voice);
  voiceRow.append(voiceLabel, voiceValue);
  hud.stats.append(voiceRow);

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
  if (done) {
    const idle = document.createElement("p");
    idle.className = "day-choices-idle";
    idle.textContent = "한 바퀴 저장됨. 새로고침해도 Voice / Trust가 남는다.";
    hud.choices.append(idle);
  } else if (pending.length === 0) {
    const idle = document.createElement("p");
    idle.className = "day-choices-idle";
    idle.textContent = BEAT_BLURB_KO[session.beat];
    hud.choices.append(idle);
  } else if (chosen) {
    const doneChoice = document.createElement("p");
    doneChoice.className = "day-choices-idle";
    doneChoice.textContent = `선택함 · ${chosen.labelKo} / ${chosen.labelEn}`;
    hud.choices.append(doneChoice);
  } else {
    for (const choice of pending) {
      hud.choices.append(renderChoiceButton(choice, session, onChoose));
    }
  }

  const ready = canAdvance(session);
  hud.advance.disabled = !ready;
  hud.advance.textContent = done ? "일과 끝" : "다음 비트";
  if (done) {
    hud.advance.title = "MORNING→EOD 한 바퀴만 진행합니다.";
  } else if (!ready) {
    hud.advance.title = "이 비트에서 먼저 선택하세요.";
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
  const blocked = choice.voiceCost !== undefined && session.voice < choice.voiceCost;
  button.disabled = blocked;

  const title = document.createElement("strong");
  title.textContent = choice.hub ? `${choice.hub} · ${choice.labelKo}` : choice.labelKo;
  const detail = document.createElement("span");
  detail.textContent = blocked
    ? `Voice ${choice.voiceCost} 필요 / Need Voice ${choice.voiceCost}`
    : `${choice.detailKo} / ${choice.detailEn}`;
  button.append(title, detail);
  button.addEventListener("click", () => {
    onChoose(choice.id);
  });
  return button;
}
