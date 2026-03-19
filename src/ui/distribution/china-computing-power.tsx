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
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(8, 20, 48, 0.9)",
        borderColor: "#00d4ff",
        borderWidth: 1,
        textStyle: { color: "#fff" },
      },
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
            color: {
              type: "linear",
              x: 1,
              y: 0,
              x2: 0,
              y2: 0,
              colorStops: [
                { offset: 0, color: "#00D0CE" },
                { offset: 1, color: "rgba(0, 91, 90, 0.25)" },
              ],
            },
          },
          barWidth: "30%",
          emphasis: {
            focus: "series",
            itemStyle: { opacity: 1 },
          },
        },
        {
          type: "effectScatter",
          coordinateSystem: "cartesian2d",
          data: data.map((item) => [
            item.value,
            data.findIndex((d) => d.province === item.province),
          ]),
          symbolSize: 8,
          showEffectOn: "render",
          rippleEffect: {
            brushType: "stroke",
            scale: 4,
          },
          itemStyle: {
            color: "#00D0CE",
            shadowBlur: 10,
            shadowColor: "#00D0CE",
          },
          zlevel: 1,
        },
      ],
    };
  }, []);

  return <EchartsWidget options={options} />;
}
