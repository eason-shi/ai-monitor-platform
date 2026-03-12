import { DistributionMap } from "@/ui/distribution/distribution-map";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/deploy/distrivution")({
  component: DistributionMap,
});
