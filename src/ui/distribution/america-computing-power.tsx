const data = [
  { operator: "亚马逊", share: "30%" },
  { operator: "英伟达", share: "37%" },
  { operator: "谷歌", share: "33%" },
];

const colors = ["#6366f1", "#22c55e", "#f59e0b"];

export function AmericaComputingPower() {
  return (
    <div className="flex items-center gap-8 w-full h-full">
      <img src="/america.png" alt="美国" className="flex-1" />
      <div className="flex flex-col gap-3">
        {data.map((item, index) => (
          <div key={item.operator} className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: colors[index] }}
            />
            <span className="text-white text-lg">
              {item.operator} {item.share}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
