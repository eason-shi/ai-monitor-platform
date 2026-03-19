import { ColorLegend } from "./color-legend";

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
    operator: "云服务商、芯片厂商",
  },
];

export function OperatorShareChart() {
  return (
    <div className="flex items-center gap-8 w-full h-full px-3">
      <div className="relative flex-1 flex items-center justify-center">
        <img src="/operator-share.png" alt="服务商占比" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-lg">服务商占比</span>
        </div>
      </div>
      <div className="w-[340px] h-full flex items-center justify-center">
        <ColorLegend
          singleCol
          data={data.map((item) => ({
            name: item.operator,
            value: `${item.percentage * 100}%`,
          }))}
        />
      </div>
    </div>
  );
}
