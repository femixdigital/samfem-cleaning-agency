import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import samfemLogo from '../assets/samfem-logo.webp'

export default function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [checking, setChecking] = useState(true)
  const [alreadyAdmin, setAlreadyAdmin] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [resetMode, setResetMode] = useState(false)

  useEffect(() => {
    let active = true

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (!active) return

      if (data.session) {
        const { data: isAdmin } = await supabase.rpc('is_admin')

        if (active && isAdmin === true) {
          setAlreadyAdmin(true)
        }

        if (
          active &&
          new URLSearchParams(window.location.search).get('reset') === 'true'
        ) {
          setResetMode(true)
        }
      }

      if (active) setChecking(false)
    }

    void checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        setResetMode(true)
        setForgotMode(false)
        setError('')
        setMessage('')
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

      if (loginError) {
        setError('Invalid email or password.')
        return
      }

      const { data: isAdmin, error: adminError } =
        await supabase.rpc('is_admin')

      if (adminError || isAdmin !== true) {
        await supabase.auth.signOut()
        setError('This account is not authorized to access the admin dashboard.')
        return
      }

      navigate('/admin', { replace: true })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const redirectTo =
        `${window.location.origin}${import.meta.env.BASE_URL}admin/login?reset=true`

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo,
        })

      if (resetError) {
        setError(resetError.message)
        return
      }

      setMessage(
        'If an account exists for this email, a password-reset link has been sent. Please check your inbox and spam folder.',
      )
    } catch {
      setError('Unable to send the reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setError('')
    setMessage('')

    if (password.length < 8) {
      setError('Your new password must contain at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('The passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const { error: updateError } =
        await supabase.auth.updateUser({ password })

      if (updateError) {
        setError(updateError.message)
        return
      }

      await supabase.auth.signOut()

      setPassword('')
      setConfirmPassword('')
      setResetMode(false)
      setMessage('Your password has been updated. Please sign in with your new password.')

      navigate('/admin/login', { replace: true })
    } catch {
      setError('Unable to update your password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-600">Loading...</p>
      </div>
    )
  }

  if (alreadyAdmin && !resetMode) {
    return <Navigate to="/admin" replace />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src={samfemLogo}
            alt="SAMFEM Cleaning Agency"
            className="mx-auto h-20 w-auto max-w-[240px] object-contain"
          />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            SAMFEM Admin
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {resetMode
              ? 'Create a new administrator password.'
              : forgotMode
                ? 'Recover access to your administrator account.'
                : 'Sign in to manage cleaning enquiries.'}
          </p>
        </div>

        {resetMode ? (
          <form
            onSubmit={handlePasswordUpdate}
            className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div>
              <label htmlFor="new-password" className="mb-2 block text-sm font-semibold text-slate-700">
                New Password
              </label>

              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your new password"
                  className="w-full rounded-lg border border-slate-200 py-3 pl-3 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm New Password
              </label>

              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full rounded-lg border border-slate-200 py-3 pl-3 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600"
                >
                  {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Updating password...' : 'Update Password'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        ) : forgotMode ? (
          <form
            onSubmit={handleForgotPassword}
            className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div>
              <label htmlFor="reset-email" className="mb-2 block text-sm font-semibold text-slate-700">
                Administrator Email
              </label>

              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter administrator email"
                  className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {message && (
              <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
              {!loading && <ArrowRight size={18} />}
            </button>

            <button
              type="button"
              onClick={() => {
                setForgotMode(false)
                setError('')
                setMessage('')
              }}
              className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleLogin}
            className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div>
              <label htmlFor="admin-email" className="mb-2 block text-sm font-semibold text-slate-700">
                Administrator Email
              </label>

              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter administrator email"
                  className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-200 py-3 pl-3 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {message && (
              <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {message}
              </p>
            )}

            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setForgotMode(true)
                  setError('')
                  setMessage('')
                }}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={18} />}
            </button>

            <p className="text-center text-xs leading-5 text-slate-500">
              Authorized SAMFEM administrators only.
            </p>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-slate-400">
          SAMFEM Cleaning Agency
        </p>
      </div>
    </main>
  )
}
