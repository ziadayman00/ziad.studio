'use client'

import { deleteBlogPostAction } from '@/lib/admin/actions'

export default function DeleteBlogPostButton({ secret, id }: { secret: string; id: number }) {
  return (
    <form
      action={deleteBlogPostAction.bind(null, secret, id)}
      onSubmit={(e) => {
        if (!confirm('Delete this post permanently?')) {
          e.preventDefault()
        }
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-red-200 bg-[color-mix(in_srgb,#fecaca_35%,var(--surface))] px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-red-800 transition-colors hover:bg-[color-mix(in_srgb,#fecaca_55%,var(--surface))]"
      >
        Delete
      </button>
    </form>
  )
}
