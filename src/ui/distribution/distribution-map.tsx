import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as TWEEN from "@tweenjs/tween.js";
import { data } from "./computing-center-data";
import { loadGlbModel } from "./glb-loader";

interface TourPoint {
  position: THREE.Vector3;
  name: string;
}

const provinceChipMap = new Map<string, number>();
for (const group of data) {
  const total = group.centers.reduce((sum, c) => sum + c.chipCount, 0);
  provinceChipMap.set(group.province, total);
}

export function DistributionMap() {
  const containerRef = useRef<HTMLDivElement>(null);

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
    const dataPoints: THREE.Mesh[] = [];
    const tourPoints: TourPoint[] = [];
    const provinceMeshes: THREE.Object3D[] = [];

    const DWELL_TIME = 4000;
    const TRANSITION_TIME = 1500;
    const OVERVIEW_POS = { x: 0, y: 28, z: 16 };
    const OVERVIEW_TARGET = { x: 0, y: 0, z: -1 };
    const tweenGroup = new TWEEN.Group();
    let currentTourIndex = 0;
    let dwellTimer: ReturnType<typeof setTimeout> | null = null;

    function transitionToNext() {
      const nextIndex = currentTourIndex % tourPoints.length;
      const nextPoint = tourPoints[nextIndex];
      currentTourIndex = nextIndex + 1;

      const nextCamPos = {
        x: nextPoint.position.x,
        y: nextPoint.position.y + 8,
        z: nextPoint.position.z + 8,
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
        first.position.x,
        first.position.y + 8,
        first.position.z + 8,
      );
      controls.target.set(first.position.x, first.position.y, first.position.z);
      controls.update();

      dwellTimer = setTimeout(() => transitionToNext(), DWELL_TIME);
    }

    loadGlbModel(gltfLoader)
      .then((gltf) => {
        console.log(gltf);

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
          console.log(child);
          provinceMeshes.push(child);

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
          tourPoints.push({
            position: sphere.position.clone(),
            name: child.name,
          });

          child.traverse((obj) => {
            obj.userData.provinceName = child.name;
          });
        }
      })
      .then(() => {
        // startTour();
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

  return <div ref={containerRef} className="w-full h-full" />;
}
