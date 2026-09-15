import { displayNameLabel, type AvatarSlotCatalog } from "./avatarSlots";
import { DAY_BEATS, type DayBeat, type HubNodeId } from "./npcSchedule";

/** EOD checkpoint only. Older v1 multi-stat saves are ignored. */
export const DAY_SIM_STORAGE_KEY = "nuri-term.day-sim.v2";

export const RELATION_NPC_IDS = ["cadet_iseul", "cadet_rio", "cadet_minjae"] as const;
export type RelationNpcId = (typeof RELATION_NPC_IDS)[number];

export const BEAT_BLURB_KO: Record<DayBeat, string> = {
  MORNING: "당직 전 준비. 동료와 눈을 맞추거나 메모만 남긴다.",
  BRIEF: "출석과 계급 소식.",
  BLOCK_A: "역할 수업 또는 당직 슬롯.",
  MEAL: "배식대 주변.",
  BLOCK_B: "남은 수업, 또는 잠깐의 틈.",
  FREE: "허브 노드 — Talk · Drill · Desk · Bay · Shop.",
  EOD: "일과 한 바퀴 끝. Voice와 Trust를 localStorage에 저장한다.",
};

const VOICE_MIN = -40;
const VOICE_MAX = 200;
const DEFAULT_VOICE = 16;

export type RelationEdge = {
  trustTo: number;
  trustFrom: number;
};

export type DaySession = {
  schemaVersion: 2;
  beat: DayBeat;
  voice: number;
  relations: Record<RelationNpcId, RelationEdge>;
  picked: Partial<Record<DayBeat, string>>;
  log: string;
  savedAtEod: boolean;
};

export type RelationDelta = {
  npcId: RelationNpcId;
  trustTo?: number;
  trustFrom?: number;
};

export type { HubNodeId };

export type DayChoice = {
  id: string;
  beat: DayBeat;
  hub?: HubNodeId;
  labelKo: string;
  labelEn: string;
  detailKo: string;
  detailEn: string;
  voice?: number;
  relation?: RelationDelta;
  voiceCost?: number;
};

/** Two player choices in the MORNING→EOD lap. Only Trust and Voice move. */
export const DAY_CHOICES: DayChoice[] = [
  {
    id: "morning_greet_iseul",
    beat: "MORNING",
    hub: "Talk",
    labelKo: "한이슬에게 짧게 인사한다",
    labelEn: "Give Han Iseul a short hello",
    detailKo: "복도에서 통신 당직 생도와 눈을 맞춘다.",
    detailEn: "A brief look in the hall — Trust only.",
    relation: { npcId: "cadet_iseul", trustTo: 8, trustFrom: 4 },
  },
  {
    id: "morning_keep_voice",
    beat: "MORNING",
    hub: "Desk",
    labelKo: "혼자 당직 메모를 적는다",
    labelEn: "Write the watch note alone",
    detailKo: "말은 아껴 두고 Voice를 남긴다.",
    detailEn: "Keep counsel — Voice only.",
    voice: 3,
  },
  {
    id: "free_talk_rio",
    beat: "FREE",
    hub: "Talk",
    labelKo: "리오와 정비 순서를 맞춘다",
    labelEn: "Line up the bay order with Rio",
    detailKo: "Voice를 써서 정비 순서를 제안한다.",
    detailEn: "Spend Voice; Trust rises.",
    voice: -5,
    relation: { npcId: "cadet_rio", trustTo: 10, trustFrom: 6 },
    voiceCost: 5,
  },
  {
    id: "free_shop_hold",
    beat: "FREE",
    hub: "Shop",
    labelKo: "보급 창구에서 Voice를 아낀다",
    labelEn: "Hold Voice at the supply window",
    detailKo: "오늘은 제안하지 않는다.",
    detailEn: "No proposal — Voice only.",
    voice: 2,
  },
];

const dayBeatSet = new Set<string>(DAY_BEATS);
const relationNpcSet = new Set<string>(RELATION_NPC_IDS);

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function clampVoice(value: number): number {
  return clamp(Math.round(value), VOICE_MIN, VOICE_MAX);
}

function defaultRelation(): RelationEdge {
  return { trustTo: 8, trustFrom: 6 };
}

