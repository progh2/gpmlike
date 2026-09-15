/** SortieLite — one position-based watch. Original unit names only. */

export const LANE_LENGTH = 5;

export const PLAYER_UNIT = {
  id: "brineknee",
  nameKo: "브라인니",
  nameEn: "Brineknee",
  kindKo: "쇼어프레임",
  kindEn: "Shoreframe",
  maxHp: 22,
  strike: 7,
} as const;

export const SCOUT_UNIT = {
  id: "kelpwalk",
  nameKo: "켈프워크",
  nameEn: "Kelpwalk",
  kindKo: "해벽정찰",
  kindEn: "WallScout",
  maxHp: 12,
  strike: 4,
} as const;

export const ENEMY_UNIT = {
  id: "fathomtick",
  nameKo: "패덤틱",
  nameEn: "Fathomtick",
  kindKo: "틈새",
  kindEn: "Seamkin",
  maxHp: 16,
  strike: 5,
} as const;

export const SORTIE_COPY = {
  screenId: "SortieLite",
  mapKo: "솔트래치 절개",
  mapEn: "Saltlatch Cut",
  watchKo: "3번 당직",
  watchEn: "Third Watch",
  openKo: "사이렌. 켈프워크가 해벽을 잡고, 패덤틱이 절개로 올라온다.",
  openEn: "Siren. Kelpwalk holds the wall as a Fathomtick climbs the cut.",
  winKo: "패덤틱이 단층 쪽으로 물러난다. 당직 종료.",
  winEn: "The Fathomtick slips back toward the fault. Watch ends.",
  loseKo: "브라인니가 기댄다. 당직은 여기서 끊긴다.",
  loseEn: "Brineknee kneels. The watch cuts out here.",
} as const;

export type SortieAction = "advance" | "withdraw" | "strike" | "hold";

export type SortieOutcome = "ongoing" | "win" | "lose";

export type SortieState = {
  turn: number;
  playerHp: number;
  scoutHp: number;
  enemyHp: number;
  playerCell: number;
  scoutCell: number;
  enemyCell: number;
  logKo: string;
  logEn: string;
  outcome: SortieOutcome;
};

export function createSortie(): SortieState {
  return {
    turn: 1,
    playerHp: PLAYER_UNIT.maxHp,
    scoutHp: SCOUT_UNIT.maxHp,
    enemyHp: ENEMY_UNIT.maxHp,
    playerCell: 1,
    scoutCell: 3,
    enemyCell: LANE_LENGTH - 1,
    logKo: SORTIE_COPY.openKo,
    logEn: SORTIE_COPY.openEn,
    outcome: "ongoing",
  };
}

function living(hp: number): boolean {
  return hp > 0;
}

function blockedCells(state: SortieState, ignore?: "player" | "scout" | "enemy"): Set<number> {
  const cells = new Set<number>();
  if (ignore !== "player" && living(state.playerHp)) {
    cells.add(state.playerCell);
  }
  if (ignore !== "scout" && living(state.scoutHp)) {
    cells.add(state.scoutCell);
  }
  if (ignore !== "enemy" && living(state.enemyHp)) {
    cells.add(state.enemyCell);
  }
  return cells;
}

function inLane(cell: number): boolean {
  return cell >= 0 && cell < LANE_LENGTH;
}

function stepToward(from: number, toward: number): number {
  if (from === toward) {
    return from;
  }
  return from + Math.sign(toward - from);
}

export function areAdjacent(a: number, b: number): boolean {
  return Math.abs(a - b) === 1;
}

export function playerEnemyAdjacent(state: SortieState): boolean {
  return living(state.enemyHp) && areAdjacent(state.playerCell, state.enemyCell);
}

function tryStep(from: number, toward: number, blocked: Set<number>): number | null {
  const next = stepToward(from, toward);
  if (next === from || !inLane(next) || blocked.has(next)) {
    return null;
  }
  return next;
}

export function playerAdvanceCell(state: SortieState): number | null {
  if (!living(state.enemyHp)) {
    return null;
  }
  return tryStep(state.playerCell, state.enemyCell, blockedCells(state, "player"));
}

export function playerWithdrawCell(state: SortieState): number | null {
  if (!living(state.enemyHp)) {
    return null;
  }
  const away = state.playerCell + (state.playerCell < state.enemyCell ? -1 : 1);
  if (!inLane(away) || blockedCells(state, "player").has(away)) {
    return null;
  }
  return away;
}

export function canAct(state: SortieState, action: SortieAction): boolean {
  if (state.outcome !== "ongoing") {
    return false;
  }
  if (action === "hold") {
    return true;
  }
  if (action === "strike") {
    return playerEnemyAdjacent(state);
  }
  if (action === "advance") {
    return playerAdvanceCell(state) !== null;
  }
  return playerWithdrawCell(state) !== null;
}

export function pickAutoAction(state: SortieState): SortieAction {
  if (canAct(state, "strike")) {
    return "strike";
  }
  if (canAct(state, "advance")) {
    return "advance";
  }
  return "hold";
}

