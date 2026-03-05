# 已建成电力南丁格尔玫瑰图设计文档

## 概述

为 `/src/ui/distribution/built-power.tsx` 实现一个南丁格尔玫瑰图，显示各省份已建成电力装机容量的分布。

## 组件架构

**文件位置**：`src/ui/distribution/built-power.tsx`

**组件结构**：
- 函数组件 `BuiltPowerChart`
- 使用 `useRef` 管理 DOM 引用和 echarts 实例
- 使用 `useEffect` 处理图表初始化、配置和清理
- 响应式处理：监听 window resize 事件

**与现有代码一致性**：
- 参考 `building-power.tsx` 的代码结构
- 保持相同的 hooks 使用模式和生命周期管理
- 保持相同的样式类名 `w-full h-full`

## 数据设计

**省份列表**（与 building-power.tsx 相同）：
河北、云贵、上海、广东、浙江、内蒙古、宁夏、安徽、北京、江苏

**数值调整**（在原数值基础上微调，保持合理分布）：
```typescript
const data = [
  { province: "河北", value: 820 },
  { province: "云贵", value: 450 },
  { province: "上海", value: 380 },
  { province: "广东", value: 1180 },
  { province: "浙江", value: 950 },
  { province: "内蒙古", value: 580 },
  { province: "宁夏", value: 150 },
  { province: "安徽", value: 720 },
  { province: "北京", value: 280 },
  { province: "江苏", value: 1190 },
]
```

## echarts 配置设计

**核心配置**：
- `series.type`: 'pie'
- `series.roseType`: 'radius' （实现半径不同、角度相同的南丁格尔效果）
- `series.radius`: ['20%', '70%'] （内外半径，形成环形）
- `series.data`: 使用调整后的数值数据

**颜色方案**（10 种不同颜色区分省份）：
```typescript
const colors = [
  '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
  '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#5470c6'
]
```

**交互配置**：
- `label.show`: true（显示数值标签）
- `label.position`: 'outside'（标签在扇形外部）
- `label.formatter`: `{b}: {c}`（显示省份名称和数值）
- `emphasis.scale`: true（鼠标悬停放大效果）
- `tooltip.trigger`: 'item'（显示详细信息）

**动画配置**：
- `animationDuration`: 1500
- `animationEasing`: 'cubicOut'
- `animationDelay`: 按索引递增延迟

## 样式和布局

**容器样式**：
- 使用与 building-power.tsx 相同的容器配置
- `grid` 配置：`{ left: '3%', right: '4%', bottom: '3%', containLabel: true }`
- 确保图表在不同屏幕尺寸下正常显示

**响应式处理**：
- 监听 window resize 事件
- 调用 `chart.resize()` 方法
- 组件卸载时移除事件监听器并销毁 echarts 实例

## 错误处理和代码组织

**空值保护**：
- 检查 `chartRef.current` 是否存在再初始化
- 组件卸载时正确清理实例引用

**TypeScript 类型安全**：
- 使用 `echarts.ECharts` 类型声明
- useRef 泛型指定类型

**代码组织**：
- 数据定义在组件外部（避免重复创建）
- 单一 useEffect 处理所有初始化逻辑
- 清理函数返回事件监听器并销毁实例

## 关键特性

- **可视化类型**：南丁格尔玫瑰图（roseType: 'radius'）
- **数据映射**：半径反映数值大小，角度均等
- **颜色区分**：10 种不同颜色
- **交互功能**：数值标签 + tooltip + 悬停高亮
- **响应式**：自适应容器大小
