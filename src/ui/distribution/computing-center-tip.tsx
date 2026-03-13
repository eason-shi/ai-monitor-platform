import { data } from "./computing-center-data";

interface ComputingCenterTipProps {
  province: string | null;
  visible: boolean;
}

export function ComputingCenterTip({
  province,
  visible,
}: ComputingCenterTipProps) {
  if (!province) return null;

  const group = data.find((g) => g.province === province);
  if (!group) return null;

  const totalChips = group.centers.reduce((sum, c) => sum + c.chipCount, 0);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 1500ms cubic-bezier(0.65, 0, 0.35, 1)",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

      <div
        className="relative w-[1120px] h-[780px] flex flex-col overflow-hidden"
        style={{
          transform: visible ? "scale(1)" : "scale(0.85)",
          transition: "transform 1500ms cubic-bezier(0.65, 0, 0.35, 1)",
        }}
      >
        <div className="flex items-center justify-between h-12 bg-linear-to-r from-[#0058A2] from-[1.65%] to-[rgba(0,61,89,0)] to-[96.88%] px-5 shrink-0">
          <div className="flex items-center gap-x-4">
            <img src="/widget-title-icon.svg" />
            <span
              className="text-xl text-white italic"
              style={{
                fontFamily: '"MiSans", sans-serif',
                letterSpacing: "2.74px",
              }}
            >
              {group.province} · 智算中心
            </span>
          </div>
          <div className="flex items-center gap-x-6 text-sm text-white/80">
            <span>
              中心数量：
              <span className="text-cyan-300 font-medium">
                {group.centers.length}
              </span>
            </span>
            <span>
              总芯片数：
              <span className="text-cyan-300 font-medium">
                {totalChips.toLocaleString()}
              </span>
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto bg-[linear-gradient(99.85deg,rgba(0,206,255,0.049)_-5.21%,rgba(11,0,255,0)_102.37%)] backdrop-blur-[12.73px] p-6">
          <div className="grid grid-cols-3 gap-4">
            {group.centers.map((center) => (
              <div
                key={center.id}
                className="rounded-lg border border-slate-600/60 bg-slate-800/50 p-5 transition-colors hover:border-cyan-400/60 hover:shadow-[0_0_12px_rgba(34,211,238,0.15)]"
              >
                <div
                  className="text-lg text-white font-semibold mb-3"
                  style={{
                    fontFamily: '"MiSans", sans-serif',
                  }}
                >
                  {center.name}
                </div>
                <div className="space-y-2 text-sm text-white/70">
                  <div className="flex justify-between">
                    <span>所在区域</span>
                    <span className="text-white/90">{center.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>芯片类型</span>
                    <span className="text-white/90">{center.chipType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>芯片数量</span>
                    <span className="text-cyan-300 font-medium">
                      {center.chipCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
