#!/usr/bin/env node
/**
 * Team review bar for #7 — fail the build if the catalog drifts.
 * 1. Slot ids stay locked (URL/path only).
 * 2. Every slot has license + licenseUrl.
 * 3. Load from documented https URL — no committed .vrm.
 * 4. Shape matches docs/design/vrm-slots.schema.json.
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = join(root, "public/avatar-slots.json");

/** Locked in docs/design/original-pitch.md — do not rename. */
const LOCKED_SLOT_IDS = [
  "cadet_player",
  "cadet_iseul",
  "cadet_rio",
  "cadet_minjae",
  "cadet_arin",
  "cadet_taeho",
  "staff_nari",
];

const SLOT_KEYS = new Set([
  "id",
  "displayName",
  "vrmUrl",
  "vrmPath",
  "license",
  "licenseUrl",
  "role",
  "sourceName",
  "sourceUrl",
  "attribution",
  "status",
]);

const ROLES = new Set(["Pilot", "Scout", "Lead", "Wrench", "Ops", "Medic"]);
const ID_PATTERN = /^[a-z][a-z0-9_]*$/;

const failures = [];

function fail(message) {
  failures.push(message);
}

const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));

if (catalog.schemaVersion !== 1) {
  fail("schemaVersion must be 1");
}
if (typeof catalog.defaultSlotId !== "string" || !ID_PATTERN.test(catalog.defaultSlotId)) {
  fail("defaultSlotId must match the slot id pattern");
}
if (!Array.isArray(catalog.slots) || catalog.slots.length === 0) {
  fail("slots must be a non-empty array");
}

const extraRoot = Object.keys(catalog).filter(
  (key) => !["schemaVersion", "defaultSlotId", "slots"].includes(key),
);
if (extraRoot.length > 0) {
  fail(`unknown catalog keys: ${extraRoot.join(", ")}`);
}

const ids = catalog.slots.map((slot) => slot.id);
const missingLocked = LOCKED_SLOT_IDS.filter((id) => !ids.includes(id));
const unexpected = ids.filter((id) => !LOCKED_SLOT_IDS.includes(id));
if (missingLocked.length > 0 || unexpected.length > 0) {
  fail(
    `slot ids must stay locked (swap URL/path only). missing=${missingLocked.join(",") || "—"} unexpected=${unexpected.join(",") || "—"}`,
  );
}
if (new Set(ids).size !== ids.length) {
  fail("slot ids must be unique");
}
if (!LOCKED_SLOT_IDS.includes(catalog.defaultSlotId)) {
  fail(`defaultSlotId "${catalog.defaultSlotId}" is not a locked slot id`);
}

for (const slot of catalog.slots) {
  const label = slot.id ?? "(missing id)";
  const unknown = Object.keys(slot).filter((key) => !SLOT_KEYS.has(key));
  if (unknown.length > 0) {
    fail(`${label}: unknown keys ${unknown.join(", ")}`);
  }
  if (typeof slot.id !== "string" || !ID_PATTERN.test(slot.id)) {
    fail(`${label}: invalid id`);
  }
  if (!slot.license || !String(slot.license).trim()) {
    fail(`${label}: missing license`);
  }
  if (!slot.licenseUrl || !String(slot.licenseUrl).trim()) {
    fail(`${label}: missing licenseUrl`);
  }
  if (!slot.vrmUrl && !slot.vrmPath) {
    fail(`${label}: need vrmUrl or vrmPath`);
  }
  if (slot.vrmUrl && !String(slot.vrmUrl).startsWith("https://")) {
    fail(`${label}: vrmUrl must be an https URL`);
  }
  if (!slot.vrmUrl) {
    fail(`${label}: M2 catalog must use a documented CDN vrmUrl (do not commit a .vrm)`);
  }
  if (slot.role && !ROLES.has(slot.role)) {
    fail(`${label}: role must be a Role ID`);
  }
  if (slot.status && slot.status !== "placeholder" && slot.status !== "ready") {
    fail(`${label}: status must be placeholder|ready`);
  }
  const name = slot.displayName;
  const named =
    typeof name === "string"
      ? name.length > 0
      : name && typeof name.ko === "string" && name.ko && typeof name.en === "string" && name.en;
  if (!named) {
    fail(`${label}: displayName must be a string or { ko, en }`);
  }
}

const trackedVrms = execSync("git ls-files -z -- '*.vrm'", {
  cwd: root,
  encoding: "utf8",
})
  .split("\0")
  .filter(Boolean);
if (trackedVrms.length > 0) {
  fail(`do not commit VRM binaries: ${trackedVrms.join(", ")}`);
}

if (failures.length > 0) {
  console.error("avatar-slots review bar FAIL:");
  for (const message of failures) {
    console.error(`  - ${message}`);
  }
  process.exit(1);
}

console.log(
  `avatar-slots review bar OK — ${ids.length} locked ids, license+licenseUrl on every slot, CDN vrmUrl only.`,
);
