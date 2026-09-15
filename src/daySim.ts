import { displayNameLabel, type AvatarSlotCatalog } from "./avatarSlots";
import { DAY_BEATS, type DayBeat, type HubNodeId } from "./npcSchedule";

export const DAY_SIM_STORAGE_KEY = "nuri-term.day-sim.v1";

export const VITAL_IDS = ["Body", "Drive", "Focus", "Mind", "Presence", "Morale"] as const;
export type VitalId = (typeof VITAL_IDS)[number];

export const STAT_IDS = [...VITAL_IDS, "Voice"] as const;
export type StatId = (typeof STAT_IDS)[number];

export const RELATION_NPC_IDS = ["cadet_iseul", "cadet_rio", "cadet_minjae"] as const;
export type RelationNpcId = (typeof RELATION_NPC_IDS)[number];

export const STAT_LABEL_KO: Record<StatId, string> = {
  Body: "활력",
  Drive: "추진",
  Focus: "집중",
  Mind: "사고",
  Presence: "존재감",
  Morale: "사기",
  Voice: "발언",
};

export const BEAT_BLURB_KO: Record<DayBeat, string> = {
  MORNING: "당직 전 준비. 장구를 만지거나 동료와 눈을 맞춘다.",
  BRIEF: "출석과 계급 소식. Voice 수당이 들어온다.",
  BLOCK_A: "역할 수업 또는 당직 슬롯.",
  MEAL: "배식대 주변. 시선이 많아진다.",
  BLOCK_B: "남은 수업, 또는 잠깐의 틈.",
  FREE: "허브 노드 — Talk · Drill · Desk · Bay · Shop.",
  EOD: "일과 정리. 세션이 저장되고 날짜가 넘어간다.",
};

const STAT_RANGE: Record<StatId, { min: number; max: number }> = {
  Body: { min: 0, max: 1000 },
  Drive: { min: 0, max: 1000 },
  Focus: { min: 0, max: 100 },
  Mind: { min: 0, max: 100 },
  Presence: { min: 0, max: 100 },
  Morale: { min: 0, max: 100 },
  Voice: { min: -40, max: 200 },
};

const DEFAULT_STATS: Record<StatId, number> = {
  Body: 80,
  Drive: 80,
  Focus: 55,
  Mind: 50,
  Presence: 45,
  Morale: 50,
  Voice: 16,
};

const EOD_DECAY: Partial<Record<StatId, number>> = {
  Focus: -3,
  Mind: -2,
  Presence: -2,
};

const BRIEF_STIPEND = 8;

export type RelationEdge = {
  trustTo: number;
  trustFrom: number;
  bond: number;
};

export type DaySession = {
  schemaVersion: 1;
  termDay: number;
  beat: DayBeat;
  stats: Record<StatId, number>;
  relations: Record<RelationNpcId, RelationEdge>;
  picked: Partial<Record<DayBeat, string>>;
  log: string;
};

export type StatDelta = Partial<Record<StatId, number>>;

export type RelationDelta = {
  npcId: RelationNpcId;
  trustTo?: number;
  trustFrom?: number;
  bond?: number;
};

export type { HubNodeId };

export type DayChoice = {
  id: string;
  beat: DayBeat;
  hub?: HubNodeId;
  labelKo: string;
  detailKo: string;
  stats?: StatDelta;
  relation?: RelationDelta;
  voiceCost?: number;
};

export const DAY_CHOICES: DayChoice[] = [
  {
    id: "morning_greet_iseul",
    beat: "MORNING",
    hub: "Talk",
    labelKo: "한이슬에게 짧게 인사한다",
    detailKo: "복도에서 통신 당직 생도와 눈을 맞춘다.",
    stats: { Presence: 3, Drive: -2 },
    relation: { npcId: "cadet_iseul", trustTo: 8, trustFrom: 4 },
  },
  {
    id: "morning_solo_prep",
    beat: "MORNING",
    hub: "Bay",
    labelKo: "혼자 장구를 점검한다",
    detailKo: "쇼어프레임 씰부터 다시 본다.",
    stats: { Focus: 5, Body: -3, Presence: -2 },
  },
  {
    id: "free_talk_rio",
    beat: "FREE",
    hub: "Talk",
    labelKo: "Talk — 리오와 정비 일정을 맞춘다",
    detailKo: "Voice를 써서 정비반 순서를 제안한다.",
    stats: { Voice: -5, Morale: 4 },
    relation: { npcId: "cadet_rio", trustTo: 10, trustFrom: 6 },
    voiceCost: 5,
  },
  {
    id: "free_drill_wall",
    beat: "FREE",
    hub: "Drill",
    labelKo: "Drill — 해벽 보행을 반복한다",
    detailKo: "다리에 소금이 앉을 때까지 왕복한다.",
    stats: { Focus: 8, Body: -8, Drive: -6, Morale: 2 },
  },
];

