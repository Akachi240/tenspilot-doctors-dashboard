import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Stethoscope,
  UserPlus,
  MessageSquare,
  PhoneCall
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { InvitePatientModal } from '@/components/InvitePatientModal'
import { TelehealthModal } from '@/components/TelehealthModal'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function DashboardLayout() {
  const { doctor, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [incomingCall, setIncomingCall] = useState<Record<string, unknown> | null>(null)
  const [callModalOpen, setCallModalOpen] = useState(false)
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0)

  useEffect(() => {
    if (!doctor) return

    const q = query(
      collection(db, 'consultations'),
      where('doctorId', '==', doctor.id),
      where('status', '==', 'ringing')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setIncomingCall(snapshot.docs[0].data() as Record<string, unknown>)
      } else {
        setIncomingCall((prev) => {
          if (prev && !callModalOpen) {
            return null
          }
          return prev
        })
      }
    })

    const qAlerts = query(
      collection(db, 'alerts'),
      where('doctorId', '==', doctor.id),
      where('status', '==', 'unread')
    )

    const unsubscribeAlerts = onSnapshot(qAlerts, (snapshot) => {
      setUnreadAlertsCount(snapshot.size)
    })

    return () => {
      unsubscribe()
      unsubscribeAlerts()
    }
  }, [doctor, callModalOpen])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-surface-0 overflow-x-hidden">
      {/* Decorative background blobs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface-1/80 backdrop-blur-md border-b border-white/5 z-40 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg text-slate-400 hover:bg-white/5 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-blue-400" />
          </div>
          <span className="font-semibold text-slate-100">TensPilot+</span>
        </div>
        <div className="w-10" />
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-surface-1/90 backdrop-blur-xl border-r border-white/5 z-50 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          'lg:translate-x-0 lg:bg-surface-1/50 lg:backdrop-blur-2xl lg:shadow-[4px_0_24px_rgba(0,0,0,0.2)]',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Stethoscope className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-semibold text-slate-100 tracking-tight">TensPilot+</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor Info */}
        <div className="p-4 border-b border-white/5 bg-surface-2/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/15 border border-blue-500/20 rounded-full flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-blue-400">
                {doctor?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'DR'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-medium text-slate-100 truncate">Dr. {doctor?.name}</p>
              <p className="text-xs text-slate-400 truncate">{doctor?.specialty || 'General'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 16rem)' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'sidebar-link active'
                    : 'sidebar-link'
                )
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 shrink-0" />
                {item.label}
              </div>
              {item.to === '/dashboard' && unreadAlertsCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </NavLink>
          ))}

          {/* Invite Patient Button */}
          <div className="pt-4 mt-4 border-t border-white/5">
            <button
              onClick={() => {
                setSidebarOpen(false)
                setInviteModalOpen(true)
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 transition-colors group"
            >
              <div className="p-1.5 bg-blue-500/10 rounded-md group-hover:bg-blue-500/20 transition-colors">
                <UserPlus className="w-4 h-4" />
              </div>
              Invite Patient
            </button>
          </div>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-surface-1/80 backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen relative z-10">
        
        {/* Incoming Call Banner */}
        {incomingCall && !callModalOpen && (
          <div className="absolute top-4 left-4 right-4 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-md bg-blue-600/90 backdrop-blur-lg border border-blue-400/30 rounded-xl p-4 shadow-2xl z-50 flex items-center justify-between animate-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <PhoneCall className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Incoming Video Call</h3>
                <p className="text-blue-100 text-sm">Patient is waiting...</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setCallModalOpen(true)
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        )}

        <Outlet />
      </main>

      {/* Invite Patient Modal */}
      <InvitePatientModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />

      {/* Incoming Telehealth Modal */}
      {incomingCall?.patientId && (
        <TelehealthModal
          isOpen={callModalOpen}
          onClose={() => {
            setCallModalOpen(false)
            setIncomingCall(null)
          }}
          patientId={incomingCall.patientId as string}
          patientName="Patient"
          doctorId={doctor?.id || ''}
          isIncoming={true}
        />
      )}
    </div>
  )
}
