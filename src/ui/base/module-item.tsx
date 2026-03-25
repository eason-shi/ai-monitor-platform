interface ModuleItemProps {
  active?: boolean;
  isRight?: boolean;
  itemName: string;
  className?: string;
  onClick?: () => void;
}

export function ModuleItem({
  active = false,
  isRight = false,
  itemName,
  className,
  onClick,
}: ModuleItemProps) {
  const bgImage = isRight
    ? active
      ? "/module-active-bg-right.png"
      : "/module-bg-right.png"
    : active
      ? "/module-active-bg.png"
      : "/module-bg.png";

  return (
    <div
      onClick={onClick}
      className={`
        relative flex items-center justify-center
        w-[310px] h-20 px-4
        bg-cover bg-no-repeat bg-center
        select-none cursor-pointer
        ${className ?? ""}
      `}
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <span
        className={`
          font-['MiSans'] font-bold italic text-[30px] leading-10
          text-center bg-clip-text text-transparent px-1
        `}
        style={{
          backgroundImage: active
            ? "linear-gradient(to top, #0048FF 0%, #FFFFFF 40%)"
            : "linear-gradient(to top, rgba(37, 117, 255, 0.72) 0%, #FFFFFF 40%)",
        }}
      >
        {itemName}
      </span>
    </div>
  );
}
