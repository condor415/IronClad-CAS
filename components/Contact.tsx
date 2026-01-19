import React, { useState } from 'react';
import { Mail, MapPin, Send } from 'lucide-react';
import Button from './Button';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This constructs a mailto link with the form data pre-filled
    // It opens the user's default email client
    const subject = encodeURIComponent(`Inquiry from ${formData.name}: ${formData.subject}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:Admin@ironcladcas.com?subject=${subject}&body=${body}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div id="contact" className="bg-[#051120] py-24 border-t border-[#D4DBE2]/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#0B1F3A]/30 skew-x-12 transform translate-x-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Contact Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#102A4C] border border-[#C47F2A]/30 text-[#C47F2A] text-xs font-semibold uppercase tracking-wider mb-6">
              Contact Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Let's secure your financial future.</h2>
            <p className="text-[#D4DBE2] text-lg mb-12 leading-relaxed">
              Whether you are ready to engage a fractional CFO or just have a question about our diagnostic process, our team is ready to listen.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-[#102A4C] p-3 rounded-lg border border-[#D4DBE2]/10">
                  <Mail className="text-[#C47F2A] h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Email Us</h3>
                  <p className="text-[#D4DBE2]/60 text-sm mb-1">Direct access to our strategy team.</p>
                  <a href="mailto:Admin@ironcladcas.com" className="text-white hover:text-[#C47F2A] transition-colors font-medium">Admin@ironcladcas.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#102A4C] p-3 rounded-lg border border-[#D4DBE2]/10">
                  <MapPin className="text-[#C47F2A] h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Headquarters</h3>
                  <p className="text-[#D4DBE2]/60 text-sm mb-1">Serving clients nationwide.</p>
                  <span className="text-white font-medium">New York, NY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#0B1F3A] rounded-2xl p-8 border border-[#D4DBE2]/10 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-[#D4DBE2]">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#051120] border border-[#D4DBE2]/20 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C47F2A] transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-[#D4DBE2]">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#051120] border border-[#D4DBE2]/20 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C47F2A] transition-all"
                    placeholder="john@company.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-[#D4DBE2]">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-[#051120] border border-[#D4DBE2]/20 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C47F2A] transition-all appearance-none"
                >
                  <option value="" disabled>Select a topic</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Services Information">Services Information</option>
                  <option value="Request Audit">Request Profit Audit</option>
                  <option value="Partnership">Partnership Opportunity</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-[#D4DBE2]">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-[#051120] border border-[#D4DBE2]/20 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C47F2A] transition-all"
                  placeholder="Tell us about your business challenges..."
                ></textarea>
              </div>

              <Button variant="primary" className="w-full">
                Send Message <Send size={18} />
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;