import { useState, useEffect, useCallback } from 'react'
import { X, Copy, Check, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createAccessCode, fetchAccessCodes } from '@/lib/firestore'
import type { DoctorPatientLink } from '@/lib/types'
import { cn, formatDate } from '@/lib/utils'

interface InvitePatientModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InvitePatientModal({ isOpen, onClose }: InvitePatientModalProps) {
  const { doctor } = useAuth()
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [codes, setCodes] = useState<DoctorPatientLink[]>([])
  const [newCode, setNewCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadCodes = useCallback(async () => {
    if (!doctor) return
    setLoading(true)
    setError(null)
    try {
      const fetchedCodes = await fetchAccessCodes(doctor.id)
      setCodes(fetchedCodes)
    } catch (error) {
      console.error('❌ Failed to load access codes:', error)
      setError('Failed to load codes. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [doctor])

  useEffect(() => {
    if (isOpen && doctor) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadCodes()
    }
  }, [isOpen, doctor, loadCodes])

  const handleGenerateCode = async () => {
    if (!doctor) {
      setError('Doctor information not loaded')
      return
    }

    setGenerating(true)
    setError(null)
    setNewCode(null)

    // Safety timeout to prevent infinite hanging
    const timeoutId = setTimeout(() => {
      setGenerating(false)
      setError('Code generation timed out. Check your internet connection and try again.')
      console.error('⏱️ Code generation timeout after 15 seconds')
    }, 15000)

    try {
      const link = await createAccessCode(doctor.id)

      if (!link || !link.accessCode) {
        throw new Error('Invalid response: No access code received')
      }

      setNewCode(link.accessCode)
      setError(null)

      // Reload the codes list
      await loadCodes()
    } catch (error: unknown) {
      console.error('❌ Failed to generate code:', error)

      let errorMessage = 'Error generating code'

      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)

        if (error.message.includes('timeout') || error.message.includes('Timeout')) {
          errorMessage = 'Request timed out — backend may be slow or offline'
        } else if (error.message.includes('permission') || error.message.includes('Permission') || error.message.includes('PERMISSION_DENIED')) {
          errorMessage = 'Permission denied — check Firebase security rules'
        } else if (error.message.includes('network') || error.message.includes('offline')) {
          errorMessage = 'Network error — check your internet connection'
        } else if (error.message.includes('QUOTA')) {
          errorMessage = 'Quota exceeded — too many requests'
        } else {
          errorMessage = error.message
        }
      }

      setError(errorMessage)
    } finally {
      clearTimeout(timeoutId)
      setGenerating(false)
    }
  }

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      alert('Failed to copy to clipboard')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative glass-card shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-scale-in bg-surface-1 border-glass-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-slate-100">Invite Patient</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:bg-white/5 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-red-300">Error</p>
                <p className="text-sm text-red-400/80 mt-1">{error}</p>
                <p className="text-xs text-red-400/60 mt-2">
                  Check console (F12) for more details
                </p>
              </div>
            </div>
          )}

          {/* Generate New Code */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-5">
            <p className="text-sm text-blue-200/80 mb-4">
              Generate a unique 6-digit code for your patient to link their account.
            </p>
            <button
              onClick={handleGenerateCode}
              disabled={generating}
              className={cn('btn btn-primary w-full shadow-lg shadow-blue-500/20', generating && 'opacity-50')}
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 spinner" />
                  Generating... (may take a few seconds)
                </>
              ) : (
                'Generate New Code'
              )}
            </button>
          </div>

          {/* New Code Display */}
          {newCode && !error && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-5">
              <p className="text-sm text-emerald-400 mb-3 font-medium">✅ New code generated!</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-mono font-bold text-emerald-400 tracking-[0.2em]">
                  {newCode}
                </span>
                <button
                  onClick={() => copyToClipboard(newCode)}
                  className="btn btn-secondary text-sm bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 hover:text-emerald-200 border-none"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-surface-2/50 border border-glass-border rounded-lg p-5">
            <h3 className="font-medium text-slate-200 mb-3">Instructions for Patient</h3>
            <ol className="text-sm text-slate-400 space-y-2 list-decimal list-inside marker:text-slate-500">
              <li>Open TensPilot+ app</li>
              <li>Go to Settings</li>
              <li>Tap &quot;Link to Doctor&quot;</li>
              <li>Enter the 6-digit code</li>
            </ol>
          </div>

          {/* Previous Codes */}
          <div className="pt-2">
            <h3 className="font-medium text-slate-200 mb-3">Recent Codes</h3>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-6 h-6 spinner text-blue-500" />
              </div>
            ) : codes.length === 0 ? (
              <div className="bg-surface-2/30 rounded-lg p-6 text-center border border-white/5">
                <p className="text-sm text-slate-500">
                  No codes generated yet
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {codes.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-3.5 bg-surface-2/50 border border-white/5 rounded-lg hover:border-white/10 transition-colors"
                  >
                    <div>
                      <span className="font-mono font-medium text-slate-200 tracking-wider">
                        {link.accessCode}
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatDate(link.createdAt)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'badge text-xs px-2.5 py-1',
                        link.status === 'active' && 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20',
                        link.status === 'pending' && 'bg-amber-500/20 text-amber-400 border border-amber-500/20',
                        link.status === 'revoked' && 'bg-red-500/20 text-red-400 border border-red-500/20'
                      )}
                    >
                      {link.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-surface-1/80">
          <button onClick={onClose} className="btn btn-secondary w-full py-2.5">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
