import {
  ENEMY_UNIT,
  LANE_LENGTH,
  PLAYER_UNIT,
  SCOUT_UNIT,
  SORTIE_COPY,
  type SortieAction,
  type SortieState,
  canAct,
} from "./sortieLite";

export type SortieHudElements = {
  overlay: HTMLElement;
  map: HTMLElement;
  lane: HTMLElement;
  units: HTMLElement;
  log: HTMLElement;
  actions: HTMLElement;
  auto: HTMLButtonElement;
  leave: HTMLButtonElement;
};

const ACTION_COPY: Record<SortieAction, { ko: string; en: string }> = {
  advance: { ko: "전진", en: "Advance" },
  withdraw: { ko: "후퇴", en: "Withdraw" },
  strike: { ko: "타격", en: "Strike" },
  hold: { ko: "대기", en: "Hold" },
};

const MANUAL_ACTIONS: SortieAction[] = ["advance", "withdraw", "strike", "hold"];

export function bindSortieHud(): SortieHudElements {
  const requireEl = <T extends HTMLElement>(id: string): T => {
    const el = document.getElementById(id);
    if (!el) {
      throw new Error(`Sortie HUD markup is missing: #${id}`);
    }
    return el as T;
  };
  return {
    overlay: requireEl("sortie-overlay"),
    map: requireEl("sortie-map"),
    lane: requireEl("sortie-lane"),
    units: requireEl("sortie-units"),
    log: requireEl("sortie-log"),
    actions: requireEl("sortie-actions"),
    auto: requireEl<HTMLButtonElement>("sortie-auto"),
    leave: requireEl<HTMLButtonElement>("sortie-leave"),
  };
}

export function setSortieOpen(hud: SortieHudElements, open: boolean): void {
  hud.overlay.hidden = !open;
  document.body.dataset.sortie = open ? "on" : "off";
}

function renderHp(current: number, max: number): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "sortie-hp";
  const bar = document.createElement("div");
  bar.className = "sortie-hp-fill";
  bar.style.width = `${Math.max(0, Math.round((current / max) * 100))}%`;
  const label = document.createElement("span");
  label.textContent = `${current} / ${max}`;
  wrap.append(bar, label);
  return wrap;
}

function renderUnitCard(
  id: string,
  roleKo: string,
  roleEn: string,
  hp: number,
  max: number,
  side: "player" | "scout" | "enemy",
): HTMLElement {
  const card = document.createElement("article");
  card.className = "sortie-unit";
  card.dataset.side = side;
  const title = document.createElement("strong");
  title.textContent = id;
  const kind = document.createElement("span");
  kind.textContent = `${roleKo} / ${roleEn}`;
  card.append(title, kind, renderHp(hp, max));
  return card;
}

export function renderSortieHud(
  hud: SortieHudElements,
  state: SortieState,
  onAction: (action: SortieAction) => void,
  onAuto: () => void,
): void {
  hud.map.textContent = `${SORTIE_COPY.watchKo} / ${SORTIE_COPY.watchEn} · ${SORTIE_COPY.mapKo} / ${SORTIE_COPY.mapEn} · 턴 ${state.turn}`;

  hud.lane.replaceChildren();
  for (let cell = 0; cell < LANE_LENGTH; cell += 1) {
    const item = document.createElement("li");
    item.className = "sortie-cell";
    if (state.playerHp > 0 && state.playerCell === cell) {
      item.dataset.player = "on";
      item.textContent = PLAYER_UNIT.id;
    } else if (state.scoutHp > 0 && state.scoutCell === cell) {
      item.dataset.scout = "on";
      item.textContent = SCOUT_UNIT.id;
    } else if (state.enemyHp > 0 && state.enemyCell === cell) {
      item.dataset.enemy = "on";
      item.textContent = ENEMY_UNIT.id;
    } else {
      item.textContent = String(cell + 1);
    }
    hud.lane.append(item);
  }

  hud.units.replaceChildren(
    renderUnitCard(
      PLAYER_UNIT.id,
      PLAYER_UNIT.roleKo,
      PLAYER_UNIT.roleEn,
      state.playerHp,
      PLAYER_UNIT.maxHp,
      "player",
    ),
    renderUnitCard(
      SCOUT_UNIT.id,
      SCOUT_UNIT.roleKo,
      SCOUT_UNIT.roleEn,
      state.scoutHp,
      SCOUT_UNIT.maxHp,
      "scout",
    ),
    renderUnitCard(
      ENEMY_UNIT.id,
      ENEMY_UNIT.roleKo,
      ENEMY_UNIT.roleEn,
      state.enemyHp,
      ENEMY_UNIT.maxHp,
      "enemy",
    ),
  );

  hud.log.textContent = `${state.logKo} / ${state.logEn}`;

  const finished = state.outcome !== "ongoing";
  hud.actions.replaceChildren();
  if (!finished) {
    for (const action of MANUAL_ACTIONS) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sortie-act";
      button.disabled = !canAct(state, action);
      const title = document.createElement("strong");
      title.textContent = `${ACTION_COPY[action].ko} / ${ACTION_COPY[action].en}`;
      const detail = document.createElement("span");
      detail.textContent = action === "strike" ? "인접할 때만 / Adjacent only" : "한 칸 / One cell";
      button.append(title, detail);
      button.addEventListener("click", () => {
        onAction(action);
      });
      hud.actions.append(button);
    }
  } else {
    const done = document.createElement("p");
    done.className = "sortie-done";
    done.textContent =
      state.outcome === "win"
        ? "승리 · 학원 일과로 돌아간다. / Win · return to the academy day."
        : "패배 · 학원 일과로 돌아간다. / Loss · return to the academy day.";
    hud.actions.append(done);
  }

  hud.auto.hidden = finished;
  hud.auto.disabled = finished;
  hud.auto.onclick = () => {
    onAuto();
  };
  hud.leave.hidden = !finished;
}
