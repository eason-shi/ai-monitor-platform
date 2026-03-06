import { PlatformBase } from "@/ui/base/platform-base";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="relative h-screen bg-[#01152f] overflow-hidden">
      <PlatformBase />
      <Outlet />
    </div>
  ),
});
