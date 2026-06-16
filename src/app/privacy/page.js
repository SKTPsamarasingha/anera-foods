"use client";

import React from "react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12 animate-fade-in font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#C27D38] font-bold">Store Contracts</span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#1E3A2F]">Terms & Policies</h1>
        <div className="w-12 h-1 bg-[#C27D38] mx-auto rounded-full mt-3" />
      </div>

      {/* Nav anchors */}
      <div className="flex justify-center gap-3 text-xs font-semibold text-[#1E3A2F]/80 flex-wrap">
        <a href="#privacy" className="hover:text-[#C27D38] underline">Privacy Policy</a>
        <span>•</span>
        <a href="#shipping" className="hover:text-[#C27D38] underline">Shipping Policy</a>
        <span>•</span>
        <a href="#refunds" className="hover:text-[#C27D38] underline">Refund Policy</a>
        <span>•</span>
        <a href="#terms" className="hover:text-[#C27D38] underline">Terms of Service</a>
      </div>

      <hr className="border-gray-100" />

      {/* 1. Privacy Policy */}
      <section id="privacy" className="space-y-4 pt-4">
        <h2 className="text-xl font-bold font-serif text-[#1E3A2F]">Privacy Policy</h2>
        <p>
          At Anera Foods, accessible from our e-commerce platform, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Anera Foods and how we use it.
        </p>
        <p>
          We collect personal identification information including Name, Email, Phone Number, and Shipping Address solely to process checkout orders and deliver packages. We do not sell, rent, or share customer contact databases with third parties.
        </p>
        <p>
          If you have Meta Pixel or TikTok tracking active during your browsing, specific metrics like pages loaded, items added to cart, and checkout completions are recorded anonymously to improve ad distribution performance.
        </p>
      </section>

      <hr className="border-gray-100" />

      {/* 2. Shipping & Delivery Policy */}
      <section id="shipping" className="space-y-4 pt-4">
        <h2 className="text-xl font-bold font-serif text-[#1E3A2F]">Shipping & Delivery Policy</h2>
        <p>
          We ship food packages island-wide across all districts in Sri Lanka.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Delivery Charges:</strong> LKR 350 standard shipping for Western Province (Colombo, Gampaha, Kalutara). LKR 450 flat rate for outer districts.
          </li>
          <li>
            <strong>Processing Time:</strong> Orders are dispatched from our Gampaha facility within 24 hours of order confirmation.
          </li>
          <li>
            <strong>Delivery Duration:</strong> Standard shipments take 2 to 4 business days. Major city centers (Colombo/Gampaha) usually receive orders within 48 hours.
          </li>
          <li>
            <strong>Delivery Call:</strong> The courier driver will call the customer phone number provided during checkout. Packages will not be left at properties without confirmation.
          </li>
        </ul>
      </section>

      <hr className="border-gray-100" />

      {/* 3. Refund & Return Policy */}
      <section id="refunds" className="space-y-4 pt-4">
        <h2 className="text-xl font-bold font-serif text-[#1E3A2F]">Refund & Return Policy</h2>
        <p>
          Because our products are perishable food items, standard returns are not accepted. However, your satisfaction is our priority:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Damaged/Spoiled Items:</strong> If a package is ruptured upon delivery, or the quality of foods is compromised, please take a photograph and notify us via email (hello@anerafoods.lk) or WhatsApp (+94 76 913 8608) within 24 hours.
          </li>
          <li>
            <strong>Resolutions:</strong> Valid complaints will receive a free replacement shipment dispatched immediately, or a full refund issued to the customer’s bank account.
          </li>
          <li>
            <strong>Cancellations:</strong> You can cancel your order at any stage before dispatch. Once dispatched (you will receive a dispatch notice), cancellations cannot be completed.
          </li>
        </ul>
      </section>

      <hr className="border-gray-100" />

      {/* 4. Terms of Service */}
      <section id="terms" className="space-y-4 pt-4">
        <h2 className="text-xl font-bold font-serif text-[#1E3A2F]">Terms of Service</h2>
        <p>
          By accessing this website, you agree to comply with our purchasing terms. All product prices listed on the site are in Sri Lankan Rupees (LKR) and inclusive of local packaging costs.
        </p>
        <p>
          For Cash on Delivery orders, you agree to make the full invoice amount available to the delivery agent. Repeated failures to accept COD packages without valid reasons may result in restriction of address coordinates in future order campaigns.
        </p>
      </section>

    </div>
  );
}
