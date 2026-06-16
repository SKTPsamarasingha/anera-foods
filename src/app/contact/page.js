"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";
    
    if (formData.email.trim()) {
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Enter a valid email address";
      }
    } else {
      newErrors.email = "Email is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#C27D38] font-bold">Connect With Us</span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#1E3A2F]">Get In Touch</h1>
        <p className="text-xs text-gray-500 font-sans">
          Have a bulk order request, delivery query, or product feedback? Shoot us a message or contact us directly on WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-stretch">
        
        {/* Info Column */}
        <div className="lg:col-span-5 bg-[#1E3A2F] text-white p-8 rounded-2xl flex flex-col justify-between space-y-8 shadow-md">
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-serif text-[#FDFBF7]">Contact Details</h3>
            
            <ul className="space-y-4 text-xs font-sans text-gray-200">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#C27D38] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Anera Foods Lab,<br />Colombo Road, Gampaha, Sri Lanka</span>
              </li>

              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#C27D38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+94769138608" className="hover:text-[#C27D38] transition-colors">+94 76 913 8608</a>
              </li>

              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#C27D38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:hello@anerafoods.lk" className="hover:text-[#C27D38] transition-colors">hello@anerafoods.lk</a>
              </li>
            </ul>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-6 font-sans text-xs">
            <h4 className="font-serif font-bold text-white text-sm">Operating Hours</h4>
            <p className="text-gray-300">Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p className="text-gray-300">Saturday: 9:00 AM - 1:00 PM</p>
            <p className="text-[#C27D38] font-bold">Closed on Sundays & Poya Days</p>
          </div>

          <div className="pt-4 border-t border-white/10">
            <a 
              href="https://wa.me/94769138608" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-accent w-full text-xs font-semibold py-2.5 text-center flex items-center justify-center gap-2"
            >
              Message Us on WhatsApp
            </a>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
          {sent ? (
            <div className="text-center space-y-4 py-8 animate-fade-in">
              <div className="w-12 h-12 bg-[#2E7D32]/10 text-[#2E7D32] rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold font-serif text-[#1E3A2F]">Message Sent!</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto font-sans leading-relaxed">
                Thank you for contacting Anera Foods. A support representative will review your inquiry and get back to you shortly.
              </p>
              <button 
                onClick={() => setSent(false)} 
                className="btn btn-outline py-2 px-5 text-xs mt-2"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold font-serif text-[#1E3A2F]">Send a message</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 font-sans">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full p-2.5 text-xs border rounded-lg focus:outline-none focus:border-[#C27D38] font-sans ${
                      errors.name ? "border-[#D32F2F]" : "border-gray-200"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && <span className="text-[10px] text-[#D32F2F] font-sans block">{errors.name}</span>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 font-sans">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-2.5 text-xs border rounded-lg focus:outline-none focus:border-[#C27D38] font-sans ${
                      errors.email ? "border-[#D32F2F]" : "border-gray-200"
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="text-[10px] text-[#D32F2F] font-sans block">{errors.email}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 font-sans">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#C27D38] font-sans"
                    placeholder="e.g. 0771234567"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 font-sans">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#C27D38] font-sans"
                    placeholder="e.g. Bulk Cashew Order"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 font-sans">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full p-2.5 text-xs border rounded-lg focus:outline-none focus:border-[#C27D38] font-sans ${
                    errors.message ? "border-[#D32F2F]" : "border-gray-200"
                  }`}
                  placeholder="Tell us what you need help with..."
                />
                {errors.message && <span className="text-[10px] text-[#D32F2F] font-sans block">{errors.message}</span>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary py-3 text-xs uppercase font-bold tracking-wider font-sans mt-2"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
