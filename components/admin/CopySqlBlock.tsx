'use client'

import { useState } from 'react'

export default function CopySqlBlock({ sql }: { sql: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(sql)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-white/15 bg-black/40 p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-sans text-sm text-white/75">
          <strong className="text-white">Fastest fix:</strong> Supabase → <strong className="text-white">SQL Editor</strong> → New query → paste →{' '}
          <strong className="text-white">Run</strong>. Then refresh this page (and run <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px]">npm run db:seed</code> if you want rows from{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px]">projects.json</code>).
        </p>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-full border border-white/20 bg-white/[0.08] px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/[0.14]"
        >
          {copied ? 'Copied' : 'Copy SQL'}
        </button>
      </div>
      <textarea
        readOnly
        value={sql}
        rows={14}
        className="mt-4 w-full resize-y rounded-xl border border-white/10 bg-black/50 p-4 font-mono text-[11px] leading-relaxed text-emerald-100/90 outline-none"
        spellCheck={false}
      />
    </div>
  )
}
