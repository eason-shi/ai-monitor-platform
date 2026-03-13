import { useEffect, useRef } from "react";
import * as echarts from "echarts";
interface EchartsWidgetProps {
  options: Parameters<echarts.ECharts["setOption"]>[0];
  className?: string;
  initOpts?: Parameters<typeof echarts.init>[2];
}

export function EchartsWidget({
  options,
  className = "w-full h-full",
  initOpts,
}: EchartsWidgetProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, null, initOpts);
    instanceRef.current = chart;

    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(chartRef.current);

    return () => {
      observer.disconnect();
      chart.dispose();
      instanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.setOption(options);
    }
  }, [options]);

  return <div ref={chartRef} className={className} />;
}
