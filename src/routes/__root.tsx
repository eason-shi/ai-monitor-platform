import { PlatformBase } from "@/ui/base/platform-base";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="relative h-screen bg-[#01152f] overflow-hidden">
      <PlatformBase />
      <div className="w-full h-full absolute top-0 left-0">
        <Outlet />
      </div>
    </div>
  ),
});
