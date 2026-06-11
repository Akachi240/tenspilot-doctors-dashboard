/* eslint-disable no-console */
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../src/lib/firebase';

/**
 * Migration script to normalize existing sessions to the new unified schema.
 */
export async function migrateSessions() {
  console.log('Starting session migration...');
  const sessionsRef = collection(db, 'sessions');
  const snapshot = await getDocs(sessionsRef);

  let updatedCount = 0;

  for (const sessionDoc of snapshot.docs) {
    const data = sessionDoc.data();
    
    // Check if it needs migration
    const needsMigration = data.placement && !data.location;
    
    if (needsMigration) {
      console.log(`Migrating session ${sessionDoc.id}...`);
      
      const updates: Record<string, unknown> = {
        location: data.placement || data.location || 'Unknown',
        // Copy other nested parameters if needed
        duration: data.duration || data.parameters?.duration || 0,
        intensity: data.intensity || data.parameters?.intensity || 0,
        reductionPct: data.reductionPct ?? (data.painBefore && data.painAfter ? Math.round(((data.painBefore - data.painAfter) / data.painBefore) * 100) : 0),
      };

      await updateDoc(doc(db, 'sessions', sessionDoc.id), updates);
      updatedCount++;
    }
  }

  console.log(`Migration complete. Updated ${updatedCount} sessions.`);
}
