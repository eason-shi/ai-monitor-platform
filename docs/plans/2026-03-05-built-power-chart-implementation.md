# 已建成电力南丁格尔玫瑰图实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为 `/src/ui/distribution/built-power.tsx` 实现一个南丁格尔玫瑰图，显示各省份已建成电力装机容量的分布

**Architecture:** 使用 echarts 的 pie 系列，配置 roseType: 'radius' 实现南丁格尔玫瑰图效果。组件结构参考 building-power.tsx，使用 useRef 和 useEffect 管理 echarts 实例生命周期。

**Tech Stack:** React 19, TypeScript 5.9, echarts 6.0

---

### Task 1: 添加 mock 数据和颜色配置

**Files:**
- Modify: `src/ui/distribution/built-power.tsx`

**Step 1: 添加数据定义**

在文件开头添加 mock 数据和颜色配置：

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
];

const colors = [
  '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
  '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#5470c6'
];
```

**Step 2: 提交**

```bash
git add src/ui/distribution/built-power.tsx
git commit -m "feat(built-power): add data and colors configuration"
```

---

### Task 2: 创建组件基础结构

**Files:**
- Modify: `src/ui/distribution/built-power.tsx`

**Step 1: 添加组件结构和引用**

```typescript
import { useEffect, useRef } from "react";
import * as echarts from "echarts";

export function BuiltPowerChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  return <div ref={chartRef} className="w-full h-full" />;
}
```

**Step 2: 提交**

```bash
git add src/ui/distribution/built-power.tsx
git commit -m "feat(built-power): add component structure"
```

---

### Task 3: 实现 echarts 初始化和配置

**Files:**
- Modify: `src/ui/distribution/built-power.tsx`

**Step 1: 添加 useEffect 初始化逻辑**

```typescript
useEffect(() => {
  if (!chartRef.current) return;

  const chart = echarts.init(chartRef.current);
  instanceRef.current = chart;

  chart.setOption({
    series: [
      {
        type: 'pie',
        roseType: 'radius',
        radius: ['20%', '70%'],
        data: data.map((item, index) => ({
          name: item.province,
          value: item.value,
          itemStyle: {
            color: colors[index % colors.length]
          }
        })),
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}: {c}',
          fontSize: 12
        },
        emphasis: {
          scale: true,
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        animationDuration: 1500,
        animationEasing: 'cubicOut',
        animationDelay: (idx: number) => idx * 100
      }
    ],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    }
  });

  const handleResize = () => chart.resize();
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
    chart.dispose();
    instanceRef.current = null;
  };
}, []);
```

**Step 2: 提交**

```bash
git add src/ui/distribution/built-power.tsx
git commit -m "feat(built-power): add echarts initialization and configuration"
```

---

### Task 4: 验证组件导出

**Files:**
- Modify: `src/ui/distribution/built-power.tsx`

**Step 1: 确保组件正确导出**

检查文件末尾是否有正确的导出语句。完整文件应该是：

```typescript
import { useEffect, useRef } from "react";
import * as echarts from "echarts";

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
];

const colors = [
  '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
  '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#5470c6'
];

export function BuiltPowerChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    instanceRef.current = chart;

    chart.setOption({
      series: [
        {
          type: 'pie',
          roseType: 'radius',
          radius: ['20%', '70%'],
          data: data.map((item, index) => ({
            name: item.province,
            value: item.value,
            itemStyle: {
              color: colors[index % colors.length]
            }
          })),
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}: {c}',
            fontSize: 12
          },
          emphasis: {
            scale: true,
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          animationDuration: 1500,
          animationEasing: 'cubicOut',
          animationDelay: (idx: number) => idx * 100
        }
      ],
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      }
    });

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
      instanceRef.current = null;
    };
  }, []);

  return <div ref={chartRef} className="w-full h-full" />;
}
```

**Step 2: 提交**

```bash
git add src/ui/distribution/built-power.tsx
git commit -m "feat(built-power): complete component implementation"
```

---

### Task 5: 本地验证

**Step 1: 启动开发服务器**

```bash
npm run dev
```

**Step 2: 在浏览器中访问应用**

打开浏览器访问开发服务器地址（通常是 http://localhost:5173）

**Step 3: 验证功能**

确认以下功能正常：
- 南丁格尔玫瑰图正确渲染
- 10 个省份以不同颜色显示
- 扇形半径反映数值大小
- 鼠标悬停时有高亮效果
- Tooltip 显示省份名称、数值和百分比
- 窗口调整大小时图表自适应

**Step 4: 提交验证结果**

如果验证通过，添加 final commit：

```bash
git commit --allow-empty -m "feat(built-power): verify component works correctly"
```

---

## 完成标准

- [ ] Mock 数据和颜色配置已添加
- [ ] 组件基础结构已创建
- [ ] echarts 初始化和配置已完成
- [ ] 组件正确导出
- [ ] 本地验证通过，图表正常显示
- [ ] 所有交互功能正常工作
