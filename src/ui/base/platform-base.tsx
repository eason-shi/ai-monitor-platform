import { BaseFooter } from "./base-footer";
import { BaseHeader } from "./base-header";

export function PlatformBase() {
  return (
    <div className="relative h-full flex flex-col justify-between ">
      <BaseHeader />
      <BaseFooter />
    </div>
  );
}
