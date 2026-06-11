import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  User,
  Lock,
  Bell,
  Trash2,
  Loader2,
  LogOut,
  AlertTriangle,
  Check,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  specialty: z.string().min(2, 'Please enter a specialty'),
  phone: z.string().optional(),
  clinic: z.string().optional(),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

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

export function SettingsPage() {
  const { doctor, updateDoctorProfile, changePassword, deleteAccount, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'password' | 'danger'>('profile')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  // Notification settings
  const [notifications, setNotifications] = useState(doctor?.notifications || {
    emailAlerts: true,
    weeklyDigest: true,
    patientActivity: false,
    complianceAlerts: true,
  })
  
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: doctor?.name || '',
      specialty: doctor?.specialty || '',
      phone: doctor?.phone || '',
      clinic: doctor?.clinic || '',
    },
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '', newPassword: '', confirmPassword: ''
    }
  })

  const [prevDoctorId, setPrevDoctorId] = useState(doctor?.id)
  
  if (doctor?.id !== prevDoctorId) {
    setPrevDoctorId(doctor?.id)
    if (doctor?.notifications) {
      setNotifications(doctor.notifications)
    }
  }

  useEffect(() => {
    if (doctor) {
      profileForm.reset({
        name: doctor.name || '',
        specialty: doctor.specialty || '',
        phone: doctor.phone || '',
        clinic: doctor.clinic || '',
      })
    }
  }, [doctor, profileForm])

  const handleProfileUpdate = async (data: ProfileFormData) => {
    setProfileLoading(true)
    setProfileSuccess(false)
    setProfileError('')
    try {
      await updateDoctorProfile(data)
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordUpdate = async (data: PasswordFormData) => {
    setPasswordLoading(true)
    setPasswordSuccess(false)
    setPasswordError('')
    try {
      await changePassword(data.currentPassword, data.newPassword)
      setPasswordSuccess(true)
      passwordForm.reset()
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleNotificationChange = async (key: keyof typeof notifications) => {
    const newNotifications = {
      ...notifications,
      [key]: !notifications[key],
    }
    setNotifications(newNotifications)
    await updateDoctorProfile({ notifications: newNotifications })
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    try {
      await deleteAccount()
    } catch (err) {
      console.error(err)
      setDeleteLoading(false)
      setDeleteModalOpen(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'danger', label: 'Danger Zone', icon: Trash2 },
  ] as const

  return (
    <div className="p-6 lg:p-8 page-enter">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-blue-500/15 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
                  tab.id === 'danger' && activeTab === tab.id && 'bg-red-500/15 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]',
                  tab.id === 'danger' && activeTab !== tab.id && 'text-red-400 hover:bg-red-500/10'
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}

            <hr className="my-4 border-white/10" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </nav>

          {/* Account Info Card */}
          <div className="mt-6 p-4 glass-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-400">
                  {doctor?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'Dr'}
                </span>
              </div>
              <div>
                <p className="font-medium text-slate-100 text-sm">{doctor?.name}</p>
                <p className="text-xs text-slate-400 truncate max-w-[150px]">{doctor?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="glass-card p-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-slate-100 mb-6">
                Profile Information
              </h2>

              {profileSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Profile updated successfully
                </div>
              )}
              
              {profileError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {profileError}
                </div>
              )}

              <form
                onSubmit={profileForm.handleSubmit(handleProfileUpdate)}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="profile-name" className="label text-slate-300">
                      Full Name
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      className="input bg-surface-2/50 border-glass-border focus:border-primary text-slate-200"
                      {...profileForm.register('name')}
                    />
                    {profileForm.formState.errors.name && (
                      <p className="error-text text-red-400 text-xs mt-1">
                        {profileForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="profile-specialty" className="label text-slate-300">
                      Specialty
                    </label>
                    <select
                      id="profile-specialty"
                      className="input bg-surface-2/50 border-glass-border focus:border-primary text-slate-200"
                      {...profileForm.register('specialty')}
                    >
                      <option value="" className="bg-surface-2 text-slate-200">Select a specialty</option>
                      {specialties.map((specialty) => (
                        <option key={specialty} value={specialty} className="bg-surface-2 text-slate-200">
                          {specialty}
                        </option>
                      ))}
                    </select>
                    {profileForm.formState.errors.specialty && (
                      <p className="error-text text-red-400 text-xs mt-1">
                        {profileForm.formState.errors.specialty.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="profile-phone" className="label text-slate-300">
                      Phone
                    </label>
                    <input
                      id="profile-phone"
                      type="tel"
                      className="input bg-surface-2/50 border-glass-border focus:border-primary text-slate-200"
                      placeholder="+1 (555) 123-4567"
                      {...profileForm.register('phone')}
                    />
                  </div>

                  <div>
                    <label htmlFor="profile-clinic" className="label text-slate-300">
                      Clinic / Hospital
                    </label>
                    <input
                      id="profile-clinic"
                      type="text"
                      className="input bg-surface-2/50 border-glass-border focus:border-primary text-slate-200"
                      placeholder="Clinic or Hospital name"
                      {...profileForm.register('clinic')}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className={cn('btn btn-primary', profileLoading && 'opacity-50')}
                  >
                    {profileLoading && <Loader2 className="w-4 h-4 spinner" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="glass-card p-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-slate-100 mb-6">
                Notification Preferences
              </h2>

              <div className="space-y-4">
                {[
                  { key: 'emailAlerts', label: 'Email Alerts', description: 'Receive important updates via email' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Get a weekly summary of patient activity' },
                  { key: 'patientActivity', label: 'Patient Activity', description: 'Notify when patients complete sessions' },
                  { key: 'complianceAlerts', label: 'Compliance Alerts', description: 'Alert when patient compliance drops below threshold' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-surface-2/30 rounded-lg border border-glass-border">
                    <div>
                      <p className="font-medium text-slate-200">{item.label}</p>
                      <p className="text-sm text-slate-400">{item.description}</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(item.key as keyof typeof notifications)}
                      className={cn(
                        'relative w-11 h-6 rounded-full transition-colors',
                        notifications[item.key as keyof typeof notifications]
                          ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                          : 'bg-surface-3'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform',
                          notifications[item.key as keyof typeof notifications] && 'translate-x-5'
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="glass-card p-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-slate-100 mb-6">Change Password</h2>

              {passwordSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Password updated successfully
                </div>
              )}
              
              {passwordError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {passwordError}
                </div>
              )}

              <form
                onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)}
                className="space-y-5 max-w-md"
              >
                <div>
                  <label htmlFor="current-password" className="label text-slate-300">
                    Current Password
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    className="input bg-surface-2/50 border-glass-border focus:border-primary text-slate-200"
                    {...passwordForm.register('currentPassword')}
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="error-text text-red-400 text-xs mt-1">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="new-password" className="label text-slate-300">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    className="input bg-surface-2/50 border-glass-border focus:border-primary text-slate-200"
                    {...passwordForm.register('newPassword')}
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="error-text text-red-400 text-xs mt-1">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirm-password" className="label text-slate-300">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    className="input bg-surface-2/50 border-glass-border focus:border-primary text-slate-200"
                    {...passwordForm.register('confirmPassword')}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="error-text text-red-400 text-xs mt-1">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className={cn('btn btn-primary', passwordLoading && 'opacity-50')}
                  >
                    {passwordLoading && <Loader2 className="w-4 h-4 spinner" />}
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <div className="glass-card p-6 border-red-500/20 animate-fade-in">
              <h2 className="text-lg font-semibold text-red-400 mb-6">Danger Zone</h2>

              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-medium text-red-300">Delete Account</h3>
                    <p className="text-sm text-red-400/80 mt-1">
                      Permanently delete your account and all associated data. This action
                      cannot be undone.
                    </p>
                    <button
                      onClick={() => setDeleteModalOpen(true)}
                      className="btn btn-danger mt-5"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteModalOpen(false)}
          />
          <div className="relative glass-card shadow-2xl w-full max-w-md p-6 animate-scale-in bg-surface-1 border-glass-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-500/20 rounded-full border border-red-500/30">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-100">Delete Account</h2>
                <p className="text-sm text-slate-400">This action is irreversible</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-6 bg-surface-2 p-3 rounded-md border border-white/5">
              Are you sure you want to delete your account? All your data, patient links, 
              and history will be permanently erased.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="btn btn-secondary flex-1"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="btn btn-danger flex-1"
                disabled={deleteLoading}
              >
                {deleteLoading ? <Loader2 className="w-4 h-4 spinner" /> : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
