import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { data } from "./computing-center-data";

const GLB_DB_NAME = "glb-cache";
const GLB_STORE_NAME = "models";
const GLB_CACHE_KEY = "china.glb";
const GLB_URL = "https://pub-bc5962af312445caa5258b02a060440b.r2.dev/china.glb";

function openGlbDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(GLB_DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(GLB_STORE_NAME);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getCachedGlb(): Promise<ArrayBuffer | null> {
  const db = await openGlbDB();
  return new Promise((resolve) => {
    const tx = db.transaction(GLB_STORE_NAME, "readonly");
    const req = tx.objectStore(GLB_STORE_NAME).get(GLB_CACHE_KEY);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => resolve(null);
  });
}

async function cacheGlb(data: ArrayBuffer): Promise<void> {
  const db = await openGlbDB();
  const tx = db.transaction(GLB_STORE_NAME, "readwrite");
  tx.objectStore(GLB_STORE_NAME).put(data, GLB_CACHE_KEY);
}

async function loadGlbModel(loader: GLTFLoader): Promise<GLTF> {
  const cached = await getCachedGlb();
  if (cached) {
    return new Promise((resolve, reject) => {
      loader.parse(cached, "", resolve, reject);
    });
  }

  const res = await fetch(GLB_URL);
  const buffer = await res.arrayBuffer();
  await cacheGlb(buffer);
  return new Promise((resolve, reject) => {
    loader.parse(buffer, "", resolve, reject);
  });
}

const provinceChipMap = new Map<string, number>();
for (const group of data) {
  const total = group.centers.reduce((sum, c) => sum + c.chipCount, 0);
  provinceChipMap.set(group.province, total);
}

export function DistributionMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const { clientWidth: width, clientHeight: height } = container;

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 200);
    camera.position.set(0, 28, 16);
    camera.lookAt(0, 0, -1);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    rendererRef.current = renderer;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(10, -10, 20);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x4488cc, 0.5);
    fillLight.position.set(-10, 10, 5);
    scene.add(fillLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, -1);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.minPolarAngle = Math.PI * 0.1;
    controls.maxPolarAngle = Math.PI * 0.6;
    controls.update();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    let mixer: THREE.AnimationMixer | null = null;
    const dataPoints: THREE.Mesh[] = [];

    loadGlbModel(gltfLoader)
      .then((gltf) => {
        const model = gltf.scene;
        scene.add(model);

        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }

        const provinceGroups = gltf.scene.children[1]?.children ?? [];
        const maxChips = Math.max(...provinceChipMap.values());

        for (const child of provinceGroups) {
          const chips = provinceChipMap.get(child.name);
          if (chips == null) continue;

          const worldPos = new THREE.Vector3();
          child.getWorldPosition(worldPos);

          const radius = 0.15 + (chips / maxChips) * 0.35;
          const geo = new THREE.SphereGeometry(radius, 16, 16);
          const mat = new THREE.MeshBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.85,
          });
          const sphere = new THREE.Mesh(geo, mat);
          sphere.position.copy(worldPos);
          sphere.position.y += 0.6;
          scene.add(sphere);
          dataPoints.push(sphere);
        }
      })
      .catch((error) => {
        console.error("GLB model loading failed:", error);
      });

    const timer = new THREE.Timer();
    let animationId: number;

    const animate = (timestamp: number) => {
      animationId = requestAnimationFrame(animate);
      timer.update(timestamp);
      const delta = timer.getDelta();

      mixer?.update(delta);

      const pulse = 0.9 + 0.2 * Math.sin(timestamp * 0.003);
      for (const pt of dataPoints) {
        pt.scale.setScalar(pulse);
        (pt.material as THREE.MeshBasicMaterial).opacity =
          0.6 + 0.25 * Math.sin(timestamp * 0.003);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate(performance.now());

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);
      controls.dispose();
      dracoLoader.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  const handleDownload = () => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    const url = renderer.domElement.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "distribution-map.png";
    a.click();
  };

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      <button
        onClick={handleDownload}
        className="absolute right-4 bottom-4 z-10 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </button>
    </div>
  );
}
