'use client'

import { useActionState } from 'react'

import { loginAction } from '@/lib/admin/actions'

export default function LoginForm({ secret }: { secret: string }) {
  const [state, formAction, pending] = useActionState(loginAction.bind(null, secret), undefined)

  return (
    <div className="min-h-[calc(100vh-1px)] flex items-center justify-center px-6 py-24 bg-[#0c0c10]">
      <div className="w-full max-w-md">
        <div
          className="rounded-[28px] border p-8 md:p-10 shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
          style={{
            borderColor: 'rgba(255,255,255,0.10)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          }}
        >
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="font-sans text-[11px] tracking-[0.22em] uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Private panel
              </p>
              <h1 className="font-display font-black text-2xl md:text-3xl mt-2 tracking-tight text-white">Enter studio</h1>
            </div>
            <img src="/dark-logo.png" alt="" className="h-10 w-auto opacity-90" aria-hidden />
          </div>

          <p className="mt-6 font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.48)' }}>
            This route is hidden from public navigation. Sign in to manage projects stored in your database.
          </p>

          <form action={formAction} className="mt-10 space-y-5">
            <label className="block">
              <span className="font-sans text-[11px] tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.42)' }}>
                Password
              </span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={pending}
                className="mt-3 w-full rounded-2xl border bg-black/30 px-5 py-4 font-sans text-[15px] text-white outline-none transition-[border-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] focus:border-[var(--coral)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--coral)_35%,transparent)]"
                style={{ borderColor: 'rgba(255,255,255,0.14)' }}
                placeholder="••••••••"
              />
            </label>

            {state?.error ? (
              <p className="font-sans text-sm text-red-300/90">
                {state.error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-[var(--coral)] px-6 py-4 font-display font-semibold text-sm text-white shadow-[0_16px_50px_rgba(255,122,89,0.22)] transition-[transform,opacity] duration-500 ease-[var(--ease-out-expo)] hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
            >
              {pending ? 'Signing in…' : 'Continue'}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center font-sans text-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>
          Session stays on this device for seven days.
        </p>
      </div>
    </div>
  )
}
