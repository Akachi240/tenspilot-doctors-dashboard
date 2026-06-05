import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Stethoscope, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  specialty: z.string().min(2, 'Please select or enter a specialty'),
})

type ProfileFormData = z.infer<typeof profileSchema>

const specialties = [
  'Physiotherapy',
  'Neurology',
  'Pain Management',
  'Sports Medicine',
  'Orthopedics',
  'Rehabilitation',
  'General Practice',
  'Other',
]

export function CreateProfilePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { createDoctorProfile, logout, user } = useAuth()

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      specialty: '',
    },
  })

  const handleSubmit = async (data: ProfileFormData) => {
    setLoading(true)
    setError('')
    try {
      await createDoctorProfile(data.name, data.specialty)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create profile'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-0 px-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 page-enter">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 border border-blue-500/30 rounded-2xl mb-4 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <Stethoscope className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Complete Your Profile</h1>
          <p className="text-slate-400 mt-1">Tell us a bit about yourself</p>
        </div>

        {/* Profile Card */}
        <div className="glass-card p-8 animate-scale-in">
          <div className="text-sm text-slate-400 mb-6 bg-surface-2/50 p-3 rounded-lg border border-white/5 text-center">
            Signed in as <span className="font-medium text-slate-200">{user?.email}</span>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <div>
              <label htmlFor="name" className="label text-slate-300">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="input bg-surface-2/50 border-glass-border focus:border-primary text-slate-200"
                placeholder="Dr. Jane Smith"
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="error-text text-red-400 text-xs mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="specialty" className="label text-slate-300">
                Specialty
              </label>
              <select
                id="specialty"
                className="input bg-surface-2/50 border-glass-border focus:border-primary text-slate-200"
                {...form.register('specialty')}
              >
                <option value="" className="bg-surface-2 text-slate-400">Select a specialty</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty} className="bg-surface-2 text-slate-200">
                    {specialty}
                  </option>
                ))}
              </select>
              {form.formState.errors.specialty && (
                <p className="error-text text-red-400 text-xs mt-1">{form.formState.errors.specialty.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn('btn btn-primary w-full py-3 mt-4 shadow-lg shadow-blue-500/20', loading && 'opacity-50')}
            >
              {loading && <Loader2 className="w-4 h-4 spinner" />}
              Continue to Dashboard
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <button
              type="button"
              onClick={logout}
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
