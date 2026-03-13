import { useMemo } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import { EchartsWidget } from "@/ui/echarts-widget";

const data = [
  { province: "河北", count: 856 },
  { province: "云贵", count: 432 },
  { province: "上海", count: 321 },
  { province: "广东", count: 1234 },
  { province: "浙江", count: 987 },
  { province: "内蒙古", count: 543 },
  { province: "宁夏", count: 123 },
  { province: "安徽", count: 765 },
  { province: "北京", count: 234 },
  { province: "江苏", count: 1234 },
];

export function BuildingPowerChart() {
  const options = useMemo<EChartsOption>(() => {
    const provinces = data.map((d) => d.province);
    const counts = data.map((d) => d.count);

    return {
      xAxis: {
        type: "category",
        data: provinces,
        axisLine: { lineStyle: { color: "#ccc" } },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "#666" },
        splitLine: { lineStyle: { type: "dashed", color: "#eee" } },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      series: [
        {
          type: "bar",
          data: counts,
          barWidth: "80%",
          label: {
            show: true,
            position: "top",
            color: "#333",
            fontSize: 12,
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#83bff6" },
              { offset: 1, color: "#188df0" },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#2378f7" },
                { offset: 1, color: "#2378f7" },
              ]),
            },
          },
          animationDuration: 1500,
          animationEasing: "cubicOut",
          animationDelay: (idx: number) => idx * 100,
        },
      ],
      animationDuration: 1500,
      animationEasing: "cubicOut",
    };
  }, []);

  return <EchartsWidget options={options} />;
}
