import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-4 text-center">
      <h3 className="text-2xl font-bold">人工智能产业发展监测大屏</h3>
    </div>
  );
}
