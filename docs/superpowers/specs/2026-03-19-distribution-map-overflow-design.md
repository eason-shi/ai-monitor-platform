# DistributionMap 延伸效果设计

## 概述

让 DistributionMap 组件向左右和下方延伸，超出父容器边界，被前景组件遮挡，形成地图作为"背景层"的视觉效果，减少组件间的割裂感。

## 目标

- 地图向左右延伸约 96px（-mx-24）
- 地图向下延伸约 64px（-mb-16）
- 延伸部分被前景组件遮挡，形成背景层效果

## 修改文件

**src/ui/distribution/distribution-center.tsx**

## 具体变更

### 1. 地图容器添加负边距和层级

```tsx
// 修改 DistributionMap 组件调用
<DistributionMap
  className="-mx-24 -mb-16 relative z-0"
  onProvinceChange={setProvince}
  onTipVisibleChange={setTipVisible}
  onModeChange={setMapMode}
/>
```

### 2. 顶部总量卡片添加高层级

在现有 className 末尾添加 `z-20`：

```tsx
// 修改前
<div className="absolute -top-18 left-[22%] flex justify-center items-center gap-[180px]  rounded-lg px-6 py-3 ">

// 修改后
<div className="absolute -top-18 left-[22%] flex justify-center items-center gap-[180px] rounded-lg px-6 py-3 z-20">
```

### 3. 底部信息卡片容器添加高层级

在现有 className 中添加 `z-20 relative`：

```tsx
// 修改前
<div className="h-[280px] flex justify-between">

// 修改后
<div className="h-[280px] flex justify-between z-20 relative">
```

## 层级结构

```
z-20: TotalInfoItems（顶部卡片）
z-20: ChipCountInfo, DescriptionInfo, TotalComputingInfo（底部卡片）
z-10: MapModeIndicator, ComputingCenterTip（无需修改，已有默认层级）
z-0:  DistributionMap（背景地图）
```

## 验证步骤

1. 地图向左右延伸约 96px，向下延伸约 64px
2. 延伸部分被顶部和底部前景卡片遮挡
3. 地图交互功能正常（省份悬停、模式切换）
