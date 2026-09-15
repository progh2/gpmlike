import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import type { WaypointDef } from "./npcSchedule";

export function detachBillboardLabels(root: THREE.Object3D): void {
  const leftover: CSS2DObject[] = [];
  root.traverse((obj) => {
    if (obj instanceof CSS2DObject) {
      leftover.push(obj);
    }
  });
  for (const label of leftover) {
    label.element.remove();
    label.removeFromParent();
  }
}

export function makeBillboardLabel(text: string, className: string, y = 1.85): CSS2DObject {
  const el = document.createElement("div");
  el.className = className;
  el.textContent = text;
  const label = new CSS2DObject(el);
  label.position.set(0, y, 0);
  return label;
}

function colorOf(hex: string): number {
  return new THREE.Color(hex).getHex();
}

function addHubMarker(scene: THREE.Scene, waypoint: WaypointDef): void {
  const color = colorOf(waypoint.color);
  const [x, , z] = waypoint.position;

  if (waypoint.kind === "box") {
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 0.42, 1.15),
      new THREE.MeshStandardMaterial({ color, roughness: 0.78, metalness: 0.05 }),
    );
    block.position.set(x, 0.21, z);
    block.name = `waypoint-box:${waypoint.id}`;
    block.userData.hubId = waypoint.id;
    scene.add(block);
  }

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.48, 0.66, 36),
    new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(x, 0.03, z);
  ring.name = `waypoint:${waypoint.id}`;
  ring.userData.hubId = waypoint.id;
  scene.add(ring);

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.045, 1.55, 8),
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.55,
      metalness: 0.08,
    }),
  );
  pole.position.set(x, 0.78, z);
  pole.name = `waypoint-pole:${waypoint.id}`;
  pole.userData.hubId = waypoint.id;
  scene.add(pole);

  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0xf2f6fb, roughness: 0.35 }),
  );
  cap.position.set(x, 1.6, z);
  cap.name = `waypoint-cap:${waypoint.id}`;
  cap.userData.hubId = waypoint.id;
  scene.add(cap);

  const label = makeBillboardLabel(waypoint.label, "wp-label", 1.95);
  label.position.set(x, 1.95, z);
  scene.add(label);
}

/** IA hub nodes only: Talk · Drill · Desk · Bay · Shop. */
export function addSchedulePlaceholders(scene: THREE.Scene, waypoints: WaypointDef[]): void {
  for (const waypoint of waypoints) {
    addHubMarker(scene, waypoint);
  }
}
