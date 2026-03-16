import { useState } from "react";
import { WidgetContainer } from "../widget/widget-container";
import { BuiltPowerChart } from "./built-power";
import { OperatorShareChart } from "./operator-share";
import { ChipShareChart } from "./chip-share";
import { BuildingPowerChart } from "./building-power";
import { DistributionMap } from "./distribution-map";
import { ComputingCenterTip } from "./computing-center-tip";

export function PowerDistribution() {
  const [province, setProvince] = useState<string | null>(null);
  const [tipVisible, setTipVisible] = useState(false);
  const [mapMode, setMapMode] = useState<"touring" | "free">("touring");

  return (
    <div className="w-full h-full flex gap-3 px-3 py-20">
      <div className="w-[22%] flex flex-col gap-3 justify-between">
        <div className="flex-1 min-h-0">
          <WidgetContainer title="各省份已建成智算算力规模">
            <BuiltPowerChart />
          </WidgetContainer>
        </div>

        <div className="flex-1 min-h-0">
          <WidgetContainer title="各省份规划或建设中智算算力规模">
            <BuildingPowerChart />
          </WidgetContainer>
        </div>

        <div className="flex-1 min-h-0">
          <WidgetContainer title="智能芯片类型占比（对外服务）">
            <OperatorShareChart />
          </WidgetContainer>
        </div>

        <div className="flex-1 min-h-0">
          <WidgetContainer title="智算中心运营服务商占比">
            <ChipShareChart />
          </WidgetContainer>
        </div>
      </div>

      <div className="w-[56%] relative flex flex-col">
        <div className="h-[256px]"></div>

        <div className="flex-1 relative">
          <DistributionMap
            onProvinceChange={setProvince}
            onTipVisibleChange={setTipVisible}
            onModeChange={setMapMode}
          />

          <ComputingCenterTip province={province} visible={tipVisible} mode={mapMode} />
        </div>

        <div className="h-[280px]"></div>
      </div>

      <div className="w-[22%] flex flex-col gap-3 justify-between">
        <div className="flex-1 min-h-0">
          <WidgetContainer title="中国算力服务结构">
            <div />
          </WidgetContainer>
        </div>

        <div className="flex-1 min-h-0">
          <WidgetContainer title="美国算力服务结构">
            <div />
          </WidgetContainer>
        </div>

        <div className="flex-1 min-h-0">
          <WidgetContainer title="服务供给方式对比">
            <div />
          </WidgetContainer>
        </div>

        <div className="flex-1 min-h-0">
          <WidgetContainer title="算力服务分布对比">
            <div />
          </WidgetContainer>
        </div>
      </div>
    </div>
  );
}
