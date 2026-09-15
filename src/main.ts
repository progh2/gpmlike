import "./style.css";
import { VRM } from "@pixiv/three-vrm";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import {
  type AvatarSlot,
  type AvatarSlotCatalog,
  displayNameLabel,
  findSlot,
  loadCatalog,
  resolveVrmHref,
  slotIdFromSearch,
  writeSlotQuery,
} from "./avatarSlots";
import { disposeVrm, loadVrm } from "./loadVrm";
import { bindDayHud, renderDayHud, type DayHudElements } from "./dayHud";
import {
  type DaySession,
  advanceBeat,
  applyChoice,
  loadSession,
  persistEod,
  resetSession,
} from "./daySim";
import {
  type NpcAgent,
  agentLabel,
  findAgent,
  placeAgentAtBeat,
  spawnScheduledAgents,
  tickAgent,
} from "./npcAgents";
import { AcademyClock, loadSchedule, type ScheduleCatalog } from "./npcSchedule";
import { addSchedulePlaceholders, detachBillboardLabels, makeBillboardLabel } from "./placeholders";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1f2a);
scene.fog = new THREE.Fog(0x1a1f2a, 48, 90);

const camera = new THREE.PerspectiveCamera(
  42,
  window.innerWidth / window.innerHeight,
  0.05,
  200,
);
camera.position.set(11, 11, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.className = "label-layer";
document.body.appendChild(labelRenderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;
controls.target.set(0, 0.4, 1);
controls.minDistance = 1.2;
controls.maxDistance = 48;
controls.maxPolarAngle = Math.PI * 0.49;
controls.update();

const grid = new THREE.GridHelper(48, 48, 0x7ec8d8, 0x3d5566);
scene.add(grid);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(48, 48),
  new THREE.MeshStandardMaterial({
    color: 0x1a2633,
    roughness: 0.95,
    metalness: 0.05,
  }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.01;
ground.receiveShadow = true;
scene.add(ground);

scene.add(new THREE.AmbientLight(0xffffff, 0.55));
scene.add(new THREE.HemisphereLight(0xd7e6ff, 0x243040, 0.55));

const sun = new THREE.DirectionalLight(0xe8f0ff, 2.2);
sun.position.set(6, 14, 8);
scene.add(sun);

const fill = new THREE.DirectionalLight(0xfff2e0, 0.7);
fill.position.set(-5, 4, 6);
scene.add(fill);

function requireElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`HUD markup is missing: ${selector}`);
  }
  return element;
}

const slotSelect = requireElement<HTMLSelectElement>("#slot-select");
const slotMeta = requireElement<HTMLElement>("#slot-meta");
const slotStatus = requireElement<HTMLElement>("#slot-status");
const clockStatus = requireElement<HTMLElement>("#clock-status");
const npcRoster = requireElement<HTMLElement>("#npc-roster");
const dayHud: DayHudElements = bindDayHud();

const clock = new THREE.Clock();
const followTarget = new THREE.Vector3();
let currentVrm: VRM | undefined;
let loadGeneration = 0;
let agents: NpcAgent[] = [];
let schedule: ScheduleCatalog;
let academyClock: AcademyClock;
let focusedSlotId = "";
let session: DaySession = loadSession();

const PREVIEW_STAND = new THREE.Vector3(3.6, 0, 1.4);

function dropPreview(): void {
  if (!currentVrm) {
    return;
  }
  detachBillboardLabels(currentVrm.scene);
  disposeVrm(currentVrm, scene);
  currentVrm = undefined;
}

function setStatus(text: string, kind: "idle" | "busy" | "error" = "idle"): void {
  slotStatus.textContent = text;
  slotStatus.dataset.kind = kind;
}

function renderSlotMeta(slot: AvatarSlot): void {
  const role = slot.role ? ` · ${slot.role}` : "";
  const source = slot.sourceName ?? "sample VRM";
  slotMeta.replaceChildren();

  const line = document.createElement("span");
  line.textContent = `${displayNameLabel(slot.displayName)}${role} · ${source} · `;
  slotMeta.append(line);

  const license = document.createElement("a");
  license.href = slot.licenseUrl;
  license.target = "_blank";
  license.rel = "noopener noreferrer";
  license.textContent = slot.license;
  slotMeta.append(license);
}

function populateSelect(catalog: AvatarSlotCatalog, selectedId: string): void {
  slotSelect.replaceChildren();
  for (const slot of catalog.slots) {
    const option = document.createElement("option");
    option.value = slot.id;
    option.textContent = `${displayNameLabel(slot.displayName)} (${slot.id})`;
    slotSelect.append(option);
  }
  slotSelect.value = selectedId;
}

