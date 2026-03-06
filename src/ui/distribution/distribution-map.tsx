import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import {
  aggregateByProvince,
  data,
  type ComputingCenter,
} from "./computing-center-data";

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
    const scatterData = buildScatterData(data);

    const provincesWithData = new Set(data.map((c) => c.province));
    const mapData = provinceData.map((d) => ({
      ...d,
      itemStyle: {
        areaColor: provincesWithData.has(d.name) ? "#1a3355" : "#132039",
      },
    }));

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
      geo: {
        map: "china",
        roam: false,
        zoom: 1.2,
        itemStyle: {
          areaColor: "#132039",
          borderColor: "rgba(100, 180, 255, 0.25)",
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: {
            areaColor: "#1e3a5f",
          },
          label: { show: false },
        },
        label: { show: false },
      },
      series: [
        {
          type: "map",
          map: "china",
          geoIndex: 0,
          data: mapData,
        },
        {
          type: "effectScatter",
          coordinateSystem: "geo",
          data: scatterData,
          symbolSize: (val: number[]) => Math.max(6, Math.sqrt(val[2]) * 0.6),
          rippleEffect: {
            brushType: "stroke",
            scale: 3,
            period: 4,
          },
        },
      ],
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

  return <div ref={chartRef} className="w-full h-full" />;
}

const chipColorMap: Record<string, string> = {
  "英伟达 H100": "#76B900",
  "英伟达 A100": "#00C9A7",
  华为昇腾910: "#E63946",
  寒武纪MLU370: "#F4A261",
};

function buildScatterData(centers: ComputingCenter[]) {
  return centers.map((c) => {
    const color = chipColorMap[c.chipType] || "#f39c12";
    return {
      name: c.name,
      value: [c.longitude, c.latitude, c.chipCount],
      province: c.province,
      district: c.district,
      chipType: c.chipType,
      itemStyle: {
        color,
        shadowBlur: 10,
        shadowColor: `${color}80`,
      },
    };
  });
}
