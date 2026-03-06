import type { PropsWithChildren } from "react";

interface WidgetContainerProps {
  title: string;
}

export function WidgetContainer(
  props: WidgetContainerProps & PropsWithChildren,
) {
  return (
    <div className="w-full h-full overflow-hidden">
      /* header */
      <div></div>
      /* 子元素 */
      <div></div>
    </div>
  );
}
