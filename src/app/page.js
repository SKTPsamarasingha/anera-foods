"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    db.getProducts().then((products) => {
      // Show first 4 products on the home page as top picks
      setFeaturedProducts(products.slice(0, 4));
    });
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center text-white bg-grain overflow-hidden">
        {/* Curved gradient background mimicking premium organic food styling */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-[#1E3A2F]/90 mix-blend-multiply" />

        {/* Subtle glowing elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C27D38]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D1E2D3]/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 animate-fade-in py-16">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-[#C27D38] font-bold bg-[#FDFBF7]/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
            Est. 2026 • Taste of Sri Lanka
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-serif leading-tight max-w-4xl mx-auto text-[#FDFBF7]">
            Sri Lankan Culinary Heritage,{" "}
            <span className="text-[#C27D38]">Refined.</span>
          </h1>
          <p className="text-base sm:text-xl text-[#FDFBF7]/85 max-w-2xl mx-auto font-light leading-relaxed">
            Delighting tables with premium, hand-picked ready-to-eat products,
            traditional spice sambols, and healthy artisanal snacks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/products"
              className="btn btn-accent px-8 py-4 w-full sm:w-auto font-sans tracking-wide"
            >
              Explore Our Catalog
            </Link>
            <Link
              href="/about"
              className="btn  bg-[#1E3A2F] text-white hover:bg-[#1E3A2F]  px-8 py-4 w-full sm:w-auto font-sans tracking-wide"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white border border-[#1E3A2F]/5 rounded-2xl shadow-sm text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#1E3A2F]/5 text-[#1E3A2F] rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 stroke-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold font-serif text-[#1E3A2F]">
              Premium Authenticity
            </h3>
            <p className="text-xs text-gray-500 font-sans leading-relaxed">
              Made strictly with premium ingredients, following heirloom
              grandmother recipes to deliver genuine Sri Lankan flavor profile.
            </p>
          </div>

          <div className="p-8 bg-white border border-[#1E3A2F]/5 rounded-2xl shadow-sm text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#1E3A2F]/5 text-[#1E3A2F] rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 stroke-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold font-serif text-[#1E3A2F]">
              Instant Convenience
            </h3>
            <p className="text-xs text-gray-500 font-sans leading-relaxed">
              Skip the long preparation hours. Our ready-to-eat range and roti
              mixes allow you to prepare delicious meals in under 10 minutes.
            </p>
          </div>

          <div className="p-8 bg-white border border-[#1E3A2F]/5 rounded-2xl shadow-sm text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#1E3A2F]/5 text-[#1E3A2F] rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 stroke-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold font-serif text-[#1E3A2F]">
              Cash On Delivery
            </h3>
            <p className="text-xs text-gray-500 font-sans leading-relaxed">
              Order safely from the comfort of your home and pay only when our
              delivery partner hands the package directly to you.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#C27D38] font-bold">
            Curated Selections
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#1E3A2F]">
            Browse by Category
          </h2>
          <div className="w-16 h-1 bg-[#C27D38] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Snacks Category Card */}
          <Link
            href="/products?category=snacks"
            className="relative h-72 rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white space-y-1.5">
              <span className="text-[10px] tracking-wider uppercase text-[#C27D38] font-bold">
                Crunchy & Savory
              </span>
              <h3 className="text-xl font-bold font-serif">Artisanal Snacks</h3>
              <p className="text-[11px] text-gray-300 font-sans">
                Premium Cashews, Bittergourd chips, halwa
              </p>
            </div>
          </Link>

          {/* Ready-to-Eat Category Card */}
          <Link
            href="/products?category=ready-to-eat"
            className="relative h-72 rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white space-y-1.5">
              <span className="text-[10px] tracking-wider uppercase text-[#C27D38] font-bold">
                Instant Delights
              </span>
              <h3 className="text-xl font-bold font-serif">Ready-To-Eat</h3>
              <p className="text-[11px] text-gray-300 font-sans">
                Roti mixes, cutlets, fast bites
              </p>
            </div>
          </Link>

          {/* Specialty Category Card */}
          <Link
            href="/products?category=specialty"
            className="relative h-72 rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white space-y-1.5">
              <span className="text-[10px] tracking-wider uppercase text-[#C27D38] font-bold">
                Kitchen Staples
              </span>
              <h3 className="text-xl font-bold font-serif">Specialty Items</h3>
              <p className="text-[11px] text-gray-300 font-sans">
                Katta sambol, Maldive fish mixes, Kithul treacle
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#C27D38] font-bold">
              Selected Favorites
            </span>
            <h2 className="text-3xl font-bold font-serif text-[#1E3A2F]">
              Our Best Sellers
            </h2>
          </div>
          <Link
            href="/products"
            className="btn btn-outline text-xs py-2 px-5 font-semibold"
          >
            View All Products
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 5. BRAND INTRO / ABOUT BLOCK */}
      <section className="bg-gradient-to-r from-[#1E3A2F] to-[#12241C] text-[#FDFBF7] py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C27D38]/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C27D38] font-bold">
                Heirloom Flavors
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif leading-tight">
                Prepared with love, packaged with care.
              </h2>
              <p className="text-sm text-gray-300 font-sans leading-relaxed">
                Anera Foods started as a kitchen experiment with a mission to
                package authentic Sri Lankan delicacy components that are
                historically cumbersome to prepare. By sourcing the finest raw
                ingredients from local farming clusters, we maintain complete
                control over raw spice blends and packaging standards.
              </p>
              <p className="text-sm text-gray-300 font-sans leading-relaxed">
                From our signature spiced cashews to the sweet amber kithul
                treacle syrup, we ensure every product reflects the high
                standards of a gourmet food store.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="btn btn-accent px-6 py-3 font-sans text-xs"
                >
                  Read Our Full Story
                </Link>
              </div>
            </div>

            <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
                alt="Premium prepared dish"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. SOCIAL PROOF / REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#C27D38] font-bold">
            Testimonials
          </span>
          <h2 className="text-3xl font-bold font-serif text-[#1E3A2F]">
            Loved by Home Cooks
          </h2>
          <div className="w-16 h-1 bg-[#C27D38] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white border border-[#1E3A2F]/5 rounded-2xl shadow-sm space-y-4">
            <div className="flex text-[#E5A93B] gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-xs text-gray-500 font-sans italic leading-relaxed">
              &ldquo;The Pol Roti mix is a lifesaver. Preparing dinner is
              usually so hectic, but with this, I just add warm water, knead,
              and cook. Tastes exactly like home, very authentic!&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-[#1E3A2F]/10 flex items-center justify-center font-bold text-sm text-[#1E3A2F]">
                ND
              </div>
              <div>
                <h4 className="text-xs font-bold font-serif text-[#1E3A2F]">
                  Nisansala De Silva
                </h4>
                <p className="text-[10px] text-gray-400 font-sans">
                  Colombo, Customer
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-[#1E3A2F]/5 rounded-2xl shadow-sm space-y-4">
            <div className="flex text-[#E5A93B] gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-xs text-gray-500 font-sans italic leading-relaxed">
              &ldquo;Ordered the spiced deviled cashews for a small
              get-together. The curry leaves infusion and the spice level are
              perfect. Everyone loved it. Definitely ordering again.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-[#1E3A2F]/10 flex items-center justify-center font-bold text-sm text-[#1E3A2F]">
                AS
              </div>
              <div>
                <h4 className="text-xs font-bold font-serif text-[#1E3A2F]">
                  Amila Senanayake
                </h4>
                <p className="text-[10px] text-gray-400 font-sans">
                  Kandy, Customer
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-[#1E3A2F]/5 rounded-2xl shadow-sm space-y-4">
            <div className="flex text-[#E5A93B] gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-xs text-gray-500 font-sans italic leading-relaxed">
              &ldquo;The Maldive Fish Sambol matches beautifully with bread or
              milk rice. The packaging is premium and seals the freshness
              properly. A true high-quality product.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-[#1E3A2F]/10 flex items-center justify-center font-bold text-sm text-[#1E3A2F]">
                KM
              </div>
              <div>
                <h4 className="text-xs font-bold font-serif text-[#1E3A2F]">
                  Kumari Mendis
                </h4>
                <p className="text-[10px] text-gray-400 font-sans">
                  Gampaha, Customer
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DYNAMIC CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#C27D38] rounded-3xl p-8 sm:p-16 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#1E3A2F]/15 rounded-full" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FDFBF7]/10 rounded-full" />

          <h2 className="text-3xl sm:text-5xl font-bold font-serif max-w-2xl mx-auto leading-tight text-[#FDFBF7]">
            Craving Authentic Sri Lankan Flavors?
          </h2>
          <p className="text-sm sm:text-base text-[#FDFBF7]/90 max-w-xl mx-auto font-sans leading-relaxed">
            Order today and pay cash at your door. We ship island-wide with
            delivery in 2-4 business days.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/products"
              className="btn bg-[#1E3A2F] text-white hover:bg-black px-8 py-3.5 w-full sm:w-auto font-sans"
            >
              Shop Now (Cash on Delivery)
            </Link>
            <a
              href="https://wa.me/94769138608"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline border-white text-white hover:bg-white hover:text-[#C27D38] px-8 py-3.5 w-full sm:w-auto font-sans flex items-center justify-center gap-2"
            >
              Order via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
