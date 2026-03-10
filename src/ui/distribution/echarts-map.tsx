import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { data, aggregateByProvince } from "./computing-center-data";

const provinceData = aggregateByProvince(data);

const scatterData = data.flatMap((g) =>
  g.centers.map((c) => ({
    name: c.name,
    value: [c.longitude, c.latitude, c.chipCount],
    chipType: c.chipType,
    province: c.province,
    district: c.district,
  })),
);

interface ScatterDataItem {
  name: string;
  value: number[];
  chipType: string;
  province: string;
  district: string;
}

export function EchartsMap() {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;

    let disposed = false;

    fetch("/china.json")
      .then((res) => res.json())
      .then((geoJson) => {
        if (disposed || !el) return;

        echarts.registerMap("china", geoJson);

        const chart = echarts.init(el);
        instanceRef.current = chart;

        chart.setOption({
          geo: {
            map: "china",
            roam: true,
            zoom: 1.2,
            center: [104.5, 36],
            itemStyle: {
              areaColor: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "#1a3a6b" },
                  { offset: 1, color: "#0a1e3d" },
                ],
              },
              borderColor: "#2a5faa",
              borderWidth: 1,
            },
            emphasis: {
              itemStyle: {
                areaColor: "#0d3470",
                borderColor: "#00d4ff",
                borderWidth: 2,
              },
              label: {
                show: false,
              },
            },
            select: {
              disabled: true,
            },
            label: {
              show: false,
            },
          },
          tooltip: {
            trigger: "item",
            backgroundColor: "rgba(8, 20, 48, 0.9)",
            borderColor: "#00d4ff",
            borderWidth: 1,
            textStyle: {
              color: "#e0f0ff",
              fontSize: 13,
            },
            formatter: (
              params: echarts.DefaultLabelFormatterCallbackParams,
            ) => {
              if (params.seriesType === "effectScatter") {
                const d = params.data as ScatterDataItem;
                return `<strong>${d.name}</strong><br/>
                  ${d.province} · ${d.district}<br/>
                  芯片类型：${d.chipType}<br/>
                  芯片数量：<span style="color:#00d4ff;font-weight:bold">${d.value[2]}</span>`;
              }
              if (params.seriesType === "map") {
                return `<strong>${params.name}</strong><br/>
                  芯片总量：<span style="color:#00d4ff;font-weight:bold">${params.value || 0}</span>`;
              }
              return "";
            },
          },
          visualMap: {
            min: 0,
            max: 7000,
            show: true,
            left: 20,
            bottom: 20,
            text: ["高", "低"],
            textStyle: {
              color: "#8ab4f8",
            },
            inRange: {
              color: ["#0a1e3d", "#0d3470", "#1a5fb4", "#3a8fd4", "#00d4ff"],
            },
            seriesIndex: 0,
          },
          series: [
            {
              name: "省份算力",
              type: "map",
              map: "china",
              geoIndex: 0,
              data: provinceData,
            },
            {
              name: "数据中心",
              type: "effectScatter",
              coordinateSystem: "geo",
              data: scatterData,
              symbolSize: (val: number[]) => {
                const size = Math.sqrt(val[2]) / 3;
                return Math.max(6, Math.min(size, 24));
              },
              rippleEffect: {
                brushType: "stroke",
                scale: 3,
                period: 4,
              },
              itemStyle: {
                color: "#00d4ff",
                shadowBlur: 10,
                shadowColor: "#00d4ff",
              },
            },
          ],
          animationDuration: 1500,
          animationEasing: "cubicOut",
        });

        const ro = new ResizeObserver(() => chart.resize());
        ro.observe(el);

        cleanupRef.current = () => {
          ro.disconnect();
          chart.dispose();
          instanceRef.current = null;
        };
      });

    return () => {
      disposed = true;
      cleanupRef.current?.();
    };
  }, []);

  return <div ref={chartRef} className="w-full h-full" />;
}
