import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import type { Session } from '@/lib/types'
import { updateSessionNotes } from '@/lib/firestore'
import { formatDate, formatTime, getModeEmoji, calculatePainRelief, cn } from '@/lib/utils'

interface SessionNotesModalProps {
  isOpen: boolean
  session: Session | null
  onClose: () => void
  onUpdate: (sessionId: string, newNotes: string) => void
}

export function SessionNotesModal({
  isOpen,
  session,
  onClose,
  onUpdate,
}: SessionNotesModalProps) {
  const [notes, setNotes] = useState(session?.notes || '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (session) {
      setNotes(session.notes || '')
    }
  }, [session])

  if (!isOpen || !session) return null

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateSessionNotes(session.id, notes)
      onUpdate(session.id, notes)
      onClose()
    } catch (error) {
      console.error('Failed to save notes:', error)
    } finally {
      setSaving(false)
    }
  }

  const relief = calculatePainRelief(session.painBefore, session.painAfter)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative glass-card shadow-2xl w-full max-w-lg animate-scale-in bg-surface-1 border-glass-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-slate-100">Session Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:bg-white/5 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Session Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-2/50 border border-white/5 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1.5 uppercase tracking-wider font-medium">Date & Time</p>
              <p className="font-medium text-slate-200">
                {formatDate(session.timestamp)}<br />
                <span className="text-slate-400 text-sm font-normal">{formatTime(session.timestamp)}</span>
              </p>
            </div>
            <div className="bg-surface-2/50 border border-white/5 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1.5 uppercase tracking-wider font-medium">Mode</p>
              <p className="font-medium text-slate-200 flex items-center gap-2">
                <span className="text-xl">{getModeEmoji(session.modeId)}</span>
                {session.modeName}
              </p>
            </div>
          </div>

          {/* Pain Scores */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
              <p className="text-xs text-red-400/80 mb-1 uppercase tracking-wider font-medium">Pain Before</p>
              <p className="text-3xl font-bold text-red-400">{session.painBefore}</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-center">
              <p className="text-xs text-emerald-400/80 mb-1 uppercase tracking-wider font-medium">Pain After</p>
              <p className="text-3xl font-bold text-emerald-400">{session.painAfter}</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
              <p className="text-xs text-blue-400/80 mb-1 uppercase tracking-wider font-medium">Relief</p>
              <p className="text-3xl font-bold text-blue-400">
                {relief > 0 ? '+' : ''}
                {relief}
              </p>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-2/50 border border-white/5 rounded-lg p-3 px-4 flex justify-between items-center">
              <p className="text-sm text-slate-400">Duration</p>
              <p className="font-medium text-slate-200">{session.duration} min</p>
            </div>
            <div className="bg-surface-2/50 border border-white/5 rounded-lg p-3 px-4 flex justify-between items-center">
              <p className="text-sm text-slate-400">Intensity</p>
              <p className="font-medium text-slate-200">{session.intensity}%</p>
            </div>
          </div>

          {session.location && (
            <div className="bg-surface-2/50 border border-white/5 rounded-lg p-3 px-4 flex justify-between items-center">
              <p className="text-sm text-slate-400">Body Location</p>
              <p className="font-medium text-slate-200 capitalize">{session.location}</p>
            </div>
          )}

          {/* Notes */}
          <div className="pt-2">
            <label htmlFor="session-notes" className="label text-slate-300">
              Clinical Notes
            </label>
            <textarea
              id="session-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about patient response, adjustments made, etc..."
              rows={4}
              className="input resize-none bg-surface-2/50 border-glass-border focus:border-primary text-slate-200 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-white/10 bg-surface-1/80">
          <button onClick={onClose} className="btn btn-secondary flex-1 py-2.5">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={cn('btn btn-primary flex-1 py-2.5 shadow-lg shadow-blue-500/20', saving && 'opacity-50')}
          >
            {saving && <Loader2 className="w-4 h-4 spinner" />}
            Save Notes
          </button>
        </div>
      </div>
    </div>
  )
}
