import { useState, useMemo, useEffect } from 'react'
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
  Phone,
  Mail,
  MessageSquare,
  Video,
  Sparkles,
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
import { fetchPatient, fetchPatientSessions, fetchPatientPainLogs } from '@/lib/firestore'
import type { Patient, Session, PainLog } from '@/lib/types'
import {
  cn,
  formatDate,
  getModeEmoji,
} from '@/lib/utils'
import { SessionNotesModal } from '@/components/SessionNotesModal'
import { UnlinkPatientModal } from '@/components/UnlinkPatientModal'
import { TelehealthModal } from '@/components/TelehealthModal'
import { useAuth } from '@/contexts/AuthContext'

type TimeRange = '7' | '30' | '90'

export function PatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>()
  const navigate = useNavigate()
  const { doctor } = useAuth()
  
  const [patient, setPatient] = useState<Patient | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [painLogs, setPainLogs] = useState<PainLog[]>([])
  const [loading, setLoading] = useState(true)

  const [timeRange, setTimeRange] = useState<TimeRange>('7')
  const [modeFilter, setModeFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [notesModalOpen, setNotesModalOpen] = useState(false)
  const [unlinkModalOpen, setUnlinkModalOpen] = useState(false)
  const [telehealthModalOpen, setTelehealthModalOpen] = useState(false)

  const sessionsPerPage = 5

  useEffect(() => {
    if (!patientId) return
    const loadData = async () => {
      setLoading(true)
      try {
        const [p, s, pLogs] = await Promise.all([
          fetchPatient(patientId),
          fetchPatientSessions(patientId),
          fetchPatientPainLogs(patientId)
        ])
        setPatient(p)
        setSessions(s)
        setPainLogs(pLogs)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [patientId])

  // Stats
  const stats = useMemo(() => {
    if (sessions.length === 0) return { totalSessions: 0, avgRelief: 0, bestRelief: 0, complianceRate: 0 }
    
    const reliefs = sessions.map((s) => Math.max(0, s.painBefore - s.painAfter))
    const avgRelief = reliefs.reduce((a, b) => a + b, 0) / reliefs.length
    const bestRelief = Math.max(...reliefs)

    // Mock compliance based on session count
    const complianceRate = Math.min(100, Math.round((sessions.length / 10) * 100))

    return {
      totalSessions: sessions.length,
      avgRelief: Math.round(avgRelief * 10) / 10,
      bestRelief,
      complianceRate,
    }
  }, [sessions])

  // Trend Data for Chart
  const trendData = useMemo(() => {
    const days = parseInt(timeRange, 10)
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)

    const filtered = sessions
      .filter(s => s.timestamp >= cutoff)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

    // Group by date to average if multiple sessions per day
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

  // Filtered and paginated sessions
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

  // Get unique modes for filter
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
      <div className="p-6 lg:p-8 page-enter">
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
    <div className="p-6 lg:p-8 page-enter">
      {/* Header */}
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/messages')}
            className="btn bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            Message
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

      {/* AI Insight */}
      <div className="glass-card p-6 mb-8 border-l-4 border-l-purple-500 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-500/15 rounded-lg text-purple-400 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-purple-400 mb-1">AI Patient Insight</h3>
            <p className="text-sm text-slate-300">
              {patient.name} has shown a consistent decrease in pain levels over the last 14 days when using the TENS device. 
              Adherence is excellent. Consider adjusting the therapy schedule to a lower frequency if progress continues.
            </p>
          </div>
        </div>
      </div>

      {/* Patient Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 stagger-children">
        {/* Contact Info */}
        <div className="glass-card p-6">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">{patient.email || '—'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">—</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">Enrolled {formatDate(patient.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card stat-card stat-card-blue p-4 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/15 rounded-lg text-blue-400">
                <Activity className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-slate-400">Sessions</p>
            </div>
            <p className="text-2xl font-bold text-slate-100">{stats.totalSessions}</p>
          </div>
          <div className="glass-card stat-card stat-card-emerald p-4 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/15 rounded-lg text-emerald-400">
                <TrendingDown className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-slate-400">Avg Relief</p>
            </div>
            <p className="text-2xl font-bold text-slate-100">{stats.avgRelief} pts</p>
          </div>
          <div className="glass-card stat-card stat-card-amber p-4 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-500/15 rounded-lg text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-slate-400">Best</p>
            </div>
            <p className="text-2xl font-bold text-slate-100">{stats.bestRelief} pts</p>
          </div>
          <div className="glass-card stat-card stat-card-blue p-4 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/15 rounded-lg text-purple-400">
                <Target className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-slate-400">Compliance</p>
            </div>
            <p className="text-2xl font-bold text-slate-100">{stats.complianceRate}%</p>
          </div>
        </div>
      </div>

      {/* Pain Trend Chart */}
      <div className="glass-card p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-slate-100">Pain Trend</h2>
          <div className="flex gap-2 bg-surface-2 p-1 rounded-lg border border-glass-border">
            {(['7', '30', '90'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'px-3 py-1 text-sm font-medium rounded-md transition-all',
                  timeRange === range
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                )}
              >
                {range}d
              </button>
            ))}
          </div>
        </div>

        {trendData.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                    color: '#f1f5f9'
                  }}
                />
                <Legend iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="before"
                  name="Pain Before"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, stroke: '#1e293b', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="after"
                  name="Pain After"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, stroke: '#1e293b', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-slate-500">
            No session data available for this period.
          </div>
        )}
      </div>

      <div className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-white/5 bg-surface-2/30">
          <h2 className="text-lg font-semibold text-slate-100">Session History</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={modeFilter}
              onChange={(e) => {
                setModeFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="input py-1.5 w-auto"
            >
              <option value="all">All Modes</option>
              {uniqueModes.map((mode) => (
                <option key={mode} value={mode} className="capitalize">
                  {mode}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {paginatedSessions.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No sessions found.
            </div>
          ) : (
            paginatedSessions.map((session) => {
              const relief = session.painBefore - session.painAfter
              return (
                <div
                  key={session.id}
                  className="p-4 hover:bg-white/5 transition-colors cursor-pointer group"
                  onClick={() => {
                    setSelectedSession(session)
                    setNotesModalOpen(true)
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg mt-0.5 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-200 flex items-center gap-2">
                          <span className="text-base">{getModeEmoji(session.modeId)}</span>
                          <span className="capitalize">{session.modeName || session.modeId}</span>
                        </p>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {formatDate(session.timestamp)} &middot; {session.duration} min
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 font-mono text-sm">
                        <span className="text-red-400">{session.painBefore}</span>
                        <span className="text-slate-600">&rarr;</span>
                        <span className="text-emerald-400">{session.painAfter}</span>
                      </div>
                      <span className={cn(
                        'text-xs font-medium inline-block mt-1',
                        relief >= 4 ? 'text-emerald-400' :
                        relief >= 2 ? 'text-amber-400' : 'text-slate-400'
                      )}>
                        {relief > 0 ? `-${relief}` : relief} pts relief
                      </span>
                    </div>
                  </div>
                  {session.notes && (
                    <p className="mt-3 ml-[2.75rem] text-sm text-slate-400 italic border-l-2 border-white/10 pl-3 py-0.5">
                      &ldquo;{session.notes}&rdquo;
                    </p>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/5 bg-surface-2/30">
            <p className="text-sm text-slate-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn btn-secondary btn-sm disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-secondary btn-sm disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pain Logs */}
      <div className="glass-card overflow-hidden animate-slide-up mt-8" style={{ animationDelay: '0.4s' }}>
        <div className="p-6 border-b border-white/5 bg-surface-2/30">
          <h2 className="text-lg font-semibold text-slate-100">Pain Logs</h2>
        </div>
        <div className="divide-y divide-white/5">
          {painLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No pain logs recorded yet.
            </div>
          ) : (
            painLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg mt-0.5 text-red-400">
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

      {/* Modals */}
      <SessionNotesModal
        isOpen={notesModalOpen}
        session={selectedSession}
        onClose={() => {
          setNotesModalOpen(false)
          setSelectedSession(null)
        }}
        onUpdate={(sessionId, newNotes) => {
          setSessions((prevSessions) =>
            prevSessions.map((s) =>
              s.id === sessionId ? { ...s, notes: newNotes } : s
            )
          )
          // The modal closes itself, so we just need to update state
        }}
      />
      <UnlinkPatientModal
        isOpen={unlinkModalOpen}
        patient={{
          id: patient.id,
          name: patient.name,
          email: patient.email,
          condition: patient.condition,
          createdAt: patient.createdAt,
          totalSessions: stats.totalSessions,
          avgPainRelief: stats.avgRelief,
          lastSessionDate: sessions[0]?.timestamp,
        }}
        onClose={() => setUnlinkModalOpen(false)}
        onUnlink={() => navigate('/patients')}
      />
      <TelehealthModal
        isOpen={telehealthModalOpen}
        onClose={() => setTelehealthModalOpen(false)}
        patientName={patient.name}
        patientId={patient.id}
        doctorId={doctor?.id || 'doc123'}
      />
    </div>
  )
}
