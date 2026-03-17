import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import { EchartsWidget } from "@/ui/echarts-widget";

const data = [
  { value: 500675, name: "英伟达" },
  { value: 116428, name: "昇腾" },
  { value: 40680, name: "海光信息" },
  { value: 39334, name: "寒武纪" },
  { value: 38320, name: "燧原" },
  // { value: 14440, name: "昆仑芯" },
  // { value: 11293, name: "沐曦" },
  // { value: 7573, name: "天数智芯" },
  // { value: 7360, name: "摩尔线程" },
  // { value: 5573, name: "壁仞" },
];

export function ChipShareChart() {
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
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(8, 20, 48, 0.9)",
        borderColor: "#00d4ff",
        borderWidth: 1,
        textStyle: { color: "#fff" },
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        right: "5%",
        top: "middle",
        textStyle: { color: "#fff" },
      },
      series: [
        {
          type: "pie",
          padAngle: 5,
          itemStyle: {
            borderRadius: 10,
          },
          radius: ["40%", "70%"],
          center: ["35%", "50%"],
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
          data,
        },
      ],
    };
  }, []);

  return <EchartsWidget options={options} />;
}
