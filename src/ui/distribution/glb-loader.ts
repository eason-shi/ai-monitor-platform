import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

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

export async function loadGlbModel(loader: GLTFLoader): Promise<GLTF> {
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
