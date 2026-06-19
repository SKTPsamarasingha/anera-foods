"use client";

import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-20 animate-fade-in">
      {/* Hero Banner Header */}
      <section className="relative py-24 text-white text-center bg-grain overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-[#0D0D0D]/90 mix-blend-multiply" />
        <div className="relative max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#E1A926] font-bold">
            About Anera Foods
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold font-serif text-[#F2F2F2]">
            Our Brand Story
          </h1>
          <p className="text-sm sm:text-base text-gray-300 font-light max-w-xl mx-auto">
            Traditional Sri Lankan preparations require hours of patient
            craftsmanship. We package those precise flavors to bring ease to
            your modern kitchen.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="max-w-4xl mx-auto px-4 space-y-8 font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-serif text-[#F2F2F2] text-center sm:text-left">
            How Anera Started
          </h2>
          <p>
            Anera Foods was founded under Pixzora Lab’s development scope to
            bridge a critical gap: access to authentic, high-quality,
            pre-prepared Sri Lankan foods. Many Sri Lankans living in urban
            areas, or carrying out demanding corporate routines, find it
            extremely difficult to source clean ingredients and spend hours
            processing condiments like Pol Roti mixes, Maldive fish sambols, or
            banana blossom cutlets from scratch.
          </p>
          <p>
            We realized that convenience shouldn’t mean compromising on taste or
            heritage. Sourcing direct spices, fresh coconut, and hand-caught
            cured Maldive fish from Sri Lankan coastal communities, we crafted
            recipes that preserve the aromatic heat and sweetness of traditional
            home-cooked dishes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
          <div className="premium-card p-6 space-y-3">
            <h3 className="text-lg font-bold font-serif text-white">
              Our Mission
            </h3>
            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              To establish a globally recognized premium food label representing
              Sri Lanka’s authentic agricultural legacy. We aim to empower local
              farming clusters by purchasing raw produce at fair trade values
              while delivering uncompromised quality and absolute convenience to
              our customers.
            </p>
          </div>

          <div className="premium-card p-6 space-y-3">
            <h3 className="text-lg font-bold font-serif text-white">
              Our Quality Standard
            </h3>
            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              We employ strict hygienic regulations and vacuum-sealed food-grade
              packaging. Our products contain zero artificial chemical colors,
              stabilizers, or MSG. You get pure food prepared with standard
              traditional dehydrating and roasting methods that seal in flavors
              naturally.
            </p>
          </div>
        </div>

        {/* Video or Image Banner */}
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg border border-gray-100 mt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80"
            alt="Sri Lankan spice grinding process"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="pt-10 text-center space-y-4">
          <h3 className="text-xl font-bold font-serif text-[#F2F2F2]">
            Experience Sri Lankan Flavors Today
          </h3>
          <p className="text-xs max-w-sm mx-auto">
            Browse our catalog, place your Cash on Delivery order, and taste the
            difference.
          </p>
          <div className="pt-2">
            <Link href="/products" className="btn btn-accent px-6 py-3 text-xs">
              View Our Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
