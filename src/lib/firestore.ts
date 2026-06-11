import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  Timestamp,
  serverTimestamp,
  limit,
  addDoc,
  DocumentSnapshot,
  writeBatch,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type {
  Patient,
  Session,
  PainLog,
  DoctorPatientLink,
  DashboardStats,
  PatientWithStats,
} from '@/lib/types'
import { generateAccessCode, calculatePainRelief } from '@/lib/utils'

export interface DoctorPatientsResult {
  patients: PatientWithStats[]
  allSessions: Session[]
}

/** Fetch all patients linked to a doctor. Optimized to prevent N+1 queries. */
export async function fetchDoctorPatients(doctorId: string): Promise<DoctorPatientsResult> {
  // 1. Fetch links to get patient IDs
  const linksQuery = query(
    collection(db, 'doctorPatientLinks'),
    where('doctorId', '==', doctorId),
    where('status', '==', 'active')
  )
  const linksSnapshot = await getDocs(linksQuery)
  const patientIds = linksSnapshot.docs
    .map((d) => d.data().patientId)
    .filter((id): id is string => !!id)

  if (patientIds.length === 0) return { patients: [], allSessions: [] }

  // 2. Batch-fetch all patient and session data
  const CHUNK_SIZE = 30 // Firestore 'in' query limit
  const patientIdChunks = chunkArray(patientIds, CHUNK_SIZE)

  const patientPromises = patientIdChunks.map((idChunk) =>
    getDocs(query(collection(db, 'users'), where('__name__', 'in', idChunk)))
  )
  const sessionPromises = patientIdChunks.map((idChunk) =>
    getDocs(query(collection(db, 'sessions'), where('patientId', 'in', idChunk)))
  )

  const [patientSnapshots, sessionSnapshots] = await Promise.all([
    Promise.all(patientPromises),
    Promise.all(sessionPromises),
  ])

  // 3. Process and map the data
  const patientsMap = new Map<string, Patient>()
  patientSnapshots
    .flatMap((snap) => snap.docs)
    .forEach((doc) => {
      patientsMap.set(doc.id, mapPatient(doc))
    })

  const sessionsMap = new Map<string, Session[]>()
  sessionSnapshots
    .flatMap((snap) => snap.docs)
    .forEach((doc) => {
      const session = mapSession(doc.id, doc.data())
      if (session) {
        const existing = sessionsMap.get(session.patientId) || []
        sessionsMap.set(session.patientId, [...existing, session])
      }
    })

  // 4. Combine into PatientWithStats and calculate stats
  // Collect all sessions for reuse by the dashboard
  const allSessions: Session[] = []
  sessionsMap.forEach((sessions) => allSessions.push(...sessions))

  const patients = patientIds
    .map((id) => {
      const patient = patientsMap.get(id)
      if (!patient) return null

      const sessions = sessionsMap.get(id) || []
      sessions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

      const totalSessions = sessions.length
      const avgPainRelief =
        totalSessions > 0
          ? sessions.reduce((acc, s) => acc + calculatePainRelief(s.painBefore, s.painAfter), 0) /
            totalSessions
          : 0

      return {
        ...patient,
        totalSessions,
        avgPainRelief: Math.round(avgPainRelief * 10) / 10,
        lastSessionDate: sessions[0]?.timestamp,
      } as PatientWithStats
    })
    .filter((p): p is PatientWithStats => p !== null)

  return { patients, allSessions }
}

/** Fetch all sessions for a specific patient */
export async function fetchPatientSessions(patientId: string): Promise<Session[]> {
  try {
    const sessionsQuery = query(
      collection(db, 'sessions'),
      where('patientId', '==', patientId),
      orderBy('timestamp', 'desc')
    )
    const snapshot = await getDocs(sessionsQuery)
    return snapshot.docs.map((d) => mapSession(d.id, d.data())).filter((s): s is Session => !!s)
  } catch {
    // Fallback: fetch without orderBy if composite index missing
    const fallbackQuery = query(
      collection(db, 'sessions'),
      where('patientId', '==', patientId)
    )
    const snapshot = await getDocs(fallbackQuery)
    const sessions = snapshot.docs.map((d) => mapSession(d.id, d.data())).filter((s): s is Session => !!s)
    // Sort in memory as a fallback
    return sessions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }
}

