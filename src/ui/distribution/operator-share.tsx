import { useMemo } from "react";
import { EchartsWidget } from "@/ui/echarts-widget";

export function OperatorShareChart() {
  const options = useMemo(() => ({}), []);

  return <EchartsWidget options={options} />;
}
