export const COLORS = [
  "#62C5FA",
  "#2C52C9",
  "#C9B42C",
  "#FAAE62",
  "#76FAED",
  "#FA7676",
  "#3CCCC9",
  "#B238E8",
  "#ABFC4F",
  "#CD5ED1",
];

interface ColorLegendProps {
  data: { name: string; value: string }[];
  singleCol?: boolean;
}

export function ColorLegend(props: ColorLegendProps) {
  return (
    <div
      className={
        props.singleCol
          ? "flex flex-col gap-4"
          : "grid grid-cols-2 gap-x-10 gap-y-4"
      }
    >
      {props.data.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-5 text-base text-white"
        >
          <div
            className="w-2.5 h-2.5 shrink-0"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
          <span className="shrink-0">{item.name}</span>
          <span className="font-bold">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
