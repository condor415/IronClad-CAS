import React from 'react';
import { Mail } from 'lucide-react';

const LogoIconSmall = () => (
  <svg width="32" height="32" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    <path d="M50 0C50 0 15 5 5 35V60C5 85 50 120 50 120C50 120 95 85 95 60V35C85 5 50 0 50 0Z" fill="#C47F2A"/>
    <rect x="25" y="55" width="10" height="35" rx="2" fill="#0B1F3A"/>
    <rect x="45" y="40" width="10" height="50" rx="2" fill="#0B1F3A"/>
    <rect x="65" y="50" width="10" height="40" rx="2" fill="#0B1F3A"/>
    <path d="M50 95L65 110L95 65" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#051120] py-12 border-t border-[#D4DBE2]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
           <LogoIconSmall />
           <span className="text-[#D4DBE2] font-bold tracking-tight text-xl">IronClad <span className="text-[#C47F2A]">CAS</span></span>
        </div>
        <div className="flex flex-col items-center gap-2 text-[#D4DBE2] text-sm">
          <span>&copy; {new Date().getFullYear()} IronClad CAS. All rights reserved.</span>
          <a href="mailto:Lee@ironcladcas.com" className="flex items-center gap-2 hover:text-[#C47F2A] transition-colors">
            <Mail size={14} /> Lee@ironcladcas.com
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