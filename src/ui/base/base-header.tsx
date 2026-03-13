export function BaseHeader() {
  return (
    <div className="absolute top-0 left-0 ">
      <img src="/header-bg.png" alt="" className="w-full" />
      <div className="relative w-4/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold tracking-[0.3em] text-white drop-shadow-[0_0_12px_rgba(100,200,255,0.8)]">
            人工智能产业发展监测平台
          </span>
        </div>
      </div>
    </div>
  );
}
