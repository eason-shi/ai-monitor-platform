import { useCallback, useState } from "react";
import { realData } from "./computing-center-data";
import { ComputingCenterCardItem } from "./computing-center-card-item";

interface ComputingCenterTipProps {
  province: string | null;
  visible: boolean;
  mode: "touring" | "free";
}

interface CachedData {
  province: string;
  clusters: typeof realData;
  totalCards: number;
}

export function ComputingCenterTip({
  province,
  visible,
  mode,
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
        if (mode === "free" && phase === "entering" && cached) {
          setCached({ province, clusters, totalCards });
        } else {
          setCached({ province, clusters, totalCards });
          setPhase("entering");
        }
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
      className="absolute left-[58%] top-[55%] flex flex-col z-10 rounded-lg overflow-visible w-max pointer-events-none"
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
        <div
          className={`grid ${cached.clusters.length >= 2 ? "grid-cols-2" : "grid-cols-1"} gap-4`}
        >
          {cached.clusters.map((c, index) => (
            <ComputingCenterCardItem
              key={c.id}
              c={c}
              delay={
                phase === "entering"
                  ? `${600 + index * 80}ms`
                  : `${(cached.clusters.length - 1 - index) * 60}ms`
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
