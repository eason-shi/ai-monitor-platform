import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import * as echarts from "echarts";
import { EchartsWidget } from "@/ui/echarts-widget";
import { ColorLegend, COLORS } from "./color-legend";

const data = [
  { value: 500675, name: "英伟达" },
  { value: 40680, name: "海光信息" },
  { value: 39334, name: "寒武纪" },
  { value: 38320, name: "燧原" },
  { value: 14440, name: "昆仑芯" },
  { value: 11293, name: "沐曦" },
  { value: 116428, name: "昇腾" },
  { value: 7573, name: "天数智芯" },
  { value: 7360, name: "摩尔线程" },
  { value: 5573, name: "壁仞" },
];

function lightenColor(hex: string, amount: number) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
  const b = Math.min(255, (num & 0x0000ff) + amount);
  return `rgb(${r}, ${g}, ${b})`;
}

function darkenColor(hex: string, amount: number) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `rgb(${r}, ${g}, ${b})`;
}

function createRadialGradient(color: string) {
  return new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
    { offset: 0, color: lightenColor(color, 60) },
    { offset: 0.6, color: color },
    { offset: 1, color: darkenColor(color, 40) },
  ]);
}

export function ChipShareChart() {
  const chartData = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.value - a.value);
    const top2 = sorted.slice(0, 2);
    const others = sorted.slice(2);
    const othersValue = others.reduce((sum, item) => sum + item.value, 0);
    const result = [...top2, { value: othersValue, name: "其他" }];
    return result.map((item, index) => ({
      ...item,
      itemStyle: {
        color: createRadialGradient(COLORS[index % COLORS.length]),
      },
    }));
  }, []);

  const legendData = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return data.map((item) => ({
      name: item.name,
      value: `${((item.value / total) * 100).toFixed(2)}%`,
    }));
  }, []);

  const options = useMemo<EChartsOption>(() => {
    return {
      color: COLORS,
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(8, 20, 48, 0.9)",
        borderColor: "#00d4ff",
        borderWidth: 1,
        textStyle: { color: "#fff" },
        formatter: "{b}: {c} ({d}%)",
      },
      series: [
        {
          type: "pie",
          startAngle: 240,
          roseType: "area",
          radius: ["10%", "85%"],
          center: ["50%", "50%"],
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          emphasis: {
            scale: true,
            scaleSize: 10,
            itemStyle: {
              shadowBlur: 20,
              shadowColor: "rgba(99, 102, 241, 0.6)",
            },
          },
          data: chartData,
        },
      ],
    };
  }, [chartData]);

  return (
    <div className="flex w-full h-full px-3">
      <div className="flex-1 flex items-center justify-center">
        <EchartsWidget options={options} />
      </div>
      <div className="w-[340px] h-full flex items-center justify-start">
        <ColorLegend data={legendData} />
      </div>
    </div>
  );
}
