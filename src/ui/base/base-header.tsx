import { useLocation, useNavigate } from "@tanstack/react-router";
import { ModuleItem } from "./module-item";

export function BaseHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <div className="absolute top-0 left-0 w-full">
      <img src="/header-bg.png" alt="" className="w-full block" />
      <div className="absolute inset-x-0 top-1/8 flex items-center justify-center">
        <span className="text-[60px] font-bold font-['MiSans'] tracking-[0.3em] text-white">
          人工智能产业发展监测平台
        </span>
      </div>
      <div className="absolute left-[6%] top-1/4 -translate-y-1/2 flex gap-4">
        <ModuleItem
          itemName="算力底座"
          active={isActive("/")}
          onClick={() => navigate({ to: "/" })}
        />
        <ModuleItem
          itemName="AI数据"
          active={isActive("/data")}
          onClick={() => navigate({ to: "/data" })}
        />
      </div>
      <div className="absolute right-[6%] top-1/4 -translate-y-1/2 flex gap-4">
        <ModuleItem
          itemName="大模型"
          active={isActive("/model")}
          isRight={true}
          onClick={() => navigate({ to: "/model" })}
        />
        <ModuleItem
          itemName="知识图谱"
          active={isActive("/graph")}
          isRight={true}
          onClick={() => navigate({ to: "/graph" })}
        />
      </div>
    </div>
  );
}
