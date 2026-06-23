"use client";

import React, { useState } from "react";
import Link from "next/link";

const FAQS = [
  {
    id: 1,
    category: "ordering",
    question: "How do I place an order?",
    answer: "Browse our products, select your desired items and quantities, and click 'Add to Cart'. Open the cart drawer, click 'Checkout', fill in your delivery details, select your district, and confirm your order. You pay cash only when the delivery agent delivers your package."
  },
  {
    id: 2,
    category: "shipping",
    question: "Do you ship island-wide in Sri Lanka?",
    answer: "Yes, we ship to all districts across Sri Lanka. Delivery is managed by our professional courier partners who specialize in food-safe shipments."
  },
  {
    id: 3,
    category: "shipping",
    question: "What are your shipping rates and delivery times?",
    answer: "We charge a flat rate of LKR 350 for Western Province (Colombo, Gampaha, Kalutara) and LKR 450 for other outer districts. Standard delivery takes 2 to 4 business days. You will receive a phone call from the courier before delivery."
  },
  {
    id: 4,
    category: "products",
    question: "How should I store Anera Foods products?",
    answer: "Our Cashews and Bittergourd chips should be stored in a cool, dry place in airtight containers. Spiced Roti Mixes are shelf-stable but must be kept dry. Condiments like Katta Sambol and Maldive Fish Sambol are best stored in the refrigerator after opening to retain absolute freshness."
  },
  {
    id: 5,
    category: "products",
    question: "Are your products vegetarian or vegan friendly?",
    answer: "Products like our Spiced Deviled Cashews, Pol Roti Mix, and Bittergourd Chips are 100% vegetarian. However, traditional Katta Sambol and Maldive Fish Sambol contain cured Maldive fish and are not vegetarian. Product pages clearly state all ingredient configurations."
  },
  {
    id: 6,
    category: "returns",
    question: "What is your refund or replacement policy?",
    answer: "If you receive a damaged package, or if the food quality is compromised, contact us immediately within 24 hours of delivery. We will arrange a free replacement package or issue a full refund. Please keep the invoice and packaging for validation."
  }
];

export default function FAQPage() {
  const [openId, setOpenId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = activeCategory === "all" 
    ? FAQS 
    : FAQS.filter(f => f.category === activeCategory);

  return (
    <div
      className="
 max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fade-in"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#C27D38] font-bold">
          Support Center
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-white">
          Frequently Asked Questions
        </h1>
        <div className="w-12 h-1 bg-[#C27D38] mx-auto rounded-full mt-3" />
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 border-b border-gray-100 pb-3 flex-wrap">
        {[
          { id: "all", label: "All Questions" },
          { id: "ordering", label: "Ordering & COD" },
          { id: "shipping", label: "Shipping & Delivery" },
          { id: "products", label: "Product Storage" },
          { id: "returns", label: "Returns & Refund" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveCategory(tab.id);
              setOpenId(null);
            }}
            className={`text-xs px-3.5 py-1.5 rounded-full font-sans transition-all ${
              activeCategory === tab.id
                ? "bg-[#1E3A2F] text-white font-semibold shadow-sm"
                : "text-gray-500 hover:text-white hover:bg-[#1E3A2F]/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-4 max-w-3xl mx-auto pt-4">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xs hover:border-[#1E3A2F]/10 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full p-5 text-left flex justify-between items-center font-sans font-semibold text-sm text-white hover:bg-[#1E3A2F]/2 transition-colors gap-4"
              >
                <span>{faq.question}</span>
                <span
                  className={`transform transition-transform text-lg text-[#C27D38] ${isOpen ? "rotate-45" : ""}`}
                >
                  ＋
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 font-sans text-xs sm:text-sm text-gray-500 border-t border-gray-50/50 pt-3 leading-relaxed bg-[#FDFBF7]/40">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="bg-[#F0F4F1] rounded-2xl p-6 text-center border border-[#1E3A2F]/5 space-y-3 max-w-2xl mx-auto mt-12">
        <h3 className="font-serif font-bold text-white text-base">
          Still have questions?
        </h3>
        <p className="text-xs text-gray-500 max-w-xs mx-auto">
          We are available directly on WhatsApp to answer bulk inquiries or
          delivery questions.
        </p>
        <div className="pt-2">
          <a
            href="https://wa.me/94769138608"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary py-2 px-5 text-xs inline-flex items-center gap-1.5"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
