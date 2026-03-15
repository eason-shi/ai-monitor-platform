import type { ClusterData } from "./computing-center-data";

export function ComputingCenterCardItem({
  c,
  delay,
}: {
  c: ClusterData;
  delay: string;
}) {
  return (
    <div
      key={c.id}
      className="w-[520px] h-[160px] flex flex-col cct-card transition-colors"
      style={{
        animationDelay: delay,
      }}
    >
      <div
        className="flex items-center text-lg text-white font-semibold h-14"
        style={{
          fontFamily: '"MiSans", sans-serif',
        }}
      >
        {c.cluster_name}
      </div>

      <div className="flex-1 text-lg text-white font-light bg-[#00AAFF26] grid grid-cols-2 items-center px-4">
        <span>所在区域：<span className="text-white/90">{c.region_city}</span></span>
        <span>芯片类型：<span className="text-white/90">{c.chip_type}</span></span>
        <span>卡数量：<span className="text-cyan-300 font-medium">{parseInt(c.card_quantity, 10).toLocaleString()}</span></span>
      </div>
    </div>
  );
}
