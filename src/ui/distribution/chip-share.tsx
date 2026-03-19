import { useMemo } from "react";
import type { EChartsOption } from "echarts";
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

export function ChipShareChart() {
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
          startAngle: 270,
          roseType: "radius",
          radius: ["20%", "100%"],
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

  return (
    <div className="flex w-full h-full px-3">
      <div className="flex-1 flex items-center justify-center">
        <EchartsWidget options={options} />
      </div>
      <div className="w-[340px] h-full flex items-center justify-center">
        <ColorLegend
          data={data.map((item) => ({
            name: item.name,
            value: String(item.value),
          }))}
        />
      </div>
    </div>
  );
}
