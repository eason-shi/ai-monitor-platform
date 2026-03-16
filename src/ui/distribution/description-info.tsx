export function DescriptionInfo() {
  return (
    <div className="flex flex-col justify-between py-4 w-[476px] h-full bg-[#00327D2E]">
      <DescriptionItem src="./desc-a.png" text="目前全国超大智算集群" />
      <DescriptionItem src="./desc-b.png" text="分布在15个省、自治区、直辖市" />
      <DescriptionItem src="./desc-a.png" text="江苏智算算力规模42排行第六" />
    </div>
  );
}

function DescriptionItem({ src, text }: { src: string; text: string }) {
  return (
    <div className="relative">
      <img src={src} />
      <span className="absolute inset-0 flex items-center pl-22 text-white text-lg font-bold">
        {text}
      </span>
    </div>
  );
}