export async function fetchPatientPainLogs(patientId: string): Promise<PainLog[]> {
  try {
    const q = query(
      collection(db, 'pain_logs'),
      where('patientId', '==', patientId),
      orderBy('timestamp', 'desc')
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => {
      const data = doc.data()
      const ts = data.timestamp as Timestamp | Date | undefined
      let timestamp: Date | undefined
      if (ts instanceof Date) timestamp = ts
      else if (ts && typeof ts === 'object' && 'toDate' in ts) timestamp = (ts as any).toDate()

      return {
        id: doc.id,
        patientId: (data.patientId as string) || patientId,
        painLevel: Number(data.painLevel) || 0,
        location: (data.location as string) || 'Unknown',
        notes: data.notes as string | undefined,
        timestamp: timestamp || new Date(),
        source: data.source as 'manual' | 'pre-session' | 'post-session' | undefined,
      }
    })
  } catch (error) {
    console.error(`Error fetching pain logs for patient ${patientId}:`, error)
    return []
  }
}

/** Fetch a single patient by ID */
export async function fetchPatient(patientId: string): Promise<Patient | null> {
  const patientDoc = await getDoc(doc(db, 'users', patientId))
  if (!patientDoc.exists()) return null
  return mapPatient(patientDoc)
}

/** Calculate dashboard-level statistics */
export async function fetchDashboardStats(doctorId: string): Promise<DashboardStats> {
  const linksQuery = query(
    collection(db, 'doctorPatientLinks'),
    where('doctorId', '==', doctorId),
    where('status', '==', 'active')
  )
  const linksSnapshot = await getDocs(linksQuery)
  const patientIds = linksSnapshot.docs.map((d) => d.data().patientId).filter((id) => !!id)
  const totalPatients = patientIds.length

  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  let weeklySessionCount = 0
  let totalRelief = 0
  let reliefCount = 0

  if (patientIds.length > 0) {
    // Use a single 'in' query to fetch all relevant sessions at once
    // Note: This still has the 30-ID limit. For a production app with many patients,
    // this should be chunked.
    const patientIdChunks = chunkArray(patientIds, 30);
    const queryPromises = patientIdChunks.map(chunk =>
      getDocs(query(
          collection(db, 'sessions'),
          where('patientId', 'in', chunk),
          where('timestamp', '>=', Timestamp.fromDate(oneWeekAgo))
      ))
    );
    try {
      const querySnapshots = await Promise.all(queryPromises);

      for (const snapshot of querySnapshots) {
        weeklySessionCount += snapshot.size;
        for (const d of snapshot.docs) {
          const data = d.data();
          totalRelief += calculatePainRelief((data.painBefore as number) || 0, (data.painAfter as number) || 0);
          reliefCount++;
        }
      }
    } catch (err) {
      console.warn("Failed to fetch dashboard stats with timestamp index, trying fallback...", err);
      const fallbackPromises = patientIdChunks.map(chunk =>
        getDocs(query(
            collection(db, 'sessions'),
            where('patientId', 'in', chunk)
        ))
      );
      const fallbackSnapshots = await Promise.all(fallbackPromises);
      for (const snapshot of fallbackSnapshots) {
        for (const d of snapshot.docs) {
          const data = d.data();
          const sessionTimestamp = (data.timestamp as Timestamp)?.toDate();
          if (sessionTimestamp && sessionTimestamp >= oneWeekAgo) {
            weeklySessionCount++;
            totalRelief += calculatePainRelief((data.painBefore as number) || 0, (data.painAfter as number) || 0);
            reliefCount++;
          }
        }
      }
    }
  }

  const averagePainRelief =
    reliefCount > 0 ? Math.round((totalRelief / reliefCount) * 10) / 10 : 0
  const complianceRate =
    totalPatients > 0
      ? Math.min(100, Math.round((weeklySessionCount / (totalPatients * 3)) * 100))
      : 0

  return {
    totalPatients,
    activeSessionsThisWeek: weeklySessionCount,
    averagePainRelief,
    complianceRate,
  }
}

/** Create a new patient access code */
export async function createAccessCode(doctorId: string): Promise<DoctorPatientLink> {
  const code = generateAccessCode()

  const linkData = {
    accessCode: code,
    doctorId,
    patientId: null,
    createdAt: serverTimestamp(),
    status: 'active',
  }

  const timeoutPromise = new Promise<never>((_, reject) => 
    setTimeout(() => reject(new Error('Network timeout: Could not connect to database. Please disable any AdBlockers or VPNs.')), 8000)
  );

  const docRef = await Promise.race([
    addDoc(collection(db, 'doctorPatientLinks'), linkData),
    timeoutPromise
  ]);

  return {
    id: docRef.id,
    accessCode: code,
    doctorId,
    patientId: null,
    createdAt: new Date(),
    status: 'active',
  }
}

