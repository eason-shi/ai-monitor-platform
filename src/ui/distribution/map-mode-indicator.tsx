interface MapModeIndicatorProps {
  mode: "touring" | "free";
  onToggle: () => void;
}

export function MapModeIndicator({ mode, onToggle }: MapModeIndicatorProps) {
  return (
    <div
      className="absolute top-4 left-4 z-10 rounded-lg overflow-hidden"
      style={{
        border: "1px solid rgba(0,206,255,0.6)",
        boxShadow: "0 0 6px rgba(0,206,255,0.3)",
      }}
    >
      <div
        className="relative flex backdrop-blur-[12.73px]"
        style={{
          background:
            "linear-gradient(99.85deg, rgba(0,206,255,0.049) -5.21%, rgba(11,0,255,0) 102.37%)",
        }}
      >
        <div
          className="absolute top-0 left-0 h-full w-1/2 transition-transform duration-300 ease-in-out"
          style={{
            transform: mode === "free" ? "translateX(100%)" : "translateX(0)",
            background: "rgba(0,206,255,0.15)",
            borderRadius: "0.5rem",
          }}
        />

        <button
          type="button"
          className="relative z-1 flex items-center gap-2 px-5 py-2.5 cursor-pointer"
          onClick={() => mode !== "touring" && onToggle()}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              backgroundColor: "#00ceff",
              animation:
                mode === "touring"
                  ? "cct-pulse 2s ease-in-out infinite"
                  : "none",
              opacity: mode === "touring" ? 1 : 0.4,
            }}
          />
          <span
            className="text-sm leading-tight transition-colors duration-300"
            style={{
              color: mode === "touring" ? "#fff" : "rgba(255,255,255,0.5)",
            }}
          >
            自动巡览
          </span>
        </button>

        <button
          type="button"
          className="relative z-1 flex items-center gap-2 px-5 py-2.5 cursor-pointer"
          onClick={() => mode !== "free" && onToggle()}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              backgroundColor: "#00ceff",
              opacity: mode === "free" ? 1 : 0.4,
            }}
          />
          <span
            className="text-sm leading-tight transition-colors duration-300"
            style={{
              color: mode === "free" ? "#fff" : "rgba(255,255,255,0.5)",
            }}
          >
            自由探索
          </span>
        </button>
      </div>
    </div>
  );
}
