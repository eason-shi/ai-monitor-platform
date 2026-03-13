import type { EChartsOption } from "echarts";
import { EchartsWidget } from "../echarts-widget";

const data = [
  { province: "河北", value: 82 },
  { province: "云贵", value: 45 },
  { province: "上海", value: 38 },
  { province: "广东", value: 118 },
  { province: "浙江", value: 95 },
  { province: "内蒙古", value: 58 },
  { province: "宁夏", value: 15 },
  { province: "安徽", value: 72 },
  { province: "北京", value: 28 },
  { province: "江苏", value: 119 },
];

const options: EChartsOption = {
  grid: {
    top: 60,
    bottom: 0,
    left: 20,
    right: 0,
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: data.map((d) => d.province),
    axisLabel: { color: "#fff" },
  },
  yAxis: {
    type: "value",
    name: "单位:EFlops",
    nameTextStyle: { color: "#00AAFF", fontSize: 16 },
    axisLabel: { color: "#fff" },
    splitLine: { lineStyle: { color: "#162431" } },
  },
  series: [
    {
      type: "pictorialBar",
      symbol: "image:///bar.png",
      symbolRepeat: false,
      symbolSize: ["100%", "100%"],
      data: data.map((d) => d.value),
    },
  ],
};

export function BuiltPowerChart() {
  return <EchartsWidget options={options} />;
}
