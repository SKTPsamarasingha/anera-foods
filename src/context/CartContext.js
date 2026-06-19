"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "@/lib/db";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [district, setDistrict] = useState("Colombo");
  const [settings, setSettings] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart on client mount
  useEffect(() => {
    setIsMounted(true);
    const storedCart = localStorage.getItem("anr_cart");
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to parse cart items:", e);
      }
    }
    // load settings for shipping/loyalty
    (async () => {
      try {
        const s = await db.getSettings();
        setSettings(s || {});
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    })();
  }, []);

  // Save cart to local storage
  const saveCart = (items) => {
    setCartItems(items);
    if (typeof window !== "undefined") {
      localStorage.setItem("anr_cart", JSON.stringify(items));
    }
  };

  const addToCart = (product, quantity = 1) => {
    const existingIndex = cartItems.findIndex((item) => item.id === product.id);
    let updatedCart = [...cartItems];

    if (existingIndex >= 0) {
      const newQty = updatedCart[existingIndex].quantity + quantity;
      // Cap at stockQuantity if stock is limited
      if (
        product.stockQuantity !== undefined &&
        newQty > product.stockQuantity
      ) {
        updatedCart[existingIndex].quantity = product.stockQuantity;
      } else {
        updatedCart[existingIndex].quantity = newQty;
      }
    } else {
      updatedCart.push({
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        weight: product.weight,
        images: product.images,
        quantity: Math.min(quantity, product.stockQuantity || 99),
      });
    }

    saveCart(updatedCart);
    db.logPixelEvent("AddToCart", {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
    });
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    saveCart(updatedCart);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity } : item,
    );
    saveCart(updatedCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  // Calculations
  const cartSubtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Shipping calculation uses settings.deliveryZones or settings.deliveryFees when present
  const getShippingCost = (selectedDistrict) => {
    const cleanDist = (selectedDistrict || "").toLowerCase().trim();

    // If settings define deliveryZones as array of { district, fee }
    if (settings?.deliveryZones && Array.isArray(settings.deliveryZones)) {
      const match = settings.deliveryZones.find((z) => {
        if (!z) return false;
        const d = (z.district || z.name || "").toLowerCase().trim();
        return d && cleanDist && d === cleanDist;
      });
      if (match) return Number(match.fee) || 0;
    }

    // If a single deliveryFees value is set, use it
    if (
      settings?.deliveryFees !== undefined &&
      settings?.deliveryFees !== null
    ) {
      return Number(settings.deliveryFees) || 0;
    }

    // Fallback: Western Province cheaper, others higher
    const westernProvinceDistricts = ["colombo", "gampaha", "kalutara"];
    if (!cleanDist) return 350;
    return westernProvinceDistricts.includes(cleanDist) ? 350 : 450;
  };

  const shippingCost = cartItems.length > 0 ? getShippingCost(district) : 0;
  const grandTotal = cartSubtotal + shippingCost;

  const loyaltyPointsPerLKR = Number(settings?.loyaltyPointsPerLKR || 0);
  const loyaltyPointsEarned = Math.floor(cartSubtotal * loyaltyPointsPerLKR);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        district,
        setDistrict,
        settings,
        loyaltyPointsEarned,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        shippingCost,
        grandTotal,
        getShippingCost,
        isMounted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
