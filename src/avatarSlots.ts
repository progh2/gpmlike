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

export function catalogHref(): string {
  return `${import.meta.env.BASE_URL}avatar-slots.json`;
}

export async function loadCatalog(): Promise<AvatarSlotCatalog> {
  const href = catalogHref();
  const response = await fetch(href);
  if (!response.ok) {
    throw new Error(`avatar-slots.json 로드 실패 (${response.status})`);
  }

  const data = (await response.json()) as AvatarSlotCatalog;
  if (data.schemaVersion !== 1 || !Array.isArray(data.slots) || data.slots.length === 0) {
    throw new Error("지원하지 않는 avatar-slots.json 스키마입니다.");
  }
  return data;
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
