'use client'

import { useActionState } from 'react'

import { loginAction } from '@/lib/admin/actions'

export default function LoginForm({ secret }: { secret: string }) {
  const [state, formAction, pending] = useActionState(loginAction.bind(null, secret), undefined)

  return (
    <div className="flex min-h-[calc(100vh-1px)] items-center justify-center bg-[var(--background)] px-6 py-24">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.4] mix-blend-multiply"
        style={{
          backgroundImage: `radial-gradient(ellipse 100% 70% at 50% -20%, color-mix(in srgb, var(--coral) 16%, transparent), transparent 55%)`,
        }}
        aria-hidden
      />
      <div className="relative w-full max-w-md">
        <div className="cin-panel rounded-[28px] p-8 shadow-[0_32px_100px_rgba(0,0,0,0.08)] md:p-10">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[color-mix(in_srgb,var(--lavender)_88%,transparent)]">Private panel</p>
              <h1 className="mt-2 font-display text-2xl font-black tracking-tight text-[var(--foreground)] md:text-3xl">Enter studio</h1>
            </div>
            <img src="/dark-logo.png" alt="" className="h-10 w-auto opacity-90" aria-hidden />
          </div>

          <p className="mt-6 font-sans text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_52%,var(--lavender))]">
            This route is hidden from public navigation. Sign in to manage portfolio and blog content.
          </p>

          <form action={formAction} className="mt-10 space-y-5">
            <label className="block">
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--foreground)_45%,var(--lavender))]">
                Password
              </span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={pending}
                className="mt-3 w-full rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-4 font-sans text-[15px] text-[var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] outline-none transition-[border-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] focus:border-[color-mix(in_srgb,var(--coral)_45%,var(--border-strong))] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--coral)_22%,transparent)]"
                placeholder="••••••••"
              />
            </label>

            {state?.error ? <p className="font-sans text-sm text-red-700">{state.error}</p> : null}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-[var(--coral)] px-6 py-4 font-display text-sm font-semibold text-white shadow-[0_16px_50px_rgba(255,122,89,0.22)] transition-[transform,opacity] duration-500 ease-[var(--ease-out-expo)] hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
            >
              {pending ? 'Signing in…' : 'Continue'}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center font-sans text-xs text-[color-mix(in_srgb,var(--lavender)_90%,transparent)]">Session stays on this device for seven days.</p>
      </div>
    </div>
  )
}
