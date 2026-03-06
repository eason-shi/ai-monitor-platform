import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { aggregateByProvince, data } from "./computing-center-data";

export function DistributionMap() {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/china.json")
      .then((r) => r.json())
      .then((geoJson) => {
        if (cancelled) return;
        echarts.registerMap("china", geoJson);
        setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    instanceRef.current = chart;

    const provinceData = aggregateByProvince(data);

    const provincesWithData = new Set(data.map((g) => g.province));

    const highlightProvinceData = provinceData
      .filter((d) => provincesWithData.has(d.name))
      .map((d) => ({
        name: d.name,
        value: d.value,
      }));

    const COLORS = {
      glow: "rgba(6, 182, 212, 0.6)",
      border: "rgba(6, 182, 212, 0.8)",
      fill: "rgba(19, 32, 57, 0.8)",
      highlight: "rgba(26, 51, 85, 0.9)",
      topBorder: "rgba(186, 230, 253, 0.4)",
    };

    chart.setOption({
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(13, 27, 42, 0.9)",
        borderColor: "rgba(100, 180, 255, 0.3)",
        textStyle: { color: "#e0e6ed" },
        formatter: (params: {
          seriesType: string;
          name: string;
          value: number;
          data: {
            name: string;
            province: string;
            district: string;
            chipType: string;
            value: number[];
          };
        }) => {
          if (params.seriesType === "effectScatter") {
            const d = params.data;
            return `<b>${d.name}</b><br/>${d.province} · ${d.district}<br/>芯片类型：${d.chipType}<br/>芯片数量：${d.value[2]}`;
          }
          if (params.seriesType === "map") {
            return `<b>${params.name}</b><br/>芯片总量：${params.value || 0}`;
          }
          return "";
        },
      },
      geo: [
        {
          map: "china",
          roam: false,
          zoom: 1.2,
          zlevel: 0,
          silent: true,
          itemStyle: {
            areaColor: "transparent",
            borderColor: COLORS.border,
            borderWidth: 3,
            shadowColor: COLORS.glow,
            shadowBlur: 30,
          },
        },
        {
          map: "china",
          roam: false,
          zoom: 1.2,
          zlevel: 1,
          silent: true,
          itemStyle: {
            areaColor: COLORS.fill,
            borderColor: "rgba(100, 180, 255, 0.2)",
            borderWidth: 1,
          },
        },
        {
          map: "china",
          roam: false,
          zoom: 1.2,
          zlevel: 2,
          silent: true,
          data: highlightProvinceData,
          itemStyle: {
            areaColor: COLORS.highlight,
            borderColor: COLORS.border,
            borderWidth: 2,
            shadowColor: COLORS.glow,
            shadowBlur: 15,
          },
        },
        {
          map: "china",
          roam: false,
          zoom: 1.2,
          zlevel: 3,
          itemStyle: {
            areaColor: "transparent",
            borderColor: COLORS.topBorder,
            borderWidth: 1,
          },
          emphasis: {
            itemStyle: {
              areaColor: "rgba(30, 58, 95, 0.9)",
            },
            label: { show: false },
          },
          label: { show: false },
        },
      ],
      series: [],
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
  }, [ready]);

  return (
    <div className="relative w-full h-full">
      <img
        src="/earth-background.png"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div ref={chartRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
