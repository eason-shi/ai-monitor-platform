import { BaseHeader } from "@/ui/base/base-header";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: Index,
});

function Index() {
  return (
    <div className="bg-[#01152f] w-[3200px] h-[1800px] relative px-14 pb-16 pt-36">
      <BaseHeader />
      <Outlet />
    </div>
  );
}
