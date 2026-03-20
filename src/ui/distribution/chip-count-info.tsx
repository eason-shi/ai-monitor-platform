import type { ReactNode } from "react";
import {
  ChineseChipCountIcon,
  MixedChipCountIcon,
  NvChipCountIcon,
} from "./chip-count-icon";

export function ChipCountInfo() {
  return (
    <div className="w-[700px] h-full bg-[#00327D2E] flex justify-evenly items-center">
      <SingleChipCountInfo
        icon={<NvChipCountIcon />}
        count="2000"
        type="全NV卡"
      />
      <SingleChipCountInfo
        icon={<ChineseChipCountIcon />}
        count="1500"
        type="国产卡"
      />
      <SingleChipCountInfo
        icon={<MixedChipCountIcon />}
        count="800"
        type="NV+国产"
      />
    </div>
  );
}

function SingleChipCountInfo({
  icon,
  count,
  type,
}: {
  icon: ReactNode;
  count: string;
  type: string;
}) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 flex items-baseline gap-0.5">
          <span className="text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(0,255,200,0.6)]">
            {count}
          </span>
          <span className="text-base text-cyan-300 font-medium">个</span>
        </div>
        {icon}
      </div>
      <span className="text-xl text-white font-medium tracking-wider">
        {type}
      </span>
    </div>
  );
}
