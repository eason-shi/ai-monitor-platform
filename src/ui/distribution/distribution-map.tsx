import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as TWEEN from "@tweenjs/tween.js";
import { realData } from "./computing-center-data";
import { loadGlbModel } from "./glb-loader";

function getMarkerByColonyType(
  colony_type: string,
  textures: Record<string, THREE.Texture>,
): THREE.Texture {
  switch (colony_type) {
    case "全国产卡":
      return textures.chinese;
    case "NV+国产":
      return textures.both;
    case "全NV卡":
    case "NV+AMD":
    default:
      return textures.nv;
  }
}

interface TourPoint {
  position: THREE.Vector3;
  cameraPosition: THREE.Vector3;
  name: string;
}

const MIN_SPREAD = 4;
const FOV_DEG = 55;
const FOV_RAD = (FOV_DEG * Math.PI) / 180;
const OVERVIEW_POS = { x: 2.47, y: 33.17, z: 17.73 };
const OVERVIEW_TARGET = { x: 0, y: 0, z: -1 };

const OVERVIEW_DIR = (() => {
  const dx = OVERVIEW_POS.x - OVERVIEW_TARGET.x;
  const dy = OVERVIEW_POS.y - OVERVIEW_TARGET.y;
  const dz = OVERVIEW_POS.z - OVERVIEW_TARGET.z;
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
  return { x: dx / len, y: dy / len, z: dz / len };
})();

function computeTourView(points: { x: number; y: number; z: number }[]): {
  target: THREE.Vector3;
  cameraPosition: THREE.Vector3;
} {
  const PADDING = 1.5;
  const DIRECTION_BLEND = 0.25;
  const MAX_OFFSET = 20;
  const MIN_DIST = 8;
  const MAX_DIST = 32;

  const n = points.length;
  let cx = 0,
    cy = 0,
    cz = 0;
  for (const p of points) {
    cx += p.x;
    cy += p.y;
    cz += p.z;
  }
  cx /= n;
  cy /= n;
  cz /= n;
  const target = new THREE.Vector3(cx, cy + 2, cz);

  const offsetX = cx - OVERVIEW_TARGET.x;
  const offsetZ = cz - OVERVIEW_TARGET.z;
  const offsetLen = Math.sqrt(offsetX * offsetX + offsetZ * offsetZ);
  const blend = DIRECTION_BLEND * Math.min(offsetLen / MAX_OFFSET, 1);

  let offDirX = 0,
    offDirZ = 0;
  if (offsetLen > 0.01) {
    offDirX = offsetX / offsetLen;
    offDirZ = offsetZ / offsetLen;
  }

  const rawDirX = OVERVIEW_DIR.x * (1 - blend) + offDirX * blend;
  const rawDirY = OVERVIEW_DIR.y;
  const rawDirZ = OVERVIEW_DIR.z * (1 - blend) + offDirZ * blend;
  const dirLen = Math.sqrt(
    rawDirX * rawDirX + rawDirY * rawDirY + rawDirZ * rawDirZ,
  );
  const finalDirX = rawDirX / dirLen;
  const finalDirY = rawDirY / dirLen;
  const finalDirZ = rawDirZ / dirLen;

  let minX = Infinity,
    maxX = -Infinity,
    minZ = Infinity,
    maxZ = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.z < minZ) minZ = p.z;
    if (p.z > maxZ) maxZ = p.z;
  }
  const diagLen = Math.sqrt((maxX - minX) ** 2 + (maxZ - minZ) ** 2);
  const spread = Math.max(diagLen, MIN_SPREAD);
  const rawDist = (spread * PADDING) / (2 * Math.tan(FOV_RAD / 2)) + 2;
  const distance = Math.max(MIN_DIST, Math.min(MAX_DIST, rawDist));

  const camX = target.x + finalDirX * distance;
  const camY = target.y + finalDirY * distance;
  const camZ = target.z + finalDirZ * distance;

  return { target, cameraPosition: new THREE.Vector3(camX, camY, camZ) };
}

