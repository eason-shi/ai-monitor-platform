import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="bg-[#01152f] h-screen overflow-hidden">
      <Outlet />
    </div>
  ),
});
