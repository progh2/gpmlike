import * as THREE from "three";

/** Hub nodes from docs/design/ia.md — empty markers until #8 schedule AI. */
const WAYPOINTS = [
  { id: "Talk", label: "Talk", position: new THREE.Vector3(-6, 0, -4), color: 0x6ec8d4 },
  { id: "Drill", label: "Drill", position: new THREE.Vector3(7, 0, -5), color: 0xd4b36e },
  { id: "Bay", label: "Bay", position: new THREE.Vector3(-2, 0, 8), color: 0x8aa4d4 },
] as const;

const STUB_NPCS = [
  { name: "npc-stub:Talk", position: new THREE.Vector3(-6.8, 0.7, -4.3), color: 0xc48a7a },
  { name: "npc-stub:Drill", position: new THREE.Vector3(7.6, 0.7, -4.6), color: 0x7aa3c4 },
  { name: "npc-stub:Bay", position: new THREE.Vector3(-2.8, 0.7, 8.4), color: 0x9a8ac4 },
] as const;

export function addSchedulePlaceholders(scene: THREE.Scene): void {
  for (const waypoint of WAYPOINTS) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.48, 0.66, 36),
      new THREE.MeshBasicMaterial({ color: waypoint.color, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(waypoint.position);
    ring.position.y = 0.03;
    ring.name = `waypoint:${waypoint.id}`;
    scene.add(ring);

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.045, 1.55, 8),
      new THREE.MeshStandardMaterial({
        color: waypoint.color,
        roughness: 0.55,
        metalness: 0.08,
      }),
    );
    pole.position.copy(waypoint.position);
    pole.position.y = 0.78;
    pole.name = `waypoint-pole:${waypoint.id}`;
    scene.add(pole);

    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 12, 10),
      new THREE.MeshStandardMaterial({ color: 0xf2f6fb, roughness: 0.35 }),
    );
    cap.position.copy(waypoint.position);
    cap.position.y = 1.6;
    cap.name = `waypoint-cap:${waypoint.id}`;
    scene.add(cap);
  }

  for (const stub of STUB_NPCS) {
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 1.38, 0.34),
      new THREE.MeshStandardMaterial({
        color: stub.color,
        roughness: 0.82,
        metalness: 0.04,
      }),
    );
    body.position.copy(stub.position);
    body.name = stub.name;
    scene.add(body);
  }
}
