import { useState } from 'react'
import { X, AlertTriangle, Loader2 } from 'lucide-react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { unlinkPatient } from '@/lib/firestore'
import type { PatientWithStats } from '@/lib/types'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface UnlinkPatientModalProps {
  isOpen: boolean
  patient: PatientWithStats | null
  onClose: () => void
  onUnlink: () => void
}

export function UnlinkPatientModal({
  isOpen,
  patient,
  onClose,
  onUnlink,
}: UnlinkPatientModalProps) {
  const { doctor } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen || !patient) return null

  const handleUnlink = async () => {
    if (!doctor) return

    setLoading(true)
    setError('')

    try {
      // Find the link document
      const linksQuery = query(
        collection(db, 'doctorPatientLinks'),
        where('doctorId', '==', doctor.id),
        where('patientId', '==', patient.id),
        where('status', '==', 'active')
      )
      const linksSnapshot = await getDocs(linksQuery)

      if (linksSnapshot.empty) {
        throw new Error('Link not found')
      }

      const linkId = linksSnapshot.docs[0].id
      await unlinkPatient(linkId, patient.id)
      onUnlink()
    } catch (err) {
      console.error('Failed to unlink patient:', err)
      setError('Failed to unlink patient. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative glass-card shadow-2xl w-full max-w-md animate-scale-in bg-surface-1 border-glass-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-slate-100">Unlink Patient</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:bg-white/5 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start gap-4 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-amber-300">Are you sure?</p>
              <p className="text-sm text-amber-400/80 mt-2 leading-relaxed">
                This will remove <span className="font-medium text-amber-300">{patient.name}</span> from
                your patient roster. You will no longer be able to view their therapy data.
                The patient can re-link by entering a new access code.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-white/10 bg-surface-1/80">
          <button onClick={onClose} className="btn btn-secondary flex-1 py-2.5">
            Cancel
          </button>
          <button
            onClick={handleUnlink}
            disabled={loading}
            className={cn('btn btn-danger flex-1 py-2.5 shadow-lg shadow-red-500/20', loading && 'opacity-50')}
          >
            {loading && <Loader2 className="w-4 h-4 spinner" />}
            Unlink Patient
          </button>
        </div>
      </div>
    </div>
  )
}