interface DistributionMapProps {
  mode?: "touring" | "free";
  onProvinceChange?: (name: string) => void;
  onTipVisibleChange?: (visible: boolean) => void;
  onModeChange?: (mode: "touring" | "free") => void;
}

interface MapInternals {
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  tweenGroup: TWEEN.Group;
  modeState: { current: "touring" | "free" };
  getDwellTimer: () => ReturnType<typeof setTimeout> | null;
  setDwellTimer: (t: ReturnType<typeof setTimeout> | null) => void;
  transitionToNext: () => void;
  resetHighlight: () => void;
  fadeMarkers: (province: string | null) => void;
}

function lonLatToModel(lon: number, lat: number) {
  const scaleX = 0.877150027387623;
  const scaleZ = -44.39121698080014;
  const offsetX = -92.46535967185065;
  const offsetZ = 28.413195901434506;
  const offsetY = 0;

  const mx = lon;
  const my = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));

  return {
    x: scaleX * mx + offsetX,
    y: offsetY,
    z: scaleZ * my + offsetZ,
  };
}

const provinceGroupsMap = new Map<string, typeof realData>();
for (const item of realData) {
  const arr = provinceGroupsMap.get(item.region_prov);
  if (arr) arr.push(item);
  else provinceGroupsMap.set(item.region_prov, [item]);
}

const DWELL_TIME = 4000;
const TRANSITION_TIME = 1500;

