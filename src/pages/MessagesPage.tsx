import { useState, useRef, useEffect } from 'react'
import { Search, Send, MessageSquare, MoreVertical, Phone, Video } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { fetchDoctorPatients } from '@/lib/firestore'
import { PatientWithStats } from '@/lib/types'

interface Message {
  id: string
  text: string
  senderRole: 'doctor' | 'patient' | 'system'
  timestamp: Date
}

interface Chat {
  id: string
  patientId: string
  patientName: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
}

export function MessagesPage() {
  const { doctor } = useAuth()
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [inputText, setInputText] = useState('')
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [patientsMap, setPatientsMap] = useState<Record<string, PatientWithStats>>({})
  
  const activeChat = chats.find(c => c.patientId === activeChatId)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch patient details to map names
  useEffect(() => {
    if (!doctor) return
    fetchDoctorPatients(doctor.id).then(({ patients }) => {
      const map: Record<string, PatientWithStats> = {}
      patients.forEach(p => map[p.id] = p)
      setPatientsMap(map)
    }).catch(console.error)
  }, [doctor])

  // Listen to chats list
  useEffect(() => {
    if (!doctor) return
    const q = query(
      collection(db, 'chats'),
      where('doctorId', '==', doctor.id)
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(d => {
        const data = d.data()
        return {
          id: d.id,
          patientId: data.patientId,
          patientName: patientsMap[data.patientId]?.name || 'Loading...',
          lastMessage: data.lastMessage || '',
          lastMessageTime: data.lastMessageTime?.toDate() || new Date(),
          unreadCount: data.unreadCount || 0
        } as Chat
      }).sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime())
      
      // Update names if map loaded later
      const updatedChatList = chatList.map(c => ({
        ...c,
        patientName: patientsMap[c.patientId]?.name || `Patient ${c.patientId.slice(0, 4)}`
      }))
      
      setChats(updatedChatList)
      if (!activeChatId && updatedChatList.length > 0) {
        setActiveChatId(updatedChatList[0].patientId)
      }
    })
    return () => unsubscribe()
  }, [doctor, patientsMap, activeChatId])

  // Listen to active chat messages
  useEffect(() => {
    if (!doctor || !activeChatId) return
    const linkId = `${doctor.id}_${activeChatId}`
    const q = query(
      collection(db, `doctorPatientLinks/${linkId}/messages`),
      orderBy('timestamp', 'asc')
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => {
        const data = d.data()
        return {
          id: d.id,
          text: data.text,
          senderRole: data.senderRole,
          timestamp: data.timestamp?.toDate() || new Date()
        } as Message
      })
      setMessages(msgs)
    })
    return () => unsubscribe()
  }, [doctor, activeChatId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputText.trim() || !activeChatId || !doctor) return

    const userText = inputText
    setInputText('')
    
    const linkId = `${doctor.id}_${activeChatId}`
    try {
      await addDoc(collection(db, `doctorPatientLinks/${linkId}/messages`), {
        text: userText,
        senderId: doctor.id,
        senderRole: 'doctor',
        timestamp: serverTimestamp()
      })
      
      await setDoc(doc(db, 'chats', linkId), {
        doctorId: doctor.id,
        patientId: activeChatId,
        lastMessage: userText,
        lastMessageTime: serverTimestamp(),
        unreadCount: 0
      }, { merge: true })
      
    } catch (err) {
      console.error("Failed to send message", err)
    }
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex overflow-hidden glass-card m-6 lg:m-8">
      {/* Sidebar - Chat List */}
      <div className="w-1/3 border-r border-white/10 flex flex-col bg-surface-2/30">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-slate-100 mb-4">Messages</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search patients..."
              className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {chats.map(chat => (
            <button
              key={chat.patientId}
              onClick={() => setActiveChatId(chat.patientId)}
              className={cn(
                "w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-colors text-left border-b border-white/5",
                activeChatId === chat.patientId && "bg-blue-500/10 hover:bg-blue-500/10"
              )}
            >
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-blue-400">
                  {chat.patientName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-medium text-slate-200 truncate">{chat.patientName}</span>
                  <span className="text-xs text-slate-500">
                    {chat.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-slate-400 truncate">{chat.lastMessage}</p>
              </div>
              {chat.unreadCount > 0 && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <span className="text-[10px] font-bold text-white">{chat.unreadCount}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {activeChat ? (
        <div className="flex-1 flex flex-col bg-black/20">
          {/* Chat Header */}
          <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between bg-surface-2/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-400">
                  {activeChat.patientName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">{activeChat.patientName}</h3>
                <span className="text-xs text-emerald-400">Online</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-slate-400 hover:text-slate-200 transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              <button className="text-slate-400 hover:text-slate-200 transition-colors">
                <Video className="w-5 h-5" />
              </button>
              <button className="text-slate-400 hover:text-slate-200 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.map(msg => {
              const isDoc = msg.senderRole === 'doctor'
              return (
                <div key={msg.id} className={cn("flex flex-col max-w-[75%]", isDoc ? "ml-auto items-end" : "mr-auto items-start")}>
                  <div className={cn(
                    "px-4 py-2 rounded-2xl",
                    isDoc 
                      ? "bg-blue-600 text-white rounded-tr-sm" 
                      : "bg-surface-3 text-slate-200 rounded-tl-sm border border-white/5"
                  )}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-surface-2/30">
            <div className="flex items-center gap-2">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 bg-black/40 border border-white/10 rounded-full px-5 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50"
              />
              <button 
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 -ml-1" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-black/20">
          <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
          <p>Select a patient to start messaging</p>
        </div>
      )}
    </div>
  )
}
