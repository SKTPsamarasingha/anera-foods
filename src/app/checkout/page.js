"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/db";
import { sendOrderEmail } from "@/lib/email";

const SRI_LANKA_DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Galle",
  "Matara",
  "Kurunegala",
  "Jaffna",
  "Anuradhapura",
  "Trincomalee",
  "Badulla",
  "Ratnapura",
  "Kegalle",
  "Hambantota",
  "Ampara",
  "Batticaloa",
  "Vavuniya",
  "Mannar",
  "Mullaitivu",
  "Kilinochchi",
  "Nuwara Eliya",
  "Matale",
  "Puttalam",
  "Polonnaruwa",
  "Monaragala",
];

export default function CheckoutPage() {
  const {
    cartItems,
    cartSubtotal,
    shippingCost,
    grandTotal,
    district,
    setDistrict,
    clearCart,
    isMounted,
  } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Trigger InitiateCheckout Pixel Event
  useEffect(() => {
    if (isMounted && cartItems.length > 0) {
      db.logPixelEvent("InitiateCheckout", {
        itemCount: cartItems.length,
        value: cartSubtotal,
        currency: "LKR",
      });
    }
  }, [isMounted, cartItems, cartSubtotal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDistrictChange = (e) => {
    const selected = e.target.value;
    setDistrict(selected);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    const cleanPhone = formData.phone.trim();
    if (!cleanPhone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\s-]{9,15}$/.test(cleanPhone)) {
      newErrors.phone =
        "Enter a valid Sri Lankan phone number (e.g., 0771234567)";
    }

    if (!formData.address.trim())
      newErrors.address = "Delivery address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";

    if (formData.email.trim()) {
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Enter a valid email address";
      }
    } else {
      newErrors.email = "Email address is required for confirmation receipt";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      router.push(`/login?redirect=/checkout`);
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const orderData = {
        customer: {
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          district,
          ...(user?.uuid ? { uuid: user.uuid } : {}),
        },
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          weight: item.weight,
        })),
        paymentMethod: "COD",
        subtotal: cartSubtotal,
        shippingCost,
        totalAmount: grandTotal,
        notes: formData.notes.trim(),
      };

      // Create order in DB (handles stock deduction)
      const order = await db.createOrder(orderData);

      // Dispatch simulated email
      await sendOrderEmail(order);

      // Track order confirmation view
      setPlacedOrder(order);

      // Clear Cart
      clearCart();
    } catch (error) {
      console.error("Checkout submission failed:", error);
      alert("There was an error processing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E1A926] mx-auto"></div>
        <p className="mt-4 text-xs text-gray-500">Initializing checkout...</p>
      </div>
    );
  } 

  // 1. ORDER CONFIRMED DISPLAY (Success state)
  if (placedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8 animate-fade-in">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#2E7D32]/10 text-[#2E7D32] rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 stroke-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-[#E1A926] tracking-widest font-sans">
              Payment Mode: Cash on Delivery
            </span>
            <h1 className="text-3xl font-bold font-serif text-black">
              Order Confirmed!
            </h1>
            <p className="text-xs text-gray-500 font-sans">
              Thank you for shopping with Anera Foods. We have sent a simulated
              confirmation receipt to{" "}
              <strong className="text-gray-700">
                {placedOrder.customer.email}
              </strong>
              .
            </p>
          </div>

          <div className="bg-[#1A1A1A] p-5 rounded-2xl text-left border border-[#E1A926]/5 space-y-3 font-sans text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Order Number:</span>
              <strong className="text-[#F2F2F2]">
                {placedOrder.orderNumber}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Estimated Delivery:</span>
              <strong className="text-[#F2F2F2]">2 - 4 Business Days</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Address:</span>
              <span className="text-right text-[#F2F2F2] max-w-xs font-semibold">
                {placedOrder.customer.address}, {placedOrder.customer.city}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3">
              <span className="text-gray-600 font-semibold">Total Amount:</span>
              <strong className="text-sm text-[#E1A926]">
                LKR {placedOrder.totalAmount.toLocaleString()}
              </strong>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/products"
              className="btn btn-primary px-6 py-3 text-xs w-full sm:w-auto font-sans"
            >
              Continue Shopping
            </Link>
            <Link
              href={`/track?number=${placedOrder.orderNumber}&phone=${placedOrder.customer.phone}`}
              className="btn btn-outline px-6 py-3 text-xs w-full sm:w-auto font-sans"
            >
              Track Order Status
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. EMPTY CART VIEW
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
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
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h2 className="text-2xl font-bold font-serif text-[#F2F2F2]">
          Your Cart is Empty
        </h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto font-sans">
          You need items in your cart to checkout. Explore our premium selection
          of traditional delicacies.
        </p>
        <Link
          href="/products"
          className="btn btn-primary text-xs py-2.5 px-6 font-sans"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in">
      <div className="text-center sm:text-left space-y-2">
        <h1 className="text-3xl font-bold font-serif text-[#F2F2F2]">
          Secure Checkout
        </h1>
        <p className="text-xs text-gray-500 font-sans">
          Please provide valid contact and delivery details. Our rider will
          contact you prior to delivery.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Left: Shipping Details Fields */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold font-serif text-black border-b border-gray-100 pb-3 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[#E1A926]"
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
            </svg>
            1. Delivery Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 font-sans">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`text-black w-full p-2.5 text-xs border rounded-lg focus:outline-none focus:border-[#E1A926] font-sans ${
                  errors.firstName ? "border-[#D32F2F]" : "border-gray-200"
                }`}
                placeholder="John"
              />
              {errors.firstName && (
                <span className="text-[10px] text-[#D32F2F] font-sans block">
                  {errors.firstName}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 font-sans">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`text-black w-full p-2.5 text-xs border rounded-lg focus:outline-none focus:border-[#E1A926] font-sans ${
                  errors.lastName ? "border-[#D32F2F]" : "border-gray-200"
                }`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <span className="text-[10px] text-[#D32F2F] font-sans block">
                  {errors.lastName}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 font-sans">
                Phone Number * (Delivery rider will call you)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`text-black w-full p-2.5 text-xs border rounded-lg focus:outline-none focus:border-[#E1A926] font-sans ${
                  errors.phone ? "border-[#D32F2F]" : "border-gray-200"
                }`}
                placeholder="e.g. 0771234567"
              />
              {errors.phone && (
                <span className="text-[10px] text-[#D32F2F] font-sans block">
                  {errors.phone}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 font-sans">
                Email Address * (Invoice target)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`text-black w-full p-2.5 text-xs border rounded-lg focus:outline-none focus:border-[#E1A926] font-sans ${
                  errors.email ? "border-[#D32F2F]" : "border-gray-200"
                }`}
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <span className="text-[10px] text-[#D32F2F] font-sans block">
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 font-sans">
              Street Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`text-black w-full p-2.5 text-xs border rounded-lg focus:outline-none focus:border-[#E1A926] font-sans ${
                errors.address ? "border-[#D32F2F]" : "border-gray-200"
              }`}
              placeholder="e.g. No. 45, Temple Road"
            />
            {errors.address && (
              <span className="text-[10px] text-[#D32F2F] font-sans block">
                {errors.address}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 font-sans">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`text-black w-full p-2.5 text-xs border rounded-lg focus:outline-none focus:border-[#E1A926] font-sans ${
                  errors.city ? "border-[#D32F2F]" : "border-gray-200"
                }`}
                placeholder="e.g. Colombo 03"
              />
              {errors.city && (
                <span className="text-[10px] text-[#D32F2F] font-sans block">
                  {errors.city}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 font-sans">
                District * (Select for shipping rate)
              </label>
              <select
                value={district}
                onChange={handleDistrictChange}
                className="text-black w-full p-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#E1A926] font-sans bg-white"
              >
                {SRI_LANKA_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 font-sans">
              Order Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="text-black w-full p-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#E1A926] font-sans"
              placeholder="Special delivery instructions or packaging requests..."
            />
          </div>

          <h2 className="text-lg font-bold font-serif text-black border-b border-gray-100 pb-3 pt-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[#E1A926]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            2. Payment Method
          </h2>
          <div className="p-4 rounded-xl border border-[#E1A926] bg-[#1A1A1A] flex items-center gap-3">
            <span className="w-4.5 h-4.5 rounded-full border-4 border-[#E1A926] flex items-center justify-center flex-shrink-0" />
            <div className="font-sans">
              <h4 className="text-xs font-bold text-[#F2F2F2]">
                Cash on Delivery (COD)
              </h4>
              <p className="text-[10px] text-gray-500">
                Pay cash to our delivery agent upon receiving the package.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Order summary & Submit CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold font-serif text-black border-b border-gray-100 pb-2">
              Order Summary
            </h3>

            {/* Items list */}
            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex justify-between gap-3 font-sans text-xs"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 line-clamp-1">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-gray-400">
                      Qty: {item.quantity} • {item.weight}
                    </span>
                  </div>
                  <strong className="text-gray-700">
                    LKR {(item.price * item.quantity).toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>

            {/* Totals panel */}
            <div className="border-t border-gray-100 pt-4 space-y-2.5 font-sans text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>LKR {cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Fee ({district})</span>
                <span>LKR {shippingCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 text-[#F2F2F2] font-bold">
                <span className="text-sm text-black">Grand Total</span>
                <span className="text-lg text-[#E1A926]">
                  LKR {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn btn-accent py-3.5 text-xs font-bold uppercase tracking-wider font-sans rounded-xl mt-4"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Placing Order...
                </span>
              ) : (
                `Confirm Order (LKR ${grandTotal.toLocaleString()})`
              )}
            </button>

            <p className="text-[10px] text-gray-400 text-center font-sans mt-2">
              By confirming, you agree to pay cash upon delivery.
              Returns/refunds apply under our standard policy conditions.
            </p>
          </div>

          {/* Secure indicator */}
          <div className="p-4 bg-[#1A1A1A] rounded-xl border border-dashed border-[#E1A926]/20 flex items-center gap-3 text-[#F2F2F2] text-[11px] font-sans">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>
              Your order is backed by Anera Foods support. Feel free to contact
              us on WhatsApp if you need changes.
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

