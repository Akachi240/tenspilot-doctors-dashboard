export interface Doctor {
  id: string
  email: string
  name: string
  specialty: string
  createdAt: Date
  phone?: string
  clinic?: string
  notifications?: { [key: string]: boolean }
}

export interface Patient {
  id: string
  email: string
  name: string
  condition?: string
  linkedDoctorId?: string
  createdAt?: Date
  displayName?: string
}

export interface PatientWithStats extends Patient {
  totalSessions: number
  avgPainRelief: number
  lastSessionDate?: Date
}

export interface Session {
  id: string
  patientId: string
  modeId: string
  modeName: string
  painBefore: number
  painAfter: number
  duration: number
  intensity: number
  timestamp: Date
  location: string
  notes?: string
}

export interface DoctorPatientLink {
  id: string
  accessCode: string
  doctorId: string
  patientId: string | null
  linkedAt?: Date
  createdAt?: Date
  status: 'active' | 'pending' | 'revoked'
}

export interface DashboardStats {
  totalPatients: number
  activeSessionsThisWeek: number
  averagePainRelief: number
  complianceRate: number
}
