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
const CAM_ELEVATION = Math.PI * 0.22;
const FOV_DEG = 55;
const FOV_RAD = (FOV_DEG * Math.PI) / 180;

function computeTourView(points: { x: number; y: number; z: number }[]): {
  target: THREE.Vector3;
  cameraPosition: THREE.Vector3;
} {
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
  const rawDist = spread / (2 * Math.tan(FOV_RAD / 2)) + 2;
  const distance = Math.max(6, Math.min(20, rawDist));

  let azimuth = 0;

  if (n >= 3) {
    let covXX = 0,
      covXZ = 0,
      covZZ = 0;
    for (const p of points) {
      const dx = p.x - cx,
        dz = p.z - cz;
      covXX += dx * dx;
      covXZ += dx * dz;
      covZZ += dz * dz;
    }
    covXX /= n;
    covXZ /= n;
    covZZ /= n;

    const trace = covXX + covZZ;
    const det = covXX * covZZ - covXZ * covXZ;
    const disc = Math.sqrt(Math.max(0, (trace * trace) / 4 - det));
    const lambda2 = trace / 2 - disc;

    const evX = covXZ;
    const evZ = lambda2 - covXX;
    const len = Math.sqrt(evX * evX + evZ * evZ);
    if (len > 1e-6) {
      azimuth = Math.atan2(evZ, evX);
      if (Math.cos(azimuth) < 0) azimuth += Math.PI;
      if (azimuth > Math.PI) azimuth -= 2 * Math.PI;
      azimuth = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, azimuth));
    }
  }

  const camX =
    target.x + distance * Math.cos(CAM_ELEVATION) * Math.sin(azimuth);
  const camY = target.y + distance * Math.sin(CAM_ELEVATION);
  const camZ =
    target.z + distance * Math.cos(CAM_ELEVATION) * Math.cos(azimuth);

  return { target, cameraPosition: new THREE.Vector3(camX, camY, camZ) };
}

interface DistributionMapProps {
  onProvinceChange?: (name: string) => void;
  onTipVisibleChange?: (visible: boolean) => void;
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

export function DistributionMap({
  onProvinceChange,
  onTipVisibleChange,
}: DistributionMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const onProvinceChangeRef = useRef(onProvinceChange);
  const onTipVisibleChangeRef = useRef(onTipVisibleChange);
  useEffect(() => {
    onProvinceChangeRef.current = onProvinceChange;
    onTipVisibleChangeRef.current = onTipVisibleChange;
  });

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
    });
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
    const dataPointsByProvince = new Map<string, THREE.Sprite[]>();
    let markerTextures: Record<string, THREE.Texture> | null = null;
    const tourPoints: TourPoint[] = [];
    const provinceMeshes: THREE.Object3D[] = [];

    const DWELL_TIME = 4000;
    const TRANSITION_TIME = 1500;
    const OVERVIEW_POS = { x: 0, y: 28, z: 16 };
    const OVERVIEW_TARGET = { x: 0, y: 0, z: -1 };
    const tweenGroup = new TWEEN.Group();
    let currentTourIndex = 0;
    let dwellTimer: ReturnType<typeof setTimeout> | null = null;

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

    function startTour() {
      if (tourPoints.length === 0) return;
      const first = tourPoints[0];
      currentTourIndex = 1;

      camera.position.set(
        first.cameraPosition.x,
        first.cameraPosition.y,
        first.cameraPosition.z,
      );
      controls.target.set(first.position.x, first.position.y, first.position.z);
      controls.update();

      for (const [prov, sprites] of dataPointsByProvince) {
        if (prov !== first.name) {
          for (const sprite of sprites) {
            (sprite.material as THREE.SpriteMaterial).opacity = 0;
          }
        }
      }

      onProvinceChangeRef.current?.(first.name);
      onTipVisibleChangeRef.current?.(true);
      // dwellTimer = setTimeout(() => transitionToNext(), DWELL_TIME);
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

        const MARKER_SIZE = 0.08;
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
        startTour();
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

    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(provinceMeshes, true);
      if (intersects.length > 0) {
        console.log(intersects[0].object.parent?.name);
        // const provinceName = intersects[0].object.userData.provinceName;
        // if (provinceName) {
        //   console.log(provinceName);
        // }
      }
    };

    renderer.domElement.addEventListener("click", handleClick);

    return () => {
      if (dwellTimer) clearTimeout(dwellTimer);
      tweenGroup.removeAll();
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

  return <div ref={containerRef} className="w-full h-full" />;
}
