"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) return null; // Hide footer on admin dashboard for clean operational views

  return (
    <footer className="bg-[#0D0D0D] text-[#F2F2F2] pt-16 pb-8 mt-auto border-t border-[#E1A926]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex flex-col leading-none">
              <span className="text-2xl font-bold font-serif tracking-wider text-white">
                ANERA FOODS
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#E1A926] font-semibold uppercase mt-1">
                Premium Sri Lanka
              </span>
            </Link>
            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              Bringing the authentic, premium flavors of Sri Lanka to modern
              dining tables. Carefully prepared, packaged, and delivered fresh.
            </p>
            <div className="flex space-x-3 pt-2">
              {/* TikTok link from research document */}
              <a
                href="https://www.tiktok.com/@anerafoods?_r=1&_t=ZS-97255lmzjUY"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#E1A926] hover:border-transparent transition-colors"
                title="Follow us on TikTok"
              >
                <span className="text-xs font-bold font-sans">TT</span>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#E1A926] hover:border-transparent transition-colors"
                title="Follow us on Facebook"
              >
                <span className="text-xs font-bold font-sans">FB</span>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#E1A926] hover:border-transparent transition-colors"
                title="Follow us on Instagram"
              >
                <span className="text-xs font-bold font-sans">IG</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#E1A926] mb-4 font-sans">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-300 font-sans">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home Page
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  Our Brand Story
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  href="/track"
                  className="hover:text-white transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Policies */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#E1A926] mb-4 font-sans">
              Policies
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-300 font-sans">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy#shipping"
                  className="hover:text-white transition-colors"
                >
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy#refunds"
                  className="hover:text-white transition-colors"
                >
                  Refund & Return Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy#terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#E1A926] mb-4 font-sans">
              Store Contact
            </h3>
            <ul className="space-y-3 text-xs text-gray-300 font-sans">
              <li className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-[#E1A926] flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  Anera Foods Lab,
                  <br />
                  Colombo Road, Gampaha, Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[#E1A926] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href="tel:+94769138608"
                  className="hover:text-white transition-colors"
                >
                  +94 74 336 1612
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[#E1A926] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:hello@anerafoods.lk"
                  className="hover:text-white transition-colors"
                >
                  hello@anerafoods.lk
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-white/10 my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-400 font-sans gap-4">
          <p>
            &copy; {new Date().getFullYear()} Anera Foods. All rights reserved.
            Developed for Thiruna Samarasinghe.
          </p>
          <div className="flex items-center gap-3">
            <span className="border border-white/10 rounded px-2 py-0.5 uppercase tracking-wider font-semibold">
              Cash on Delivery
            </span>
            <span className="border border-white/10 rounded px-2 py-0.5 uppercase tracking-wider font-semibold">
              100% Sri Lankan
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
