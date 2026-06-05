import { useState, useEffect, useMemo } from 'react'
import { FileText, Download, Loader2, Calendar } from 'lucide-react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useAuth } from '@/contexts/AuthContext'
import { fetchDoctorPatients, fetchPatientSessions } from '@/lib/firestore'
import type { PatientWithStats } from '@/lib/types'
import { formatDate, getModeEmoji, cn } from '@/lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export function ReportsPage() {
  const { doctor } = useAuth()
  const [patients, setPatients] = useState<PatientWithStats[]>([])
  const [loading, setLoading] = useState(true)

  const [generating, setGenerating] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  useEffect(() => {
    // Set default date range (last 30 days)
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 30)
    setEndDate(end.toISOString().split('T')[0])
    setStartDate(start.toISOString().split('T')[0])
  }, [])

  useEffect(() => {
    if (!doctor) return
    const loadPatients = async () => {
      setLoading(true)
      try {
        const { patients: docs } = await fetchDoctorPatients(doctor.id)
        setPatients(docs)
        if (docs.length > 0 && !selectedPatientId) {
          setSelectedPatientId(docs[0].id)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadPatients()
  }, [doctor, selectedPatientId])

  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || null
  }, [patients, selectedPatientId])

  // Mock compliance data for chart
  const complianceData = [
    { week: 'Week 1', compliance: 78 },
    { week: 'Week 2', compliance: 85 },
    { week: 'Week 3', compliance: 82 },
    { week: 'Week 4', compliance: 91 },
  ]

  const generatePDF = async () => {
    if (!selectedPatient || !startDate || !endDate) return

    setGenerating(true)

    try {
      // Fetch real sessions for the selected date range
      const allSessions = await fetchPatientSessions(selectedPatientId)
      
      const startD = new Date(startDate)
      const endD = new Date(endDate)
      endD.setHours(23, 59, 59, 999)

      const sessions = allSessions.filter(s => 
        s.timestamp >= startD && s.timestamp <= endD
      )

      // Calculate statistics
      const totalSessions = sessions.length
      const reliefs = sessions.map((s) => Math.max(0, s.painBefore - s.painAfter))
      const avgRelief = totalSessions > 0 
        ? Math.round((reliefs.reduce((a, b) => a + b, 0) / totalSessions) * 10) / 10 
        : 0
      const bestRelief = totalSessions > 0 ? Math.max(...reliefs) : 0
      const complianceRate = Math.min(100, Math.round((totalSessions / 12) * 100)) // mock expectation

      // Generate recommendation
      let recommendation = ''
      if (totalSessions === 0) {
        recommendation = 'No sessions recorded in this period.'
      } else if (avgRelief >= 4) {
        recommendation = 'Continue current therapy - excellent pain relief achieved.'
      } else if (avgRelief >= 2) {
        recommendation = 'Consider adjusting session intensity or duration for better results.'
      } else if (totalSessions < 8) {
        recommendation = 'Increase session frequency to at least 3 times per week.'
      } else {
        recommendation = 'Consider switching modes or consulting for alternative approaches.'
      }

      // Create PDF
      const pdf = new jsPDF()
      const pageWidth = pdf.internal.pageSize.getWidth()

      // Header
      pdf.setFillColor(37, 99, 235)
      pdf.rect(0, 0, pageWidth, 40, 'F')

      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text('TensPilot+', 20, 25)

      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Clinical Report', pageWidth - 20, 25, { align: 'right' })

      // Patient Info
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Patient Information', 20, 55)

      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Name: ${selectedPatient.name}`, 20, 65)
      pdf.text(`Condition: ${selectedPatient.condition || 'Not specified'}`, 20, 72)
      pdf.text(
        `Report Period: ${formatDate(startD)} - ${formatDate(endD)}`,
        20,
        79
      )
      pdf.text(`Generated: ${formatDate(new Date())}`, 20, 86)
      pdf.text(`Prepared by: Dr. ${doctor?.name || ''}, ${doctor?.specialty || ''}`, 20, 93)

      // Summary Stats
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Therapy Summary', 20, 110)

      const statsData = [
        ['Total Sessions', totalSessions.toString()],
        ['Average Pain Relief', `${avgRelief} points`],
        ['Best Session Relief', `${bestRelief} points`],
        ['Compliance Rate', `${complianceRate}%`],
      ]

      autoTable(pdf, {
        startY: 115,
        head: [['Metric', 'Value']],
        body: statsData,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
        margin: { left: 20, right: 20 },
      })

      // Session History
      const finalY = (pdf as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY

      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Session History', 20, finalY + 15)

      const sessionData = sessions.map((s) => [
        formatDate(s.timestamp),
        `${getModeEmoji(s.modeId)} ${s.modeName || s.modeId}`,
        s.painBefore.toString(),
        s.painAfter.toString(),
        `${s.painBefore - s.painAfter}`,
        `${s.duration} min`,
      ])

      if (sessionData.length > 0) {
        autoTable(pdf, {
          startY: finalY + 20,
          head: [['Date', 'Mode', 'Before', 'After', 'Relief', 'Duration']],
          body: sessionData,
          theme: 'striped',
          headStyles: { fillColor: [37, 99, 235] },
          margin: { left: 20, right: 20 },
        })
      } else {
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        pdf.text('No sessions found for this period.', 20, finalY + 25)
      }

      // Recommendation
      const finalY2 = (pdf as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || (finalY + 30)

      if (finalY2 < 240) {
        pdf.setFillColor(240, 249, 255)
        pdf.rect(20, finalY2 + 10, pageWidth - 40, 30, 'F')

        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(37, 99, 235)
        pdf.text('Clinical Recommendation', 25, finalY2 + 22)

        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(0, 0, 0)
        pdf.text(recommendation, 25, finalY2 + 32)
      }

      // Footer / Signature Area
      pdf.setDrawColor(200, 200, 200)
      pdf.line(20, 270, pageWidth - 20, 270)

      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      pdf.text('Healthcare Provider Signature: _____________________', 20, 280)
      pdf.text('Date: _____________________', pageWidth - 80, 280)

      // Save
      pdf.save(
        `TensPilot_Report_${selectedPatient.name.replace(/\s+/g, '_')}_${startDate}.pdf`
      )
    } catch (error) {
      console.error('Failed to generate PDF:', error)
    } finally {
      setGenerating(false)
    }
  }

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Generate Report</h1>
        <p className="text-slate-400 mt-1">Create PDF reports for patient records</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 stagger-children">
        {/* Report Form */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-6">Report Options</h2>

          <div className="space-y-5">
            {/* Patient Selection */}
            <div>
              <label htmlFor="patient-select" className="label text-slate-300">
                Select Patient
              </label>
              <select
                id="patient-select"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="input bg-surface-2/50 border-glass-border focus:border-primary text-slate-200"
              >
                {patients.length === 0 ? (
                  <option value="" disabled>No patients linked</option>
                ) : (
                  patients.map((patient) => (
                    <option key={patient.id} value={patient.id} className="bg-surface-2 text-slate-200">
                      {patient.name} - {patient.condition || 'No condition'}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-date" className="label text-slate-300">
                  Start Date
                </label>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input bg-surface-2/50 border-glass-border focus:border-primary text-slate-200"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <div>
                <label htmlFor="end-date" className="label text-slate-300">
                  End Date
                </label>
                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input bg-surface-2/50 border-glass-border focus:border-primary text-slate-200"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generatePDF}
              disabled={generating || !selectedPatientId || !startDate || !endDate}
              className={cn(
                'btn btn-primary w-full mt-4 py-3 text-base shadow-lg shadow-blue-500/20',
                (generating || !selectedPatientId) && 'opacity-50'
              )}
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 spinner" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Generate PDF Report
                </>
              )}
            </button>
          </div>

          {/* Compliance Chart */}
          <div className="mt-8 pt-6 border-t border-glass-border">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Weekly Compliance Trend</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complianceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="week" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                    formatter={(value) => [`${value}%`, 'Compliance']}
                  />
                  <Bar dataKey="compliance" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-6">Report Preview</h2>

          {selectedPatient ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-5 rounded-xl shadow-lg shadow-blue-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    <span className="font-semibold text-lg tracking-tight">TensPilot+</span>
                  </div>
                  <span className="text-sm font-medium opacity-90 uppercase tracking-wider">Clinical Report</span>
                </div>
              </div>

              <div className="bg-surface-2/50 border border-glass-border rounded-xl p-5 space-y-4">
                <h3 className="font-medium text-slate-200">Patient Information</h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                  <div>
                    <span className="text-slate-400">Name:</span>
                    <span className="ml-2 text-slate-100 font-medium">{selectedPatient.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Condition:</span>
                    <span className="ml-2 text-slate-100 font-medium">
                      {selectedPatient.condition || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Sessions:</span>
                    <span className="ml-2 text-slate-100 font-medium">
                      {selectedPatient.totalSessions}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Avg Relief:</span>
                    <span className="ml-2 text-emerald-400 font-medium">
                      {selectedPatient.avgPainRelief} pts
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-slate-400 py-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {startDate && endDate
                    ? `${formatDate(new Date(startDate))} - ${formatDate(new Date(endDate))}`
                    : 'Select date range'}
                </span>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-sm text-blue-300 leading-relaxed">
                  <span className="font-semibold text-blue-400">Report includes:</span> Therapy summary,
                  pain trend analysis, session history, and clinical recommendations based on the selected timeframe.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 flex flex-col items-center">
              <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mb-4 border border-glass-border">
                <FileText className="w-8 h-8 opacity-50" />
              </div>
              <p>Select a patient to preview report</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
