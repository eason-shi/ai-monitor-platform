import { BuildingPowerChart } from "@/ui/distribution/building-power";
import { BuiltPowerChart } from "@/ui/distribution/built-power";
import { OperatorShareChart } from "@/ui/distribution/operator-share";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-6 flex flex-wrap gap-6">
      <div className="h-125 w-150">
        <BuildingPowerChart />
      </div>
      <div className="h-125 w-150">
        <BuiltPowerChart />
      </div>
      <div className="h-125 w-150">
        <OperatorShareChart />
      </div>
    </div>
  );
}
