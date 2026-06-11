import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, Copy, ShieldAlert, ChevronDown, CheckCircle2 } from 'lucide-react';
import { generateClinicalNote, type AIPatientSummaryMode } from '@/lib/groq-service';
import type { PatientWithStats } from '@/lib/types';
import { fadeSlideUp } from '@/lib/design-system/animations';

export function AIPatientSummary({ patient }: { patient: PatientWithStats }) {
  const [mode, setMode] = useState<AIPatientSummaryMode>('strict');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDataSource, setShowDataSource] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasSessions = patient.sessions && patient.sessions.length > 0;

  const handleGenerate = async () => {
    if (!hasSessions) {
      setError('Insufficient data: Cannot generate a note without session history.');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateClinicalNote(patient, mode);
      setSummary(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div variants={fadeSlideUp} className="glass-card p-6 mb-8 border border-blue-500/20 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            AI Medical Scribe
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Generate an automated SOAP note from {patient.name}'s recent TENS therapy data.
          </p>
        </div>
        
        <div className="flex items-center bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
          <button
            onClick={() => setMode('strict')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === 'strict' 
                ? 'bg-blue-500 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Clinical Mode (Strict)
          </button>
          <button
            onClick={() => setMode('draft')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === 'draft' 
                ? 'bg-amber-500 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Draft Mode
          </button>
        </div>
      </div>

      {!summary && !isGenerating && !error && (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-800/20">
          <FileText className="w-10 h-10 text-slate-500 mb-3" />
          <p className="text-slate-400 text-sm mb-4 text-center max-w-sm">
            AI will analyze {patient.sessions?.length || 0} recorded sessions to generate a structured clinical note.
          </p>
          <button
            onClick={handleGenerate}
            disabled={!hasSessions}
            className="btn btn-primary"
          >
            <Sparkles className="w-4 h-4" />
            Generate SOAP Note
          </button>
        </div>
      )}

      {isGenerating && (
        <div className="flex flex-col items-center justify-center p-8 border border-slate-700/50 rounded-xl bg-slate-800/20">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-blue-400 font-medium">Analyzing clinical data...</p>
          <p className="text-xs text-slate-500 mt-2">Processing {patient.sessions?.length || 0} session records</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-red-400">Generation Failed</h4>
            <p className="text-sm text-red-300/80 mt-1">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-xs text-slate-400 hover:text-slate-300 mt-2 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {summary && (
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-slate-700/50 bg-slate-800/50">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <FileText className="w-4 h-4 text-blue-400" />
              Generated SOAP Note
              <span className="text-[10px] uppercase tracking-wider bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded ml-2">
                {mode}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDataSource(!showDataSource)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2 py-1"
              >
                Data Source <ChevronDown className={`w-3 h-3 transition-transform ${showDataSource ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-medium bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1.5 rounded-md transition-colors"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy to EMR'}
              </button>
            </div>
          </div>
          
          <AnimatePresence>
            {showDataSource && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-slate-950 p-4 border-b border-slate-800"
              >
                <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Raw Data Used</h4>
                <div className="text-xs text-slate-400 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {patient.sessions?.map((s: { timestamp: string | Date | number, modeName: string, painBefore: number, painAfter: number }) => `[${new Date(s.timestamp).toLocaleDateString()}] Mode: ${s.modeName}, Pain: ${s.painBefore}->${s.painAfter}`).join('\n')}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-5 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap prose prose-invert max-w-none">
            {summary}
          </div>
          
          <div className="p-3 bg-slate-800/30 border-t border-slate-700/50 flex justify-between items-center">
            <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
              <ShieldAlert className="w-3 h-3" />
              AI-generated content. Please verify against raw clinical data before saving to EMR.
            </p>
            <button 
              onClick={handleGenerate}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              Regenerate
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
