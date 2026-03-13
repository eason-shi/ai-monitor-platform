import type { PropsWithChildren } from "react";

interface WidgetContainerProps {
  title: string;
}

export function WidgetContainer(
  props: WidgetContainerProps & PropsWithChildren,
) {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden ">
      <div className="flex items-center gap-x-5 h-11 bg-linear-to-r from-[#0058A2] from-[1.65%] to-[rgba(0,61,89,0)] to-[96.88%]">
        <img src="/widget-title-icon.svg" />
        <span
          className="text-xl text-white italic"
          style={{
            fontFamily:
              '"Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif',
            fontWeight: 900,
            letterSpacing: "2.74px",
          }}
        >
          {props.title}
        </span>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">{props.children}</div>
    </div>
  );
}
