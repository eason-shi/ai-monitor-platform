import { useMemo, useState } from "react";
import type { ComputingCenter, ProvinceGroup } from "./computing-center-data";
import { EchartsWidget } from "@/ui/echarts-widget";

const palette = [
  "#C0392B",
  "#1ABC9C",
  "#E67E22",
  "#2980B9",
  "#8E44AD",
  "#27AE60",
];

function normalize(value: number, min: number, max: number) {
  if (max === min) return 40;
  return ((value - min) / (max - min)) * 40 + 20;
}

export function DataCenterList({ group }: { group: ProvinceGroup }) {
  const [selectedId, setSelectedId] = useState<string>(
    group.centers[0]?.id ?? "",
  );

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-3 min-h-0 flex flex-col overflow-hidden"
        style={{
          backgroundImage: "url('/data-center-bg.png')",
          backgroundSize: "100% 100%",
        }}
      >
        <div className="px-3 py-2 flex items-center gap-2 shrink-0">
          <div className="w-1 h-4 bg-cyan-400" />
          <span className="text-cyan-300 text-sm font-medium tracking-wide">
            超大规模智算集群：{group.province}市
          </span>
          <div className="flex-1 h-px bg-linear-to-r from-cyan-400/60 to-transparent" />
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 space-y-2 scrollbar-thin">
          {group.centers.map((center) => (
            <DataCenterCard
              key={center.id}
              center={center}
              selected={center.id === selectedId}
              onClick={() => setSelectedId(center.id)}
            />
          ))}
        </div>
      </div>
      <div className="flex-2 min-h-0">
        <BubbleChart centers={group.centers} />
      </div>
    </div>
  );
}

function DataCenterCard({
  center,
  selected,
  onClick,
}: {
  center: ComputingCenter;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded p-3 border transition-all ${
        selected
          ? "border-cyan-400 bg-slate-800/70 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
          : "border-slate-600/60 bg-slate-800/50 hover:border-slate-500"
      }`}
    >
      <div className="text-white text-sm font-semibold mb-2">{center.name}</div>
      <div className="flex justify-between text-slate-300 text-xs mb-1">
        <span>所在区域：{center.district}</span>
        <span>芯片类型：{center.chipType}</span>
      </div>
      <div className="text-slate-300 text-xs">卡数量：{center.chipCount}</div>
    </div>
  );
}

function BubbleChart({ centers }: { centers: ComputingCenter[] }) {
  const options = useMemo(() => {
    const counts = centers.map((c) => c.chipCount);
    const min = Math.min(...counts);
    const max = Math.max(...counts);

    return {
      backgroundColor: "transparent",
      series: [
        {
          type: "graph",
          layout: "force",
          roam: false,
          force: {
            repulsion: 120,
            gravity: 0.15,
            edgeLength: 80,
          },
          data: centers.map((c, i) => ({
            name: c.name,
            value: c.chipCount,
            symbolSize: normalize(c.chipCount, min, max),
            itemStyle: { color: palette[i % palette.length] },
            label: {
              show: true,
              color: "#fff",
              fontSize: 11,
              formatter: () => `${c.name.slice(0, 2)}\n${c.chipCount}`,
            },
          })),
          edges: [],
        },
      ],
      tooltip: {
        trigger: "item",
        formatter: (params: { data: { name: string; value: number } }) =>
          `${params.data.name}<br/>卡数量：${params.data.value}`,
      },
    };
  }, [centers]);

  return (
    <EchartsWidget
      options={options}
      initOpts={{ renderer: "canvas" }}
    />
  );
}
