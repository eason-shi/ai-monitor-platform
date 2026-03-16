import { BaseHeader } from "@/ui/base/base-header";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: Index,
});

function Index() {
  return (
    <div className="bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat w-[3200px] h-[1800px] relative px-14 pb-16 pt-36">
      <BaseHeader />
      <Outlet />
    </div>
  );
}
