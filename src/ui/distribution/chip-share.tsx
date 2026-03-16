import { useMemo } from "react";
import { EchartsWidget } from "@/ui/echarts-widget";

const data = [];

export function ChipShareChart() {
  const options = useMemo(() => ({}), []);

  return <EchartsWidget options={options} />;
}
