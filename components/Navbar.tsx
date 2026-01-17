import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Button from './Button';
import { ViewState } from '../types';

interface NavbarProps {
  onCtaClick: () => void;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const LogoIcon = () => (
  <svg width="48" height="48" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    {/* Shield Background */}
    <path d="M50 0C50 0 15 5 5 35V60C5 85 50 120 50 120C50 120 95 85 95 60V35C85 5 50 0 50 0Z" fill="#0B1F3A"/>
    
    {/* Graph Bars */}
    <rect x="25" y="55" width="10" height="35" rx="2" fill="white"/>
    <rect x="45" y="40" width="10" height="50" rx="2" fill="white"/>
    <rect x="65" y="50" width="10" height="40" rx="2" fill="white"/>
    
    {/* Checkmark */}
    <path d="M50 95L65 110L95 65" stroke="#C47F2A" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Navbar: React.FC<NavbarProps> = ({ onCtaClick, currentView, setView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setView('landing');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleViewChange = (view: ViewState) => {
    setView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#D4DBE2]/95 backdrop-blur-md border-b border-[#0B1F3A]/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Area */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('top')}>
             <LogoIcon />
             <div className="flex flex-col">
                <span className="text-[#0B1F3A] font-extrabold text-2xl tracking-tighter leading-none">
                  IronClad
                </span>
                <span className="text-[#C47F2A] font-bold text-lg tracking-widest leading-none">
                  CAS
                </span>
             </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => handleNavClick('symptoms')} className="text-[#0B1F3A] hover:text-[#C47F2A] font-semibold transition-colors">The Problems</button>
            <button onClick={() => handleNavClick('solution')} className="text-[#0B1F3A] hover:text-[#C47F2A] font-semibold transition-colors">The System</button>
            <button onClick={() => handleNavClick('services')} className="text-[#0B1F3A] hover:text-[#C47F2A] font-semibold transition-colors">Services</button>
            <button onClick={() => handleViewChange('articles')} className="text-[#0B1F3A] hover:text-[#C47F2A] font-semibold transition-colors">Insights</button>
            <button onClick={() => handleViewChange('about')} className="text-[#0B1F3A] hover:text-[#C47F2A] font-semibold transition-colors">Our Firm</button>
            <button onClick={() => handleNavClick('contact')} className="text-[#0B1F3A] hover:text-[#C47F2A] font-semibold transition-colors">Contact</button>
            <Button onClick={onCtaClick} variant="secondary" className="py-2 px-6 text-xs shadow-none">Book Strategy Call</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden text-[#0B1F3A]">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#D4DBE2] border-t border-[#0B1F3A]/10 px-4 pt-4 pb-6 space-y-4 shadow-xl">
             <button onClick={() => handleNavClick('symptoms')} className="block w-full text-left text-[#0B1F3A] font-semibold py-2">The Problems</button>
            <button onClick={() => handleNavClick('solution')} className="block w-full text-left text-[#0B1F3A] font-semibold py-2">The System</button>
            <button onClick={() => handleNavClick('services')} className="block w-full text-left text-[#0B1F3A] font-semibold py-2">Services</button>
            <button onClick={() => handleViewChange('articles')} className="block w-full text-left text-[#0B1F3A] font-semibold py-2">Insights</button>
            <button onClick={() => handleViewChange('about')} className="block w-full text-left text-[#0B1F3A] font-semibold py-2">Our Firm</button>
             <button onClick={() => handleNavClick('contact')} className="block w-full text-left text-[#0B1F3A] font-semibold py-2">Contact</button>
            <Button onClick={onCtaClick} variant="primary" className="w-full text-center mt-4">Book Strategy Call</Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;