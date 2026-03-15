import { useCallback, useState } from "react";
import { realData } from "./computing-center-data";

interface ComputingCenterTipProps {
  province: string | null;
  visible: boolean;
}

interface CachedData {
  province: string;
  clusters: typeof realData;
  totalCards: number;
}

export function ComputingCenterTip({
  province,
  visible,
}: ComputingCenterTipProps) {
  const [phase, setPhase] = useState<"hidden" | "entering" | "exiting">(
    "hidden",
  );
  const [cached, setCached] = useState<CachedData | null>(null);
  const [prevVisible, setPrevVisible] = useState(visible);
  const [prevProvince, setPrevProvince] = useState(province);

  if (visible !== prevVisible || province !== prevProvince) {
    setPrevVisible(visible);
    setPrevProvince(province);
    if (visible && province) {
      const clusters = realData.filter((c) => c.region_prov === province);
      if (clusters.length > 0) {
        const totalCards = clusters.reduce(
          (sum, c) => sum + parseInt(c.card_quantity, 10),
          0,
        );
        setCached({ province, clusters, totalCards });
        setPhase("entering");
      }
    } else if (!visible && phase === "entering") {
      setPhase("exiting");
    }
  }

  const handleAnimationEnd = useCallback(
    (e: React.AnimationEvent) => {
      if (phase === "exiting" && e.target === e.currentTarget) {
        setPhase("hidden");
        setCached(null);
      }
    },
    [phase],
  );

  if (phase === "hidden" || !cached) return null;

  return (
    <div
      className="absolute left-[58%] top-[55%] flex flex-col z-10 rounded-lg overflow-visible w-max"
      data-phase={phase}
      onAnimationEnd={handleAnimationEnd}
      style={{
        animation:
          phase === "exiting"
            ? "cct-content-hide 800ms ease-in forwards"
            : undefined,
      }}
    >
      <span className="cct-border" />

      <div className="cct-header items-center justify-between bg-linear-to-r from-[#0058A2] from-[1.65%] to-[rgba(0,61,89,0)] to-[96.88%] px-5 py-6 shrink-0 rounded-t-lg">
        <div className="flex items-center gap-x-4">
          <img src="/widget-title-icon.svg" />
          <span className="text-2xl text-white italic">超大规模智算集群</span>
          <span className="text-4xl text-white">{cached.province}</span>
        </div>
      </div>

      <div className="cct-content bg-[linear-gradient(99.85deg,rgba(0,206,255,0.049)_-5.21%,rgba(11,0,255,0)_102.37%)] backdrop-blur-[12.73px] p-6 rounded-b-lg">
        <div className={`grid ${cached.clusters.length >= 2 ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
          {cached.clusters.map((c, index) => (
            <div
              key={c.id}
              className="w-[520px] h-[160px] cct-card rounded-lg border border-slate-600/60 bg-slate-800/50 p-5 transition-colors hover:border-cyan-400/60 hover:shadow-[0_0_12px_rgba(34,211,238,0.15)]"
              style={{
                animationDelay:
                  phase === "entering"
                    ? `${600 + index * 80}ms`
                    : `${(cached.clusters.length - 1 - index) * 60}ms`,
              }}
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
