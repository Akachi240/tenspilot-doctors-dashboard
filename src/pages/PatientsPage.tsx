import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  UserPlus,
  ChevronUp,
  ChevronDown,
  Eye,
  Users,
  Filter,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useDoctorData } from '@/hooks/useDoctorData'
import { cn } from '@/lib/utils'
import { InvitePatientModal } from '@/components/InvitePatientModal'

type SortField = 'name' | 'lastSession' | 'avgRelief' | 'totalSessions' | 'compliance'
type SortDirection = 'asc' | 'desc'
type StatusFilter = 'all' | 'active' | 'inactive'

export function PatientsPage() {
  const { doctor } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('lastSession')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const { patients, loading } = useDoctorData(doctor?.id)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const filteredAndSortedPatients = useMemo(() => {
    let result = [...patients].map(p => {
      // Calculate derived fields for display
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const isActive = p.lastSessionDate ? p.lastSessionDate > thirtyDaysAgo : false
      const compliance = Math.min(100, p.totalSessions * 5) // Mock compliance calculation
      return { ...p, status: isActive ? 'active' : 'inactive', compliance }
    })

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((patient) => patient.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (patient) =>
          patient.name.toLowerCase().includes(query) ||
          (patient.condition?.toLowerCase() || '').includes(query) ||
          patient.email.toLowerCase().includes(query)
      )
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'lastSession':
          comparison = (a.lastSessionDate?.getTime() || 0) - (b.lastSessionDate?.getTime() || 0)
          break
        case 'avgRelief':
          comparison = a.avgPainRelief - b.avgPainRelief
          break
        case 'totalSessions':
          comparison = a.totalSessions - b.totalSessions
          break
        case 'compliance':
          comparison = a.compliance - b.compliance
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [patients, searchQuery, sortField, sortDirection, statusFilter])

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    )
  }

  const activeCount = filteredAndSortedPatients.filter((p) => p.status === 'active').length
  const inactiveCount = filteredAndSortedPatients.filter((p) => p.status === 'inactive').length

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full spinner"></div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Patients</h1>
          <p className="text-slate-400 mt-1">
            {patients.length} patient{patients.length !== 1 ? 's' : ''} linked
          </p>
        </div>
        <button
          onClick={() => setInviteModalOpen(true)}
          className="btn btn-primary"
        >
          <UserPlus className="w-4 h-4" />
          Invite Patient
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="input py-2 px-3 min-w-[140px]"
          >
            <option value="all">All ({patients.length})</option>
            <option value="active">Active ({activeCount})</option>
            <option value="inactive">Inactive ({inactiveCount})</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card table-container">
        {filteredAndSortedPatients.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-4 border border-glass-border">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">
              {searchQuery ? 'No patients found' : 'No patients yet'}
            </h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Invite your first patient to start monitoring their progress.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setInviteModalOpen(true)}
                className="btn btn-primary"
              >
                <UserPlus className="w-4 h-4" />
                Invite Patient
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-2/50">
                <tr>
                  <th className="text-left">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 hover:text-slate-200 transition-colors"
                    >
                      Patient
                      {renderSortIcon('name')}
                    </button>
                  </th>
                  <th className="text-left">
                    <span>Condition</span>
                  </th>
                  <th className="text-left">
                    <button
                      onClick={() => handleSort('totalSessions')}
                      className="flex items-center gap-1 hover:text-slate-200 transition-colors"
                    >
                      Sessions
                      {renderSortIcon('totalSessions')}
                    </button>
                  </th>
                  <th className="text-left">
                    <button
                      onClick={() => handleSort('avgRelief')}
                      className="flex items-center gap-1 hover:text-slate-200 transition-colors"
                    >
                      Avg Relief
                      {renderSortIcon('avgRelief')}
                    </button>
                  </th>
                  <th className="text-left">
                    <button
                      onClick={() => handleSort('compliance')}
                      className="flex items-center gap-1 hover:text-slate-200 transition-colors"
                    >
                      Compliance
                      {renderSortIcon('compliance')}
                    </button>
                  </th>
                  <th className="text-left">
                    <button
                      onClick={() => handleSort('lastSession')}
                      className="flex items-center gap-1 hover:text-slate-200 transition-colors"
                    >
                      Last Session
                      {renderSortIcon('lastSession')}
                    </button>
                  </th>
                  <th className="text-right">
                    <span>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/15 border border-blue-500/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-400">
                            {patient.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-100">{patient.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={cn(
                              'inline-block w-2 h-2 rounded-full shadow-sm',
                              patient.status === 'active' ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-slate-500'
                            )} />
                            <span className="text-xs text-slate-400 capitalize">{patient.status}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-slate-300">
                        {patient.condition || '-'}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm font-medium text-slate-200">
                        {patient.totalSessions}
                      </span>
                    </td>
                    <td>
                      <span
                        className={cn(
                          'text-sm font-medium px-2 py-1 rounded-md border bg-opacity-10',
                          patient.avgPainRelief >= 6 ? 'bg-emerald-500 border-emerald-500/20 text-emerald-400' :
                          patient.avgPainRelief >= 3 ? 'bg-amber-500 border-amber-500/20 text-amber-400' : 
                          'bg-red-500 border-red-500/20 text-red-400'
                        )}
                      >
                        {patient.avgPainRelief > 0 ? '+' : ''}
                        {patient.avgPainRelief.toFixed(1)} pts
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-surface-3 rounded-full max-w-[80px] overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              patient.compliance >= 80 ? 'bg-emerald-500' :
                              patient.compliance >= 60 ? 'bg-amber-500' : 'bg-red-500'
                            )}
                            style={{ width: `${patient.compliance}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-400">{patient.compliance}%</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-slate-300">
                        {patient.lastSessionDate ? patient.lastSessionDate.toLocaleDateString() : '—'}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => navigate(`/patients/${patient.id}`)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <InvitePatientModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />
    </div>
  )
}
