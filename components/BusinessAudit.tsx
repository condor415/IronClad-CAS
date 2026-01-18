import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowRight, Check, AlertCircle } from 'lucide-react';
import Button from './Button';
import { generateAudit } from '../services/geminiService';
import { sendAuditNotification } from '../services/emailService';
import { AuditResult, AuditData, LeadData } from '../types';

interface BusinessAuditProps {
  onCtaClick?: (data?: LeadData) => void;
}

const BusinessAudit: React.FC<BusinessAuditProps> = ({ onCtaClick }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  const [formData, setFormData] = useState<AuditData>({
    businessName: '',
    industry: '',
    email: '',
    phone: '',
    revenue: '',
    employees: '',
    accountingSetup: '',
    painPoints: [],
    customPain: ''
  });

  const handleInputChange = (field: keyof AuditData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePainPoint = (point: string) => {
    setFormData(prev => {
      const exists = prev.painPoints.includes(point);
      return {
        ...prev,
        painPoints: exists 
          ? prev.painPoints.filter(p => p !== point)
          : [...prev.painPoints, point]
      };
    });
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    if (!formData.industry || !formData.revenue) return;
    
    setLoading(true);
    setErrorMessage(null);
    setResult(null);

    // 1. Send Email Notification (Fire and forget)
    console.log("Submitting audit, sending email notification...");
    sendAuditNotification(formData).catch(err => console.error("Email dispatch error:", err));
    
    // 2. Generate AI Audit
    try {
      const data = await generateAudit(formData);
      setResult(data);
      setStep(5); // Move to results step
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message || "Analysis failed. Please try again.");
      setLoading(false);
    }
  };

  const handleReviewClick = () => {
    if (onCtaClick) {
      onCtaClick({
        name: formData.businessName, // Using business name as proxy for name if no contact name, or add contact name field
        email: formData.email,
        phone: formData.phone
      });
    } else {
      window.open("https://calendly.com/leeserel/30min", "_blank");
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
            <label className="block text-[#D4DBE2] text-sm font-bold mb-2">Business Name</label>
            <input 
                type="text" 
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full bg-[#051120] border border-[#D4DBE2]/20 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#C47F2A] outline-none"
            />
        </div>
        <div>
            <label className="block text-[#D4DBE2] text-sm font-bold mb-2">Industry</label>
            <select 
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full bg-[#051120] border border-[#D4DBE2]/20 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#C47F2A] outline-none"
            >
                <option value="">Select Industry...</option>
                <option value="Professional Services">Professional Services</option>
                <option value="eCommerce / Retail">eCommerce / Retail</option>
                <option value="Construction / Trades">Construction / Trades</option>
                <option value="SaaS / Technology">SaaS / Technology</option>
                <option value="Healthcare / Medical">Healthcare / Medical</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Other">Other</option>
            </select>
        </div>
        <div>
            <label className="block text-[#D4DBE2] text-sm font-bold mb-2">Work Email</label>
            <input 
                type="email" 
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-[#051120] border border-[#D4DBE2]/20 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#C47F2A] outline-none"
            />
        </div>
        <div>
            <label className="block text-[#D4DBE2] text-sm font-bold mb-2">Phone Number</label>
            <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full bg-[#051120] border border-[#D4DBE2]/20 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#C47F2A] outline-none"
            />
        </div>
      </div>
      <Button 
        onClick={handleNext} 
        disabled={!formData.businessName || !formData.industry || !formData.email || !formData.phone} 
        className="w-full"
      >
        Next Step <ArrowRight size={18} />
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <div>
            <label className="block text-[#D4DBE2] text-sm font-bold mb-2">Monthly Revenue Range</label>
            <div className="grid grid-cols-2 gap-3">
                {['<$50k', '$50k - $200k', '$200k - $1M', '$1M+'].map(opt => (
                    <button
                        key={opt}
                        onClick={() => handleInputChange('revenue', opt)}
                        className={`p-3 rounded-lg border text-sm font-bold transition-all ${formData.revenue === opt ? 'bg-[#C47F2A] border-[#C47F2A] text-white' : 'bg-[#051120] border-[#D4DBE2]/20 text-[#D4DBE2] hover:bg-[#102A4C]'}`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
        <div>
            <label className="block text-[#D4DBE2] text-sm font-bold mb-2">Number of Employees</label>
             <div className="grid grid-cols-4 gap-3">
                {['1-5', '6-20', '21-50', '50+'].map(opt => (
                    <button
                        key={opt}
                        onClick={() => handleInputChange('employees', opt)}
                        className={`p-3 rounded-lg border text-sm font-bold transition-all ${formData.employees === opt ? 'bg-[#C47F2A] border-[#C47F2A] text-white' : 'bg-[#051120] border-[#D4DBE2]/20 text-[#D4DBE2] hover:bg-[#102A4C]'}`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button onClick={() => setStep(1)} className="text-[#D4DBE2] underline text-sm">Back</button>
        <Button onClick={handleNext} disabled={!formData.revenue || !formData.employees} className="flex-1">
            Next Step <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
       <div>
            <label className="block text-[#D4DBE2] text-sm font-bold mb-4">Current Accounting Setup</label>
            <div className="space-y-3">
                {[
                    { val: 'QuickBooks/Xero (DIY)', label: 'I do it myself (QuickBooks/Xero)' },
                    { val: 'Bookkeeper', label: 'I have a part-time bookkeeper' },
                    { val: 'In-House', label: 'I have full-time in-house staff' },
                    { val: 'Spreadsheets', label: 'Excel / Spreadsheets / Shoebox' },
                    { val: 'CPA Firm', label: 'My tax CPA handles it (once a year)' }
                ].map(opt => (
                    <button
                        key={opt.val}
                        onClick={() => handleInputChange('accountingSetup', opt.val)}
                        className={`w-full p-4 rounded-lg border text-left flex items-center justify-between transition-all ${formData.accountingSetup === opt.val ? 'bg-[#C47F2A] border-[#C47F2A] text-white shadow-lg' : 'bg-[#051120] border-[#D4DBE2]/20 text-[#D4DBE2] hover:bg-[#102A4C]'}`}
                    >
                        <span className="font-semibold">{opt.label}</span>
                        {formData.accountingSetup === opt.val && <Check size={18} />}
                    </button>
                ))}
            </div>
        </div>
        <div className="flex gap-4 items-center">
            <button onClick={() => setStep(2)} className="text-[#D4DBE2] underline text-sm">Back</button>
            <Button onClick={handleNext} disabled={!formData.accountingSetup} className="flex-1">
                Next Step <ArrowRight size={18} />
            </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div>
            <label className="block text-[#D4DBE2] text-sm font-bold mb-4">What's keeping you up at night? (Select all that apply)</label>
            <div className="grid md:grid-cols-2 gap-3 mb-4">
                {[
                    "Cash Flow unpredictability",
                    "Low Profit Margins",
                    "High Tax Bills",
                    "Blind Decision Making",
                    "Payroll struggles",
                    "Inventory Management",
                    "Investor Reporting",
                    "Overhead costs"
                ].map(opt => (
                    <button
                        key={opt}
                        onClick={() => togglePainPoint(opt)}
                        className={`p-3 rounded-lg border text-xs md:text-sm font-medium text-left transition-all ${formData.painPoints.includes(opt) ? 'bg-[#102A4C] border-[#C47F2A] text-white shadow-md shadow-[#C47F2A]/10' : 'bg-[#051120] border-[#D4DBE2]/10 text-[#D4DBE2]/70 hover:border-[#D4DBE2]/40'}`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
            <textarea 
                 value={formData.customPain}
                 onChange={(e) => handleInputChange('customPain', e.target.value)}
                 placeholder="Any specific challenges?"
                 className="w-full bg-[#051120] border border-[#D4DBE2]/20 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#C47F2A] outline-none min-h-[80px] text-sm"
            />
        </div>
        <div className="flex gap-4 items-center">
            <button onClick={() => setStep(3)} className="text-[#D4DBE2] underline text-sm">Back</button>
            <Button onClick={handleSubmit} variant="ai" disabled={loading} className="flex-1">
                 {loading ? <><Loader2 className="animate-spin" /> Analyzing Business...</> : <><Sparkles size={20} /> Generate Audit</>}
            </Button>
        </div>
        {errorMessage && (
            <div className="flex items-center gap-2 text-red-300 bg-red-900/20 px-4 py-2 rounded-lg border border-red-500/30 text-sm">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{errorMessage}</span>
            </div>
        )}
      </div>
  );

  const renderResults = () => {
    if (!result) return null;
    return (
        <div className="animate-in zoom-in-95 duration-500">
            <div className="text-center mb-8">
                <div className="inline-block bg-[#C47F2A] text-white px-4 py-1 rounded-full text-sm font-bold mb-4">AUDIT COMPLETE</div>
                <h3 className="text-2xl font-bold text-white">Analysis for {formData.businessName}</h3>
            </div>
            
             <div className="bg-[#051120] rounded-xl border border-red-500/50 p-6 grid md:grid-cols-2 gap-8 mb-8 shadow-2xl">
              <div>
                <p className="text-[#D4DBE2] text-xs uppercase tracking-wider font-bold mb-2 flex items-center gap-2">
                    <AlertCircle size={14} className="text-red-500"/> Risk Assessment
                </p>
                <p className="text-xl md:text-2xl font-bold text-white leading-tight">{result.bleed_estimate}</p>
              </div>
              <div>
                <p className="text-[#D4DBE2] text-xs uppercase tracking-wider font-bold mb-2 flex items-center gap-2">
                    <Sparkles size={14} className="text-[#C47F2A]"/> Strategic Triage Plan
                </p>
                <ul className="space-y-3 mt-2">
                  {result.triage_plan.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-200 text-sm">
                      <span className="text-[#C47F2A] font-bold min-w-[20px]">{idx + 1}.</span> {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="text-center">
                <p className="text-[#D4DBE2] mb-4 text-sm">We have captured your business profile. Let's discuss these results in detail.</p>
                <Button 
                    onClick={handleReviewClick} 
                    variant="primary" 
                    className="mx-auto w-full md:w-auto"
                >
                    Review with an IronClad CFO
                </Button>
                <button onClick={() => {setStep(1); setResult(null);}} className="block mx-auto mt-4 text-[#D4DBE2]/50 text-sm hover:text-white">Start Over</button>
            </div>
        </div>
    );
  };

  return (
    <div className="bg-[#D4DBE2] py-12 border-b border-[#0B1F3A]/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B1F3A] rounded-2xl border border-[#C47F2A]/30 p-8 md:p-12 relative overflow-hidden shadow-2xl">
          
          {/* Header */}
          {step < 5 && (
            <div className="relative z-10 text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-3">IronClad Business Audit</h2>
                <p className="text-[#D4DBE2] max-w-xl mx-auto">Answer 4 quick questions to unlock a free AI-powered financial assessment of your business.</p>
            </div>
          )}

          {/* Progress Bar */}
          {step < 5 && (
            <div className="w-full bg-[#051120] h-2 rounded-full mb-8 overflow-hidden border border-[#D4DBE2]/10">
                <div 
                    className="bg-[#C47F2A] h-full transition-all duration-500 ease-out"
                    style={{ width: `${(step / 4) * 100}%` }}
                ></div>
            </div>
          )}

          {/* Steps */}
          <div className="relative z-10 min-h-[300px]">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderResults()}
          </div>

        </div>
      </div>
    </div>
  );
};

export default BusinessAudit;