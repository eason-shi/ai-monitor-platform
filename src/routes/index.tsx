import { BuildingPowerChart } from "@/ui/distribution/building-power";
import { BuiltPowerChart } from "@/ui/distribution/built-power";
import { ChipShareChart } from "@/ui/distribution/chip-share";
import { DistributionMap } from "@/ui/distribution/distribution-map";
import { OperatorShareChart } from "@/ui/distribution/operator-share";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <div className="p-6 flex flex-wrap gap-6"></div>;
}
