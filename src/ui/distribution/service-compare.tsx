import { useCallback, useEffect, useRef } from "react";
import type { EChartsOption, ECharts } from "echarts";
import { EchartsWidget } from "../echarts-widget";

const data = [
  { contury: "中国", value: 37 },
  { contury: "美国", value: 85 },
];

function buildGaugeOption(
  name: string,
  value: number,
  color: [string, string],
): EChartsOption {
  return {
    series: [
      {
        type: "gauge",
        startAngle: 220,
        endAngle: -40,
        min: 0,
        max: 100,
        animationDuration: 1500,
        animationDurationUpdate: 1500,
        animationEasingUpdate: "cubicOut",
        progress: {
          show: true,
          width: 14,
          roundCap: true,
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: color[0] },
                { offset: 1, color: color[1] },
              ],
            },
          },
        },
        axisLine: {
          roundCap: true,
          lineStyle: { width: 14, color: [[1, "rgba(255,255,255,0.08)"]] },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        pointer: { show: false },
        anchor: { show: false },
        title: {
          show: true,
          offsetCenter: [0, "70%"],
          fontSize: 14,
          color: "rgba(255,255,255,0.85)",
        },
        detail: {
          offsetCenter: [0, "30%"],
          fontSize: 28,
          fontWeight: "bold",
          color: "#fff",
          formatter: "{value}%",
        },
        data: [{ value, name }],
      },
    ],
  };
}

const ANIM_DURATION = 1500;
const HOLD_DURATION = 2000;
const RESET_DURATION = 600;

function useGaugeLoop(name: string, target: number, color: [string, string]) {
  const instanceRef = useRef<ECharts | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const onInstance = useCallback((inst: ECharts | null) => {
    instanceRef.current = inst;
  }, []);

  useEffect(() => {
    function loop() {
      const chart = instanceRef.current;
      if (!chart || chart.isDisposed()) return;

      chart.setOption({
        series: [
          {
            animationDurationUpdate: ANIM_DURATION,
            animationEasingUpdate: "cubicOut",
            data: [{ value: target, name }],
          },
        ],
      });

      timerRef.current = setTimeout(() => {
        const chart = instanceRef.current;
        if (!chart || chart.isDisposed()) return;

        chart.setOption({
          series: [
            {
              animationDurationUpdate: RESET_DURATION,
              animationEasingUpdate: "linear",
              data: [{ value: 0, name }],
            },
          ],
        });

        timerRef.current = setTimeout(loop, RESET_DURATION + 300);
      }, ANIM_DURATION + HOLD_DURATION);
    }

    const startTimer = setTimeout(loop, 100);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(timerRef.current);
    };
  }, [name, target]);

  const initialOption = buildGaugeOption(name, 0, color);

  return { initialOption, onInstance };
}

export function ServiceCompare() {
  const china = useGaugeLoop("中国", data[0].value, ["#1e90ff", "#00cfff"]);
  const usa = useGaugeLoop("美国", data[1].value, ["#ff6a00", "#ff2d55"]);

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 h-full">
        <EchartsWidget options={china.initialOption} onInstance={china.onInstance} />
      </div>
      <div className="flex-1 h-full">
        <EchartsWidget options={usa.initialOption} onInstance={usa.onInstance} />
      </div>
    </div>
  );
}
