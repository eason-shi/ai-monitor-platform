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
          className="text-xl text-white italic font-bold"
          style={{
            fontFamily: '"MiSans", sans-serif',
            letterSpacing: "2.74px",
          }}
        >
          {props.title}
        </span>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden bg-[linear-gradient(99.85deg,rgba(0,206,255,0.049)_-5.21%,rgba(11,0,255,0)_102.37%)] backdrop-blur-[12.73px]">
        {props.children}
      </div>
    </div>
  );
}
