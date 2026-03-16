// import type { Component } from "react";
import {
  ChineseChipCountIcon,
  MixedChipCountIcon,
  NvChipCountIcon,
} from "./chip-count-icon";

export function ChipCountInfo() {
  return (
    <div className="w-[700px] h-full bg-[#00327D2E] flex justify-evenly items-center">
      <NvChipCountIcon />
      <ChineseChipCountIcon />
      <MixedChipCountIcon />
    </div>
  );
}

// function SingleChipCountInfo({
//   icon,
//   count,
//   type,
// }: {
//   icon: Component;
//   count: string;
//   type: string;
// }) {
//   return <div></div>;
// }
