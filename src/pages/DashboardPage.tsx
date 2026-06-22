import { useState, useEffect } from 'react'
import { Users, Activity, TrendingDown, Target, UserPlus, FileText, Sparkles, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import type { DashboardStats, PatientWithStats } from '@/lib/types'
import { useDoctorData } from '@/hooks/useDoctorData'
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { cn } from '@/lib/utils'
import { InvitePatientModal } from '@/components/InvitePatientModal'
import { ClinicalIntelligencePanel } from '@/components/ClinicalIntelligencePanel'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fadeSlideUp, staggerContainer } from '@/lib/design-system/animations'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  color: 'blue' | 'emerald' | 'amber' | 'purple'
  suffix?: string
}

function StatCard({ title, value, icon: Icon, color, suffix }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/15 text-blue-400',
    emerald: 'bg-emerald-500/15 text-emerald-400',
    amber: 'bg-amber-500/15 text-amber-400',
    purple: 'bg-purple-500/15 text-purple-400',
  }

  const beforeClasses = {
    blue: 'stat-card-blue',
    emerald: 'stat-card-emerald',
    amber: 'stat-card-amber',
    purple: 'stat-card-blue', // fallback
  }

  return (
    <div className={cn("glass-card stat-card p-6", beforeClasses[color])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-100">
            {value}
            {suffix && <span className="text-lg font-normal text-slate-500">{suffix}</span>}
          </p>
        </div>
        <div className={cn('p-3 rounded-xl', colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

interface DashboardAlert {
  id: string
  riskLevel: string
  message: string
  aiResponse: string
  patientId: string
  status: string
  doctorId: string
  timestamp?: unknown // firestore timestamp
}

export function DashboardPage() {
  const { doctor } = useAuth()
  const navigate = useNavigate()
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentPatients, setRecentPatients] = useState<PatientWithStats[]>([])
  const [weeklyActivity, setWeeklyActivity] = useState<{ day: string; sessions: number }[]>([])
  const [loadingPhase, setLoadingPhase] = useState('Initializing...')
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState<DashboardAlert[]>([])

  useEffect(() => {
    if (!doctor) return
    const qAlerts = query(
      collection(db, 'alerts'),
      where('doctorId', '==', doctor.id),
      where('status', '==', 'unread')
    )
    const unsubscribe = onSnapshot(qAlerts, (snapshot) => {
      setAlerts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DashboardAlert)))
    })
    return () => unsubscribe()
  }, [doctor])

  const handleDismissAlert = async (alertId: string) => {
    try {
      await updateDoc(doc(db, 'alerts', alertId), { status: 'read' })
    } catch (e) {
      console.error(e)
    }
  }

  const { patients, allSessions, loading: dataLoading } = useDoctorData(doctor?.id)

  useEffect(() => {
    if (!dataLoading && patients.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true)
      setProgress(10)
      setLoadingPhase('Processing real-time data...')

      setProgress(60)
      
      setProgress(75)
      setLoadingPhase('Calculating weekly trends...')
      
      // Sort by last session desc
      const sortedDocs = [...patients].sort((a, b) => 
        (b.lastSessionDate?.getTime() || 0) - (a.lastSessionDate?.getTime() || 0)
      )
      setRecentPatients(sortedDocs.slice(0, 4))

      // Calculate weekly activity
      const oneWeekAgo = new Date()
      oneWeekAgo.setHours(0,0,0,0)
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 6) // last 7 days including today
      
      const activityMap = new Map<string, number>()
      for(let i=6; i>=0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
          activityMap.set(dayName, 0)
      }

      allSessions.forEach(session => {
        if (session.timestamp >= oneWeekAgo) {
          const dayName = session.timestamp.toLocaleDateString('en-US', { weekday: 'short' })
          if (activityMap.has(dayName)) {
            activityMap.set(dayName, activityMap.get(dayName)! + 1)
          }
        }
      })

      const activityArray = Array.from(activityMap.entries()).map(([day, count]) => ({
        day,
        sessions: count
      }))
      setWeeklyActivity(activityArray)

      // Calculate Stats
      const statsObj: DashboardStats = {
        totalPatients: patients.length,
        complianceRate: Math.round((patients.filter(p => p.lastSessionDate && p.lastSessionDate >= oneWeekAgo).length / (patients.length || 1)) * 100),
        averagePainRelief: patients.reduce((acc, p) => acc + (p.avgPainRelief || 0), 0) / (patients.length || 1),
        activeSessionsThisWeek: allSessions.filter(s => s.timestamp >= oneWeekAgo).length
      }
      setStats(statsObj)

      setProgress(100)
      setTimeout(() => setLoading(false), 300)
    } else if (!dataLoading && patients.length === 0) {
      setLoading(false)
      setStats({
        totalPatients: 0,
        complianceRate: 0,
        averagePainRelief: 0,
        activeSessionsThisWeek: 0
      })
    }
  }, [patients, allSessions, dataLoading])

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex flex-col items-center justify-center min-h-[50vh] space-y-6 animate-fade-in">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full spinner"></div>
        <div className="w-full max-w-md space-y-2">
          <div className="flex justify-between text-sm text-slate-400 font-medium animate-pulse">
            <span>{loadingPhase}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  // Sort alerts by urgency (high > medium > low) and then by date
  const sortedAlerts = [...alerts].sort((a, b) => {
    const riskWeight = { high: 3, medium: 2, low: 1 } as Record<string, number>;
    const weightA = riskWeight[a.riskLevel] || 0;
    const weightB = riskWeight[b.riskLevel] || 0;
    if (weightA !== weightB) return weightB - weightA;
    
    // Fallback to timestamp if available
    if (a.timestamp && b.timestamp) {
      const timeA = (a.timestamp as { seconds: number }).seconds || 0;
      const timeB = (b.timestamp as { seconds: number }).seconds || 0;
      return timeB - timeA;
    }
    return 0;
  });

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">
          Welcome back, <span className="gradient-text">{doctor?.name}</span>
        </h1>
        <p className="text-slate-400 mt-1">
          Monitor your patients&apos; TENS therapy progress
        </p>
      </div>

      <ClinicalIntelligencePanel patients={recentPatients} />

      {/* Stats Grid */}
      <motion.div variants={fadeSlideUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Patients"
          value={stats?.totalPatients || 0}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Sessions This Week"
          value={stats?.activeSessionsThisWeek || 0}
          icon={Activity}
          color="emerald"
        />
        <StatCard
          title="Avg Pain Relief"
          value={stats?.averagePainRelief?.toFixed(1) || '0.0'}
          icon={TrendingDown}
          color="amber"
          suffix=" pts"
        />
        <StatCard
          title="Compliance Rate"
          value={stats?.complianceRate || 0}
          icon={Target}
          color="purple"
          suffix="%"
        />
      </motion.div>

      {/* AI Smart Alerts */}
      <motion.div variants={fadeSlideUp} className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/15 rounded-lg text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-100">Smart Alerts & Insights</h2>
          </div>
          {alerts.length > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm animate-pulse">
              {alerts.length} New
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.length === 0 ? (
            <div className="col-span-2 p-6 text-center text-slate-400 text-sm border border-white/5 rounded-xl bg-white/5">
              No new alerts. AI is monitoring patients.
            </div>
          ) : (
            sortedAlerts.map(alert => {
              const isHigh = alert.riskLevel === 'high' || alert.riskLevel === 'critical';
              const isMedium = alert.riskLevel === 'medium';
              return (
              <div key={alert.id} className={cn("p-4 border rounded-xl flex items-start gap-4", 
                isHigh ? "bg-red-500/10 border-red-500/20" : isMedium ? "bg-amber-500/10 border-amber-500/20" : "bg-blue-500/10 border-blue-500/20"
              )}>
                <AlertTriangle className={cn("w-5 h-5 shrink-0 mt-0.5", isHigh ? "text-red-400" : isMedium ? "text-amber-400" : "text-blue-400")} />
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className={cn("font-medium", isHigh ? "text-red-400" : isMedium ? "text-amber-400" : "text-blue-400")}>
                      {isHigh ? 'Critical Alert' : isMedium ? 'Warning' : 'Notice'}
                    </h3>
                    <button 
                      onClick={() => handleDismissAlert(alert.id)}
                      className="text-xs text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2 py-1 rounded"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p className="text-sm text-slate-300 mt-2 italic border-l-2 border-white/10 pl-2">
                    "{alert.message}"
                  </p>
                  <p className="text-xs text-slate-400 mt-3 bg-black/20 p-2 rounded">
                    <span className="font-medium text-purple-400">AI Response:</span> {alert.aiResponse}
                  </p>
                  <div className="mt-4 flex gap-4">
                    <button 
                      onClick={() => navigate(`/patients/${alert.patientId}`)}
                      className={cn("text-xs font-medium transition-colors hover:underline", alert.riskLevel === 'high' ? "text-red-300 hover:text-red-200" : "text-amber-300 hover:text-amber-200")}
                    >
                      Patient Profile →
                    </button>
                    <button 
                      onClick={() => navigate('/messages')}
                      className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors hover:underline"
                    >
                      Message Patient
                    </button>
                  </div>
                </div>
              </div>
            )})
          )}
        </div>
      </motion.div>

      <motion.div variants={fadeSlideUp} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 glass-card p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Weekly Session Activity</h2>
        <div style={{ width: '100%', minHeight: 256, height: 256 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                    color: '#f1f5f9'
                  }}
                />
              <Bar dataKey="sessions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
            <button
              onClick={() => setInviteModalOpen(true)}
              className="glass-card glass-card-hover p-6 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/15 rounded-xl group-hover:bg-blue-500/25 transition-colors">
                  <UserPlus className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-100">Invite Patient</h3>
                  <p className="text-sm text-slate-400">Generate access code</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/reports')}
              className="glass-card glass-card-hover p-6 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/15 rounded-xl group-hover:bg-amber-500/25 transition-colors">
                  <FileText className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-100">Generate Report</h3>
                  <p className="text-sm text-slate-400">Create PDF report</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Patients */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-100">Recent Patients</h2>
            <button 
              onClick={() => navigate('/patients')}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View All
            </button>
          </div>
          <div className="glass-card overflow-hidden">
            <div className="divide-y divide-white/5">
              {recentPatients.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">
                  No patients linked yet
                </div>
              ) : (
                recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => navigate(`/patients/${patient.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/15 border border-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-400">
                          {patient.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">{patient.name}</p>
                        <p className="text-xs text-slate-400">{patient.condition || 'No condition set'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-200">
                        {patient.lastSessionDate ? new Date(patient.lastSessionDate).toLocaleDateString() : '—'}
                      </p>
                      <p className="text-xs text-slate-500">{patient.totalSessions} sessions</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Invite Modal */}
      <InvitePatientModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />
    </motion.div>
  )
}
