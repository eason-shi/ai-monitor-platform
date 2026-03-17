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
        <div className="absolute top-0 left-[22%] flex justify-center items-center gap-[180px]  bg-slate-900/90 rounded-lg px-6 py-3 ">
          <TotalInfoItem title="324个" subTitle="项目总量" />
          <TotalInfoItem title="1690EFlops" subTitle="智算总量" />
          <TotalInfoItem title="43255张" subTitle="卡总量" />
        </div>

        <DistributionMap
          onProvinceChange={setProvince}
          onTipVisibleChange={setTipVisible}
          onModeChange={setMapMode}
        />

        <MapModeIndicator mode={mapMode} />

        <ComputingCenterTip
          province={province}
          visible={tipVisible}
          mode={mapMode}
        />
      </div>

      <div className="h-[280px] flex justify-between">
        <ChipCountInfo />
        <DescriptionInfo />
        <TotalComputingInfo />
      </div>
    </div>
  );
}
