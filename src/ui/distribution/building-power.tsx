import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import { EchartsWidget } from "@/ui/echarts-widget";

const data = [
  { value: 4800, name: "内蒙古" },
  { value: 3600, name: "宁夏" },
  { value: 2800, name: "上海" },
  { value: 2500, name: "浙江" },
  { value: 2200, name: "贵州" },
  { value: 1900, name: "北京" },
  { value: 1600, name: "广东" },
  { value: 1200, name: "安徽" },
  { value: 1000, name: "江苏" },
  { value: 800, name: "甘肃" },
];

export function BuildingPowerChart() {
  const options = useMemo<EChartsOption>(() => {
    return {
      color: [
        "#6366f1",
        "#8bc34a",
        "#f59e0b",
        "#ef4444",
        "#ec4899",
        "#3b82f6",
        "#14b8a6",
        "#a855f7",
        "#f97316",
        "#64748b",
      ],
      legend: {
        orient: "vertical",
        right: "5%",
        top: "middle",
        textStyle: { color: "#fff" },
      },
      series: [
        {
          type: "pie",
          roseType: "radius",
          radius: ["15%", "75%"],
          center: ["50%", "55%"],
          label: { show: false },
          labelLine: { show: false },
          data,
        },
      ],
    };
  }, []);

  return <EchartsWidget options={options} />;
}
