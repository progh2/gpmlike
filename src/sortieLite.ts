/** SortieLite — one position-based watch. Original unit names only. */

export const LANE_LENGTH = 5;

/** Locked unit IDs: allies Shoreframe + WallScout; one enemy dummy Seamkin. */
export const PLAYER_UNIT = {
  id: "Shoreframe",
  nameKo: "쇼어프레임",
  nameEn: "Shoreframe",
  roleKo: "아군",
  roleEn: "ally",
  maxHp: 22,
  strike: 7,
} as const;

export const SCOUT_UNIT = {
  id: "WallScout",
  nameKo: "해벽정찰",
  nameEn: "WallScout",
  roleKo: "아군 Auto",
  roleEn: "ally Auto",
  maxHp: 12,
  strike: 4,
} as const;

export const ENEMY_UNIT = {
  id: "Seamkin",
  nameKo: "틈새",
  nameEn: "Seamkin",
  roleKo: "적 dummy",
  roleEn: "enemy dummy",
  maxHp: 16,
  strike: 5,
} as const;

export const SORTIE_COPY = {
  screenId: "SortieLite",
  mapKo: "해벽 절개",
  mapEn: "seawall cut",
  watchKo: "CRISIS",
  watchEn: "SortieLite Auto",
  openKo: "사이렌. CRISIS → SortieLite. WallScout가 해벽을 잡고 Seamkin dummy가 올라온다.",
  openEn: "Siren. CRISIS → SortieLite. WallScout holds the wall; one Seamkin dummy climbs.",
  winKo: "Seamkin dummy가 물러난다. 직전 beat로 복귀.",
  winEn: "The Seamkin dummy withdraws. Return to the previous beat.",
  loseKo: "Shoreframe이 기댄다. 직전 beat로 복귀.",
  loseEn: "Shoreframe kneels. Return to the previous beat.",
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
    partsKo.push(`${SCOUT_UNIT.id} 타격 −${SCOUT_UNIT.strike}`);
    partsEn.push(`${SCOUT_UNIT.id} strikes −${SCOUT_UNIT.strike}`);
    return;
  }
  const next = tryStep(state.scoutCell, state.enemyCell, blockedCells(state, "scout"));
  if (next !== null) {
    state.scoutCell = next;
    partsKo.push(`${SCOUT_UNIT.id} 전진`);
    partsEn.push(`${SCOUT_UNIT.id} advances`);
    return;
  }
  partsKo.push(`${SCOUT_UNIT.id} 대기`);
  partsEn.push(`${SCOUT_UNIT.id} holds`);
}

function applyEnemy(state: SortieState, partsKo: string[], partsEn: string[]): void {
  if (!living(state.enemyHp)) {
    return;
  }
  if (playerEnemyAdjacent(state)) {
    state.playerHp = Math.max(0, state.playerHp - ENEMY_UNIT.strike);
    partsKo.push(`${ENEMY_UNIT.id} dummy 타격 −${ENEMY_UNIT.strike}`);
    partsEn.push(`${ENEMY_UNIT.id} dummy strikes −${ENEMY_UNIT.strike}`);
    return;
  }
  if (living(state.scoutHp) && areAdjacent(state.enemyCell, state.scoutCell)) {
    state.scoutHp = Math.max(0, state.scoutHp - ENEMY_UNIT.strike);
    partsKo.push(`${ENEMY_UNIT.id} dummy가 ${SCOUT_UNIT.id}를 친다 −${ENEMY_UNIT.strike}`);
    partsEn.push(`${ENEMY_UNIT.id} dummy hits ${SCOUT_UNIT.id} −${ENEMY_UNIT.strike}`);
    return;
  }
  const next = tryStep(state.enemyCell, state.playerCell, blockedCells(state, "enemy"));
  if (next !== null) {
    state.enemyCell = next;
    partsKo.push(`${ENEMY_UNIT.id} dummy 전진`);
    partsEn.push(`${ENEMY_UNIT.id} dummy advances`);
    return;
  }
  partsKo.push(`${ENEMY_UNIT.id} dummy 대기`);
  partsEn.push(`${ENEMY_UNIT.id} dummy holds`);
}

function applyPlayer(state: SortieState, action: SortieAction, partsKo: string[], partsEn: string[]): void {
  if (action === "strike") {
    state.enemyHp = Math.max(0, state.enemyHp - PLAYER_UNIT.strike);
    partsKo.push(`${PLAYER_UNIT.id} 타격 −${PLAYER_UNIT.strike}`);
    partsEn.push(`${PLAYER_UNIT.id} strikes −${PLAYER_UNIT.strike}`);
    return;
  }
  if (action === "advance") {
    const next = playerAdvanceCell(state);
    if (next !== null) {
      state.playerCell = next;
    }
    partsKo.push(`${PLAYER_UNIT.id} 전진`);
    partsEn.push(`${PLAYER_UNIT.id} advances`);
    return;
  }
  if (action === "withdraw") {
    const next = playerWithdrawCell(state);
    if (next !== null) {
      state.playerCell = next;
    }
    partsKo.push(`${PLAYER_UNIT.id} 후퇴`);
    partsEn.push(`${PLAYER_UNIT.id} withdraws`);
    return;
  }
  partsKo.push(`${PLAYER_UNIT.id} 대기`);
  partsEn.push(`${PLAYER_UNIT.id} holds`);
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
