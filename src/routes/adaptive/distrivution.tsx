import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/adaptive/distrivution")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="text-white">Hello "/adaptive/distrivution"!</div>;
}
