import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type AuthStatus = 'loading' | 'authorized' | 'unauthorized'

export default function AdminProtectedRoute() {
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    let active = true

    const checkAdmin = async (session: Awaited<
      ReturnType<typeof supabase.auth.getSession>
    >['data']['session']) => {
      if (!session) {
        if (active) setStatus('unauthorized')
        return
      }

      const { data, error } = await supabase.rpc('is_admin')

      if (!active) return

      setStatus(!error && data === true ? 'authorized' : 'unauthorized')
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        if (active) setStatus('unauthorized')
        return
      }

      void checkAdmin(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setStatus('loading')

        setTimeout(() => {
          void checkAdmin(session)
        }, 0)
      }
    )

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-600">
          Verifying administrator access...
        </p>
      </div>
    )
  }

  if (status === 'unauthorized') {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
