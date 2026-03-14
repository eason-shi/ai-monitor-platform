import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import { EchartsWidget } from "@/ui/echarts-widget";

export function BuildingPowerChart() {
  const options = useMemo<EChartsOption>(() => {
    return {};
  }, []);

  return <EchartsWidget options={options} />;
}
