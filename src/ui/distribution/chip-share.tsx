import { useEffect, useRef } from "react";
import * as echarts from "echarts";

const data = [
  { company: "英伟达(NVIDIA)", share: 38.5 },
  { company: "英特尔", share: 12.3 },
  { company: "AMD", share: 10.8 },
  { company: "谷歌", share: 9.2 },
  { company: "苹果", share: 8.7 },
  { company: "亚马逊", share: 7.5 },
  { company: "微软", share: 6.8 },
  { company: "博通", share: 6.4 },
  { company: "其他", share: 18.8 },
];

const colorMap: Record<string, [string, string]> = {
  "英伟达(NVIDIA)": ["#76B900", "#4A7500"],
  "英特尔": ["#0071C5", "#004A80"],
  "AMD": ["#ED1C24", "#A5000A"],
  "谷歌": ["#4285F4", "#134D9E"],
  "苹果": ["#555555", "#222222"],
  "亚马逊": ["#FF9900", "#CC6600"],
  "微软": ["#00A4EF", "#0069B4"],
  "博通": ["#CC092F", "#8B0620"],
  "其他": ["#95A5A6", "#7F8C8D"],
};

export function ChipShareChart() {
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
          radius: ["45%", "70%"],
          data: data.map((item) => {
            const [c1, c2] = colorMap[item.company];
            return {
              name: item.company,
              value: item.share,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                  { offset: 0, color: c1 },
                  { offset: 1, color: c2 },
                ]),
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.15)",
                borderRadius: 6,
              },
            };
          }),
          label: {
            show: true,
            position: "outside",
            formatter: (params: {
              name: string;
              value: number;
              percent: number;
            }) =>
              `{name|${params.name}}\n{value|${params.value}} ({percent|${params.percent}%})`,
            rich: {
              name: { fontWeight: "bold", fontSize: 13, color: "#333" },
              value: { fontSize: 12, color: "#666" },
              percent: { fontSize: 12, color: "#666" },
            },
          },
          emphasis: {
            scale: true,
            itemStyle: {
              shadowBlur: 20,
              shadowColor: "rgba(0, 0, 0, 0.3)",
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
