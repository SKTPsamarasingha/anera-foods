"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/db";
import { generateInvoiceHtml } from "@/lib/email";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Ready for Dispatch",
  "Dispatched",
  "Delivered",
  "Completed",
  "Cancelled",
];

function OrdersContent() {
  const searchParams = useSearchParams();
  const focusId = searchParams.get("id");

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [previewInvoice, setPreviewInvoice] = useState(false);

  const loadOrders = async () => {
    const data = await db.getOrders();
    setOrders(data);

    // Auto-focus order if focused ID provided in query params
    if (focusId) {
      const target = data.find((o) => o.id === focusId);
      if (target) {
        setSelectedOrder(target);
      }
    }
  };

  useEffect(() => {
    loadOrders();
    // Refresh orders list every 5 seconds to get incoming checkouts
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, [focusId]);

  // Filtering logic
  useEffect(() => {
    let result = [...orders];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.phone.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }

    setFilteredOrders(result);
  }, [orders, search, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    const updated = await db.updateOrderStatus(orderId, newStatus);
    if (updated) {
      setSelectedOrder(updated);
      loadOrders();
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Processing":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Ready for Dispatch":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Dispatched":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Delivered":
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in font-sans">
      {/* Left Column: Orders List */}
      <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div>
          <h1
            className="text-xl font-bold font-serif text-black"
          >
            Order Management
          </h1>
          <p className="text-xs text-gray-500">
            Track and dispatch customer purchases.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order #, customer, phone..."
              className="w-full pl-9 pr-4 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#E1A926] text-black"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3 top-3"
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

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#E1A926] bg-white text-gray-600"
            >
              <option value="all">All Statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] font-bold">
                <th className="py-3">Order</th>
                <th className="py-3">Customer</th>
                <th className="py-3">District</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-600">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => {
                      setSelectedOrder(o);
                      setPreviewInvoice(false);
                    }}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedOrder?.id === o.id
                        ? "bg-[#E1A926]/10 font-semibold"
                        : ""
                    }`}
                  >
                    <td className="py-3.5 text-[#E1A926] font-bold">
                      {o.orderNumber}
                    </td>
                    <td className="py-3.5">
                      <span className="block text-gray-800">
                        {o.customer.name}
                      </span>
                      <span className="block text-[10px] text-gray-400 font-normal">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 text-gray-500">
                      {o.customer.district}
                    </td>
                    <td className="py-3.5 font-bold text-gray-700">
                      LKR {o.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${getStatusBadgeClass(o.status)}`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Column: Order Detail View Panel */}
      <div className="lg:col-span-5">
        {selectedOrder ? (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 animate-fade-in sticky top-24">
            {/* Detail Header */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-lg font-bold font-serif text-black">
                  {selectedOrder.orderNumber}
                </h2>
                <span className="text-[10px] text-gray-400 font-sans">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Status Update drop down */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-gray-400 block font-sans text-right">
                  Process Status
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder.id, e.target.value)
                  }
                  className="p-1 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#E1A926] bg-white font-semibold text-[#E1A926]"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {previewInvoice ? (
              // INVOICE PREVIEW PANEL
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold font-serif text-black">
                    Invoice Packing Slip
                  </span>
                  <button
                    onClick={() => setPreviewInvoice(false)}
                    className="text-xs font-bold text-[#C27D38] underline"
                  >
                    Back to Details
                  </button>
                </div>
                <div
                  id="print-invoice"
                  className="border border-gray-200 rounded-xl overflow-hidden max-h-[400px] overflow-y-auto p-4 bg-[#FDFBF7]"
                  dangerouslySetInnerHTML={{
                    __html: generateInvoiceHtml(selectedOrder),
                  }}
                />
                <button
                  onClick={() => {
                    const invoiceHtml = generateInvoiceHtml(selectedOrder);
                    const printWindow = window.open(
                      "",
                      "_blank",
                      "width=800,height=900",
                    );
                    if (printWindow) {
                      printWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <title>Anera Foods - Invoice</title>
                            <style>
                              body { margin: 0; padding: 20px; font-family: Helvetica, Arial, sans-serif; background-color: #FFFFFF; }
                              @media print { body { margin: 0; } }
                            </style>
                          </head>
                          <body>
                            ${invoiceHtml}
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.focus();
                      printWindow.print();
                    }
                  }}
                  className="btn btn-primary w-full py-2 text-xs font-sans rounded-lg"
                >
                  Print Packing Slip
                </button>
              </div>
            ) : (
              // STANDARD DETAIL PANEL
              <div className="space-y-5 text-xs font-sans">
                {/* Quick Status Actions */}
                {selectedOrder.status !== "Completed" &&
                  selectedOrder.status !== "Cancelled" && (
                    <div className="bg-[#F0F4F1] p-4 rounded-xl border border-[#1E3A2F]/5 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block font-sans">
                        Next Action Step
                      </span>
                      <div className="flex gap-2">
                        {selectedOrder.status === "Pending" && (
                          <button
                            onClick={() =>
                              handleStatusChange(selectedOrder.id, "Confirmed")
                            }
                            className="btn py-2 px-4 text-xs font-sans rounded-md w-full bg-[#2E7D32] hover:bg-[#1E5A22] text-white border-transparent flex items-center justify-center gap-1.5"
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
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Confirm Order
                          </button>
                        )}
                        {selectedOrder.status === "Confirmed" && (
                          <button
                            onClick={() =>
                              handleStatusChange(selectedOrder.id, "Processing")
                            }
                            className="btn py-2 px-4 text-xs font-sans rounded-md w-full bg-[#1E3A2F] hover:bg-[#C27D38] text-white border-transparent flex items-center justify-center gap-1.5"
                          >
                            🍳 Start Preparing
                          </button>
                        )}
                        {selectedOrder.status === "Processing" && (
                          <button
                            onClick={() =>
                              handleStatusChange(
                                selectedOrder.id,
                                "Ready for Dispatch",
                              )
                            }
                            className="btn py-2 px-4 text-xs font-sans rounded-md w-full bg-[#8E24AA] hover:bg-[#6A1B9A] text-white border-transparent flex items-center justify-center gap-1.5"
                          >
                            📦 Mark as Ready
                          </button>
                        )}
                        {selectedOrder.status === "Ready for Dispatch" && (
                          <button
                            onClick={() =>
                              handleStatusChange(selectedOrder.id, "Dispatched")
                            }
                            className="btn py-2 px-4 text-xs font-sans rounded-md w-full bg-[#E65100] hover:bg-[#B33900] text-white border-transparent flex items-center justify-center gap-1.5"
                          >
                            🚚 Ship Order
                          </button>
                        )}
                        {selectedOrder.status === "Dispatched" && (
                          <button
                            onClick={() =>
                              handleStatusChange(selectedOrder.id, "Delivered")
                            }
                            className="btn py-2 px-4 text-xs font-sans rounded-md w-full bg-[#2E7D32] hover:bg-[#1E5A22] text-white border-transparent flex items-center justify-center gap-1.5"
                          >
                            🏠 Mark Delivered
                          </button>
                        )}
                        {selectedOrder.status === "Delivered" && (
                          <button
                            onClick={() =>
                              handleStatusChange(selectedOrder.id, "Completed")
                            }
                            className="btn py-2 px-4 text-xs font-sans rounded-md w-full bg-[#C27D38] hover:bg-[#A96222] text-white border-transparent flex items-center justify-center gap-1.5"
                          >
                            ★ Complete Order
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                {/* Buyer Details */}
                <div className="space-y-2">
                  <h3 className="text-xs uppercase font-bold text-[#C27D38] tracking-wider font-sans">
                    Buyer Details
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-xl space-y-1.5 text-gray-600">
                    <p>
                      <strong>Name:</strong> {selectedOrder.customer.name}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      <a
                        href={`tel:${selectedOrder.customer.phone}`}
                        className="text-[#C27D38] font-bold hover:underline"
                      >
                        {selectedOrder.customer.phone}
                      </a>
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedOrder.customer.email}
                    </p>
                    <p>
                      <strong>Address:</strong> {selectedOrder.customer.address}
                      , {selectedOrder.customer.city},{" "}
                      {selectedOrder.customer.district}
                    </p>
                  </div>
                </div>

                {/* Items Purchased */}
                <div className="space-y-2">
                  <h3 className="text-xs uppercase font-bold text-[#C27D38] tracking-wider font-sans">
                    Items Purchased
                  </h3>
                  <div className="divide-y divide-gray-100">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex justify-between">
                        <div>
                          <span className="font-semibold text-gray-800">
                            {item.name}
                          </span>
                          <span className="block text-[10px] text-gray-400">
                            Qty: {item.quantity} • {item.weight}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-700">
                          LKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Invoice Totals */}
                <div className="border-t border-gray-100 pt-3 space-y-1.5 text-gray-500">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>LKR {selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>
                      LKR {selectedOrder.shippingCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-2 text-black font-bold">
                    <span>Invoice Total:</span>
                    <span className="text-[#C27D38]">
                      LKR {selectedOrder.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="bg-[#FDFBF7] p-3 rounded-lg border border-dashed border-[#1E3A2F]/10">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                      Customer Notes:
                    </span>
                    <p className="text-gray-600 italic">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-3">
                  <a
                    href={`https://wa.me/${selectedOrder.customer.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn bg-[#2E7D32] py-2.5 text-xs text-center flex items-center justify-center gap-1.5"
                  >
                    WhatsApp Rider
                  </a>
                  <button
                    onClick={() => setPreviewInvoice(true)}
                    className="btn btn-primary py-2.5 text-xs font-semibold"
                  >
                    Preview Invoice
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center text-gray-400 text-xs py-20 font-sans">
            <svg
              className="w-12 h-12 mx-auto text-gray-200 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
            Select an order from the list to view billing information, update
            shipping status, or preview print slips.
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1E3A2F] mx-auto"></div>
          <p className="mt-4 text-xs text-gray-500">Loading orders...</p>
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
