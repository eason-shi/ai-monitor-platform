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

const colors = ["#22c55e", "#f59e0b", "#ef4444"];

export function OperatorShareChart() {
  return (
    <div className="flex items-center gap-8 w-full h-full">
      <div className="relative">
        <img src="/operator-share.png" alt="服务商占比" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-lg">服务商占比</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {data.map((item, index) => (
          <div key={item.operator} className="flex items-center gap-3">
            <div
              className="w-4 h-4 shrink-0 rounded"
              style={{ backgroundColor: colors[index] }}
            />
            <span className="text-white text-lg">
              {item.operator} {(item.percentage * 100).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
