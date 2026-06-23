"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/db";

export default function AdminInventoryPage() {
  const [logs, setLogs] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [filteredLogs, setFilteredLogs] = useState([]);

  useEffect(() => {
    const loadLogs = async () => {
      const data = await db.getInventoryLogs();
      setLogs(data);
      setFilteredLogs(data);
    };
    loadLogs();
  }, []);

  // Filter logs logic
  useEffect(() => {
    if (filterType === "all") {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(logs.filter(l => l.type === filterType));
    }
  }, [filterType, logs]);

  const getLogTypeBadge = (type) => {
    switch (type) {
      case "stock-in": return "bg-green-100 text-green-800 border-green-200";
      case "sale": return "bg-orange-100 text-orange-800 border-orange-200";
      case "adjustment": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-black">Inventory Movement Logs</h1>
        <p className="text-xs text-gray-500">Chronological tracking of stock restocks, buyer sales, and manual manager adjustments.</p>
      </div>

      {/* Main logs table container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        
        {/* Type Filter dropdown */}
        <div className="flex items-center gap-2 max-w-xs">
          <label className="text-xs text-gray-400 whitespace-nowrap">Filter Movement:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#C27D38] bg-white text-gray-600"
          >
            <option value="all">All Movements</option>
            <option value="stock-in">Stock-In (Restocks)</option>
            <option value="sale">Sales Deductions</option>
            <option value="adjustment">Manual Adjustments</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] font-bold">
                <th className="py-2.5">Date & Time</th>
                <th className="py-2.5">Product Details</th>
                <th className="py-2.5">Movement Type</th>
                <th className="py-2.5 text-center">Change Qty</th>
                <th className="py-2.5 text-center">Ledger Balance</th>
                <th className="py-2.5 text-right">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-600">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-400">No inventory logs available.</td>
                </tr>
              ) : (
                filteredLogs.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50/30">
                    <td className="py-3 text-gray-400">
                      {new Date(l.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span className="font-semibold text-black block">{l.productName}</span>
                      <span className="text-[10px] text-gray-400 block font-mono">{l.sku}</span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase ${getLogTypeBadge(l.type)}`}>
                        {l.type}
                      </span>
                    </td>
                    <td className={`py-3 text-center font-bold font-mono ${l.type === "stock-in" || (l.type === "adjustment" && l.newQuantity > l.previousQuantity) ? "text-green-600" : "text-red-500"}`}>
                      {l.type === "stock-in" || (l.type === "adjustment" && l.newQuantity > l.previousQuantity) ? "+" : "-"}
                      {l.quantityChange}
                    </td>
                    <td className="py-3 text-center font-sans text-gray-500">
                      {l.previousQuantity} ➔ <strong className="text-gray-800">{l.newQuantity}</strong>
                    </td>
                    <td className="py-3 text-right text-gray-500 font-sans italic max-w-xs truncate" title={l.reason}>
                      {l.reason}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
