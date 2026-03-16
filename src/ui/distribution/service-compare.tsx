import type { EChartsOption } from "echarts";
import { EchartsWidget } from "../echarts-widget";

const data = [
  { contury: "中国", value: 37 },
  { contury: "美国", value: 85 },
];

function buildGaugeOption(name: string, value: number, color: [string, string]): EChartsOption {
  return {
    series: [
      {
        type: "gauge",
        startAngle: 220,
        endAngle: -40,
        min: 0,
        max: 100,
        progress: {
          show: true,
          width: 14,
          roundCap: true,
          itemStyle: {
            color: {
              type: "linear",
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: color[0] },
                { offset: 1, color: color[1] },
              ],
            },
          },
        },
        axisLine: {
          roundCap: true,
          lineStyle: { width: 14, color: [[1, "rgba(255,255,255,0.08)"]] },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        pointer: { show: false },
        anchor: { show: false },
        title: {
          show: true,
          offsetCenter: [0, "70%"],
          fontSize: 14,
          color: "rgba(255,255,255,0.85)",
        },
        detail: {
          offsetCenter: [0, "30%"],
          fontSize: 28,
          fontWeight: "bold",
          color: "#fff",
          formatter: "{value}%",
        },
        data: [{ value, name }],
      },
    ],
  };
}

const chinaOption = buildGaugeOption("中国", data[0].value, ["#1e90ff", "#00cfff"]);
const usaOption = buildGaugeOption("美国", data[1].value, ["#ff6a00", "#ff2d55"]);

export function ServiceCompare() {
  return (
    <div className="flex w-full h-full">
      <div className="flex-1 h-full">
        <EchartsWidget options={chinaOption} />
      </div>
      <div className="flex-1 h-full">
        <EchartsWidget options={usaOption} />
      </div>
    </div>
  );
}
