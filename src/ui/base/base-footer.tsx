interface Module {
  id: number;
  style: React.CSSProperties;
}

const modules: Module[] = [
  {
    id: 1,
    style: { top: "-50px", left: "5%", width: "80px", height: "130px" },
  },
  {
    id: 2,
    style: { top: "-30px", left: "15%", width: "80px", height: "130px" },
  },
  {
    id: 3,
    style: { top: "-50px", right: "15%", width: "80px", height: "130px" },
  },
  {
    id: 4,
    style: { top: "-30px", right: "5%", width: "80px", height: "130px" },
  },
];

export function BaseFooter() {
  return (
    <div className="w-full flex justify-center">
      <div className="relative w-2/5">
        <img src="/footer-bg.png" alt="" className="w-full" />
        {modules.map((module) => (
          <div
            key={module.id}
            className="absolute flex flex-col justify-center items-center rounded-lg p-4 text-white"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              ...module.style,
            }}
          >
            {module.id}
          </div>
        ))}
      </div>
    </div>
  );
}
