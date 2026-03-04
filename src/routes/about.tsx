import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold">About</h3>
      <p className="mt-4 text-gray-600">
        This is the about page of the AI Monitor Platform.
      </p>
    </div>
  )
}
