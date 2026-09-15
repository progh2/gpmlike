import * as THREE from "three";
import type { WaypointDef } from "./npcSchedule";

function colorOf(hex: string): number {
  return new THREE.Color(hex).getHex();
}

function addRingMarker(scene: THREE.Scene, waypoint: WaypointDef): void {
  const color = colorOf(waypoint.color);
  const [x, , z] = waypoint.position;

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.48, 0.66, 36),
    new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(x, 0.03, z);
  ring.name = `waypoint:${waypoint.id}`;
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
  scene.add(pole);

  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0xf2f6fb, roughness: 0.35 }),
  );
  cap.position.set(x, 1.6, z);
  cap.name = `waypoint-cap:${waypoint.id}`;
  scene.add(cap);
}

function addClassroomBox(scene: THREE.Scene, waypoint: WaypointDef): void {
  const color = colorOf(waypoint.color);
  const [x, , z] = waypoint.position;
  const building = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 2.1, 3.1),
    new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0.04 }),
  );
  building.position.set(x + 3.1, 1.05, z);
  building.name = `campus:classroom`;
  scene.add(building);

  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 1.35, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x243040, roughness: 0.6 }),
  );
  door.position.set(x + 1.05, 0.68, z);
  door.name = `campus:classroom-door`;
  scene.add(door);
}

function addRoofBox(scene: THREE.Scene, waypoint: WaypointDef): void {
  const color = colorOf(waypoint.color);
  const [x, , z] = waypoint.position;
  const tower = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 2.6, 2.4),
    new THREE.MeshStandardMaterial({ color: 0x3a4a58, roughness: 0.88 }),
  );
  tower.position.set(x - 2.2, 1.3, z);
  tower.name = `campus:roof-tower`;
  scene.add(tower);

  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.16, 3.4),
    new THREE.MeshStandardMaterial({ color, roughness: 0.7 }),
  );
  deck.position.set(x - 2.2, 2.68, z);
  deck.name = `campus:roof-deck`;
  scene.add(deck);
}

function addGateBox(scene: THREE.Scene, waypoint: WaypointDef): void {
  const color = colorOf(waypoint.color);
  const [x, , z] = waypoint.position;
  const left = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 2.4, 0.38),
    new THREE.MeshStandardMaterial({ color, roughness: 0.55 }),
  );
  left.position.set(x - 1.6, 1.2, z + 0.8);
  left.name = `campus:gate-left`;
  scene.add(left);

  const right = left.clone();
  right.position.set(x + 1.6, 1.2, z + 0.8);
  right.name = `campus:gate-right`;
  scene.add(right);

  const lintel = new THREE.Mesh(
    new THREE.BoxGeometry(3.7, 0.32, 0.42),
    new THREE.MeshStandardMaterial({ color: 0xe8eef4, roughness: 0.45 }),
  );
  lintel.position.set(x, 2.45, z + 0.8);
  lintel.name = `campus:gate-lintel`;
  scene.add(lintel);
}

function addCampusFeature(scene: THREE.Scene, waypoint: WaypointDef): void {
  if (waypoint.id === "Classroom") {
    addClassroomBox(scene, waypoint);
  } else if (waypoint.id === "Roof") {
    addRoofBox(scene, waypoint);
  } else if (waypoint.id === "Gate") {
    addGateBox(scene, waypoint);
  }
}

/** Hub + school markers. Box stubs from #7 are gone — VRMs walk these routes. */
export function addSchedulePlaceholders(scene: THREE.Scene, waypoints: WaypointDef[]): void {
  for (const waypoint of waypoints) {
    addRingMarker(scene, waypoint);
    if (waypoint.kind === "box") {
      addCampusFeature(scene, waypoint);
    }
  }
}
