import { useEffect, useMemo, useState } from "react";
import * as echarts from "echarts";
import { data } from "./computing-center-data";
import { EchartsWidget } from "@/ui/echarts-widget";

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
  const [ready, setReady] = useState(false);
  const [textureImg, setTextureImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let disposed = false;

    const img = new Image();
    img.src = "/texture.png";

    Promise.all([
      fetch("/china.json").then((res) => res.json()),
      new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      }),
    ]).then(([geoJson]) => {
      if (disposed) return;
      echarts.registerMap("china", geoJson);
      setTextureImg(img);
      setReady(true);
    });

    return () => {
      disposed = true;
    };
  }, []);

  const options = useMemo(() => {
    if (!textureImg) return {};
    return {
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
      animationEasing: "cubicOut" as const,
    };
  }, [textureImg]);

  if (!ready) return <div className="w-full h-full" />;

  return <EchartsWidget options={options} />;
}
