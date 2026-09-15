import "./style.css";
import { VRM } from "@pixiv/three-vrm";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
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
import { disposeVrm, frameVrm, loadVrm } from "./loadVrm";
import { addSchedulePlaceholders } from "./placeholders";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1f2a);
scene.fog = new THREE.Fog(0x1a1f2a, 36, 80);

const camera = new THREE.PerspectiveCamera(
  32,
  window.innerWidth / window.innerHeight,
  0.05,
  200,
);
camera.position.set(0.6, 1.45, 4.2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;
controls.target.set(0, 1.05, 0);
controls.minDistance = 1.2;
controls.maxDistance = 18;
controls.maxPolarAngle = Math.PI * 0.49;
controls.update();

const grid = new THREE.GridHelper(40, 40, 0x5aa4b8, 0x2c3d4c);
scene.add(grid);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({
    color: 0x243040,
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

addSchedulePlaceholders(scene);

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

const clock = new THREE.Clock();
let currentVrm: VRM | undefined;
let loadGeneration = 0;

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

async function showSlot(catalog: AvatarSlotCatalog, requestedId: string | null): Promise<void> {
  const slot = findSlot(catalog, requestedId);
  const generation = ++loadGeneration;
  populateSelect(catalog, slot.id);
  writeSlotQuery(slot.id);
  renderSlotMeta(slot);
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
    disposeVrm(next, scene);
    return;
  }

  if (currentVrm) {
    disposeVrm(currentVrm, scene);
  }

  currentVrm = next;
  scene.add(next.scene);
  frameVrm(next, camera, controls.target);
  controls.update();
  setStatus(`로드됨 · ${slot.id}`, "idle");
}

function frame(): void {
  const delta = clock.getDelta();
  currentVrm?.update(delta);
  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(frame);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const catalog = await loadCatalog();
await showSlot(catalog, slotIdFromSearch());

slotSelect.addEventListener("change", () => {
  void showSlot(catalog, slotSelect.value);
});
