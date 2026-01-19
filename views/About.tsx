import React from 'react';
import { Award, Briefcase, LineChart, CheckCircle2 } from 'lucide-react';

interface AboutProps {
  onCtaClick: () => void;
}

const About: React.FC<AboutProps> = ({ onCtaClick }) => {
  return (
    <div className="bg-[#D4DBE2] min-h-screen">
      {/* Header */}
      <div className="bg-[#0B1F3A] py-24 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            The Financial Rigor <br/><span className="text-[#C47F2A]">Your Ambition Deserves.</span>
        </h1>
        <p className="text-[#D4DBE2] max-w-2xl mx-auto text-lg">We aren't just accountants. We are growth partners.</p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#0B1F3A] mb-6">Built by Financial Experts. Designed for Business Owners.</h2>
          <p className="text-[#0B1F3A]/80 text-lg mb-4 leading-relaxed">
            IronClad is led by seasoned executives with Controller, CFO, and Big Four experience, having worked with companies ranging from $5 million to over $1 billion in revenue. We bring institutional-grade financial rigor to Main Street and the Middle Market, making elite financial strategy accessible to growing businesses.
          </p>
          <p className="text-[#0B1F3A]/80 text-lg mb-4 leading-relaxed">
            We possess deep real estate experience covering acquisition, disposition, advisory, and financing. We understand the deal lifecycle and the capital stack.
          </p>
          <p className="text-[#0B1F3A]/80 text-lg mb-8 leading-relaxed">
            We don't just know debits and credits; we know operations, cash flow cycles, and the specific pressures of running a growing company. With over <strong>25 years of accounting experience</strong>, we bridge the gap between compliance and true strategic advantage.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            {["Strategic Decision Making", "Accounting & Compliance", "Tax Services", "Real Estate Advisory"].map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-[#0B1F3A] font-bold">
                <CheckCircle2 size={18} className="text-[#C47F2A] flex-shrink-0" /> 
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Stats/Badges */}
        <div className="grid gap-6">
          {[
            {icon: Award, title: "Executive Led", sub: "Enterprise CFO Experience"},
            {icon: Briefcase, title: "25+ Years", sub: "Combined Experience"},
            {icon: LineChart, title: "Growth Focused", sub: "Strategic Advisory"}
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border-l-4 border-[#C47F2A] shadow-xl flex items-center gap-6 transform hover:-translate-x-2 transition-transform duration-300">
              <div className="bg-[#0B1F3A]/5 p-4 rounded-full">
                 <stat.icon className="text-[#0B1F3A] h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#0B1F3A]">{stat.title}</h3>
                <p className="text-[#0B1F3A]/70 font-medium">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;