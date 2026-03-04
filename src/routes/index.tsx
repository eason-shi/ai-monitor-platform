import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold">Home Page</h3>
      <p className="mt-4 text-gray-600">
        Welcome to the AI Monitor Platform. This is a modern React application
        built with Vite, TypeScript, Tailwind CSS, and TanStack Router.
      </p>
    </div>
  );
}
