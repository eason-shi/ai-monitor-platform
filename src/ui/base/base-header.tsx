import { useState } from "react";
import { ModuleItem } from "./module-item";

type ModuleType = "computing" | "data" | "model" | "graph";

export function BaseHeader() {
  const [activeModule, setActiveModule] = useState<ModuleType>("computing");

  return (
    <div className="absolute top-0 left-0 w-full">
      <img src="/header-bg.png" alt="" className="w-full block" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[70px] font-bold font-['MiSans'] tracking-[0.3em] text-white drop-shadow-[0_0_12px_rgba(100,200,255,0.8)]">
          人工智能产业发展监测平台
        </span>
      </div>
      <div className="absolute left-[12%] top-1/2 -translate-y-1/2 flex gap-4">
        <ModuleItem itemName="算力底座" active={activeModule == "computing"} />
        <ModuleItem itemName="AI数据" active={activeModule == "data"} />
      </div>
      <div className="absolute right-[12%] top-1/2 -translate-y-1/2 flex gap-4">
        <ModuleItem itemName="大模型" active={activeModule == "model"} />
        <ModuleItem itemName="知识图谱" active={activeModule == "graph"} />
      </div>
    </div>
  );
}
