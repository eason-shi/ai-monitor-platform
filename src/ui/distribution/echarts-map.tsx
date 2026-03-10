import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { data } from "./computing-center-data";

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

    const textureImg = new Image();
    textureImg.src = "/texture.png";

    Promise.all([
      fetch("/china.json").then((res) => res.json()),
      new Promise<void>((resolve) => {
        textureImg.onload = () => resolve();
        textureImg.onerror = () => resolve();
      }),
    ]).then(([geoJson]) => {
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
              image: textureImg,
              repeat: "repeat",
            },
            // areaColor: "white",
            borderColor: "red",
            borderWidth: 2,
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
          formatter: (params: echarts.DefaultLabelFormatterCallbackParams) => {
            if (params.seriesType === "effectScatter") {
              const d = params.data as ScatterDataItem;
              return `<strong>${d.name}</strong><br/>
                  ${d.province} · ${d.district}<br/>
                  芯片类型：${d.chipType}<br/>
                  芯片数量：<span style="color:#00d4ff;font-weight:bold">${d.value[2]}</span>`;
            }
            return "";
          },
        },
        series: [],
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
