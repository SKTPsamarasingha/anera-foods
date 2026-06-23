"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/db";

export default function AdminAnalyticsPage() {
  const [pixelLogs, setPixelLogs] = useState([]);
  const [funnel, setFunnel] = useState({
    pageViews: 0,
    carts: 0,
    checkouts: 0,
    purchases: 0,
    cartRate: 0,
    buyRate: 0,
    revenue: 0
  });

  useEffect(() => {
    const loadLogs = async () => {
      const data = await db.getPixelLogs();
      setPixelLogs(data);

      // Funnel calculations
      let pViews = 0;
      let carts = 0;
      let checkouts = 0;
      let buys = 0;
      let rev = 0;

      data.forEach(log => {
        if (log.eventName === "PageView") pViews++;
        else if (log.eventName === "AddToCart") carts++;
        else if (log.eventName === "InitiateCheckout") checkouts++;
        else if (log.eventName === "Purchase") {
          buys++;
          if (log.data && log.data.value) {
            rev += parseFloat(log.data.value);
          }
        }
      });

      const cRate = pViews > 0 ? Math.round((carts / pViews) * 100) : 0;
      const bRate = carts > 0 ? Math.round((buys / carts) * 100) : 0;

      setFunnel({
        pageViews: pViews,
        carts: carts,
        checkouts: checkouts,
        purchases: buys,
        cartRate: cRate,
        buyRate: bRate,
        revenue: rev
      });
    };

    loadLogs();
  }, []);

  const getPixelEventBadge = (name) => {
    switch (name) {
      case "PageView": return "bg-[#1E3A2F]/10 text-black border-[#1E3A2F]/20";
      case "AddToCart": return "bg-[#C27D38]/10 text-[#C27D38] border-[#C27D38]/20";
      case "InitiateCheckout": return "bg-[#E5A93B]/10 text-[#E5A93B] border-[#E5A93B]/20";
      case "Purchase": return "bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/20";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-black">Meta & TikTok Pixel Tracking</h1>
        <p className="text-xs text-gray-500">
          Attribution reports analyzing Facebook PageView and Purchase event logs to calculate campaign ROI.
        </p>
      </div>

      {/* Funnel Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Conversion Rates</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 block">Add to Cart Rate</span>
              <strong className="text-2xl font-serif text-[#C27D38]">{funnel.cartRate}%</strong>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 block">Buy Conversion Rate</span>
              <strong className="text-2xl font-serif text-[#2E7D32]">{funnel.buyRate}%</strong>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Funnel Counts</h3>
          <div className="flex gap-4 justify-between items-center text-[10px] text-gray-500 pt-1">
            <div className="text-center">
              <span className="block font-bold text-gray-800 text-base">{funnel.pageViews}</span>
              <span>Views</span>
            </div>
            <span className="text-lg">➔</span>
            <div className="text-center">
              <span className="block font-bold text-gray-800 text-base">{funnel.carts}</span>
              <span>Carts</span>
            </div>
            <span className="text-lg">➔</span>
            <div className="text-center">
              <span className="block font-bold text-[#2E7D32] text-base">{funnel.purchases}</span>
              <span>Orders</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Simulated Ad Revenue</h3>
          <div className="pt-1">
            <span className="text-[10px] text-gray-400 block">Purchase Value Total</span>
            <strong className="text-2xl font-serif text-black">LKR {funnel.revenue.toLocaleString()}</strong>
          </div>
        </div>

      </div>

      {/* Funnel Graph Visualizer */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-black font-serif">Storefront Conversion Funnel</h3>
          <p className="text-[10px] text-gray-400">Step-by-step checkout drops analysis.</p>
        </div>

        <div className="space-y-4 pt-2">
          {[
            { label: "1. Page Views (Initial Traffic)", count: funnel.pageViews, color: "bg-[#1E3A2F]", total: funnel.pageViews },
            { label: "2. Add To Basket (Product Intent)", count: funnel.carts, color: "bg-[#C27D38]", total: funnel.pageViews },
            { label: "3. Initiated Checkout (Purchase Intent)", count: funnel.checkouts, color: "bg-[#E5A93B]", total: funnel.pageViews },
            { label: "4. Purchases Completed (Success)", count: funnel.purchases, color: "bg-[#2E7D32]", total: funnel.pageViews }
          ].map((step, idx) => {
            const pct = step.total > 0 ? Math.round((step.count / step.total) * 100) : 0;
            return (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-700">{step.label}</span>
                  <span className="text-gray-500">{step.count} ({pct}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className={`${step.color} h-full rounded-full transition-all duration-1000`}
                    style={{ width: `${step.total > 0 ? (step.count / step.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Raw logs list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold text-black font-serif">Raw Pixel Logs Ledger</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] font-bold">
                <th className="py-2.5">Time</th>
                <th className="py-2.5">Pixel Event</th>
                <th className="py-2.5">Value (LKR)</th>
                <th className="py-2.5 text-right">Data Parameters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-600">
              {pixelLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">No marketing pixel activities logged yet.</td>
                </tr>
              ) : (
                pixelLogs.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50/30">
                    <td className="py-3 text-gray-400">
                      {new Date(l.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${getPixelEventBadge(l.eventName)}`}>
                        {l.eventName}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-gray-700">
                      {l.data && l.data.value ? `LKR ${parseFloat(l.data.value).toLocaleString()}` : "-"}
                    </td>
                    <td className="py-3 text-right text-gray-400 font-mono text-[10px] max-w-sm truncate" title={JSON.stringify(l.data)}>
                      {JSON.stringify(l.data)}
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
