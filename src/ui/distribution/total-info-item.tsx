export function TotalInfoItem({
  title,
  subTitle,
  className,
}: {
  title: string;
  subTitle: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="relative inline-block">
        <img src="/top-torch.png" alt="" />
        <div className="absolute inset-0 flex flex-col items-center justify-center font-['MiSans'] gap-y-2">
          <div className="text-4xl font-semibold text-white">{title}</div>
          <div className="text-2xl text-white font-thin">{subTitle}</div>
        </div>
      </div>
    </div>
  );
}
