import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="bg-[#01152f] w-[3200px] h-[1800px]">
      <Outlet />
    </div>
  ),
});