const dayBeatSet = new Set<string>(DAY_BEATS);
const relationNpcSet = new Set<string>(RELATION_NPC_IDS);

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function clampStat(id: StatId, value: number): number {
  const range = STAT_RANGE[id];
  return clamp(Math.round(value), range.min, range.max);
}

function defaultRelation(): RelationEdge {
  return { trustTo: 8, trustFrom: 6, bond: 0 };
}

export function createSession(): DaySession {
  const relations = {} as Record<RelationNpcId, RelationEdge>;
  for (const id of RELATION_NPC_IDS) {
    relations[id] = defaultRelation();
  }
  return {
    schemaVersion: 1,
    termDay: 1,
    beat: "MORNING",
    stats: { ...DEFAULT_STATS },
    relations,
    picked: {},
    log: "학기 1일. 누리만 방위학원 일과가 시작된다.",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function normalizeSession(raw: unknown): DaySession | null {
  if (!isRecord(raw) || raw.schemaVersion !== 1) {
    return null;
  }
  const base = createSession();
  const beat = typeof raw.beat === "string" && dayBeatSet.has(raw.beat) ? (raw.beat as DayBeat) : base.beat;
  const termDay = Math.max(1, Math.round(readNumber(raw.termDay, base.termDay)));

  const stats = { ...base.stats };
  if (isRecord(raw.stats)) {
    for (const id of STAT_IDS) {
      stats[id] = clampStat(id, readNumber(raw.stats[id], base.stats[id]));
    }
  }

  const relations = { ...base.relations };
  if (isRecord(raw.relations)) {
    for (const id of RELATION_NPC_IDS) {
      const edge = raw.relations[id];
      const fallback = base.relations[id];
      if (!isRecord(edge)) {
        continue;
      }
      relations[id] = {
        trustTo: clamp(readNumber(edge.trustTo, fallback.trustTo), -100, 100),
        trustFrom: clamp(readNumber(edge.trustFrom, fallback.trustFrom), -100, 100),
        bond: clamp(readNumber(edge.bond, fallback.bond), 0, 100),
      };
    }
  }

  const picked: DaySession["picked"] = {};
  if (isRecord(raw.picked)) {
    for (const beatId of DAY_BEATS) {
      const choiceId = raw.picked[beatId];
      if (typeof choiceId === "string" && DAY_CHOICES.some((choice) => choice.id === choiceId && choice.beat === beatId)) {
        picked[beatId] = choiceId;
      }
    }
  }

  return {
    schemaVersion: 1,
    termDay,
    beat,
    stats,
    relations,
    picked,
    log: typeof raw.log === "string" && raw.log.trim() ? raw.log : base.log,
  };
}

export function loadSession(storage: Pick<Storage, "getItem"> = localStorage): DaySession {
  try {
    const raw = storage.getItem(DAY_SIM_STORAGE_KEY);
    if (!raw) {
      return createSession();
    }
    return normalizeSession(JSON.parse(raw) as unknown) ?? createSession();
  } catch {
    return createSession();
  }
}

export function saveSession(session: DaySession, storage: Pick<Storage, "setItem"> = localStorage): void {
  storage.setItem(DAY_SIM_STORAGE_KEY, JSON.stringify(session));
}

export function persistSession(session: DaySession, storage: Pick<Storage, "setItem"> = localStorage): DaySession {
  saveSession(session, storage);
  return session;
}

export function choicesFor(beat: DayBeat): DayChoice[] {
  return DAY_CHOICES.filter((choice) => choice.beat === beat);
}

export function pickedChoice(session: DaySession): DayChoice | undefined {
  const id = session.picked[session.beat];
  return id ? DAY_CHOICES.find((choice) => choice.id === id) : undefined;
}

export function canAdvance(session: DaySession): boolean {
  const pending = choicesFor(session.beat);
  if (pending.length === 0) {
    return true;
  }
  return Boolean(session.picked[session.beat]);
}

function formatSigned(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

function applyStats(session: DaySession, delta: StatDelta | undefined, parts: string[]): void {
  if (!delta) {
    return;
  }
  for (const id of STAT_IDS) {
    const change = delta[id];
    if (!change) {
      continue;
    }
    session.stats[id] = clampStat(id, session.stats[id] + change);
    parts.push(`${id} ${formatSigned(change)}`);
  }
}

function applyRelation(session: DaySession, delta: RelationDelta | undefined, parts: string[]): void {
  if (!delta || !relationNpcSet.has(delta.npcId)) {
    return;
  }
  const edge = session.relations[delta.npcId];
  if (delta.trustTo) {
    edge.trustTo = clamp(edge.trustTo + delta.trustTo, -100, 100);
    parts.push(`Trust[cadet_player→${delta.npcId}] ${formatSigned(delta.trustTo)}`);
  }
  if (delta.trustFrom) {
    edge.trustFrom = clamp(edge.trustFrom + delta.trustFrom, -100, 100);
    parts.push(`Trust[${delta.npcId}→cadet_player] ${formatSigned(delta.trustFrom)}`);
  }
  if (delta.bond) {
    edge.bond = clamp(edge.bond + delta.bond, 0, 100);
    parts.push(`Bond ${formatSigned(delta.bond)}`);
  }
}

export function applyChoice(session: DaySession, choiceId: string): { ok: true } | { ok: false; reason: string } {
  const choice = DAY_CHOICES.find((item) => item.id === choiceId);
  if (!choice) {
    return { ok: false, reason: "알 수 없는 선택입니다." };
  }
  if (choice.beat !== session.beat) {
    return { ok: false, reason: "이 비트의 선택이 아닙니다." };
  }
  if (session.picked[session.beat]) {
    return { ok: false, reason: "이 비트는 이미 골랐습니다." };
  }
  if (choice.voiceCost !== undefined && session.stats.Voice < choice.voiceCost) {
    return { ok: false, reason: "Voice가 부족해 제안할 수 없습니다." };
  }

  const parts: string[] = [];
  applyStats(session, choice.stats, parts);
  applyRelation(session, choice.relation, parts);
  session.picked[session.beat] = choice.id;
  session.log = `${choice.labelKo} · ${parts.join(" · ")}`;
  return { ok: true };
}

function applyBriefStipend(session: DaySession, parts: string[]): void {
  session.stats.Voice = clampStat("Voice", session.stats.Voice + BRIEF_STIPEND);
  parts.push(`Voice ${formatSigned(BRIEF_STIPEND)} (수당)`);
}

function applyEodResolve(session: DaySession, parts: string[]): void {
  applyStats(session, EOD_DECAY, parts);
  session.termDay += 1;
  session.beat = "MORNING";
  session.picked = {};
  parts.push(`${session.termDay}일 아침`);
}

export function advanceBeat(session: DaySession): { ok: true } | { ok: false; reason: string } {
  if (!canAdvance(session)) {
    return { ok: false, reason: "이 비트에서 먼저 선택하세요." };
  }

  const parts: string[] = [];
  if (session.beat === "EOD") {
    applyEodResolve(session, parts);
    session.log = `EOD 정리 · ${parts.join(" · ")}`;
    return { ok: true };
  }

  const index = DAY_BEATS.indexOf(session.beat);
  const next = DAY_BEATS[index + 1];
  if (!next) {
    return { ok: false, reason: "다음 비트가 없습니다." };
  }
  session.beat = next;
  if (next === "BRIEF") {
    applyBriefStipend(session, parts);
  }
  session.log = parts.length > 0 ? `${next} · ${parts.join(" · ")}` : `${next} · ${BEAT_BLURB_KO[next]}`;
  return { ok: true };
}

export function resetSession(): DaySession {
  return createSession();
}

export function relationLabel(catalog: AvatarSlotCatalog, npcId: RelationNpcId): string {
  const slot = catalog.slots.find((item) => item.id === npcId);
  return slot ? displayNameLabel(slot.displayName) : npcId;
}
