import { useEffect, useRef } from "react";
import * as echarts from "echarts";

const data = [
  { operator: "云服务商", share: 24343 },
  { operator: "政府投资的当地运营公司", share: 24343 },
  { operator: "电信运营商", share: 24343 },
];

const total = data.reduce((sum, item) => sum + item.share, 0);

const colorMap: Record<string, [string, string]> = {
  云服务商: ["#4facfe", "#00f2fe"],
  政府投资的当地运营公司: ["#a18cd1", "#fbc2eb"],
  电信运营商: ["#f093fb", "#f5576c"],
};

export function OperatorShareChart() {
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
            const [c1, c2] = colorMap[item.operator];
            return {
              name: item.operator,
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
              `{name|${params.name}}: {value|${params.value}} ({percent|${params.percent}%})`,
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
