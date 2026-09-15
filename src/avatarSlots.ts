export type RoleId = "Pilot" | "Scout" | "Lead" | "Wrench" | "Ops" | "Medic";

export type LocalizedName = {
  ko: string;
  en: string;
};

export type DisplayName = string | LocalizedName;

export type SlotStatus = "placeholder" | "ready";

export type AvatarSlot = {
  id: string;
  displayName: DisplayName;
  vrmUrl?: string;
  vrmPath?: string;
  license: string;
  licenseUrl: string;
  role?: RoleId;
  sourceName?: string;
  sourceUrl?: string;
  attribution?: string;
  status?: SlotStatus;
};

export type AvatarSlotCatalog = {
  schemaVersion: 1;
  defaultSlotId: string;
  slots: AvatarSlot[];
};

/** Locked in docs/design/original-pitch.md — swap URL/path only, never rename. */
export const LOCKED_SLOT_IDS = [
  "cadet_player",
  "cadet_iseul",
  "cadet_rio",
  "cadet_minjae",
  "cadet_arin",
  "cadet_taeho",
  "staff_nari",
] as const;

const lockedSlotIdSet = new Set<string>(LOCKED_SLOT_IDS);

export function catalogHref(): string {
  return `${import.meta.env.BASE_URL}avatar-slots.json`;
}

export function assertCatalog(data: AvatarSlotCatalog): AvatarSlotCatalog {
  if (data.schemaVersion !== 1 || !Array.isArray(data.slots) || data.slots.length === 0) {
    throw new Error("지원하지 않는 avatar-slots.json 스키마입니다.");
  }

  const ids = data.slots.map((slot) => slot.id);
  const missing = LOCKED_SLOT_IDS.filter((id) => !ids.includes(id));
  const unexpected = ids.filter((id) => !lockedSlotIdSet.has(id));
  if (missing.length > 0 || unexpected.length > 0) {
    throw new Error("슬롯 id는 고정입니다. vrmUrl/vrmPath만 교체하세요.");
  }
  if (!lockedSlotIdSet.has(data.defaultSlotId)) {
    throw new Error("defaultSlotId가 잠긴 슬롯 id가 아닙니다.");
  }

  for (const slot of data.slots) {
    if (!slot.license?.trim() || !slot.licenseUrl?.trim()) {
      throw new Error(`슬롯 ${slot.id}: license와 licenseUrl은 필수입니다.`);
    }
    if (!slot.vrmUrl?.trim() && !slot.vrmPath?.trim()) {
      throw new Error(`슬롯 ${slot.id}: vrmUrl 또는 vrmPath가 필요합니다.`);
    }
  }

  return data;
}

export async function loadCatalog(): Promise<AvatarSlotCatalog> {
  const href = catalogHref();
  const response = await fetch(href);
  if (!response.ok) {
    throw new Error(`avatar-slots.json 로드 실패 (${response.status})`);
  }

  return assertCatalog((await response.json()) as AvatarSlotCatalog);
}

export function slotIdFromSearch(search = window.location.search): string | null {
  const value = new URLSearchParams(search).get("slot")?.trim();
  return value ? value : null;
}

export function writeSlotQuery(id: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set("slot", id);
  history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

export function findSlot(catalog: AvatarSlotCatalog, id: string | null): AvatarSlot {
  const requested = id ? catalog.slots.find((slot) => slot.id === id) : undefined;
  const fallback =
    catalog.slots.find((slot) => slot.id === catalog.defaultSlotId) ?? catalog.slots[0];
  return requested ?? fallback;
}

export function displayNameLabel(name: DisplayName): string {
  if (typeof name === "string") {
    return name;
  }
  return `${name.ko} / ${name.en}`;
}

export function resolveVrmHref(slot: AvatarSlot): string {
  const url = slot.vrmUrl?.trim();
  if (url) {
    if (!url.startsWith("https://")) {
      throw new Error(`슬롯 ${slot.id}: vrmUrl은 https URL이어야 합니다.`);
    }
    return url;
  }

  const path = slot.vrmPath?.trim();
  if (!path) {
    throw new Error(`슬롯 ${slot.id}에 vrmUrl/vrmPath가 없습니다.`);
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
