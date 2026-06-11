import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface JitsiApi {
  dispose: () => void
  addListener: (_event: string, _callback: () => void) => void
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    JitsiMeetExternalAPI: new (_domain: string, _options: Record<string, unknown>) => JitsiApi
  }
}

interface TelehealthModalProps {
  isOpen: boolean
  onClose: () => void
  patientName: string
  patientId: string
  doctorId: string
  isIncoming?: boolean
}

export function TelehealthModal({ isOpen, onClose, patientName, patientId, doctorId, isIncoming = false }: TelehealthModalProps) {
  const [callStatus, setCallStatus] = useState<'ringing' | 'active' | 'ended'>(isIncoming ? 'active' : 'ended')
  const roomName = `TensPilot_Consult_${doctorId}_${patientId}`
  const jitsiContainerRef = useRef<HTMLDivElement>(null)
  const jitsiApiRef = useRef<JitsiApi | null>(null)

  // Manage call lifecycle and Firestore status
  useEffect(() => {
    if (!isOpen) return

    const roomId = `TensPilot_Consult_${doctorId}_${patientId}`
    const consultationRef = doc(db, 'consultations', roomId)

    if (isIncoming) {
      setDoc(consultationRef, { status: 'active' }, { merge: true }).catch(console.error)
    } else {
      const startCall = async () => {
        try {
          await setDoc(consultationRef, {
            id: roomId,
            roomId,
            patientId,
            doctorId,
            status: 'ringing',
            initiatedBy: 'doctor',
            timestamp: serverTimestamp()
          })
          setCallStatus('ringing')
        } catch (err) {
          console.error("Error starting call:", err)
        }
      }
      startCall()
    }

    const unsubscribe = onSnapshot(consultationRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        if (data.status === 'active') setCallStatus('active')
        if (data.status === 'ended') {
          setCallStatus('ended')
          onClose()
        }
      }
    })

    return () => {
      unsubscribe()
      setDoc(consultationRef, { status: 'ended' }, { merge: true }).catch(console.error)
    }
  }, [isOpen, doctorId, patientId, onClose, isIncoming])

  // Initialize Jitsi when call becomes active
  useEffect(() => {
    if (callStatus !== 'active' || !roomName || !jitsiContainerRef.current) return

    // Clean up any previous instance
    jitsiApiRef.current?.dispose()

    const initJitsi = (domain: string) => {
      if (!jitsiContainerRef.current) return
      try {
        const api = new window.JitsiMeetExternalAPI(domain, {
          roomName: roomName,
          parentNode: jitsiContainerRef.current,
          width: '100%',
          height: '100%',
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            disableModeratorIndicator: true,
            enableEmailInStats: false,
            prejoinPageEnabled: false,
          },
          interfaceConfigOverwrite: {
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            MOBILE_APP_PROMO: false,
          },
          userInfo: {
            displayName: `Dr. TensPilot`,
            email: '',
          },
        })

        api.addListener('readyToClose', () => onClose())
        jitsiApiRef.current = api
      } catch (err) {
        console.error('Failed to init Jitsi on', domain, err)
      }
    }

    // Load External API script
    const loadScript = (src: string): Promise<void> =>
      new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.JitsiMeetExternalAPI) {
          resolve()
          return
        }
        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error(`Failed to load ${src}`))
        document.head.appendChild(script)
      })

    loadScript('https://8x8.vc/vpaas-magic-cookie-30/external_api.js')
      .then(() => initJitsi('8x8.vc'))
      .catch(() => {
        // Fallback to meet.jit.si
        loadScript('https://meet.jit.si/external_api.js')
          .then(() => initJitsi('meet.jit.si'))
          .catch((err) => console.error('All Jitsi sources failed:', err))
      })

    return () => {
      jitsiApiRef.current?.dispose()
      jitsiApiRef.current = null
    }
  }, [callStatus, roomName, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-1 w-full max-w-5xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[85vh] max-h-[900px] animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-surface-2/50">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-lg font-semibold text-slate-100">
              {callStatus === 'ringing' ? `Calling ${patientName}...` : `Live Video Consult with ${patientName}`}
            </h2>
          </div>
          <button
            onClick={() => {
              jitsiApiRef.current?.dispose()
              onClose()
            }}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video / Calling Area */}
        <div className="flex-1 w-full h-full bg-black relative flex flex-col items-center justify-center">
          
          {callStatus === 'ringing' ? (
            <div className="text-center animate-pulse">
              <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-16 h-16 bg-blue-500/40 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Calling {patientName}</h3>
              <p className="text-slate-400">Waiting for patient to accept...</p>
            </div>
          ) : (
            <div ref={jitsiContainerRef} className="w-full h-full" />
          )}
        </div>

      </div>
    </div>
  )
}
