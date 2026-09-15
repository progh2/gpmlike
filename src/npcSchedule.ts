import { LOCKED_SLOT_IDS, type AvatarSlotCatalog } from "./avatarSlots";

const lockedSlotIdSet = new Set<string>(LOCKED_SLOT_IDS);

export const DAY_BEATS = [
  "MORNING",
  "BRIEF",
  "BLOCK_A",
  "MEAL",
  "BLOCK_B",
  "FREE",
  "EOD",
] as const;

export type DayBeat = (typeof DAY_BEATS)[number];

export type WaypointKind = "ring" | "box";

export type WaypointDef = {
  id: string;
  label: string;
  position: [number, number, number];
  color: string;
  kind: WaypointKind;
};

export type AgentStops = Partial<Record<DayBeat, string>>;

export type AgentSchedule = {
  slotId: string;
  walkSpeed?: number;
  stops: AgentStops;
};

export type ScheduleCatalog = {
  schemaVersion: 1;
  clock: {
    realSecondsPerBeat: number;
    beats: DayBeat[];
  };
  walkSpeed: number;
  arriveRadius: number;
  waypoints: WaypointDef[];
  agents: AgentSchedule[];
};

const dayBeatSet = new Set<string>(DAY_BEATS);

export function scheduleHref(): string {
  return `${import.meta.env.BASE_URL}npc-schedules.json`;
}

export function assertSchedule(
  data: ScheduleCatalog,
  catalog?: AvatarSlotCatalog,
): ScheduleCatalog {
  if (data.schemaVersion !== 1) {
    throw new Error("지원하지 않는 npc-schedules.json 스키마입니다.");
  }
  if (!data.clock || !Number.isFinite(data.clock.realSecondsPerBeat) || data.clock.realSecondsPerBeat <= 0) {
    throw new Error("clock.realSecondsPerBeat는 양수여야 합니다.");
  }
  if (!Array.isArray(data.clock.beats) || data.clock.beats.length === 0) {
    throw new Error("clock.beats가 비어 있습니다.");
  }
  for (const beat of data.clock.beats) {
    if (!dayBeatSet.has(beat)) {
      throw new Error(`알 수 없는 day beat: ${beat}`);
    }
  }
  if (!Number.isFinite(data.walkSpeed) || data.walkSpeed <= 0) {
    throw new Error("walkSpeed는 양수여야 합니다.");
  }
  if (!Number.isFinite(data.arriveRadius) || data.arriveRadius <= 0) {
    throw new Error("arriveRadius는 양수여야 합니다.");
  }
  if (!Array.isArray(data.waypoints) || data.waypoints.length === 0) {
    throw new Error("waypoints가 비어 있습니다.");
  }

  const waypointIds = new Set<string>();
  for (const waypoint of data.waypoints) {
    if (!waypoint.id?.trim()) {
      throw new Error("waypoint id가 필요합니다.");
    }
    if (waypointIds.has(waypoint.id)) {
      throw new Error(`waypoint id가 중복됩니다: ${waypoint.id}`);
    }
    waypointIds.add(waypoint.id);
    if (waypoint.kind !== "ring" && waypoint.kind !== "box") {
      throw new Error(`waypoint ${waypoint.id}: kind는 ring 또는 box여야 합니다.`);
    }
    if (!Array.isArray(waypoint.position) || waypoint.position.length !== 3) {
      throw new Error(`waypoint ${waypoint.id}: position은 [x,y,z]여야 합니다.`);
    }
  }

  if (!Array.isArray(data.agents) || data.agents.length < 3) {
    throw new Error("agents는 서로 다른 루트의 슬롯 3개 이상이어야 합니다.");
  }

  const agentSlots = new Set<string>();
  for (const agent of data.agents) {
    if (!lockedSlotIdSet.has(agent.slotId)) {
      throw new Error(`agent slotId는 잠긴 캐스트 id여야 합니다: ${agent.slotId}`);
    }
    if (agentSlots.has(agent.slotId)) {
      throw new Error(`agent slotId가 중복됩니다: ${agent.slotId}`);
    }
    agentSlots.add(agent.slotId);
    if (catalog && !catalog.slots.some((slot) => slot.id === agent.slotId)) {
      throw new Error(`agent slotId가 카탈로그에 없습니다: ${agent.slotId}`);
    }
    if (agent.walkSpeed !== undefined && (!Number.isFinite(agent.walkSpeed) || agent.walkSpeed <= 0)) {
      throw new Error(`${agent.slotId}: walkSpeed는 양수여야 합니다.`);
    }

    const used = new Set<string>();
    for (const beat of data.clock.beats) {
      const stop = agent.stops[beat];
      if (!stop) {
        throw new Error(`${agent.slotId}: beat ${beat}에 waypoint가 없습니다.`);
      }
      if (!waypointIds.has(stop)) {
        throw new Error(`${agent.slotId}: 알 수 없는 waypoint ${stop}`);
      }
      used.add(stop);
    }
    if (used.size < 2) {
      throw new Error(`${agent.slotId}: 루트에 waypoint가 2곳 이상 있어야 합니다.`);
    }
  }

  return data;
}

export async function loadSchedule(catalog?: AvatarSlotCatalog): Promise<ScheduleCatalog> {
  const href = scheduleHref();
  const response = await fetch(href);
  if (!response.ok) {
    throw new Error(`npc-schedules.json 로드 실패 (${response.status})`);
  }
  return assertSchedule((await response.json()) as ScheduleCatalog, catalog);
}

export function findWaypoint(schedule: ScheduleCatalog, id: string): WaypointDef {
  const found = schedule.waypoints.find((waypoint) => waypoint.id === id);
  if (!found) {
    throw new Error(`waypoint를 찾을 수 없습니다: ${id}`);
  }
  return found;
}

export function destinationFor(agent: AgentSchedule, beat: DayBeat): string {
  const stop = agent.stops[beat];
  if (!stop) {
    throw new Error(`${agent.slotId}: ${beat} 목적지가 없습니다.`);
  }
  return stop;
}

export class AcademyClock {
  readonly beats: DayBeat[];
  readonly realSecondsPerBeat: number;
  elapsed = 0;

  constructor(clock: ScheduleCatalog["clock"]) {
    this.beats = clock.beats;
    this.realSecondsPerBeat = clock.realSecondsPerBeat;
  }

  tick(delta: number): void {
    this.elapsed += delta;
  }

  get cycleLength(): number {
    return this.beats.length * this.realSecondsPerBeat;
  }

  get beatIndex(): number {
    const t = ((this.elapsed % this.cycleLength) + this.cycleLength) % this.cycleLength;
    return Math.floor(t / this.realSecondsPerBeat);
  }

  get beat(): DayBeat {
    return this.beats[this.beatIndex] ?? this.beats[0];
  }

  get beatElapsed(): number {
    const t = ((this.elapsed % this.cycleLength) + this.cycleLength) % this.cycleLength;
    return t - this.beatIndex * this.realSecondsPerBeat;
  }

  get beatRemaining(): number {
    return Math.max(0, this.realSecondsPerBeat - this.beatElapsed);
  }
}
