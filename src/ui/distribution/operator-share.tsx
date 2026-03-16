import { useMemo } from "react";
import { EchartsWidget } from "@/ui/echarts-widget";

const data = [
  {
    percentage: 0.3034,
    operator: "政府投资的当地运营公司",
  },
  {
    percentage: 0.3228,
    operator: "电信运营商",
  },
  {
    percentage: 0.3738,
    operator: "云服务商、芯片厂商、第三方IDC等",
  },
];

export function OperatorShareChart() {
  const options = useMemo(() => ({}), []);

  return <EchartsWidget options={options} />;
}
