import type { VRM, VRMHumanBoneName } from "@pixiv/three-vrm";
import * as THREE from "three";

const LOCOMOTION_BONES: VRMHumanBoneName[] = [
  "hips",
  "spine",
  "chest",
  "leftUpperLeg",
  "leftLowerLeg",
  "rightUpperLeg",
  "rightLowerLeg",
  "leftUpperArm",
  "leftLowerArm",
  "rightUpperArm",
  "rightLowerArm",
];

export type LocomotionPose = Map<VRMHumanBoneName, THREE.Quaternion>;

const euler = new THREE.Euler();
const offset = new THREE.Quaternion();

export function captureRestPose(vrm: VRM): LocomotionPose {
  const rest: LocomotionPose = new Map();
  for (const name of LOCOMOTION_BONES) {
    const node = vrm.humanoid?.getNormalizedBoneNode(name);
    if (node) {
      rest.set(name, node.quaternion.clone());
    }
  }
  return rest;
}

function poseBone(
  vrm: VRM,
  rest: LocomotionPose,
  name: VRMHumanBoneName,
  x: number,
  y = 0,
  z = 0,
): void {
  const node = vrm.humanoid?.getNormalizedBoneNode(name);
  const base = rest.get(name);
  if (!node || !base) {
    return;
  }
  euler.set(x, y, z);
  offset.setFromEuler(euler);
  node.quaternion.copy(base).multiply(offset);
}

/** Procedural idle (breathe) vs walk (leg/arm swing). No Mixamo / extra clips. */
export function applyLocomotion(
  vrm: VRM,
  rest: LocomotionPose,
  time: number,
  walkWeight: number,
): void {
  const weight = THREE.MathUtils.clamp(walkWeight, 0, 1);
  const breathe = Math.sin(time * 1.7) * 0.025;
  const sway = Math.sin(time * 1.15) * 0.02;
  const stride = Math.sin(time * 8.2);
  const opposite = Math.sin(time * 8.2 + Math.PI);
  const leftKnee = Math.max(0, stride);
  const rightKnee = Math.max(0, opposite);

  poseBone(vrm, rest, "spine", breathe + weight * 0.06, sway * 0.4);
  poseBone(vrm, rest, "chest", breathe * 0.5, sway * (1 - weight * 0.4));
  poseBone(vrm, rest, "hips", weight * 0.04, weight * stride * 0.05);

  poseBone(vrm, rest, "leftUpperLeg", weight * stride * 0.55);
  poseBone(vrm, rest, "rightUpperLeg", weight * opposite * 0.55);
  poseBone(vrm, rest, "leftLowerLeg", weight * leftKnee * 0.42);
  poseBone(vrm, rest, "rightLowerLeg", weight * rightKnee * 0.42);

  poseBone(vrm, rest, "leftUpperArm", weight * opposite * 0.38, 0, (1 - weight) * 0.04);
  poseBone(vrm, rest, "rightUpperArm", weight * stride * 0.38, 0, (1 - weight) * -0.04);
  poseBone(vrm, rest, "leftLowerArm", weight * 0.12 + (1 - weight) * breathe);
  poseBone(vrm, rest, "rightLowerArm", weight * 0.12 + (1 - weight) * breathe);
}
