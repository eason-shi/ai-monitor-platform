import { PowerDistribution } from "@/ui/distribution/power-distribution";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

const padding = 16;

function Index() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width - 2 * padding;
      const height = entries[0].contentRect.height - 2 * padding;
      const s = Math.min(width / 3200, height / 1800);
      setScale(s);
      setOffset({
        x: (width - 3200 * s) / 2 + padding,
        y: (height - 1800 * s) / 2 + padding,
      });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden">
      <div
        className="w-[3200px] h-[1800px] origin-top-left border border-white"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
        }}
      >
        <PowerDistribution />
      </div>
    </div>
  );
}
