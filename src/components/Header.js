"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const { cartItems, cartCount, cartSubtotal, updateQuantity, removeFromCart, isMounted } = useCart();
  const { user, isAuthenticated, isAdmin, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isActive = (path) => pathname === path;
  const isAdminRoute = pathname?.startsWith("/admin");
  const roleLabel = user?.roleId || user?.role || "";

  if (isAdminRoute) {
    // Return different Header for Admin
    return (
      <header className="">
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-black backdrop-blur-md border-b border-[#1E3A2F]/10 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="flex flex-col items-start leading-none group"
              >
                <span className="text-2xl sm:text-3xl font-extrabold text-[#C27D38] font-serif tracking-wider transition-colors group-hover:text-[#C27D38]">
                  ANERA FOODS
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-white font-semibold uppercase mt-0.5">
                  Premium Sri Lanka
                </span>
              </Link>
            </div>

            {/* Navigation links */}
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className={`text-sm font-semibold tracking-wide uppercase transition-colors duration-200 ${
                  isActive("/")
                    ? "text-[#C27D38]"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={`text-sm font-semibold tracking-wide uppercase transition-colors duration-200 ${
                  isActive("/products")
                    ? "text-[#C27D38]"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Products
              </Link>
              <Link
                href="/about"
                className={`text-sm font-semibold tracking-wide uppercase transition-colors duration-200 ${
                  isActive("/about")
                    ? "text-[#C27D38]"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Our Story
              </Link>
              <Link
                href="/track"
                className={`text-sm font-semibold tracking-wide uppercase transition-colors duration-200 ${
                  isActive("/track")
                    ? "text-[#C27D38]"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Track Order
              </Link>

              <Link
                href="/contact"
                className={`text-sm font-semibold tracking-wide uppercase transition-colors duration-200 ${
                  isActive("/contact")
                    ? "text-[#C27D38]"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Auth + Cart Icons */}
            <div className="flex items-center gap-3">
              {/* Auth Section */}
              {!authLoading && (
                <>
                  {isAuthenticated ? (
                    <div className="relative">
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors group"
                      >
                        {/* <span className="w-8 h-8 rounded-full bg-gradient-to-br from-black to-black flex items-center justify-center text-white text-xs font-bold uppercase shadow-md group-hover:shadow-lg transition-shadow">
                          {user?.name?.charAt(0) || "U"}
                        </span> */}
                        <span className="hidden sm:inline font-sans">
                          {user?.name?.split(" ")[0]}
                        </span>
                        <svg
                          className={`w-3.5 h-3.5 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* User Dropdown Menu */}
                      {isUserMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-30"
                            onClick={() => setIsUserMenuOpen(false)}
                          />
                          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-40 animate-fade-in">
                            <div className="px-4 py-3 border-b border-gray-100">
                              <p className="text-sm font-bold text-black font-sans">
                                {user?.name}
                              </p>
                              <p className="text-xs text-gray-500 font-sans">
                                {user?.email}
                              </p>
                              <span className="inline-block mt-1 text-[9px] uppercase tracking-wider bg-[#C27D38]/10 text-[#C27D38] px-2 py-0.5 rounded-full font-bold font-sans">
                                {user?.role}
                              </span>
                            </div>

                            {/* <Link
                              href="/my-orders"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#1E3A2F]/5 transition-colors font-sans"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              My Orders
                            </Link> */}

                            {!isAdmin && (
                              <Link
                                href="/track"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#1E3A2F]/5 transition-colors font-sans"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                  />
                                </svg>
                                Track Order
                              </Link>
                            )}

                            {isAdmin && (
                              <Link
                                href="/admin"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#1E3A2F]/5 transition-colors font-sans"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                Admin Panel
                              </Link>
                            )}

                            <div className="border-t border-gray-100 mt-1 pt-1">
                              <button
                                onClick={async () => {
                                  setIsUserMenuOpen(false);
                                  await logout();
                                  router.push("/");
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-sans"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                  />
                                </svg>
                                Sign Out
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="hidden sm:flex items-center gap-2">
                      <Link
                        href="/login"
                        className="text-sm font-semibold text-white/70 hover:text-white transition-colors font-sans px-3 py-1.5"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        className="text-sm font-semibold text-white bg-[#1E3A2F] hover:bg-[#1E3A2F]/90 transition-colors font-sans px-4 py-1.5 rounded-lg"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </>
              )}

              {/* Shopping Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full hover:bg-[#1E3A2F]/5 text-white transition-all group"
                aria-label="Shopping Cart"
              >
                <svg
                  className="w-6 h-6 stroke-2 transition-transform group-hover:scale-105"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {isMounted && cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#C27D38] text-[#FDFBF7] text-[10px] font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-[#FDFBF7] animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col z-10 animate-fade-in border-l border-[#1E3A2F]/10">
            <div className="p-6 border-b border-[#1E3A2F]/10 flex justify-between items-center bg-black text-white">
              <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Your Basket
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {!isMounted || cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <svg
                    className="w-16 h-16 text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <p className="text-gray-500 font-sans font-medium">
                    Your cart is empty
                  </p>
                  <Link
                    href="/products"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 btn btn-primary py-2 text-xs"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-lg bg-white border border-gray-100 shadow-sm relative group"
                  >
                    <div className="w-16 h-16 bg-gray-50 rounded overflow-hidden flex-shrink-0 relative">
                      {item.images && item.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#1E3A2F]/5 flex items-center justify-center font-bold text-xs text-black">
                          {item.name.substring(0, 2)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-black line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500">{item.weight}</p>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-gray-200 rounded-md">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-2 py-0.5 text-black hover:text-red-500 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-semibold font-sans text-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-2 py-0.5 text-black hover:text-green-500 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs font-bold text-[#C27D38]">
                          LKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-[#D32F2F] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Checkout Footer */}
            {isMounted && cartItems.length > 0 && (
              <div className="p-6 border-t border-[#1E3A2F]/10 bg-white space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-medium font-sans">
                    Subtotal
                  </span>
                  <span className="text-lg font-bold text-black">
                    LKR {cartSubtotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 text-center font-sans">
                  Shipping rates calculated during checkout.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="btn text-white bg-black py-2.5 text-xs text-center"
                  >
                    Keep Browsing
                  </button>
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="btn btn-accent py-2.5 text-xs text-center block font-sans"
                  >
                    Order Now (COD)
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
