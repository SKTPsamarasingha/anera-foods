"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/lib/db";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    db.getProductById(id).then((prod) => {
      if (prod) {
        setProduct(prod);
        
        // Log ViewContent Pixel Event
        db.logPixelEvent("ViewContent", {
          productId: prod.id,
          name: prod.name,
          price: prod.price,
          category: prod.category
        });

        // Load related products
        db.getProducts().then((allProducts) => {
          const related = allProducts.filter(
            (p) => p.category === prod.category && p.id !== prod.id
          );
          setFeaturedRelated(related.slice(0, 3));
        });
      }
      setLoading(false);
    });
  }, [id]);

  const setFeaturedRelated = (list) => {
    setRelatedProducts(list);
  };

  const handleIncrement = () => {
    if (product.stockQuantity && quantity >= product.stockQuantity) return;
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity <= 1) return;
    setQuantity(prev => prev - 1);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1E3A2F] mx-auto"></div>
        <p className="mt-4 text-xs text-gray-500">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
        <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-2xl font-bold font-serif text-[#1E3A2F]">Product Not Found</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto font-sans">
          The product you are looking for may have been archived or deleted.
        </p>
        <Link href="/products" className="btn btn-primary text-xs py-2.5 px-6 font-sans">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity === 0 || product.availabilityStatus === "out-of-stock";
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity < 10;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in">
      
      {/* Back Button */}
      <Link href="/products" className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-[#1E3A2F] gap-1 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Catalog
      </Link>

      {/* Main product display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Side: Product Image */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md aspect-square relative flex items-center justify-center">
          {product.images && product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold font-serif text-[#1E3A2F]/30">{product.name}</span>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-[#D32F2F] text-white text-xs uppercase font-bold tracking-widest px-4 py-2 rounded-lg">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Product Details info */}
        <div className="space-y-6 flex flex-col justify-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C27D38] font-bold block mb-2 font-sans">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#1E3A2F] leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-[#E5A93B] gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 font-sans border-l border-gray-300 pl-3">
                5.0 (24 Customer Reviews)
              </span>
            </div>
          </div>

          <div className="border-t border-b border-gray-100 py-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-sans uppercase tracking-wider">Net Weight</span>
              <span className="text-sm font-semibold text-gray-700 font-sans">{product.weight}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-gray-400 font-sans uppercase tracking-wider">Unit Price</span>
              <span className="text-2xl font-bold text-[#C27D38] font-serif">LKR {product.price.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed">
            {product.description}
          </p>

          {/* Stock Availability */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 font-sans">Availability:</span>
            {isOutOfStock ? (
              <span className="text-xs font-bold text-[#D32F2F] font-sans">Currently Unavailable</span>
            ) : isLowStock ? (
              <span className="text-xs font-bold text-[#ED6C02] font-sans animate-pulse">Low Stock (Only {product.stockQuantity} remaining)</span>
            ) : (
              <span className="text-xs font-bold text-[#2E7D32] font-sans">In Stock (Ready to dispatch)</span>
            )}
          </div>

          {!isOutOfStock && (
            <div className="space-y-4 pt-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-gray-600 font-sans">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={handleDecrement}
                    className="px-3.5 py-1.5 text-gray-500 hover:text-red-500 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-bold font-sans text-[#1E3A2F]">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="px-3.5 py-1.5 text-gray-500 hover:text-green-500 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`btn py-3.5 text-xs font-semibold uppercase tracking-wider ${
                    added
                      ? "bg-[#2E7D32] text-white"
                      : "btn-secondary"
                  }`}
                >
                  {added ? "Added to Basket" : "Add to Basket"}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="btn btn-accent py-3.5 text-xs font-semibold uppercase tracking-wider"
                >
                  Buy It Now
                </button>
              </div>
            </div>
          )}

          {/* Meta Specifications */}
          <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-500 font-sans space-y-1">
            <p><strong>SKU:</strong> {product.sku}</p>
            <p><strong>Category:</strong> {product.category.toUpperCase()}</p>
            <p><strong>Shipping:</strong> Standard Cash on Delivery island-wide.</p>
          </div>
        </div>
      </div>

      {/* Related Products Recommendation */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8 pt-8 border-t border-[#1E3A2F]/10">
          <div className="text-center sm:text-left space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#C27D38] font-bold block">Gourmet Matches</span>
            <h2 className="text-2xl font-bold font-serif text-[#1E3A2F]">You Might Also Like</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
