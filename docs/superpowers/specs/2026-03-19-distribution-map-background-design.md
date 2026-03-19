# DistributionMap 背景色透明化设计

## 背景

DistributionMap 组件所在的页面背景色为 `#02071E`，但 Three.js canvas 的默认黑色背景造成视觉割裂感。

## 目标

让 Three.js canvas 背景完全透明，透出底层页面的 `#02071E` 背景色。

## 方案

### 修改文件

`src/ui/distribution/distribution-map.tsx`

### 修改位置

在 WebGLRenderer 创建后，`renderer.setSize()` 之前添加：

```typescript
renderer.setClearColor(0x000000, 0);
```

### 技术说明

- WebGLRenderer 默认 `clearColor` 为黑色且不透明
- 即使设置 `alpha: true`，也需要将 clearColor 的 alpha 设为 0 才能实现透明
- `setClearColor(0x000000, 0)` 第二个参数 0 表示完全透明

### 注意事项

- 请勿设置 `scene.background`，否则会覆盖 renderer 的透明设置

## 验证

运行项目，确认地图组件无模型区域显示为透明（透出页面背景色 `#02071E`）。
