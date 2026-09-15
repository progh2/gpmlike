import "./style.css";
import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1f2a);
scene.fog = new THREE.Fog(0x1a1f2a, 28, 70);

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  200,
);
camera.position.set(10, 12, 14);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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
scene.add(ground);

scene.add(new THREE.AmbientLight(0xffffff, 0.45));
const sun = new THREE.DirectionalLight(0xe8f0ff, 0.9);
sun.position.set(12, 22, 8);
scene.add(sun);

function frame(): void {
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(frame);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
