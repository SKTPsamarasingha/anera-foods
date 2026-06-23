"use client";

import React, { useState, useEffect, Suspense } from "react";
import { db } from "@/lib/db";
import { useAuth } from "@/context/AuthContext";

const STATUS_STEPS = [
  {
    status: "Pending",
    label: "Order Received",
    desc: "Awaiting confirmation from our kitchen.",
  },
  {
    status: "Confirmed",
    label: "Confirmed",
    desc: "Order details verified and approved.",
  },
  {
    status: "Processing",
    label: "Preparing",
    desc: "Your items are being packed fresh.",
  },
  {
    status: "Ready for Dispatch",
    label: "Ready",
    desc: "Packaged and ready for the courier.",
  },
  {
    status: "Dispatched",
    label: "On the Way",
    desc: "Courier is delivering to your address.",
  },
  {
    status: "Delivered",
    label: "Delivered",
    desc: "Package handed over successfully.",
  },
];

function TrackContent() {
  const [order, setOrder] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [customerOrdersLoading, setCustomerOrdersLoading] = useState(false);
  const [customerOrdersError, setCustomerOrdersError] = useState("");

  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    const loadCustomerOrders = async () => {
      console.log(user);
      
      if (!user) {
        setCustomerOrders([]);
        setCustomerOrdersError("");
        return;
      }

      setCustomerOrdersLoading(true);
      setCustomerOrdersError("");
      try {
        const orders = await db.getOrdersByCustomer();
        setCustomerOrders(orders);
      } catch (err) {
        console.error("Failed to load customer orders:", err);
        setCustomerOrdersError(
          "Unable to load your orders. Please try again later.",
        );
      } finally {
        setCustomerOrdersLoading(false);
      }
    };

    loadCustomerOrders();
  }, [user, authLoading]);

  const getStepStatus = (stepIndex, orderStatus) => {
    if (orderStatus === "Cancelled") return "cancelled";

    const activeStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Ready for Dispatch",
      "Dispatched",
      "Delivered",
      "Completed",
    ];
    const currentIdx = activeStatuses.indexOf(
      orderStatus === "Completed" ? "Delivered" : orderStatus,
    );

    if (stepIndex < currentIdx) return "completed";
    if (stepIndex === currentIdx) return "active";
    return "upcoming";
  };

  return (
    <div
      className=" max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fade-in font-sans"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#C27D38] font-bold">
          Track Shipment
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-white">
          Track Your Order
        </h1>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Enter your order credentials to securely check real-time delivery
          status.
        </p>
      </div>

      {/* Customer Orders */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#C27D38] font-bold">
              Your Orders
            </span>
            <h2 className="text-lg sm:text-xl font-semibold text-black mt-2">
              {user
                ? `Orders for ${user.name}`
                : "Sign in to view your order history"}
            </h2>
          </div>
          {user && !customerOrdersLoading && (
            <span className="text-xs text-gray-500">
              {customerOrders.length} order
              {customerOrders.length === 1 ? "" : "s"}
            </span>
          )}
        </div>

        {authLoading ? (
          <div className="py-10 text-center text-xs text-gray-500">
            Loading your account and order history...
          </div>
        ) : user ? (
          customerOrdersLoading ? (
            <div className="py-10 text-center text-xs text-gray-500">
              Fetching your past orders...
            </div>
          ) : customerOrdersError ? (
            <div className="py-10 text-center text-xs text-red-600">
              {customerOrdersError}
            </div>
          ) : customerOrders.length === 0 ? (
            <div className="py-10 text-center text-xs text-gray-500">
              No orders found for your account yet. Check back after placing a
              new order.
            </div>
          ) : (
            <div className="space-y-3">
              {customerOrders.map((customerOrder) => (
                <div
                  key={customerOrder.id}
                  className="rounded-3xl border border-gray-100 p-4 sm:p-5 hover:shadow-sm transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                        {customerOrder.orderNumber}
                      </p>
                      <p className="text-sm font-semibold text-black mt-1">
                        {customerOrder.status}
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <p>
                        {new Date(customerOrder.createdAt).toLocaleDateString()}
                      </p>
                      <p className="mt-1 font-semibold text-[#C27D38]">
                        LKR {customerOrder.totalAmount?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-500">
                    <p>
                      {customerOrder.items?.length ?? 0} item
                      {(customerOrder.items?.length ?? 0) === 1 ? "" : "s"}
                    </p>
                    <button
                      type="button"
                      onClick={() => setOrder(customerOrder)}
                      className="inline-flex items-center justify-center rounded-full border border-[#C27D38] px-4 py-2 text-[11px] font-semibold text-[#C27D38] hover:bg-[#C27D38]/10 transition"
                    >
                      View status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="py-10 text-center text-xs text-gray-500">
            Sign in to securely view all orders tied to your account.
          </div>
        )}
      </div>

      {order && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 items-start animate-fade-in">
          {/* Tracking Timeline Column */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                  Shipment Code
                </span>
                <strong className="text-base text-black font-serif">
                  {order.orderNumber}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block text-right">
                  Payment Mode
                </span>
                <span className="text-xs font-bold text-[#C27D38]">
                  Cash on Delivery
                </span>
              </div>
            </div>

            {/* Cancelled state check */}
            {order.status === "Cancelled" ? (
              <div className="p-4 bg-red-50 text-[#D32F2F] rounded-xl border border-red-100 flex items-start gap-3 text-xs leading-normal">
                <svg
                  className="w-5 h-5 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <h4 className="font-bold">Order Cancelled</h4>
                  <p className="mt-0.5">
                    This order has been marked as cancelled. If you did not
                    request this, please contact us on WhatsApp (+94 76 913
                    8608).
                  </p>
                </div>
              </div>
            ) : (
              /* Timeline progress list */
              <div className="space-y-6 relative pl-6 before:absolute before:left-2.75 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                {STATUS_STEPS.map((step, idx) => {
                  const stepStatus = getStepStatus(idx, order.status);

                  return (
                    <div
                      key={idx}
                      className="relative flex gap-4 text-xs font-sans"
                    >
                      {/* Node Dot icon */}
                      <span
                        className={`absolute -left-5 top-1.5 w-3 h-3 rounded-full border-2 transition-all flex items-center justify-center ${
                          stepStatus === "completed"
                            ? "bg-[#2E7D32] border-[#2E7D32]"
                            : stepStatus === "active"
                              ? "bg-white border-[#C27D38] ring-4 ring-[#C27D38]/10 scale-110"
                              : "bg-white border-gray-200"
                        }`}
                      />

                      <div className="flex-1">
                        <h4
                          className={`font-semibold ${
                            stepStatus === "active"
                              ? "text-[#C27D38]"
                              : stepStatus === "completed"
                                ? "text-gray-800"
                                : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </h4>
                        <p
                          className={`text-[10px] mt-0.5 ${
                            stepStatus === "active"
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Items Summary Column */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold font-serif text-black border-b border-gray-100 pb-2">
              Order Items
            </h3>

            <div className="divide-y divide-gray-100 max-h-52 overflow-y-auto pr-1">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="py-2.5 flex justify-between gap-3 font-sans text-xs"
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

            <div className="border-t border-gray-100 pt-3 space-y-2 text-xs font-sans text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>LKR {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>LKR {order.shippingCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-gray-150 pt-2 text-black font-bold">
                <span>Total Amount Paid</span>
                <span className="text-sm text-[#C27D38]">
                  LKR {order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Delivery address details */}
            <div className="text-[11px] font-sans text-gray-500 space-y-1 bg-gray-50 p-3 rounded-lg">
              <span className="font-bold text-gray-700 block uppercase text-[9px] mb-1">
                Shipping Target
              </span>
              <p>
                <strong>Rider Call Name:</strong> {order.customer.name}
              </p>
              <p>
                <strong>Courier Coordinates:</strong> {order.customer.address},{" "}
                {order.customer.city}, {order.customer.district}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1E3A2F] mx-auto"></div>
          <p className="mt-4 text-xs text-gray-500">
            Loading tracking center...
          </p>
        </div>
      }
    >
      <TrackContent />
    </Suspense>
  );
}
