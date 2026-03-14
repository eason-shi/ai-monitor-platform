interface ModuleItemProps {
  active?: boolean;
  itemName: string;
  className?: string;
  onClick?: () => void;
}

export function ModuleItem({
  active = false,
  itemName,
  className,
  onClick,
}: ModuleItemProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative flex items-center justify-center
        w-[288px] h-20
        bg-cover bg-no-repeat bg-center
        select-none cursor-pointer
        ${className ?? ""}
      `}
      style={{
        backgroundImage: `url(${active ? "/module-active-bg.png" : "/module-bg.png"})`,
      }}
    >
      <span
        className={`
          font-['MiSans'] font-normal text-[30px] leading-10
          text-center bg-clip-text text-transparent
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
