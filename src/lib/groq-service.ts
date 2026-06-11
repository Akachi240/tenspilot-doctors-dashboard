import Groq from 'groq-sdk';
import type { PatientWithStats, Session } from './types';

// Use standard API key env variable naming based on your setup.
// Assuming VITE_GROQ_API_KEY
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true, 
});

export type AIPatientSummaryMode = 'draft' | 'strict';

export async function generateClinicalNote(
  patient: PatientWithStats, 
  mode: AIPatientSummaryMode = 'strict'
): Promise<string> {
  const sessions = patient.sessions || [];
  
  if (sessions.length === 0) {
    throw new Error('Insufficient data: Patient has no recorded sessions.');
  }

  // Construct raw context block
  const rawData = sessions.map((s: Session & { placement?: string }) => (
    `Date: ${s.timestamp}
Mode: ${s.modeName} (${s.modeId})
Duration: ${s.duration} min
Intensity: ${s.intensity}
Placement: ${s.location || s.placement || 'Unknown'}
Pain Before: ${s.painBefore}
Pain After: ${s.painAfter}
Reduction: ${Math.round(((s.painBefore - s.painAfter) / s.painBefore) * 100)}%
Notes: ${s.notes || 'None'}`
  )).join('\n\n');

  const strictPrompt = `
You are an expert Clinical Documentation Assistant. Your sole purpose is to generate a SOAP note (Subjective, Objective, Assessment, Plan) based STRICTLY on the provided raw TENS therapy session data.

CRITICAL RULES:
1. Use ONLY the provided session data.
2. DO NOT infer, fabricate, or guess any missing values. 
3. If data for a section is missing or incomplete, explicitly state "Data unavailable".
4. Do not invent trends or exaggerate improvements.
5. In the "Plan" section, you may suggest standard next steps based on the trend, but CLEARLY label them as "(AI Suggestion)".

RAW SESSION DATA FOR PATIENT: ${patient.name}
${rawData}

OUTPUT FORMAT:
Generate a clean, readable markdown SOAP note.
`;

  const draftPrompt = `
You are an expert Clinical Documentation Assistant. Generate a draft SOAP note based on the provided TENS therapy session data. You may be slightly more conversational and infer general trends from the data.

RAW SESSION DATA FOR PATIENT: ${patient.name}
${rawData}

OUTPUT FORMAT:
Generate a clean, readable markdown SOAP note.
`;

  const systemMessage = mode === 'strict' ? strictPrompt : draftPrompt;

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemMessage
      },
      {
        role: "user",
        content: "Generate the clinical SOAP note now."
      }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: mode === 'strict' ? 0.0 : 0.4,
  });

  return response.choices[0]?.message?.content || "No summary generated.";
}