export function createSession(): DaySession {
  const relations = {} as Record<RelationNpcId, RelationEdge>;
  for (const id of RELATION_NPC_IDS) {
    relations[id] = defaultRelation();
  }
  return {
    schemaVersion: 2,
    beat: "MORNING",
    voice: DEFAULT_VOICE,
    relations,
    picked: {},
    log: "일과 한 바퀴. Voice와 Trust만 움직인다.",
    savedAtEod: false,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function normalizeSession(raw: unknown): DaySession | null {
  if (!isRecord(raw) || raw.schemaVersion !== 2) {
    return null;
  }
  const base = createSession();
  const beat = typeof raw.beat === "string" && dayBeatSet.has(raw.beat) ? (raw.beat as DayBeat) : base.beat;
  const voice = clampVoice(readNumber(raw.voice, base.voice));

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
    schemaVersion: 2,
    beat,
    voice,
    relations,
    picked,
    log: typeof raw.log === "string" && raw.log.trim() ? raw.log : base.log,
    savedAtEod: raw.savedAtEod === true || beat === "EOD",
  };
}

export function loadSession(storage: Pick<Storage, "getItem"> = localStorage): DaySession {
  try {
    const raw = storage.getItem(DAY_SIM_STORAGE_KEY);
    if (!raw) {
      return createSession();
    }
    const parsed = normalizeSession(JSON.parse(raw) as unknown);
    if (!parsed || !parsed.savedAtEod) {
      return createSession();
    }
    return parsed;
  } catch {
    return createSession();
  }
}

export function saveSession(session: DaySession, storage: Pick<Storage, "setItem"> = localStorage): void {
  storage.setItem(DAY_SIM_STORAGE_KEY, JSON.stringify(session));
}

export function persistEod(session: DaySession, storage: Pick<Storage, "setItem"> = localStorage): void {
  if (session.beat !== "EOD") {
    return;
  }
  session.savedAtEod = true;
  saveSession(session, storage);
}

export function clearSavedSession(storage: Pick<Storage, "removeItem"> = localStorage): void {
  storage.removeItem(DAY_SIM_STORAGE_KEY);
}

export function choicesFor(beat: DayBeat): DayChoice[] {
  return DAY_CHOICES.filter((choice) => choice.beat === beat);
}

export function pickedChoice(session: DaySession): DayChoice | undefined {
  const id = session.picked[session.beat];
  return id ? DAY_CHOICES.find((choice) => choice.id === id) : undefined;
}

export function isLapComplete(session: DaySession): boolean {
  return session.beat === "EOD";
}

export function canAdvance(session: DaySession): boolean {
  if (isLapComplete(session)) {
    return false;
  }
  const pending = choicesFor(session.beat);
  if (pending.length === 0) {
    return true;
  }
  return Boolean(session.picked[session.beat]);
}

function formatSigned(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
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
  if (choice.voiceCost !== undefined && session.voice < choice.voiceCost) {
    return { ok: false, reason: "Voice가 부족해 제안할 수 없습니다." };
  }

  const parts: string[] = [];
  if (choice.voice) {
    session.voice = clampVoice(session.voice + choice.voice);
    parts.push(`Voice ${formatSigned(choice.voice)}`);
  }
  applyRelation(session, choice.relation, parts);
  session.picked[session.beat] = choice.id;
  session.log = `${choice.labelKo} / ${choice.labelEn} · ${parts.join(" · ")}`;
  return { ok: true };
}

export function advanceBeat(session: DaySession): { ok: true; saved: boolean } | { ok: false; reason: string } {
  if (isLapComplete(session)) {
    return { ok: false, reason: "일과 한 바퀴가 끝났습니다." };
  }
  if (!canAdvance(session)) {
    return { ok: false, reason: "이 비트에서 먼저 선택하세요." };
  }

  const index = DAY_BEATS.indexOf(session.beat);
  const next = DAY_BEATS[index + 1];
  if (!next) {
    return { ok: false, reason: "다음 비트가 없습니다." };
  }
  session.beat = next;
  if (next === "EOD") {
    session.savedAtEod = true;
    session.log = `EOD · Voice ${session.voice} · localStorage 저장`;
    return { ok: true, saved: true };
  }
  session.log = `${next} · ${BEAT_BLURB_KO[next]}`;
  return { ok: true, saved: false };
}

export function resetSession(storage: Pick<Storage, "removeItem"> = localStorage): DaySession {
  clearSavedSession(storage);
  return createSession();
}

export function relationLabel(catalog: AvatarSlotCatalog, npcId: RelationNpcId): string {
  const slot = catalog.slots.find((item) => item.id === npcId);
  return slot ? displayNameLabel(slot.displayName) : npcId;
}
