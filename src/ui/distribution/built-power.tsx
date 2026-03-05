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
  "#5470c6",
  "#91cc75",
  "#fac858",
  "#ee6666",
  "#73c0de",
  "#3ba272",
  "#fc8452",
  "#9a60b4",
  "#ea7ccc",
  "#5D9CEC",
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
          type: "pie",
          roseType: "radius",
          radius: ["20%", "70%"],
          data: data.map((item, index) => ({
            name: item.province,
            value: item.value,
            itemStyle: {
              color: colors[index % colors.length],
            },
          })),
          label: {
            show: true,
            position: "outside",
            formatter: "{b}: {c}",
            fontSize: 12,
            color: "#333",
          },
          emphasis: {
            scale: true,
            label: {
              show: true,
              fontSize: 14,
              fontWeight: "bold",
            },
          },
        },
      ],
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      animationDuration: 1500,
      animationEasing: "cubicOut",
    });

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
      instanceRef.current = null;
    };
  }, []);

  return <div ref={chartRef} className="w-full h-full" />;
}
