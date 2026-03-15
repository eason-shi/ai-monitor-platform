import { realData } from "./computing-center-data";

interface ComputingCenterTipProps {
  province: string | null;
  visible: boolean;
}

export function ComputingCenterTip({
  province,
  visible,
}: ComputingCenterTipProps) {
  if (!province) return null;

  const clusters = realData.filter((c) => c.region_prov === province);
  if (clusters.length === 0) return null;

  const totalCards = clusters.reduce(
    (sum, c) => sum + parseInt(c.card_quantity, 10),
    0,
  );

  return (
    <div
      className="absolute left-[58%] top-[55%] flex flex-col overflow-hidden z-10"
      style={{
        transform: visible ? "scale(1)" : "scale(0.85)",
        transition: "transform 1500ms cubic-bezier(0.65, 0, 0.35, 1)",
      }}
    >
      <div
        className="flex items-center justify-between h-12 bg-linear-to-r from-[#0058A2] from-[1.65%] to-[rgba(0,61,89,0)] to-[96.88%] px-5 shrink-0"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 1500ms cubic-bezier(0.65, 0, 0.35, 1)",
        }}
      >
        <div className="flex items-center gap-x-4">
          <img src="/widget-title-icon.svg" />
          <span
            className="text-xl text-white italic"
            style={{
              fontFamily: '"MiSans", sans-serif',
              letterSpacing: "2.74px",
            }}
          >
            {province} · 智算中心
          </span>
        </div>
        <div className="flex items-center gap-x-6 text-sm text-white/80">
          <span>
            中心数量：
            <span className="text-cyan-300 font-medium">{clusters.length}</span>
          </span>
          <span>
            总卡数：
            <span className="text-cyan-300 font-medium">
              {totalCards.toLocaleString()}
            </span>
          </span>
        </div>
      </div>

      <div
        className="flex-1 min-h-0 overflow-y-auto bg-[linear-gradient(99.85deg,rgba(0,206,255,0.049)_-5.21%,rgba(11,0,255,0)_102.37%)] backdrop-blur-[12.73px] p-6"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 1500ms cubic-bezier(0.65, 0, 0.35, 1)",
        }}
      >
        <div className="grid grid-cols-3 gap-4">
          {clusters.map((c) => (
            <div
              key={c.id}
              className="rounded-lg border border-slate-600/60 bg-slate-800/50 p-5 transition-colors hover:border-cyan-400/60 hover:shadow-[0_0_12px_rgba(34,211,238,0.15)]"
            >
              <div
                className="text-lg text-white font-semibold mb-3"
                style={{
                  fontFamily: '"MiSans", sans-serif',
                }}
              >
                {c.cluster_name}
              </div>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex justify-between">
                  <span>所在区域</span>
                  <span className="text-white/90">{c.region_city}</span>
                </div>
                <div className="flex justify-between">
                  <span>芯片类型</span>
                  <span className="text-white/90">{c.chip_type}</span>
                </div>
                <div className="flex justify-between">
                  <span>卡数量</span>
                  <span className="text-cyan-300 font-medium">
                    {parseInt(c.card_quantity, 10).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
