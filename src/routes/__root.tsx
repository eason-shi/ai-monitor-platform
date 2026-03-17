import { BaseHeader } from "@/ui/base/base-header";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createRootRoute({
  component: Index,
});

const DESIGN_WIDTH = 3200;
const DESIGN_HEIGHT = 1800;

function useScale() {
  const [scale, setScale] = useState(() =>
    Math.min(
      window.innerWidth / DESIGN_WIDTH,
      window.innerHeight / DESIGN_HEIGHT,
    ),
  );

  useEffect(() => {
    const update = () =>
      setScale(
        Math.min(
          window.innerWidth / DESIGN_WIDTH,
          window.innerHeight / DESIGN_HEIGHT,
        ),
      );
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return scale;
}

function Index() {
  const scale = useScale();

  return (
    <div className="w-screen h-screen flex items-center justify-center overflow-hidden">
      <div
        className="bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat w-[3200px] h-[1800px] relative px-14 pb-16 pt-36"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <BaseHeader />
        <Outlet />
      </div>
    </div>
  );
}
