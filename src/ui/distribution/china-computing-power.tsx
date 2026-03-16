import { useMemo } from "react";
import { EchartsWidget } from "@/ui/echarts-widget";

const data = [
  { value: 4800, province: "北京" },
  { value: 3600, province: "上海" },
  { value: 2800, province: "广东" },
  { value: 2500, province: "江苏" },
  { value: 2200, province: "浙江" },
  { value: 1900, province: "山东" },
  { value: 1600, province: "四川" },
];

export function ChinaComputingPower() {
  const options = useMemo(() => {
    return {
      grid: { top: 30, right: 30, bottom: 30, left: 60, containLabel: true },
      yAxis: {
        type: "category",
        data: data.map((item) => item.province),
        axisLabel: { color: "#fff" },
        axisLine: { lineStyle: { color: "#475569" } },
      },
      xAxis: {
        type: "value",
        axisLabel: { color: "#fff" },
        axisLine: { lineStyle: { color: "#475569" } },
        splitLine: { lineStyle: { color: "#334155" } },
      },
      series: [
        {
          type: "bar",
          data: data.map((item) => item.value),
          itemStyle: {
            color: "#6366f1",
          },
          barWidth: "50%",
        },
      ],
    };
  }, []);

  return <EchartsWidget options={options} />;
}
