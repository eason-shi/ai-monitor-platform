import { useEffect, useRef } from "react";
import { useCountUp } from "react-countup";

export function TotalInfoItem({
  value,
  suffix,
  subTitle,
  className,
}: {
  value: number;
  suffix: string;
  subTitle: string;
  className?: string;
}) {
  const countUpRef = useRef<HTMLElement>(null!);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const { start, reset } = useCountUp({
    ref: countUpRef,
    end: value,
    suffix,
    duration: 2,
    startOnMount: true,
    onEnd: () => {
      timerRef.current = setTimeout(() => {
        reset();
        start();
      }, 3000);
    },
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className={className}>
      <div className="relative inline-block">
        <img src="/top-torch.png" alt="" />
        <div className="absolute inset-0 flex flex-col items-center justify-center font-['MiSans'] gap-y-2">
          <div className="text-4xl font-semibold text-white">
            <span ref={countUpRef} />
          </div>
          <div className="text-2xl text-white font-thin">{subTitle}</div>
        </div>
      </div>
    </div>
  );
}
