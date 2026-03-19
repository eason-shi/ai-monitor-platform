import { ColorLegend } from "./color-legend";

const data = [
  { value: 4800, name: "内蒙古" },
  { value: 3600, name: "宁夏" },
  { value: 2800, name: "上海" },
  { value: 2500, name: "浙江" },
  { value: 2200, name: "贵州" },
  { value: 1900, name: "北京" },
  { value: 1600, name: "广东" },
  { value: 1200, name: "安徽" },
  { value: 1000, name: "江苏" },
  { value: 800, name: "甘肃" },
];

export function BuildingPowerChart() {
  return (
    <div className="flex w-full h-full px-3">
      <div className="flex-1 flex items-center justify-center">
        <img src="./building-power.png" />
      </div>
      <div className="w-[340px] h-full flex items-center justify-center">
        <ColorLegend
          data={(() => {
            const total = data.reduce((sum, item) => sum + item.value, 0);
            return data.map((item) => ({
              name: item.name,
              value: `${((item.value / total) * 100).toFixed(2)}%`,
            }));
          })()}
        />
      </div>
    </div>
  );
}