/** Fetch recent access codes for a doctor */
export async function fetchAccessCodes(doctorId: string): Promise<DoctorPatientLink[]> {
  const timeoutPromise = new Promise<never>((_, reject) => 
    setTimeout(() => reject(new Error('Network timeout: Could not fetch access codes')), 8000)
  );

  try {
    const codesQuery = query(
      collection(db, 'doctorPatientLinks'),
      where('doctorId', '==', doctorId),
      orderBy('createdAt', 'desc'),
      limit(10)
    )
    const snapshot = await Promise.race([getDocs(codesQuery), timeoutPromise]);
    return snapshot.docs.map((d) => mapLink(d.id, d.data()))
  } catch (err) {
    console.warn("Failed to fetch ordered access codes, trying fallback...", err);
    try {
      // Fallback without orderBy
      const fallbackQuery = query(
        collection(db, 'doctorPatientLinks'),
        where('doctorId', '==', doctorId)
      )
      const snapshot = await Promise.race([getDocs(fallbackQuery), timeoutPromise]);
      return snapshot.docs.map((d) => mapLink(d.id, d.data()))
    } catch (fallbackErr) {
      console.error("Fallback fetch also failed:", fallbackErr);
      return [];
    }
  }
}

/** Revoke an access code */
export async function revokeAccessCode(linkId: string): Promise<void> {
  await updateDoc(doc(db, 'doctorPatientLinks', linkId), {
    status: 'revoked',
  })
}

/** Unlink a patient — revokes the link and clears patient's linkedDoctorId */
export async function unlinkPatient(linkId: string, patientId: string): Promise<void> {
  const batch = writeBatch(db)
  const linkRef = doc(db, 'doctorPatientLinks', linkId)
  batch.update(linkRef, { status: 'revoked' })
  const patientRef = doc(db, 'users', patientId)
  batch.update(patientRef, { linkedDoctorId: null })
  await batch.commit()
}

/** Update session notes */
export async function updateSessionNotes(sessionId: string, notes: string): Promise<void> {
  await updateDoc(doc(db, 'sessions', sessionId), {
    notes,
    updatedAt: serverTimestamp(),
  })
}

// ── Helpers ──

function chunkArray<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  )
}

import { validateSession } from '@/lib/schemas/session.schema';

function mapSession(id: string, data: Record<string, unknown>): Session | null {
  try {
    // Handle both Firestore Timestamp and Date objects
    const ts = data.timestamp as Timestamp | Date | undefined;
    let timestamp: Date | undefined;

    if (ts instanceof Date) {
      timestamp = ts;
    } else if (ts && typeof ts === 'object' && 'toDate' in ts) {
      timestamp = (ts as any).toDate();
    }

    // Validate required fields
    if (!timestamp) {
      console.warn(
        `❌ Session ${id}: Missing or invalid timestamp. Raw data:`,
        data
      );
      return null;
    }

    const patientId = (data.patientId as string) || '';
    if (!patientId) {
      console.warn(`❌ Session ${id}: Missing patientId`);
      return null;
    }

    // Build session object
    const session: Session = {
      id,
      patientId,
      modeId: (data.modeId as string) || 'general',
      modeName: (data.modeName as string) || 'General TENS',
      painBefore: Number(data.painBefore) || 0,
      painAfter: Number(data.painAfter) || 0,
      duration: Number(data.duration) || 0,
      intensity: Number(data.intensity) || 0,
      timestamp,
      location: (data.location as string) || 'Unknown',
      notes: (data.notes as string) || undefined,
    };

    // ✅ Validate session data
    const validationErrors = validateSession(session);
    if (validationErrors.length > 0) {
      console.warn(
        `⚠️ Session ${id} has validation issues:`,
        validationErrors
      );
      // Still return it, but log the warning
    }

    return session;
  } catch (error) {
    console.error(`❌ Error mapping session ${id}:`, error);
    return null;
  }
}

function mapLink(id: string, data: Record<string, unknown>): DoctorPatientLink {
  return {
    id,
    accessCode: (data.accessCode as string) || '',
    doctorId: (data.doctorId as string) || '',
    patientId: (data.patientId as string) || null,
    linkedAt: (data.linkedAt as Timestamp)?.toDate?.(),
    createdAt: (data.createdAt as Timestamp)?.toDate?.(),
    status: (data.status as 'active' | 'pending' | 'revoked') || 'active',
  }
}

function mapPatient(doc: DocumentSnapshot): Patient {
  const data = doc.data() || {}
  return {
    id: doc.id,
    email: (data.email as string) || '',
    name: (data.name as string) || (data.displayName as string) || `Patient ${doc.id.slice(0, 6)}`,
    condition: data.condition as string | undefined,
    linkedDoctorId: data.linkedDoctorId as string | undefined,
    createdAt: (data.createdAt as Timestamp)?.toDate(),
  }
}
