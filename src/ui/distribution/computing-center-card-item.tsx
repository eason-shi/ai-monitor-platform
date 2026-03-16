import type { ClusterData } from "./computing-center-data";

const colorMap = {
  全国产卡: "#00EAFF",
  "NV+国产": "#33D87D",
  全NV卡: "#F3DC2C",
  "NV+AMD": "#F3DC2C",
};

export function ComputingCenterCardItem({
  c,
  delay,
}: {
  c: ClusterData;
  delay: string;
}) {
  const color = colorMap[c.colony_type as keyof typeof colorMap];
  return (
    <div
      key={c.id}
      className="w-[520px] h-[160px] flex flex-col cct-card transition-colors"
      style={{
        animationDelay: delay,
      }}
    >
      <div
        className="flex items-center gap-2 text-lg text-white font-semibold h-14"
        style={{
          fontFamily: '"MiSans", sans-serif',
        }}
      >
        <Icon fill={color} />
        <span>{c.cluster_name}</span>
      </div>

      <div
        className="flex-1 text-lg text-white font-light bg-(--card-bg)/15 grid grid-cols-2 items-center px-4"
        style={{ "--card-bg": color } as React.CSSProperties}
      >
        <span>
          所在区域：<span className="text-white/90">{c.region_city}</span>
        </span>
        <span>
          芯片类型：<span className="text-white/90">{c.chip_type}</span>
        </span>
        <span>
          卡数量：
          <span className="text-cyan-300 font-medium">
            {parseInt(c.card_quantity, 10).toLocaleString()}
          </span>
        </span>
      </div>
    </div>
  );
}

function Icon({ fill }: { fill: string }) {
  return (
    <svg
      width="11"
      height="17"
      viewBox="0 0 11 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.88211 0H0V16.532H3.88211L10.4412 8.26598L3.88211 0Z"
        fill={fill}
      />
    </svg>
  );
}
