import type { PropsWithChildren } from "react";

interface WidgetContainerProps {
  title: string;
}

export function WidgetContainer(
  props: WidgetContainerProps & PropsWithChildren,
) {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden border border-[rgba(100,180,255,0.15)] bg-[rgba(1,21,47,0.6)]">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[rgba(100,180,255,0.2)] shrink-0">
        <div className="w-1 h-4 bg-[rgba(100,200,255,0.8)] shadow-[0_0_6px_rgba(100,200,255,0.8)]" />
        <span className="text-sm font-semibold text-white/90 tracking-wider drop-shadow-[0_0_8px_rgba(100,200,255,0.6)]">
          {props.title}
        </span>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">{props.children}</div>
    </div>
  );
}