function renderClockHud(): void {
  clockStatus.textContent = `학원 시계 · ${academyClock.beat} · 플레이어 진행 · Voice ${session.voice}`;
}

function syncClockToSession(): void {
  academyClock.paused = true;
  academyClock.seekBeat(session.beat);
}

function refreshDay(): void {
  syncClockToSession();
  paintDayHud();
}

function paintDayHud(): void {
  renderDayHud(dayHud, session, catalog, chooseDayOption);
}

function chooseDayOption(choiceId: string): void {
  const result = applyChoice(session, choiceId);
  if (!result.ok) {
    session.log = result.reason;
  }
  paintDayHud();
}

function stepDay(): void {
  const result = advanceBeat(session);
  if (!result.ok) {
    session.log = result.reason;
    paintDayHud();
    return;
  }
  if (result.saved) {
    persistEod(session);
  }
  refreshDay();
}

function restartTerm(): void {
  session = resetSession();
  for (const agent of agents) {
    placeAgentAtBeat(agent, schedule, session.beat);
  }
  refreshDay();
}

function renderRoster(): void {
  npcRoster.replaceChildren();
  for (const agent of agents) {
    const row = document.createElement("li");
    const focused = agent.slot.id === focusedSlotId;
    row.dataset.gait = agent.gait;
    if (focused) {
      row.dataset.focus = "on";
    }
    row.textContent = `${agentLabel(agent)} · ${agent.gait} → ${agent.targetId}`;
    npcRoster.append(row);
  }
}

function lookAtCampus(): void {
  followTarget.set(0, 0.4, 1);
}

function lookAtAgent(agent: NpcAgent): void {
  const pos = agent.vrm.scene.position;
  followTarget.set(pos.x, 1.05, pos.z);
}

async function showSlot(catalog: AvatarSlotCatalog, requestedId: string | null): Promise<void> {
  const slot = findSlot(catalog, requestedId);
  const generation = ++loadGeneration;
  focusedSlotId = slot.id;
  populateSelect(catalog, slot.id);
  writeSlotQuery(slot.id);
  renderSlotMeta(slot);

  const living = findAgent(agents, slot.id);
  if (living) {
    dropPreview();
    lookAtAgent(living);
    setStatus(`스케줄 NPC · ${slot.id} · ${living.gait} → ${living.targetId}`, "idle");
    return;
  }

  lookAtCampus();
  setStatus("VRM 로드 중…", "busy");

  const href = resolveVrmHref(slot);
  let next: VRM;
  try {
    next = await loadVrm(href);
  } catch (error) {
    if (generation !== loadGeneration) {
      return;
    }
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    setStatus(`로드 실패: ${message}`, "error");
    return;
  }

  if (generation !== loadGeneration) {
    detachBillboardLabels(next.scene);
    disposeVrm(next, scene);
    return;
  }

  dropPreview();

  currentVrm = next;
  next.scene.position.copy(PREVIEW_STAND);
  next.scene.add(makeBillboardLabel(displayNameLabel(slot.displayName), "npc-label", 1.82));
  scene.add(next.scene);
  setStatus(`프리뷰 · ${slot.id} (일정 없음 · 슬롯 VRM 교체 가능)`, "idle");
}

function frame(): void {
  const delta = clock.getDelta();
  academyClock.tick(delta);
  for (const agent of agents) {
    tickAgent(agent, schedule, academyClock, delta);
  }
  currentVrm?.update(delta);

  const focused = findAgent(agents, focusedSlotId);
  if (focused) {
    lookAtAgent(focused);
  }
  controls.target.lerp(followTarget, 1 - Math.exp(-3 * delta));
  controls.update();
  renderClockHud();
  renderRoster();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

const catalog = await loadCatalog();
schedule = await loadSchedule(catalog);
academyClock = new AcademyClock(schedule.clock);
syncClockToSession();
addSchedulePlaceholders(scene, schedule.waypoints);

try {
  setStatus("NPC 3명 로드 중…", "busy");
  agents = await spawnScheduledAgents(catalog, schedule, scene);
  for (const agent of agents) {
    placeAgentAtBeat(agent, schedule, session.beat);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : "알 수 없는 오류";
  setStatus(`NPC 로드 실패: ${message}`, "error");
}

refreshDay();

await showSlot(catalog, slotIdFromSearch());
renderer.setAnimationLoop(frame);

slotSelect.addEventListener("change", () => {
  void showSlot(catalog, slotSelect.value);
});

dayHud.advance.addEventListener("click", () => {
  stepDay();
});

dayHud.reset.addEventListener("click", () => {
  restartTerm();
});
