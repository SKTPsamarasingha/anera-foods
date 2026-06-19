"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating when clicking inside a card link
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isOutOfStock =
    product.stockQuantity === 0 ||
    product.availabilityStatus === "out-of-stock";
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity < 10;

  return (
    <div className="premium-card group flex flex-col h-full relative">
      {/* Stock status badge */}
      {isOutOfStock && (
        <span className="absolute top-4 left-4 z-10 bg-[#D32F2F] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md shadow-sm">
          Sold Out
        </span>
      )}
      {isLowStock && (
        <span className="absolute top-4 left-4 z-10 bg-[#ED6C02] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md shadow-sm animate-pulse">
          Only {product.stockQuantity} Left
        </span>
      )}

      {/* Product Image Wrapper */}
      <Link
        href={`/products/${product.id}`}
        className="block overflow-hidden relative aspect-square bg-gray-50"
      >
        {product.images && product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#E1A926]/10 text-[#E1A926] font-serif font-bold">
            {product.name}
          </div>
        )}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category & Rating */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] uppercase tracking-widest text-[#E1A926] font-bold font-sans">
            {product.category}
          </span>
          <div className="flex items-center text-[#E1A926] gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-3.5 h-3.5 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Title */}
        <Link
          href={`/products/${product.id}`}
          className="block group-hover:text-[#E1A926] transition-colors mb-2"
        >
          <h3 className="text-base font-bold font-serif text-white line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Short description snippet */}
        <p className="text-sm text-gray-500 font-sans line-clamp-2 mb-4 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Price & Add to Cart button */}
        <div className="flex justify-between items-center pt-3 border-t border-[#E1A926]/5 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-sans uppercase tracking-wider">
              Price
            </span>
            <span className="text-[14px] font-bold text-[#E1A926]">
              LKR {product.price.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`btn px-4 py-2 text-xs font-sans rounded-md transition-all ${
              isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : added
                  ? "bg-[#2E7D32] text-white border-transparent"
                  : "bg-[#0D0D0D] text-[#F2F2F2] hover:bg-[#E1A926] border-transparent"
            }`}
          >
            {isOutOfStock ? (
              "Sold Out"
            ) : added ? (
              <span className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5 stroke-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Added
              </span>
            ) : (
              "Add to Cart"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
