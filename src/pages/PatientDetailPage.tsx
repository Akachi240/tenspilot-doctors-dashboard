import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Activity,
  TrendingDown,
  Award,
  Target,
  UserX,
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar,
  Mail,
  MessageSquare,
  Video,
  Sparkles,
  Pill,
  Stethoscope,
  Clock,
  Settings2,
  X,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { PatientWithStats, Session } from '@/lib/types'
import { usePatientDetail } from '@/hooks/usePatientDetail'
import {
  cn,
  formatDate,
  getModeEmoji,
} from '@/lib/utils'
import { SessionNotesModal } from '@/components/SessionNotesModal'
import { UnlinkPatientModal } from '@/components/UnlinkPatientModal'
import { TelehealthModal } from '@/components/TelehealthModal'
import { AIPatientSummary } from '@/components/AIPatientSummary'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { fadeSlideUp, staggerContainer } from '@/lib/design-system/animations'
import { addDoc, collection, serverTimestamp, setDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

type TimeRange = '7' | '30' | '90'

export function PatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>()
  const navigate = useNavigate()
  const { doctor } = useAuth()
  const { patient, sessions, painLogs, loading } = usePatientDetail(patientId);

  const [timeRange, setTimeRange] = useState<TimeRange>('7')
  const [modeFilter, setModeFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [notesModalOpen, setNotesModalOpen] = useState(false)
  const [unlinkModalOpen, setUnlinkModalOpen] = useState(false)
  const [telehealthModalOpen, setTelehealthModalOpen] = useState(false)
  const [prescribeModalOpen, setPrescribeModalOpen] = useState(false)
  const [prescriptionText, setPrescriptionText] = useState('')

  const sessionsPerPage = 5

  const stats = useMemo(() => {
    if (sessions.length === 0) return { totalSessions: 0, avgRelief: 0, bestRelief: 0, complianceRate: 0 }
    
    const reliefs = sessions.map((s) => Math.max(0, s.painBefore - s.painAfter))
    const avgRelief = reliefs.reduce((a, b) => a + b, 0) / reliefs.length
    const bestRelief = Math.max(...reliefs)
    const complianceRate = Math.min(100, Math.round((sessions.length / 10) * 100))

    return {
      totalSessions: sessions.length,
      avgRelief: Math.round(avgRelief * 10) / 10,
      bestRelief,
      complianceRate,
    }
  }, [sessions])

  const trendData = useMemo(() => {
    const days = parseInt(timeRange, 10)
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)

    const filtered = sessions
      .filter(s => s.timestamp >= cutoff)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

    const grouped = new Map<string, { before: number; after: number; count: number }>()
    
    filtered.forEach(s => {
      const dateStr = s.timestamp.toISOString().split('T')[0]
      if (!grouped.has(dateStr)) {
        grouped.set(dateStr, { before: 0, after: 0, count: 0 })
      }
      const g = grouped.get(dateStr)!
      g.before += s.painBefore
      g.after += s.painAfter
      g.count += 1
    })

    return Array.from(grouped.entries()).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      before: Math.round((data.before / data.count) * 10) / 10,
      after: Math.round((data.after / data.count) * 10) / 10,
    }))
  }, [sessions, timeRange])

  const { paginatedSessions, totalPages } = useMemo(() => {
    let filtered = [...sessions]
    if (modeFilter !== 'all') {
      filtered = filtered.filter((s) => s.modeId === modeFilter || s.modeName.toLowerCase().includes(modeFilter))
    }
    const totalPages = Math.max(1, Math.ceil(filtered.length / sessionsPerPage))
    const start = (currentPage - 1) * sessionsPerPage
    const paginatedSessions = filtered.slice(start, start + sessionsPerPage)
    return { paginatedSessions, totalPages }
  }, [sessions, modeFilter, currentPage])

  const uniqueModes = useMemo(() => {
    const modes = new Set(sessions.map((s) => s.modeId || 'general'))
    return Array.from(modes)
  }, [sessions])

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full spinner"></div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="p-6 lg:p-8">
        <button
          onClick={() => navigate('/patients')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Patients
        </button>
        <div className="glass-card p-12 text-center">
          <p className="text-slate-400">Patient not found</p>
        </div>
      </div>
    )
  }

  const isActive = sessions.length > 0 && 
    (new Date().getTime() - sessions[0].timestamp.getTime()) < 30 * 24 * 60 * 60 * 1000

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="p-6 lg:p-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate('/patients')}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Patients
          </button>
          <div className="flex items-center gap-4 animate-slide-right">
            <div className="w-16 h-16 bg-blue-500/15 border border-blue-500/20 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/10">
              <span className="text-xl font-semibold text-blue-400">
                {patient.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">{patient.name}</h1>
              <p className="text-slate-400">{patient.condition || 'No condition set'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  'inline-block w-2 h-2 rounded-full shadow-sm',
                  isActive ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-slate-500'
                )} />
                <span className="text-sm text-slate-400">{isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/messages')}
            className="btn bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            Message
          </button>
          <button
            onClick={() => setPrescribeModalOpen(true)}
            className="btn bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          >
            <Settings2 className="w-4 h-4" />
            Prescribe Adjustment
          </button>
          <button
            onClick={() => setTelehealthModalOpen(true)}
            className="btn bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
          >
            <Video className="w-4 h-4" />
            Video Consult
          </button>
          <button
            onClick={() => setUnlinkModalOpen(true)}
            className="btn bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
          >
            <UserX className="w-4 h-4" />
            Unlink
          </button>
        </div>
      </div>

      <motion.div variants={fadeSlideUp}>
        <AIPatientSummary patient={{ ...patient, sessions, totalSessions: stats.totalSessions, avgPainRelief: stats.avgRelief, lastSessionDate: sessions[0]?.timestamp }} />
      </motion.div>

      <motion.div variants={fadeSlideUp} className="glass-card p-6 mb-8 border-l-4 border-l-purple-500">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-500/15 rounded-lg text-purple-400 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-purple-400 mb-1">AI Patient Insight</h3>
            <p className="text-sm text-slate-300">
              {sessions.length > 0 ? (
                <>{patient.name} has completed {sessions.length} session{sessions.length !== 1 ? 's' : ''} with an average pain relief of {stats.avgRelief} points. 
                {stats.avgRelief >= 3 
                  ? ' Pain relief trends are excellent. Consider adjusting the therapy schedule to a lower frequency if progress continues.' 
                  : stats.avgRelief >= 1 
                    ? ' Moderate improvement observed. Consider reviewing electrode placement and intensity settings.' 
                    : ' Minimal relief observed. Evaluate protocol compliance or consider a different modality.'}
                </>
              ) : (
                'Insufficient data to generate insights. Waiting for patient to complete more sessions.'
              )}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div variants={fadeSlideUp} className="glass-card p-6 border-t-2 border-t-blue-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-slate-400">Total Sessions</h3>
          </div>
          <p className="text-3xl font-bold text-slate-100">{stats.totalSessions}</p>
        </motion.div>

        <motion.div variants={fadeSlideUp} className="glass-card p-6 border-t-2 border-t-emerald-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-slate-400">Avg Pain Relief</h3>
          </div>
          <p className="text-3xl font-bold text-slate-100">{stats.avgRelief} <span className="text-sm font-normal text-slate-500">pts</span></p>
        </motion.div>

        <motion.div variants={fadeSlideUp} className="glass-card p-6 border-t-2 border-t-amber-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-slate-400">Best Relief</h3>
          </div>
          <p className="text-3xl font-bold text-slate-100">{stats.bestRelief} <span className="text-sm font-normal text-slate-500">pts</span></p>
        </motion.div>

        <motion.div variants={fadeSlideUp} className="glass-card p-6 border-t-2 border-t-indigo-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-slate-400">Est. Compliance</h3>
          </div>
          <p className="text-3xl font-bold text-slate-100">{stats.complianceRate}%</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <motion.div variants={fadeSlideUp} className="lg:col-span-2 glass-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-slate-100">Pain Relief Trend</h3>
            <div className="flex bg-black/20 rounded-lg p-1 border border-white/5">
              {(['7', '30', '90'] as const).map((days) => (
                <button
                  key={days}
                  onClick={() => setTimeRange(days)}
                  className={cn(
                    'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
                    timeRange === days
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  )}
                >
                  {days}D
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] w-full">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                    }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Line
                    type="monotone"
                    name="Pain Before"
                    dataKey="before"
                    stroke="#f87171"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#f87171', strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    name="Pain After"
                    dataKey="after"
                    stroke="#34d399"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#34d399', strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 border border-dashed border-white/10 rounded-xl">
                No data available for this time range
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={fadeSlideUp} className="glass-card p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-100 mb-6">Patient Details</h3>
          <div className="space-y-6 flex-1">
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">Email</span>
              </div>
              <p className="text-slate-200">{patient.email}</p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Joined</span>
              </div>
              <p className="text-slate-200">{formatDate(patient.createdAt)}</p>
            </div>
            
            {patient.medications && patient.medications.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Pill className="w-4 h-4" />
                  <span className="text-sm font-medium">Current Medications</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {patient.medications.map((med, i) => (
                    <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                      {med}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {patient.notes && (
              <div>
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Stethoscope className="w-4 h-4" />
                  <span className="text-sm font-medium">Clinical Notes</span>
                </div>
                <p className="text-sm text-slate-300 bg-black/20 p-3 rounded-lg border border-white/5">
                  {patient.notes}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Session History */}
        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-slate-100">Session History</h3>
            
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={modeFilter}
                onChange={(e) => {
                  setModeFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9 pr-8 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="all">All Modes</option>
                {uniqueModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {paginatedSessions.length === 0 ? (
              <p className="text-center text-slate-500 py-8 border border-dashed border-white/10 rounded-xl">No sessions found.</p>
            ) : (
              paginatedSessions.map((session) => {
                const relief = Math.max(0, session.painBefore - session.painAfter)
                return (
                  <div key={session.id} className="group p-4 bg-surface-2/40 hover:bg-surface-2 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl" title={session.modeName}>{getModeEmoji(session.modeId)}</span>
                          <h4 className="font-semibold text-slate-200">{session.modeName}</h4>
                        </div>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(session.timestamp)} &middot; {session.duration} mins
                        </p>
                      </div>
                      <button 
                        onClick={() => setSelectedSession(session)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        View Details
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-sm bg-black/20 rounded-lg p-3 border border-white/5">
                      <div className="flex items-center gap-6">
                        <div>
                          <span className="text-slate-500 block text-xs mb-0.5">Before</span>
                          <span className="font-semibold text-slate-300">{session.painBefore}/10</span>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-slate-600 rotate-180" />
                        <div>
                          <span className="text-slate-500 block text-xs mb-0.5">After</span>
                          <span className="font-semibold text-slate-300">{session.painAfter}/10</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block text-xs mb-0.5">Relief</span>
                        <span className="font-bold text-emerald-400">-{relief} pts</span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-slate-400">
                Page <strong className="text-slate-200">{currentPage}</strong> of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Pain Logs */}
        <div className="glass-card p-6 flex flex-col h-[600px]">
          <h3 className="text-lg font-bold text-slate-100 mb-6">Self-Reported Pain Logs</h3>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {painLogs.length === 0 ? (
              <p className="text-center text-slate-500 py-8 border border-dashed border-white/10 rounded-xl">No pain logs recorded.</p>
            ) : (
              painLogs.map((log) => (
                <div key={log.id} className="p-4 bg-surface-2/40 rounded-xl border border-white/5 relative overflow-hidden group">
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1",
                    log.painLevel >= 7 ? "bg-red-500" : log.painLevel >= 4 ? "bg-amber-500" : "bg-emerald-500"
                  )} />
                  <div className="flex justify-between items-start ml-2">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-inner",
                        log.painLevel >= 7 ? "bg-red-500/20 text-red-400" : log.painLevel >= 4 ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"
                      )}>
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">
                          Pain Level: <span className="text-red-400">{log.painLevel}</span>/10
                        </p>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {formatDate(log.timestamp)} &middot; {log.location}
                        </p>
                      </div>
                    </div>
                    {log.source && (
                      <span className="text-xs font-medium text-slate-400 capitalize px-2 py-1 bg-surface-2 rounded-md">
                        {log.source}
                      </span>
                    )}
                  </div>
                  {log.notes && (
                    <p className="mt-3 ml-[2.75rem] text-sm text-slate-400 italic border-l-2 border-white/10 pl-3 py-0.5">
                      &ldquo;{log.notes}&rdquo;
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <SessionNotesModal
        isOpen={notesModalOpen}
        session={selectedSession}
        onClose={() => {
          setNotesModalOpen(false)
          setSelectedSession(null)
        }}
        onUpdate={(_sessionId, _newNotes) => {
          // Handled by Firestore snapshot listener
        }}
      />
      
      <UnlinkPatientModal
        isOpen={unlinkModalOpen}
        onClose={() => setUnlinkModalOpen(false)}
        patient={patient as PatientWithStats}
        onUnlink={() => navigate('/patients')}
      />
      
      <TelehealthModal 
        isOpen={telehealthModalOpen} 
        onClose={() => setTelehealthModalOpen(false)}
        patientName={patient.name}
        patientId={patient.id}
        doctorId={doctor?.id || ''}
      />

      {/* Prescribe Adjustment Modal */}
      {prescribeModalOpen && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="modal-content w-full max-w-md bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-purple-400" />
                Prescribe Device Adjustment
              </h2>
              <button onClick={() => setPrescribeModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-slate-300 mb-4">
              Send new therapy parameters directly to <strong>{patient.name}</strong>'s companion app.
            </p>

            <textarea
              value={prescriptionText}
              onChange={(e) => setPrescriptionText(e.target.value)}
              placeholder="e.g., I've reviewed your recent logs. Please increase the intensity to level 6 and switch to 'Burst' mode for your next session."
              className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-slate-200 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 mb-6 min-h-[120px] resize-none"
            />

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setPrescribeModalOpen(false)}
                className="btn btn-secondary px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  if (!prescriptionText.trim() || !doctor) return;
                  const linkId = `${doctor.id}_${patient.id}`;
                  try {
                    await addDoc(collection(db, `doctorPatientLinks/${linkId}/messages`), {
                      text: `[THERAPY ADJUSTMENT PRESCRIBED]\n\n${prescriptionText}`,
                      senderId: doctor.id,
                      senderRole: 'doctor',
                      timestamp: serverTimestamp()
                    });
                    
                    await setDoc(doc(db, 'chats', linkId), {
                      doctorId: doctor.id,
                      patientId: patient.id,
                      lastMessage: `Therapy Adjustment: ${prescriptionText.substring(0, 30)}...`,
                      lastMessageTime: serverTimestamp(),
                      unreadCount: 0
                    }, { merge: true });
                    
                    setPrescriptionText('');
                    setPrescribeModalOpen(false);
                    alert('Adjustment successfully pushed to patient device/app.');
                  } catch (err) {
                    console.error("Failed to send prescription", err);
                    alert("Failed to send adjustment.");
                  }
                }}
                disabled={!prescriptionText.trim()}
                className="btn bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50 px-4 py-2 rounded-lg text-sm"
              >
                Push Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
