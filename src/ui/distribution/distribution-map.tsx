import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

function mercator(lng: number, lat: number): [number, number] {
  const x = lng;
  const y =
    Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * (180 / Math.PI);
  return [x, y];
}

interface GeoFeature {
  type: string;
  properties: Record<string, unknown>;
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

function buildProvinceShapes(feature: GeoFeature): THREE.Shape[] {
  const polygons: number[][][][] = [];
  if (feature.geometry.type === "Polygon") {
    polygons.push(feature.geometry.coordinates as number[][][]);
  } else if (feature.geometry.type === "MultiPolygon") {
    for (const poly of feature.geometry.coordinates as number[][][][]) {
      polygons.push(poly);
    }
  }

  const shapes: THREE.Shape[] = [];
  for (const rings of polygons) {
    const outer = rings[0] as number[][];
    if (!outer || outer.length < 3) continue;

    const shape = new THREE.Shape();
    const [sx, sy] = mercator(outer[0][0], outer[0][1]);
    shape.moveTo(sx, sy);
    for (let i = 1; i < outer.length; i++) {
      const [px, py] = mercator(outer[i][0], outer[i][1]);
      shape.lineTo(px, py);
    }
    shape.closePath();

    for (let h = 1; h < rings.length; h++) {
      const hole = rings[h] as number[][];
      if (!hole || hole.length < 3) continue;
      const holePath = new THREE.Path();
      const [hx, hy] = mercator(hole[0][0], hole[0][1]);
      holePath.moveTo(hx, hy);
      for (let i = 1; i < hole.length; i++) {
        const [px, py] = mercator(hole[i][0], hole[i][1]);
        holePath.lineTo(px, py);
      }
      holePath.closePath();
      shape.holes.push(holePath);
    }

    shapes.push(shape);
  }
  return shapes;
}

export function DistributionMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.8,
      0.4,
      0.85,
    );
    composer.addPass(bloomPass);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(50, 80, 50);
    scene.add(dirLight);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("/texture.png");
    texture.colorSpace = THREE.SRGBColorSpace;

    const EXTRUDE_DEPTH = 2.5;

    const LNG_MIN = 73;
    const LNG_MAX = 135;
    const LAT_MIN = 18;
    const LAT_MAX = 54;

    fetch("/china.json")
      .then((r) => r.json())
      .then((geoJson: { features: GeoFeature[] }) => {
        if (disposed) return;

        const mapGroup = new THREE.Group();
        const allPositions: THREE.Vector3[] = [];

        const [uvMinX, uvMinY] = mercator(LNG_MIN, LAT_MIN);
        const [uvMaxX, uvMaxY] = mercator(LNG_MAX, LAT_MAX);
        const uvRangeX = uvMaxX - uvMinX;
        const uvRangeY = uvMaxY - uvMinY;

        for (const feature of geoJson.features) {
          const shapes = buildProvinceShapes(feature);
          if (shapes.length === 0) continue;

          const extrudeSettings: THREE.ExtrudeGeometryOptions = {
            depth: EXTRUDE_DEPTH,
            bevelEnabled: false,
          };

          const geometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings);

          const uvAttr = geometry.getAttribute("position");
          const normalAttr = geometry.getAttribute("normal");
          const uvArray = new Float32Array(uvAttr.count * 2);

          for (let i = 0; i < uvAttr.count; i++) {
            const nx = normalAttr.getX(i);
            const ny = normalAttr.getY(i);
            const nz = normalAttr.getZ(i);
            const isTop = Math.abs(nz) > 0.5 && nz > 0;
            const isSide = Math.abs(nx) > 0.5 || Math.abs(ny) > 0.5;

            if (isTop) {
              const px = uvAttr.getX(i);
              const py = uvAttr.getY(i);
              uvArray[i * 2] = (px - uvMinX) / uvRangeX;
              uvArray[i * 2 + 1] = (py - uvMinY) / uvRangeY;
            } else if (isSide) {
              uvArray[i * 2] = 0;
              uvArray[i * 2 + 1] = 0;
            } else {
              const px = uvAttr.getX(i);
              const py = uvAttr.getY(i);
              uvArray[i * 2] = (px - uvMinX) / uvRangeX;
              uvArray[i * 2 + 1] = (py - uvMinY) / uvRangeY;
            }
          }
          geometry.setAttribute("uv", new THREE.BufferAttribute(uvArray, 2));

          const topMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            opacity: 0.9,
          });

          const sideMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(6 / 255, 182 / 255, 212 / 255),
            emissive: new THREE.Color(6 / 255, 182 / 255, 212 / 255),
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.5,
          });

          const mesh = new THREE.Mesh(geometry, [
            topMaterial,
            topMaterial,
            sideMaterial,
          ]);
          mapGroup.add(mesh);

          const posAttr = geometry.getAttribute("position");
          for (let i = 0; i < posAttr.count; i++) {
            allPositions.push(
              new THREE.Vector3(
                posAttr.getX(i),
                posAttr.getY(i),
                posAttr.getZ(i),
              ),
            );
          }

          for (const shape of shapes) {
            const points2D = shape.getPoints(50);
            const topLinePoints: THREE.Vector3[] = points2D.map(
              (p) => new THREE.Vector3(p.x, p.y, EXTRUDE_DEPTH + 0.01),
            );
            const topLineGeo = new THREE.BufferGeometry().setFromPoints(
              topLinePoints,
            );
            const topLineMat = new THREE.LineBasicMaterial({
              color: 0x22d3ee,
              transparent: true,
              opacity: 1.0,
            });
            mapGroup.add(new THREE.LineLoop(topLineGeo, topLineMat));

            const bottomLinePoints: THREE.Vector3[] = points2D.map(
              (p) => new THREE.Vector3(p.x, p.y, -0.01),
            );
            const bottomLineGeo = new THREE.BufferGeometry().setFromPoints(
              bottomLinePoints,
            );
            const bottomLineMat = new THREE.LineBasicMaterial({
              color: 0x06b6d4,
              transparent: true,
              opacity: 0.6,
            });
            mapGroup.add(new THREE.LineLoop(bottomLineGeo, bottomLineMat));
          }
        }

        const box = new THREE.Box3();
        for (const p of allPositions) box.expandByPoint(p);
        const center = new THREE.Vector3();
        box.getCenter(center);
        mapGroup.position.set(-center.x, -center.y, -center.z);
        scene.add(mapGroup);

        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y);
        const dist = maxDim / (2 * Math.tan((camera.fov * Math.PI) / 360));
        camera.position.set(0, -dist * 0.65, dist * 0.7);
        camera.lookAt(0, 0, 0);

        if (!disposed) composer.render();
      });

    const handleResize = () => {
      if (!container || disposed) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      composer.render();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
        if (obj instanceof THREE.LineLoop || obj instanceof THREE.Line) {
          obj.geometry.dispose();
          (obj.material as THREE.Material).dispose();
        }
      });
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <img
        src="/earth-background.png"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
