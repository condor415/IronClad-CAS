import React, { useState } from 'react';
import { Sparkles, Loader2, BrainCircuit, AlertCircle } from 'lucide-react';
import Button from './Button';
import { generateAudit } from '../services/geminiService';
import { AuditResult } from '../types';

const ProfitLeakDetector: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleAudit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setError(false);
    
    try {
      const data = await generateAudit(input);
      if (data) {
        setResult(data);
      } else {
        setError(true);
      }
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#D4DBE2] py-12 border-b border-[#0B1F3A]/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B1F3A] rounded-2xl border border-[#C47F2A]/30 p-8 md:p-12 relative overflow-hidden shadow-2xl">
          
          {/* Header */}
          <div className="relative z-10 text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#102A4C] border border-[#C47F2A]/50 text-[#C47F2A] text-sm font-semibold mb-4">
              <Sparkles size={14} /> Powered by Gemini AI
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Instant Business Profit Audit</h2>
            <p className="text-[#D4DBE2]">Describe a specific financial pain point. Our AI CFO will estimate the impact.</p>
          </div>

          {/* Input Area */}
          <div className="relative z-10 space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. We keep hiring people but our profit margin isn't going up..."
              className="w-full bg-[#051120] border border-[#D4DBE2]/20 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#C47F2A] min-h-[100px] placeholder:text-slate-500"
            />
            <div className="flex justify-center flex-col items-center gap-4">
              <Button onClick={handleAudit} variant="ai" disabled={loading || !input.trim()}>
                {loading ? <><Loader2 className="animate-spin" /> Analyzing...</> : <><BrainCircuit size={20} /> Analyze My Business ✨</>}
              </Button>
              
              {error && (
                <div className="flex items-center gap-2 text-red-300 bg-red-900/20 px-4 py-2 rounded-lg border border-red-500/30">
                  <AlertCircle size={16} />
                  <span className="text-sm">Analysis failed. Please try again.</span>
                </div>
              )}
            </div>
          </div>

          {/* Results Area */}
          {result && (
            <div className="mt-8 bg-[#051120] rounded-xl border border-red-500/50 p-6 grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <p className="text-[#D4DBE2] text-sm uppercase tracking-wider font-bold mb-2">Financial Impact Analysis</p>
                <p className="text-3xl md:text-4xl font-extrabold text-white">{result.bleed_estimate}</p>
              </div>
              <div>
                <p className="text-[#D4DBE2] text-sm uppercase tracking-wider font-bold mb-2">Strategic Triage Plan</p>
                <ul className="space-y-3 mt-2">
                  {result.triage_plan.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-200 text-sm">
                      <span className="text-[#C47F2A] font-bold min-w-[20px]">{idx + 1}.</span> {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfitLeakDetector;