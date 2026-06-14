import { useState, useEffect } from 'react';
import { doc, collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Patient, Session, PainLog } from '@/lib/types';
import { mapPatient, mapSession } from '@/lib/firestore';

export function usePatientDetail(patientId: string | undefined) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [painLogs, setPainLogs] = useState<PainLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);

    const unsubPatient = onSnapshot(doc(db, 'users', patientId), (docSnap) => {
      if (docSnap.exists()) {
        setPatient(mapPatient(docSnap));
      } else {
        setPatient(null);
      }
      setLoading(false); // We consider it loaded once patient info arrives
    });

    const sQ = query(
      collection(db, 'sessions'),
      where('patientId', '==', patientId),
      orderBy('timestamp', 'desc')
    );
    const unsubSessions = onSnapshot(sQ, (sSnap) => {
      setSessions(sSnap.docs.map(d => mapSession(d.id, d.data())).filter(Boolean) as Session[]);
    }, () => {
      // Fallback if missing index:
      const fallbackQ = query(collection(db, 'sessions'), where('patientId', '==', patientId));
      onSnapshot(fallbackQ, (fallbackSnap) => {
        const s = fallbackSnap.docs.map(d => mapSession(d.id, d.data())).filter(Boolean) as Session[];
        setSessions(s.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
      });
    });

    const pQ = query(
      collection(db, 'pain_logs'),
      where('patientId', '==', patientId),
      orderBy('timestamp', 'desc')
    );
    const unsubPainLogs = onSnapshot(pQ, (pSnap) => {
      setPainLogs(pSnap.docs.map(doc => {
        const data = doc.data();
        let timestamp: Date | undefined;
        if (data.timestamp instanceof Timestamp) {
          timestamp = data.timestamp.toDate();
        } else if (data.timestamp?.seconds) {
          timestamp = new Date(data.timestamp.seconds * 1000);
        } else if (data.timestamp instanceof Date) {
          timestamp = data.timestamp;
        } else {
          timestamp = new Date();
        }
        return { id: doc.id, ...data, timestamp } as PainLog;
      }));
    }, () => {
      const fallbackQ = query(collection(db, 'pain_logs'), where('patientId', '==', patientId));
      onSnapshot(fallbackQ, (fallbackSnap) => {
        const logs = fallbackSnap.docs.map(doc => {
          const data = doc.data();
          let timestamp: Date | undefined;
          if (data.timestamp instanceof Timestamp) {
            timestamp = data.timestamp.toDate();
          } else if (data.timestamp?.seconds) {
            timestamp = new Date(data.timestamp.seconds * 1000);
          } else if (data.timestamp instanceof Date) {
            timestamp = data.timestamp;
          } else {
            timestamp = new Date();
          }
          return { id: doc.id, ...data, timestamp } as PainLog;
        });
        setPainLogs(logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
      });
    });

    return () => {
      unsubPatient();
      unsubSessions();
      unsubPainLogs();
    };
  }, [patientId]);

  return { patient, sessions, painLogs, loading };
}
