import { useCallback, useEffect, useRef } from "react";
import type { EChartsOption, ECharts } from "echarts";
import { EchartsWidget } from "../echarts-widget";

const data = [
  { contury: "中国", value: 37 },
  { contury: "美国", value: 85 },
];

function buildGaugeOption(name: string, value: number): EChartsOption {
  return {
    series: [
      {
        type: "gauge",
        center: ["50%", "60%"],
        axisLine: {
          lineStyle: {
            width: 30,
            color: [
              [0.3, "#67e0e3"],
              [0.7, "#37a2da"],
              [1, "#fd666d"],
            ],
          },
        },
        pointer: {
          itemStyle: {
            color: "auto",
          },
        },
        axisTick: {
          distance: -30,
          length: 8,
          lineStyle: {
            color: "#fff",
            width: 2,
          },
        },
        splitLine: {
          distance: -30,
          length: 30,
          lineStyle: {
            color: "#fff",
            width: 4,
          },
        },
        axisLabel: {
          color: "inherit",
          distance: 40,
          fontSize: 20,
        },
        detail: {
          valueAnimation: true,
          formatter: "{value}",
          color: "inherit",
          offsetCenter: [0, "70%"],
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

  const initialOption = buildGaugeOption(name, 0);

  return { initialOption, onInstance };
}

export function ServiceCompare() {
  const china = useGaugeLoop("中国", data[0].value, ["#1e90ff", "#00cfff"]);
  const usa = useGaugeLoop("美国", data[1].value, ["#ff6a00", "#ff2d55"]);

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 h-full">
        <EchartsWidget
          options={china.initialOption}
          onInstance={china.onInstance}
        />
      </div>
      <div className="flex-1 h-full">
        <EchartsWidget
          options={usa.initialOption}
          onInstance={usa.onInstance}
        />
      </div>
    </div>
  );
}
