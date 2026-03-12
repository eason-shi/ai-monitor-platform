import { PowerDistribution } from "@/ui/distribution/power-distribution";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <div className="w-[3200px] h-[1800px]">
        <PowerDistribution />
      </div>
    </div>
  );
}
