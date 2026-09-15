import { VRM, VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
loader.crossOrigin = "anonymous";
loader.register((parser) => new VRMLoaderPlugin(parser));

export async function loadVrm(url: string): Promise<VRM> {
  const gltf = await loader.loadAsync(url);
  const vrm = gltf.userData.vrm as VRM | undefined;
  if (!vrm) {
    throw new Error("로드한 파일이 VRM이 아닙니다.");
  }

  VRMUtils.removeUnnecessaryVertices(gltf.scene);
  VRMUtils.combineSkeletons(gltf.scene);
  VRMUtils.combineMorphs(vrm);
  VRMUtils.rotateVRM0(vrm);

  vrm.scene.traverse((obj) => {
    obj.frustumCulled = false;
  });

  return vrm;
}

export function disposeVrm(vrm: VRM, scene: THREE.Scene): void {
  scene.remove(vrm.scene);
  VRMUtils.deepDispose(vrm.scene);
}

export function frameVrm(
  vrm: VRM,
  camera: THREE.PerspectiveCamera,
  target: THREE.Vector3,
): void {
  const box = new THREE.Box3().setFromObject(vrm.scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const head = vrm.humanoid?.getNormalizedBoneNode("head");
  const headPos = new THREE.Vector3();
  if (head) {
    head.updateWorldMatrix(true, false);
    head.getWorldPosition(headPos);
  } else {
    headPos.copy(center);
    headPos.y = box.min.y + size.y * 0.72;
  }

  const lookY = THREE.MathUtils.lerp(center.y, headPos.y, 0.45);
  target.set(center.x, lookY, center.z);

  const height = Math.max(size.y, 1.5);
  const distance = height * 2.15;
  camera.position.set(center.x + height * 0.18, lookY + height * 0.12, center.z + distance);
  camera.near = 0.05;
  camera.far = 200;
  camera.updateProjectionMatrix();
  camera.lookAt(target);
}
