import type { VRM } from "@pixiv/three-vrm";
import * as THREE from "three";
import {
  type AvatarSlot,
  type AvatarSlotCatalog,
  displayNameLabel,
  findSlot,
  resolveVrmHref,
} from "./avatarSlots";
import { applyLocomotion, captureRestPose, type LocomotionPose } from "./locomotion";
import { loadVrm } from "./loadVrm";
import {
  type AcademyClock,
  type AgentSchedule,
  type ScheduleCatalog,
  destinationFor,
  findWaypoint,
} from "./npcSchedule";

export type AgentGait = "idle" | "walk";

export type NpcAgent = {
  slot: AvatarSlot;
  plan: AgentSchedule;
  vrm: VRM;
  rest: LocomotionPose;
  gait: AgentGait;
  walkWeight: number;
  targetId: string;
  elapsed: number;
};

const FACE_MINUS_Z = Math.PI;

export function waypointVector(schedule: ScheduleCatalog, id: string): THREE.Vector3 {
  const [x, y, z] = findWaypoint(schedule, id).position;
  return new THREE.Vector3(x, y, z);
}

export async function spawnScheduledAgents(
  catalog: AvatarSlotCatalog,
  schedule: ScheduleCatalog,
  scene: THREE.Scene,
): Promise<NpcAgent[]> {
  const spawned = await Promise.all(
    schedule.agents.map(async (plan) => {
      const slot = findSlot(catalog, plan.slotId);
      const vrm = await loadVrm(resolveVrmHref(slot));
      const firstStop = destinationFor(plan, schedule.clock.beats[0]);
      const start = waypointVector(schedule, firstStop);
      vrm.scene.position.copy(start);
      scene.add(vrm.scene);
      return {
        slot,
        plan,
        vrm,
        rest: captureRestPose(vrm),
        gait: "idle" as const,
        walkWeight: 0,
        targetId: firstStop,
        elapsed: 0,
      } satisfies NpcAgent;
    }),
  );
  return spawned;
}

export function findAgent(agents: NpcAgent[], slotId: string): NpcAgent | undefined {
  return agents.find((agent) => agent.slot.id === slotId);
}

export function agentLabel(agent: NpcAgent): string {
  return displayNameLabel(agent.slot.displayName);
}

export function tickAgent(
  agent: NpcAgent,
  schedule: ScheduleCatalog,
  clock: AcademyClock,
  delta: number,
): void {
  agent.elapsed += delta;
  agent.targetId = destinationFor(agent.plan, clock.beat);
  const target = waypointVector(schedule, agent.targetId);
  const pos = agent.vrm.scene.position;
  const offset = target.clone().sub(pos);
  offset.y = 0;
  const distance = offset.length();
  const speed = agent.plan.walkSpeed ?? schedule.walkSpeed;
  const arrive = schedule.arriveRadius;

  if (distance > arrive) {
    agent.gait = "walk";
    const step = Math.min(distance, speed * delta);
    offset.normalize();
    pos.addScaledVector(offset, step);
    agent.vrm.scene.rotation.y = Math.atan2(offset.x, offset.z) + FACE_MINUS_Z;
  } else {
    agent.gait = "idle";
    pos.x = THREE.MathUtils.damp(pos.x, target.x, 6, delta);
    pos.z = THREE.MathUtils.damp(pos.z, target.z, 6, delta);
  }

  const want = agent.gait === "walk" ? 1 : 0;
  agent.walkWeight = THREE.MathUtils.damp(agent.walkWeight, want, 8, delta);
  applyLocomotion(agent.vrm, agent.rest, agent.elapsed, agent.walkWeight);
  agent.vrm.update(delta);
}
