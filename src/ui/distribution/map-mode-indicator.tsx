interface MapModeIndicatorProps {
  mode: "touring" | "free";
}

export function MapModeIndicator({ mode }: MapModeIndicatorProps) {
  return (
    <div
      className="absolute top-4 left-4 z-10 pointer-events-none rounded-lg overflow-hidden"
      style={{
        border: "1px solid rgba(0,206,255,0.6)",
        boxShadow: "0 0 6px rgba(0,206,255,0.3)",
      }}
    >
      <div
        key={mode}
        className="flex items-center gap-2 px-4 py-2 backdrop-blur-[12.73px]"
        style={{
          background:
            "linear-gradient(99.85deg, rgba(0,206,255,0.049) -5.21%, rgba(11,0,255,0) 102.37%)",
          animation: "cct-content-reveal 300ms ease-out",
        }}
      >
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{
            backgroundColor: mode === "touring" ? "#00ceff" : "#00ceff",
            animation:
              mode === "touring" ? "cct-pulse 2s ease-in-out infinite" : "none",
          }}
        />
        <div className="flex flex-col">
          <span className="text-sm text-white leading-tight">
            {mode === "touring" ? "自动巡览中" : "自由探索模式"}
          </span>
          <span className="text-xs text-white/50 leading-tight">
            {mode === "touring" ? "点击地图进入自由探索" : "移开鼠标恢复巡览"}
          </span>
        </div>
      </div>
    </div>
  );
}
