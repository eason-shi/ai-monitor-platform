import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/adaptive")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="w-[3200px] h-[1800px]">
        <Outlet />
      </div>
    </div>
  );
}
