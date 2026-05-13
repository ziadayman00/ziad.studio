'use client'

import { deleteProjectAction } from '@/lib/admin/actions'

export default function DeleteProjectButton({ secret, id }: { secret: string; id: number }) {
  return (
    <form
      action={deleteProjectAction.bind(null, secret, id)}
      onSubmit={(e) => {
        if (!confirm('Delete this project permanently from the database?')) {
          e.preventDefault()
        }
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-red-400/35 bg-red-500/10 px-5 py-2.5 font-sans text-xs uppercase tracking-[0.16em] text-red-200/90 transition-colors hover:bg-red-500/20"
      >
        Delete project
      </button>
    </form>
  )
}
