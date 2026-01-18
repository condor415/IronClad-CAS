import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { LeadData } from '../types';

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillData?: LeadData;
}

const BASE_CALENDLY_URL = "https://calendly.com/ironcladcas/30min"; 

const CalendlyModal: React.FC<CalendlyModalProps> = ({ isOpen, onClose, prefillData }) => {
  useEffect(() => {
    if (isOpen) {
      const head = document.querySelector('head');
      // Prevent adding duplicate script if already exists
      if (!document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
        const script = document.createElement('script');
        script.setAttribute('src', 'https://assets.calendly.com/assets/external/widget.js');
        script.setAttribute('async', 'true');
        head?.appendChild(script);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Construct URL with prefill data
  let finalUrl = BASE_CALENDLY_URL;
  if (prefillData) {
    const params = new URLSearchParams();
    if (prefillData.name) params.append('name', prefillData.name);
    if (prefillData.email) params.append('email', prefillData.email);
    // Calendly usually maps custom questions to a1, a2 etc, but phone might be different. 
    // Usually 'location' is used for phone if meeting location is phone.
    // For now we just pass standard fields.
    
    const queryString = params.toString();
    if (queryString) {
      finalUrl = `${BASE_CALENDLY_URL}?${queryString}`;
    }
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F3A]/90 backdrop-blur-sm">
      <div className="bg-[#D4DBE2] rounded-xl shadow-2xl border border-[#0B1F3A] w-full max-w-4xl h-[85vh] overflow-hidden relative flex flex-col">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 bg-white border-b border-[#0B1F3A]/10">
            <h3 className="text-[#0B1F3A] font-bold text-lg">Schedule Your Strategy Session</h3>
            <button 
            onClick={onClose} 
            className="bg-[#0B1F3A] text-white p-2 rounded-full hover:bg-[#C47F2A] transition-colors"
            >
            <X size={20} />
            </button>
        </div>

        {/* Calendly Widget Container */}
        <div className="w-full h-full bg-white relative">
            <div 
                className="calendly-inline-widget" 
                data-url={finalUrl} 
                style={{ minWidth: '320px', height: '100%' }} 
            />
        </div>
      </div>
    </div>
  );
};

export default CalendlyModal;