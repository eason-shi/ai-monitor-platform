# DistributionMap 背景色透明化设计

## 背景

DistributionMap 组件所在的页面背景色为 `#02071E`，但存在两处视觉割裂：
1. Three.js canvas 的默认黑色背景
2. 模型自带的底盘（`gltf.scene.children[5]`）颜色与背景不协调

## 目标

1. 让 Three.js canvas 背景完全透明
2. 让模型底盘颜色融入背景色 `#02071E`

## 方案

### 1. Canvas 背景透明

**文件**: `src/ui/distribution/distribution-map.tsx`

**位置**: 在 WebGLRenderer 创建后，`renderer.setSize()` 之前（约第 182 行）

```typescript
renderer.setClearColor(0x000000, 0);
```

### 2. 模型底盘融入背景

**位置**: 在模型加载后，scene.add(model) 之前（约第 367 行）

```typescript
const chassis = gltf.scene.children[5];
if (chassis) {
  chassis.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const mat = child.material as THREE.MeshStandardMaterial;
      mat.color.set(0x02071E);
    }
  });
}
```

### 技术说明

- WebGLRenderer 默认 `clearColor` 为黑色且不透明
- 即使设置 `alpha: true`，也需要将 clearColor 的 alpha 设为 0 才能实现透明
- 底盘 Mesh 的 material.color 直接设置为背景色，实现视觉融合

### 注意事项

- 请勿设置 `scene.background`，否则会覆盖 renderer 的透明设置
- 确认 `children[5]` 确实是底盘（可通过 console.log 验证）

## 验证

运行项目，确认：
1. 无模型区域显示为透明（透出页面背景色 `#02071E`）
2. 模型底盘颜色与背景色协调融合