function resolveOutcome(state: SortieState): void {
  if (state.enemyHp <= 0) {
    state.enemyHp = 0;
    state.outcome = "win";
    state.logKo = SORTIE_COPY.winKo;
    state.logEn = SORTIE_COPY.winEn;
    return;
  }
  if (state.playerHp <= 0) {
    state.playerHp = 0;
    state.outcome = "lose";
    state.logKo = SORTIE_COPY.loseKo;
    state.logEn = SORTIE_COPY.loseEn;
  }
}

function applyScout(state: SortieState, partsKo: string[], partsEn: string[]): void {
  if (!living(state.scoutHp) || !living(state.enemyHp)) {
    return;
  }
  if (areAdjacent(state.scoutCell, state.enemyCell)) {
    state.enemyHp = Math.max(0, state.enemyHp - SCOUT_UNIT.strike);
    partsKo.push(`켈프워크 타격 −${SCOUT_UNIT.strike}`);
    partsEn.push(`Kelpwalk strikes −${SCOUT_UNIT.strike}`);
    return;
  }
  const next = tryStep(state.scoutCell, state.enemyCell, blockedCells(state, "scout"));
  if (next !== null) {
    state.scoutCell = next;
    partsKo.push("켈프워크 전진");
    partsEn.push("Kelpwalk advances");
    return;
  }
  partsKo.push("켈프워크 대기");
  partsEn.push("Kelpwalk holds");
}

function applyEnemy(state: SortieState, partsKo: string[], partsEn: string[]): void {
  if (!living(state.enemyHp)) {
    return;
  }
  if (playerEnemyAdjacent(state)) {
    state.playerHp = Math.max(0, state.playerHp - ENEMY_UNIT.strike);
    partsKo.push(`패덤틱 타격 −${ENEMY_UNIT.strike}`);
    partsEn.push(`Fathomtick strikes −${ENEMY_UNIT.strike}`);
    return;
  }
  if (living(state.scoutHp) && areAdjacent(state.enemyCell, state.scoutCell)) {
    state.scoutHp = Math.max(0, state.scoutHp - ENEMY_UNIT.strike);
    partsKo.push(`패덤틱이 켈프워크를 친다 −${ENEMY_UNIT.strike}`);
    partsEn.push(`Fathomtick hits Kelpwalk −${ENEMY_UNIT.strike}`);
    return;
  }
  const next = tryStep(state.enemyCell, state.playerCell, blockedCells(state, "enemy"));
  if (next !== null) {
    state.enemyCell = next;
    partsKo.push("패덤틱 전진");
    partsEn.push("Fathomtick advances");
    return;
  }
  partsKo.push("패덤틱 대기");
  partsEn.push("Fathomtick holds");
}

function applyPlayer(state: SortieState, action: SortieAction, partsKo: string[], partsEn: string[]): void {
  if (action === "strike") {
    state.enemyHp = Math.max(0, state.enemyHp - PLAYER_UNIT.strike);
    partsKo.push(`브라인니 타격 −${PLAYER_UNIT.strike}`);
    partsEn.push(`Brineknee strikes −${PLAYER_UNIT.strike}`);
    return;
  }
  if (action === "advance") {
    const next = playerAdvanceCell(state);
    if (next !== null) {
      state.playerCell = next;
    }
    partsKo.push("브라인니 전진");
    partsEn.push("Brineknee advances");
    return;
  }
  if (action === "withdraw") {
    const next = playerWithdrawCell(state);
    if (next !== null) {
      state.playerCell = next;
    }
    partsKo.push("브라인니 후퇴");
    partsEn.push("Brineknee withdraws");
    return;
  }
  partsKo.push("브라인니 대기");
  partsEn.push("Brineknee holds");
}

export function playAction(state: SortieState, action: SortieAction): { ok: true } | { ok: false; reasonKo: string; reasonEn: string } {
  if (state.outcome !== "ongoing") {
    return { ok: false, reasonKo: "당직이 이미 끝났습니다.", reasonEn: "The watch already ended." };
  }
  if (!canAct(state, action)) {
    return { ok: false, reasonKo: "그 동작은 지금 쓸 수 없습니다.", reasonEn: "That move is not available now." };
  }

  const partsKo: string[] = [`턴 ${state.turn}`];
  const partsEn: string[] = [`Turn ${state.turn}`];
  applyPlayer(state, action, partsKo, partsEn);
  resolveOutcome(state);
  if (state.outcome !== "ongoing") {
    return { ok: true };
  }

  applyScout(state, partsKo, partsEn);
  resolveOutcome(state);
  if (state.outcome !== "ongoing") {
    return { ok: true };
  }

  applyEnemy(state, partsKo, partsEn);
  resolveOutcome(state);
  if (state.outcome === "ongoing") {
    state.turn += 1;
    state.logKo = partsKo.join(" · ");
    state.logEn = partsEn.join(" · ");
  }
  return { ok: true };
}

export function playAutoTurn(state: SortieState): { ok: true } | { ok: false; reasonKo: string; reasonEn: string } {
  return playAction(state, pickAutoAction(state));
}