export function DistributionMap({
  mode: modeProp = "touring",
  onProvinceChange,
  onTipVisibleChange,
  onModeChange,
}: DistributionMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalsRef = useRef<MapInternals | null>(null);

  const onProvinceChangeRef = useRef(onProvinceChange);
  const onTipVisibleChangeRef = useRef(onTipVisibleChange);
  const onModeChangeRef = useRef(onModeChange);
  useEffect(() => {
    onProvinceChangeRef.current = onProvinceChange;
    onTipVisibleChangeRef.current = onTipVisibleChange;
    onModeChangeRef.current = onModeChange;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const { clientWidth: width, clientHeight: height } = container;

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 200);
    camera.position.set(OVERVIEW_POS.x, OVERVIEW_POS.y, OVERVIEW_POS.z);
    camera.lookAt(0, 0, -1);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x4466aa, 2.5));
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
    // controls.addEventListener("change", () => {
    //   console.log("相机参数:", {
    //     position: {
    //       x: camera.position.x.toFixed(2),
    //       y: camera.position.y.toFixed(2),
    //       z: camera.position.z.toFixed(2),
    //     },
    //     target: {
    //       x: controls.target.x.toFixed(2),
    //       y: controls.target.y.toFixed(2),
    //       z: controls.target.z.toFixed(2),
    //     },
    //     distance: camera.position.distanceTo(controls.target).toFixed(2),
    //   });
    // });
    controls.update();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    let mixer: THREE.AnimationMixer | null = null;
    const dataPointsByProvince = new Map<string, THREE.Sprite[]>();
    let markerTextures: Record<string, THREE.Texture> | null = null;
    const tourPoints: TourPoint[] = [];
    const provinceMeshes: THREE.Object3D[] = [];

    const tweenGroup = new TWEEN.Group();
    let currentTourIndex = 0;
    let dwellTimer: ReturnType<typeof setTimeout> | null = null;
    const modeState = { current: "touring" as "touring" | "free" };

    function fadeMarkers(targetProvince: string | null) {
      for (const [prov, sprites] of dataPointsByProvince) {
        const targetOpacity =
          targetProvince === null || prov === targetProvince ? 1 : 0;
        for (const sprite of sprites) {
          const mat = sprite.material as THREE.SpriteMaterial;
          const obj = { opacity: mat.opacity };
          new TWEEN.Tween(obj, tweenGroup)
            .to({ opacity: targetOpacity }, TRANSITION_TIME)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(() => {
              mat.opacity = obj.opacity;
            })
            .start();
        }
      }
    }

    function transitionToNext() {
      if (modeState.current === "free") return;
      const nextIndex = currentTourIndex % tourPoints.length;
      const nextPoint = tourPoints[nextIndex];
      currentTourIndex = nextIndex + 1;

      const nextCamPos = {
        x: nextPoint.cameraPosition.x,
        y: nextPoint.cameraPosition.y,
        z: nextPoint.cameraPosition.z,
      };
      const nextTarget = {
        x: nextPoint.position.x,
        y: nextPoint.position.y,
        z: nextPoint.position.z,
      };

      const state = {
        camX: camera.position.x,
        camY: camera.position.y,
        camZ: camera.position.z,
        targetX: controls.target.x,
        targetY: controls.target.y,
        targetZ: controls.target.z,
      };

      const zoomOut = new TWEEN.Tween(state, tweenGroup)
        .to(
          {
            camX: OVERVIEW_POS.x,
            camY: OVERVIEW_POS.y,
            camZ: OVERVIEW_POS.z,
            targetX: OVERVIEW_TARGET.x,
            targetY: OVERVIEW_TARGET.y,
            targetZ: OVERVIEW_TARGET.z,
          },
          TRANSITION_TIME,
        )
        .easing(TWEEN.Easing.Cubic.InOut)
        .onStart(() => {
          onTipVisibleChangeRef.current?.(false);
          resetHighlight();
          fadeMarkers(null);
        })
        .onUpdate(() => {
          camera.position.set(state.camX, state.camY, state.camZ);
          controls.target.set(state.targetX, state.targetY, state.targetZ);
          controls.update();
        });

      const zoomInState = {
        camX: OVERVIEW_POS.x,
        camY: OVERVIEW_POS.y,
        camZ: OVERVIEW_POS.z,
        targetX: OVERVIEW_TARGET.x,
        targetY: OVERVIEW_TARGET.y,
        targetZ: OVERVIEW_TARGET.z,
      };

      const zoomIn = new TWEEN.Tween(zoomInState, tweenGroup)
        .to(
          {
            camX: nextCamPos.x,
            camY: nextCamPos.y,
            camZ: nextCamPos.z,
            targetX: nextTarget.x,
            targetY: nextTarget.y,
            targetZ: nextTarget.z,
          },
          TRANSITION_TIME,
        )
        .easing(TWEEN.Easing.Cubic.InOut)
        .onStart(() => {
          onProvinceChangeRef.current?.(nextPoint.name);
          onTipVisibleChangeRef.current?.(true);
          fadeMarkers(nextPoint.name);
          const provinceObj = provinceMeshes.find(
            (m) => m.userData.provinceName === nextPoint.name,
          );
          if (provinceObj) highlightProvince(provinceObj);
        })
        .onUpdate(() => {
          camera.position.set(
            zoomInState.camX,
            zoomInState.camY,
            zoomInState.camZ,
          );
          controls.target.set(
            zoomInState.targetX,
            zoomInState.targetY,
            zoomInState.targetZ,
          );
          controls.update();
        })
        .onComplete(() => {
          dwellTimer = setTimeout(() => transitionToNext(), DWELL_TIME);
        });

      zoomOut.chain(zoomIn);
      zoomOut.start();
    }

    const textureLoader = new THREE.TextureLoader();
    const loadTextures = Promise.all([
      textureLoader.loadAsync("/chinese-marker.png"),
      textureLoader.loadAsync("/nv-marker.png"),
      textureLoader.loadAsync("/both-marker.png"),
    ]).then(([chinese, nv, both]) => {
      return { chinese, nv, both };
    });

    Promise.all([loadGlbModel(gltfLoader), loadTextures])
      .then(([gltf, textures]) => {
        markerTextures = textures;

        gltf.scene.remove(gltf.scene.children[5]);

        const baseLayer = gltf.scene.children[6];
        if (baseLayer) {
          baseLayer.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              const mat = child.material as THREE.MeshPhysicalMaterial;
              mat.transparent = true;
              mat.opacity = 0.25;
              mat.depthWrite = false;
            }
          });
        }

        const model = gltf.scene;
        scene.add(model);

        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }

        const provinceChildren = gltf.scene.children[1]?.children ?? [];
        for (const child of provinceChildren) {
          provinceMeshes.push(child);
          child.traverse((obj: THREE.Object3D) => {
            obj.userData.provinceName = child.name;
          });
        }

        const MARKER_SIZE = 0.05;
        for (const item of realData) {
          const pos = lonLatToModel(
            parseFloat(item.longitude),
            parseFloat(item.latitude),
          );
          const texture = getMarkerByColonyType(item.colony_type, textures);
          const spriteMat = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            toneMapped: false,
            sizeAttenuation: false,
            depthWrite: false,
            alphaTest: 0.1,
          });
          const sprite = new THREE.Sprite(spriteMat);
          sprite.renderOrder = 10;
          sprite.center.set(0.5, 0);
          sprite.position.set(pos.x, pos.y, pos.z);
          sprite.scale.set(MARKER_SIZE, MARKER_SIZE, 1);
          sprite.userData.bouncePhase = Math.random() * Math.PI * 2;
          scene.add(sprite);
          const arr = dataPointsByProvince.get(item.region_prov);
          if (arr) arr.push(sprite);
          else dataPointsByProvince.set(item.region_prov, [sprite]);
        }

        for (const [prov, clusters] of provinceGroupsMap) {
          const pts = clusters.map((c) =>
            lonLatToModel(parseFloat(c.longitude), parseFloat(c.latitude)),
          );
          const { target, cameraPosition } = computeTourView(pts);
          tourPoints.push({ position: target, cameraPosition, name: prov });
        }
      })
      .then(() => {
        internalsRef.current = {
          camera,
          controls,
          tweenGroup,
          modeState,
          getDwellTimer: () => dwellTimer,
          setDwellTimer: (t) => {
            dwellTimer = t;
          },
          transitionToNext,
          resetHighlight,
          fadeMarkers,
        };
        transitionToNext();
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

      const BOUNCE_HEIGHT = 0.2;
      const BOUNCE_SPEED = 0.004;
      for (const sprites of dataPointsByProvince.values()) {
        for (const pt of sprites) {
          if ((pt.material as THREE.SpriteMaterial).opacity > 0) {
            const phase = pt.userData.bouncePhase || 0;
            const bounce =
              Math.abs(Math.sin(timestamp * BOUNCE_SPEED + phase)) ** 0.6;
            pt.position.y = bounce * BOUNCE_HEIGHT;
          }
        }
      }

      tweenGroup.update(timestamp);
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

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let mouseDownPos = { x: 0, y: 0 };

    const handleMouseDown = (event: MouseEvent) => {
      mouseDownPos = { x: event.clientX, y: event.clientY };
    };
    renderer.domElement.addEventListener("mousedown", handleMouseDown);

    let highlightedMeshes: {
      mesh: THREE.Mesh;
      originalMaterial: THREE.Material;
    }[] = [];

    function resetHighlight() {
      for (const { mesh, originalMaterial } of highlightedMeshes) {
        (mesh.material as THREE.Material).dispose();
        mesh.material = originalMaterial;
      }
      highlightedMeshes = [];
    }

    function highlightProvince(obj: THREE.Object3D) {
      resetHighlight();
      obj.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        const originalMaterial = child.material;
        const mat = (child.material as THREE.MeshStandardMaterial).clone();
        child.material = mat;
        mat.emissive = new THREE.Color(0x0099cc);

        mat.onBeforeCompile = (shader) => {
          shader.vertexShader = shader.vertexShader.replace(
            "#include <common>",
            `#include <common>
             varying vec3 vWorldNormal;`,
          );
          shader.vertexShader = shader.vertexShader.replace(
            "#include <worldpos_vertex>",
            `#include <worldpos_vertex>
             vWorldNormal = normalize(mat3(modelMatrix) * normal);`,
          );
          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <common>",
            `#include <common>
             varying vec3 vWorldNormal;`,
          );
          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <emissivemap_fragment>",
            `#include <emissivemap_fragment>
             float topFace = smoothstep(0.5, 0.8, vWorldNormal.y);
             totalEmissiveRadiance *= topFace;`,
          );
        };

        const state = { intensity: 0 };
        const fadeIn = new TWEEN.Tween(state, tweenGroup)
          .to({ intensity: 0.6 }, 150)
          .easing(TWEEN.Easing.Cubic.Out)
          .onUpdate(() => {
            mat.emissiveIntensity = state.intensity;
          });
        fadeIn.start();
        highlightedMeshes.push({ mesh: child, originalMaterial });
      });
    }

    const handleClick = (event: MouseEvent) => {
      if (modeState.current !== "free") return;
      const dx = event.clientX - mouseDownPos.x;
      const dy = event.clientY - mouseDownPos.y;
      if (dx * dx + dy * dy > 25) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(provinceMeshes, true);
      if (intersects.length > 0) {
        const provinceName = intersects[0].object.userData.provinceName;
        if (provinceName && provinceGroupsMap.has(provinceName)) {
          onProvinceChangeRef.current?.(provinceName);
          onTipVisibleChangeRef.current?.(true);
          const provinceObj = provinceMeshes.find(
            (m) => m.userData.provinceName === provinceName,
          );
          if (provinceObj) highlightProvince(provinceObj);
        }
      }
    };

    renderer.domElement.addEventListener("click", handleClick);

    return () => {
      internalsRef.current = null;
      if (dwellTimer) clearTimeout(dwellTimer);
      resetHighlight();
      tweenGroup.removeAll();
      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      renderer.domElement.removeEventListener("click", handleClick);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);
      controls.dispose();
      dracoLoader.dispose();
      if (markerTextures) {
        Object.values(markerTextures).forEach((t) => t.dispose());
      }
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
        if (obj instanceof THREE.Sprite) {
          obj.material.dispose();
        }
      });
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const internals = internalsRef.current;
    if (!internals) return;
    if (internals.modeState.current === modeProp) return;

    const { camera, controls, tweenGroup } = internals;

    if (modeProp === "free") {
      internals.modeState.current = "free";
      const timer = internals.getDwellTimer();
      if (timer) {
        clearTimeout(timer);
        internals.setDwellTimer(null);
      }
      tweenGroup.removeAll();

      const state = {
        camX: camera.position.x,
        camY: camera.position.y,
        camZ: camera.position.z,
        targetX: controls.target.x,
        targetY: controls.target.y,
        targetZ: controls.target.z,
      };
      new TWEEN.Tween(state, tweenGroup)
        .to(
          {
            camX: OVERVIEW_POS.x,
            camY: OVERVIEW_POS.y,
            camZ: OVERVIEW_POS.z,
            targetX: OVERVIEW_TARGET.x,
            targetY: OVERVIEW_TARGET.y,
            targetZ: OVERVIEW_TARGET.z,
          },
          TRANSITION_TIME,
        )
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(() => {
          camera.position.set(state.camX, state.camY, state.camZ);
          controls.target.set(state.targetX, state.targetY, state.targetZ);
          controls.update();
        })
        .onComplete(() => {
          internals.fadeMarkers(null);
        })
        .start();
      onTipVisibleChangeRef.current?.(false);
    } else {
      internals.modeState.current = "touring";
      internals.resetHighlight();
      onTipVisibleChangeRef.current?.(false);

      const state = {
        camX: camera.position.x,
        camY: camera.position.y,
        camZ: camera.position.z,
        targetX: controls.target.x,
        targetY: controls.target.y,
        targetZ: controls.target.z,
      };
      new TWEEN.Tween(state, tweenGroup)
        .to(
          {
            camX: OVERVIEW_POS.x,
            camY: OVERVIEW_POS.y,
            camZ: OVERVIEW_POS.z,
            targetX: OVERVIEW_TARGET.x,
            targetY: OVERVIEW_TARGET.y,
            targetZ: OVERVIEW_TARGET.z,
          },
          TRANSITION_TIME,
        )
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(() => {
          camera.position.set(state.camX, state.camY, state.camZ);
          controls.target.set(state.targetX, state.targetY, state.targetZ);
          controls.update();
        })
        .onComplete(() => {
          internals.transitionToNext();
        })
        .start();
    }
  }, [modeProp]);

  return <div ref={containerRef} className="w-full h-full cursor-pointer" />;
}
