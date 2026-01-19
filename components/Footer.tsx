import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const LogoIconSmall = () => (
  <svg width="32" height="32" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    {/* Outer Shield with Border */}
    <path d="M50 0C50 0 15 5 5 35V60C5 85 50 120 50 120C50 120 95 85 95 60V35C85 5 50 0 50 0Z" fill="#0B1F3A" stroke="#718096" strokeWidth="4"/>
    
    {/* Bars */}
    <rect x="30" y="55" width="10" height="30" rx="5" fill="white"/>
    <rect x="45" y="40" width="10" height="45" rx="5" fill="white"/>
    <rect x="60" y="50" width="10" height="35" rx="5" fill="white"/>
    {/* Checkmark */}
    <path d="M55 90L68 102L92 65" stroke="#C47F2A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#051120] py-12 border-t border-[#D4DBE2]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
           <LogoIconSmall />
           <div className="flex flex-col">
             <span className="text-[#D4DBE2] font-bold tracking-tight text-xl leading-none">IronClad</span>
             <span className="text-[#C47F2A] font-bold text-[0.6rem] uppercase tracking-wider leading-none mt-1">Accounting Services</span>
           </div>
        </div>
        <div className="flex flex-col items-center gap-2 text-[#D4DBE2] text-sm">
          <span>&copy; {new Date().getFullYear()} IronClad. All rights reserved.</span>
          <a href="mailto:Admin@ironcladcas.com" className="flex items-center gap-2 hover:text-[#C47F2A] transition-colors">
            <Mail size={14} /> Admin@ironcladcas.com
          </a>
        </div>
        <div className="flex gap-6 text-sm font-semibold text-[#D4DBE2]">
          <button className="hover:text-white transition-colors">Privacy</button>
          <button className="hover:text-white transition-colors">Terms</button>
          <span className="text-[#C47F2A]">Specializing in SMB Profitability</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;