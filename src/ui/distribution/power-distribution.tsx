import { WidgetContainer } from "../widget/widget-container";
import { BuiltPowerChart } from "./built-power";
import { OperatorShareChart } from "./operator-share";
import { ChipShareChart } from "./chip-share";
import { BuildingPowerChart } from "./building-power";
import { DistributionCenter } from "./distribution-center";

import { ChinaComputingPower } from "./china-computing-power";
import { AmericaComputingPower } from "./america-computing-power";
import { ServiceCompare } from "./service-compare";

export function PowerDistribution() {
  return (
    <div className="w-full h-full flex gap-3 px-3 py-10">
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
            <ChipShareChart />
          </WidgetContainer>
        </div>

        <div className="flex-1 min-h-0">
          <WidgetContainer title="智算中心运营服务商占比">
            <OperatorShareChart />
          </WidgetContainer>
        </div>
      </div>

      <DistributionCenter />

      <div className="w-[22%] flex flex-col gap-3 justify-between">
        <div className="flex-1 min-h-0">
          <WidgetContainer title="中国算力服务结构">
            <ChinaComputingPower />
          </WidgetContainer>
        </div>

        <div className="flex-1 min-h-0">
          <WidgetContainer title="美国算力服务结构">
            <AmericaComputingPower />
          </WidgetContainer>
        </div>

        <div className="flex-1 min-h-0">
          <WidgetContainer title="服务供给方式对比">
            <ServiceCompare />
          </WidgetContainer>
        </div>

        <div className="flex-1 min-h-0">
          <WidgetContainer title="算力服务分布对比">
            <div className="w-full h-full flex p-2">
              <div className="flex-1 flex flex-col items-center gap-1">
                <span className="text-white text-2xl">中国</span>
                <img
                  src="./china-computing.png"
                  className="flex-1 min-h-0 object-contain"
                />
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <span className="text-white text-2xl">美国</span>
                <img
                  src="./america-computing.png"
                  className="flex-1 min-h-0 object-contain"
                />
              </div>
            </div>
          </WidgetContainer>
        </div>
      </div>
    </div>
  );
}
