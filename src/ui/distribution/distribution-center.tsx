import { useState } from "react";
import { DistributionMap } from "./distribution-map";
import { ComputingCenterTip } from "./computing-center-tip";
import { MapModeIndicator } from "./map-mode-indicator";
import { TotalInfoItem } from "./total-info-item";
import { ChipCountInfo } from "./chip-count-info";
import { DescriptionInfo } from "./description-info";
import { TotalComputingInfo } from "./total-computing-info";

export function DistributionCenter() {
  const [province, setProvince] = useState<string | null>(null);
  const [tipVisible, setTipVisible] = useState(false);
  const [mapMode, setMapMode] = useState<"touring" | "free">("touring");

  return (
    <div className="w-[56%] relative flex flex-col">
      <div className="flex-1 relative">
        <div className="absolute -top-18 left-[22%] flex justify-center items-center gap-[180px]  rounded-lg px-6 py-3 ">
          <TotalInfoItem value={324} suffix="个" subTitle="项目总量" />
          <TotalInfoItem value={1690} suffix="EFlops" subTitle="智算总量" />
          <TotalInfoItem value={43255} suffix="张" subTitle="卡总量" />
        </div>

        <DistributionMap
          mode={mapMode}
          onProvinceChange={setProvince}
          onTipVisibleChange={setTipVisible}
          onModeChange={setMapMode}
        />

        <MapModeIndicator
          mode={mapMode}
          onToggle={() => setMapMode((prev) => prev === "touring" ? "free" : "touring")}
        />

        <ComputingCenterTip
          province={province}
          visible={tipVisible}
          mode={mapMode}
        />
      </div>

      <div className="h-[280px] flex justify-between gap-8">
        <ChipCountInfo />
        <DescriptionInfo />
        <TotalComputingInfo />
      </div>
    </div>
  );
}
