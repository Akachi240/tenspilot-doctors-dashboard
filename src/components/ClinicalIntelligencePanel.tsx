import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import type { PatientWithStats } from '@/lib/types';
import { fadeSlideUp, staggerContainer } from '@/lib/design-system/animations';
import { useNavigate } from 'react-router-dom';

interface ClinicalIntelligencePanelProps {
  patients: PatientWithStats[];
}

export function ClinicalIntelligencePanel({ patients }: ClinicalIntelligencePanelProps) {
  const navigate = useNavigate();

  const insights = useMemo(() => {
    if (!patients || patients.length === 0) return null;

    // Fastest Improving (highest avg pain relief)
    const fastestImproving = [...patients]
      .filter(p => p.avgPainRelief && p.avgPainRelief > 0)
      .sort((a, b) => (b.avgPainRelief || 0) - (a.avgPainRelief || 0))[0];

    // At Risk (lowest avg pain relief, or total sessions > 3 with < 1 pt relief)
    const atRisk = [...patients]
      .filter(p => p.totalSessions && p.totalSessions > 2)
      .sort((a, b) => (a.avgPainRelief || 0) - (b.avgPainRelief || 0))[0];

    return {
      fastestImproving,
      atRisk: atRisk?.avgPainRelief !== undefined && atRisk.avgPainRelief < 2 ? atRisk : null,
    };
  }, [patients]);

  if (!insights) return null;

  return (
    <motion.div variants={fadeSlideUp} className="glass-card overflow-hidden border-t-2 border-t-indigo-500 mb-8">
      <div className="p-4 bg-indigo-500/10 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
          Clinical Intelligence Panel
        </h2>
      </div>
      
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
        
        {/* Fastest Improving */}
        <motion.div variants={fadeSlideUp} className="p-6 hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => insights.fastestImproving && navigate(`/patients/${insights.fastestImproving.id}`)}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-slate-300">Fastest Improving</h3>
          </div>
          {insights.fastestImproving ? (
            <div>
              <p className="text-xl font-bold text-slate-100">{insights.fastestImproving.name}</p>
              <p className="text-sm text-emerald-400 mt-1">Avg Relief: {insights.fastestImproving.avgPainRelief} pts</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">Insufficient data</p>
          )}
          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors mt-4 opacity-0 group-hover:opacity-100" />
        </motion.div>

        {/* At Risk */}
        <motion.div variants={fadeSlideUp} className="p-6 hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => insights.atRisk && navigate(`/patients/${insights.atRisk.id}`)}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-slate-300">At Risk (No Improvement)</h3>
          </div>
          {insights.atRisk ? (
            <div>
              <p className="text-xl font-bold text-slate-100">{insights.atRisk.name}</p>
              <p className="text-sm text-red-400 mt-1">Avg Relief: {insights.atRisk.avgPainRelief} pts after {insights.atRisk.totalSessions} sessions</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">All active patients showing improvement</p>
          )}
          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-red-400 transition-colors mt-4 opacity-0 group-hover:opacity-100" />
        </motion.div>

        {/* System Metric */}
        <motion.div variants={fadeSlideUp} className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-slate-300">Avg Device Usage</h3>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-100">32 min</p>
            <p className="text-sm text-slate-400 mt-1">Per active session</p>
          </div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
