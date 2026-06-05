import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Stethoscope, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signupSchema = loginSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type LoginFormData = z.infer<typeof loginSchema>
type SignupFormData = z.infer<typeof signupSchema>

export function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [, setResetSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp, resetPassword } = useAuth()

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true)
    setError('')
    try {
      await signIn(data.email, data.password)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (data: SignupFormData) => {
    setLoading(true)
    setError('')
    try {
      await signUp(data.email, data.password)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!resetEmail) return
    setLoading(true)
    setError('')
    setResetSuccess(false)
    try {
      await resetPassword(resetEmail)
      setResetSuccess(true)
      setError('Password reset link sent! Check your email.')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-0 px-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 page-enter">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 border border-blue-500/30 rounded-2xl mb-4 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <Stethoscope className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">TensPilot+</h1>
          <p className="text-slate-400 mt-1">Doctor Dashboard</p>
        </div>

        {/* Auth Card */}
        <div className="glass-card p-8 animate-scale-in">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {isSignUp ? (
            <form onSubmit={signupForm.handleSubmit(handleSignUp)} className="space-y-5">
              {/* ... signup form ... */}
              <div>
                <label htmlFor="signup-email" className="label text-slate-300">
                  Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  className="input bg-surface-2/50 border-glass-border focus:border-primary text-slate-200"
                  placeholder="doctor@clinic.com"
                  {...signupForm.register('email')}
                />
                {signupForm.formState.errors.email && (
                  <p className="error-text text-red-400 text-xs mt-1">{signupForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="signup-password" className="label text-slate-300">
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  className="input bg-surface-2/50 border-glass-border focus:border-primary text-slate-200"
                  placeholder="Create a password"
                  {...signupForm.register('password')}
                />
                {signupForm.formState.errors.password && (
                  <p className="error-text text-red-400 text-xs mt-1">{signupForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="signup-confirm" className="label text-slate-300">
                  Confirm Password
                </label>
                <input
                  id="signup-confirm"
                  type="password"
                  className="input bg-surface-2/50 border-glass-border focus:border-primary text-slate-200"
                  placeholder="Confirm your password"
                  {...signupForm.register('confirmPassword')}
                />
                {signupForm.formState.errors.confirmPassword && (
                  <p className="error-text text-red-400 text-xs mt-1">
                    {signupForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={cn('btn btn-primary w-full py-3 mt-2 shadow-lg shadow-blue-500/20', loading && 'opacity-50')}
              >
                {loading && <Loader2 className="w-4 h-4 spinner" />}
                Create Account
              </button>
            </form>
          ) : isForgotPassword ? (
            <div className="space-y-5">
              <p className="text-sm text-slate-300 mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <div>
                <label htmlFor="reset-email" className="label text-slate-300">
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="input bg-surface-2/50 border-glass-border focus:border-primary text-slate-200"
                  placeholder="doctor@clinic.com"
                />
              </div>
              <button
                onClick={handleForgotPassword}
                disabled={loading || !resetEmail}
                className={cn('btn btn-primary w-full py-3 mt-2 shadow-lg shadow-blue-500/20', loading && 'opacity-50')}
              >
                {loading && <Loader2 className="w-4 h-4 spinner" />}
                Send Reset Link
              </button>
            </div>
          ) : (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="label text-slate-300">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  className="input bg-surface-2/50 border-glass-border focus:border-primary text-slate-200"
                  placeholder="doctor@clinic.com"
                  {...loginForm.register('email')}
                />
                {loginForm.formState.errors.email && (
                  <p className="error-text text-red-400 text-xs mt-1">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className="label text-slate-300 mb-0">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true)
                      setError('')
                      setResetSuccess(false)
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  id="login-password"
                  type="password"
                  className="input mt-1 bg-surface-2/50 border-glass-border focus:border-primary text-slate-200"
                  placeholder="Enter your password"
                  {...loginForm.register('password')}
                />
                {loginForm.formState.errors.password && (
                  <p className="error-text text-red-400 text-xs mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={cn('btn btn-primary w-full py-3 mt-2 shadow-lg shadow-blue-500/20', loading && 'opacity-50')}
              >
                {loading && <Loader2 className="w-4 h-4 spinner" />}
                Sign In
              </button>
            </form>
          )}

          <div className="mt-8 text-center border-t border-white/5 pt-6 flex flex-col gap-3">
            {isForgotPassword ? (
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false)
                  setError('')
                  setResetSuccess(false)
                }}
                className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
              >
                Back to sign in
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                }}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-8">
          Secure healthcare professional portal
        </p>
      </div>
    </div>
  )
}
