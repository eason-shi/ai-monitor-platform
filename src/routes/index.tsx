import { PowerDistribution } from "@/ui/distribution/power-distribution";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: PowerDistribution,
});
