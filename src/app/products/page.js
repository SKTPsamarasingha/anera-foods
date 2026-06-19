"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  // Sync category state with search parameters
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Load products
  useEffect(() => {
    db.getProducts().then((data) => {
      setProducts(data);
      setFilteredProducts(data);
    });
  }, []);

  // Filtering & Sorting Logic
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // In stock filter
    if (onlyInStock) {
      result = result.filter((p) => p.stockQuantity > 0);
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, onlyInStock, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="text-center sm:text-left space-y-2">
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-white">
          Our Product Catalog
        </h1>
        <p className="text-sm text-gray-500 font-sans max-w-xl">
          Browse our selected range of premium Sri Lankan specialty products.
          All orders are packed fresh and shipped via Cash on Delivery.
        </p>
      </div>

      {/* Control Bar (Search, Category Tab Selectors, Sorting) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6 lg:sticky lg:top-24 h-fit bg-[#0D0D0D] p-6 rounded-2xl border border-[#E1A926]/10 shadow-sm">
          {/* Search Box */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-[#E1A926] tracking-wider font-sans">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search cashew, roti, sambol..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-[#E1A926]/20 rounded-lg focus:outline-none focus:border-[#E1A926] font-sans bg-[#1A1A1A] text-white placeholder-gray-400"
              />
              <svg
                className="w-4 h-4 text-[#E1A926]/50 absolute left-3 top-2.5"
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
            </div>
          </div>

          <hr className="border-[#E1A926]/10" />

          {/* Categories Filter */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-[#E1A926] tracking-wider font-sans block mb-2">
              Category
            </label>
            <div className="flex flex-col gap-1.5">
              {[
                { id: "all", label: "All Products" },
                { id: "snacks", label: "Artisanal Snacks" },
                { id: "ready-to-eat", label: "Ready-To-Eat" },
                { id: "specialty", label: "Specialty Items" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-left text-xs px-3 py-2 rounded-lg font-sans transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-[#E1A926] text-[#0D0D0D] font-semibold"
                      : "text-gray-300 hover:bg-[#E1A926]/10 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-[#E1A926]/10" />

          {/* Stock Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-300 font-sans">
              Only Show In Stock
            </span>
            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
                onlyInStock ? "bg-[#E1A926]" : "bg-gray-600"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute transition-transform shadow-sm ${
                  onlyInStock ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <hr className="border-[#E1A926]/10" />

          {/* Sorting */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-[#E1A926] tracking-wider font-sans">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-[#E1A926]/20 rounded-lg p-2 text-xs focus:outline-none focus:border-[#E1A926] font-sans bg-[#1A1A1A] text-white"
            >
              <option value="default">Sort Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Alphabetical: A-Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm space-y-4">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-bold font-serif text-[#1E3A2F]">
                No products match your filters
              </h3>
              <p className="text-xs text-gray-500 font-sans max-w-sm mx-auto">
                Try searching for something else, clearing your filters, or
                showing out-of-stock items.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setOnlyInStock(false);
                  setSortBy("default");
                }}
                className="btn btn-primary py-2 px-5 text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1E3A2F] mx-auto"></div>
          <p className="mt-4 text-xs text-gray-500">Loading catalog...</p>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
