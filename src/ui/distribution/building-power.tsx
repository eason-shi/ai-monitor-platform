import { useCallback, useEffect, useMemo, useRef } from "react";
import type { EChartsOption, ECharts } from "echarts";
import { EchartsWidget } from "@/ui/echarts-widget";

const data = [
  { value: 4800, name: "内蒙古" },
  { value: 3600, name: "宁夏" },
  { value: 2800, name: "上海" },
  { value: 2500, name: "浙江" },
  { value: 2200, name: "贵州" },
  { value: 1900, name: "北京" },
  { value: 1600, name: "广东" },
  { value: 1200, name: "安徽" },
  { value: 1000, name: "江苏" },
  { value: 800, name: "甘肃" },
];

const HOLD_DURATION = 3000;

export function BuildingPowerChart() {
  const instanceRef = useRef<ECharts | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const currentIndexRef = useRef(0);
  const loopRef = useRef<() => void>(undefined);

  useEffect(() => {
    loopRef.current = () => {
      const chart = instanceRef.current;
      if (!chart || chart.isDisposed()) return;

      const prevIndex =
        (currentIndexRef.current - 1 + data.length) % data.length;

      chart.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
        dataIndex: prevIndex,
      });
      chart.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: currentIndexRef.current,
      });
      chart.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: currentIndexRef.current,
      });

      currentIndexRef.current = (currentIndexRef.current + 1) % data.length;
      timerRef.current = setTimeout(() => loopRef.current?.(), HOLD_DURATION);
    };
  });

  const onInstance = useCallback((inst: ECharts | null) => {
    instanceRef.current = inst;
    if (!inst) return;

    inst.on("mouseover", (params) => {
      clearTimeout(timerRef.current);
      if (inst.isDisposed()) return;

      inst.dispatchAction({ type: "downplay", seriesIndex: 0 });
      inst.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: params.dataIndex,
      });
      inst.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: params.dataIndex,
      });
      currentIndexRef.current = ((params.dataIndex ?? 0) + 1) % data.length;
    });

    inst.on("mouseout", () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => loopRef.current?.(), 1000);
    });

    timerRef.current = setTimeout(() => loopRef.current?.(), 500);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  const options = useMemo<EChartsOption>(() => {
    return {
      color: [
        "#6366f1",
        "#8bc34a",
        "#f59e0b",
        "#ef4444",
        "#ec4899",
        "#3b82f6",
        "#14b8a6",
        "#a855f7",
        "#f97316",
        "#64748b",
      ],
      tooltip: {
        trigger: "item",
        confine: true,
        backgroundColor: "rgba(8, 20, 48, 0.9)",
        borderColor: "#00d4ff",
        borderWidth: 1,
        padding: [10, 14],
        textStyle: { color: "#fff", fontSize: 13 },
        position(point, _params, _dom, _rect, size) {
          const cx = size.viewSize[0] * 0.35;
          const cy = size.viewSize[1] * 0.5;
          const [cw, ch] = size.contentSize;
          const gap = 15;
          const dx = point[0] - cx;
          const dy = point[1] - cy;
          const x = dx >= 0 ? point[0] + gap : point[0] - cw - gap;
          const y = dy >= 0 ? point[1] + gap : point[1] - ch - gap;
          return [x, y];
        },
        formatter(params) {
          const d = Array.isArray(params) ? params[0] : params;
          return [
            `<span style="font-size:14px;font-weight:bold">${d.marker} ${d.name}</span>`,
            `算力：<span style="color:#00d4ff;font-size:16px;font-weight:bold">${d.value}</span>`,
            `占比：<span style="color:#00d4ff">${d.percent}%</span>`,
          ].join("<br/>");
        },
      },
      legend: {
        orient: "vertical",
        right: "5%",
        top: "middle",
        textStyle: { color: "#fff" },
      },
      series: [
        {
          type: "pie",
          roseType: "radius",
          radius: ["15%", "75%"],
          center: ["35%", "50%"],
          label: { show: false },
          labelLine: { show: false },
          emphasis: {
            scale: true,
            scaleSize: 10,
            itemStyle: {
              shadowBlur: 20,
              shadowColor: "rgba(99, 102, 241, 0.6)",
            },
          },
          data,
        },
      ],
    };
  }, []);

  return <EchartsWidget options={options} onInstance={onInstance} />;
}
