import { WidgetContainer } from "../widget/widget-container";
import { BuiltPowerChart } from "./built-power";
import { OperatorShareChart } from "./operator-share";
import { ChipShareChart } from "./chip-share";
import { BuildingPowerChart } from "./building-power";
import { DataCenterList } from "./data-center-list";
import { data } from "./computing-center-data";
import { DistributionMap } from "./distribution-map";

export function PowerDistribution() {
  return (
    <div className="w-full h-full flex gap-3 px-3 py-20">
      <div className="w-[22%] flex flex-col gap-3">
        <div className="flex-1 min-h-0">
          <WidgetContainer title="各省份已建成智算算力规模">
            <BuiltPowerChart />
          </WidgetContainer>
        </div>

        <div className="flex-1 min-h-0">
          <WidgetContainer title="建设中算力">
            <BuildingPowerChart />
          </WidgetContainer>
        </div>

        <div className="flex-1 min-h-0">
          <WidgetContainer title="运营商占比">
            <OperatorShareChart />
          </WidgetContainer>
        </div>

        <div className="flex-1 min-h-0">
          <WidgetContainer title="芯片厂商占比">
            <ChipShareChart />
          </WidgetContainer>
        </div>
      </div>

      <div className="w-[56%]">{/* <DistributionMap /> */}</div>

      <div className="w-[22%]">
        <DataCenterList group={data[0]} />
      </div>
    </div>
  );
}
