import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { PatientWithStats, Session, Patient } from '@/lib/types';
import { calculatePainRelief } from '@/lib/utils';
import { mapPatient, mapSession } from '@/lib/firestore';

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export function useDoctorData(doctorId: string | undefined) {
  const [patients, setPatients] = useState<PatientWithStats[]>([]);
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!doctorId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    const qLinks = query(
      collection(db, 'doctorPatientLinks'),
      where('doctorId', '==', doctorId),
      where('status', '==', 'active')
    );

    let unsubUsers: (() => void)[] = [];
    let unsubSessions: (() => void)[] = [];

    const unsubscribeLinks = onSnapshot(qLinks, (linksSnap) => {
      // Clear previous sub-listeners if links change
      unsubUsers.forEach(u => u());
      unsubSessions.forEach(u => u());
      unsubUsers = [];
      unsubSessions = [];

      const patientIds = linksSnap.docs.map(d => d.data().patientId).filter(Boolean);
      
      if (patientIds.length === 0) {
        setPatients([]);
        setAllSessions([]);
        setLoading(false);
        return;
      }

      const chunks = chunkArray(patientIds, 30);
      const usersMap = new Map<string, Patient>();
      const sessionsMap = new Map<string, Session[]>();
      
      const updateState = () => {
        const allSess: Session[] = [];
        sessionsMap.forEach(sess => allSess.push(...sess));
        setAllSessions(allSess);

        const pats = patientIds.map(id => {
          const p = usersMap.get(id);
          if (!p) return null;
          const sess = sessionsMap.get(id) || [];
          sess.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
          const totalSessions = sess.length;
          const avgPainRelief = totalSessions > 0
            ? sess.reduce((acc, s) => acc + calculatePainRelief(s.painBefore, s.painAfter), 0) / totalSessions
            : 0;

          return {
            ...p,
            totalSessions,
            avgPainRelief: Math.round(avgPainRelief * 10) / 10,
            lastSessionDate: sess[0]?.timestamp,
          } as PatientWithStats;
        }).filter(Boolean) as PatientWithStats[];

        setPatients(pats);
        setLoading(false);
      };

      chunks.forEach(chunk => {
        const uQ = query(collection(db, 'users'), where('__name__', 'in', chunk));
        const uUnsub = onSnapshot(uQ, (uSnap) => {
          uSnap.docs.forEach(doc => usersMap.set(doc.id, mapPatient(doc)));
          updateState();
        });
        unsubUsers.push(uUnsub);

        const sQ = query(collection(db, 'sessions'), where('patientId', 'in', chunk));
        const sUnsub = onSnapshot(sQ, (sSnap) => {
          // Clear current chunk from sessionsMap to avoid stale sessions if deleted
          chunk.forEach(id => sessionsMap.set(id, []));
          sSnap.docs.forEach(doc => {
            const sess = mapSession(doc.id, doc.data());
            if (sess) {
              const existing = sessionsMap.get(sess.patientId) || [];
              sessionsMap.set(sess.patientId, [...existing, sess]);
            }
          });
          updateState();
        });
        unsubSessions.push(sUnsub);
      });
    });

    return () => {
      unsubscribeLinks();
      unsubUsers.forEach(u => u());
      unsubSessions.forEach(u => u());
    };
  }, [doctorId]);

  return { patients, allSessions, loading };
}
