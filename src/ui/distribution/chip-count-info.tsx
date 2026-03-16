import {
  ChineseChipCountIcon,
  MixedChipCountIcon,
  NvChipCountIcon,
} from "./chip-count-icon";

export function ChipCountInfo() {
  return (
    <div className="w-[700px] h-full bg-[#00327D2E] flex">
      <NvChipCountIcon />
      <ChineseChipCountIcon />
      <MixedChipCountIcon />
    </div>
  );
}
