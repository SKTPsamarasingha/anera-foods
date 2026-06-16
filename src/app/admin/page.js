"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/db";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrder: 0,
    lowStockCount: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [pixelLogsCount, setPixelLogsCount] = useState({
    PageView: 0,
    AddToCart: 0,
    InitiateCheckout: 0,
    Purchase: 0
  });

  const [categorySales, setCategorySales] = useState({
    snacks: 0,
    "ready-to-eat": 0,
    specialty: 0
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      const allOrders = await db.getOrders();
      const allProducts = await db.getProducts();
      const pixelLogs = await db.getPixelLogs();

      // 1. Calculate Metrics
      // Filter out cancelled orders for sales metrics
      const activeOrders = allOrders.filter(o => o.status !== "Cancelled");
      const salesTotal = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const ordersCount = allOrders.length;
      const avgVal = ordersCount > 0 ? salesTotal / activeOrders.length || 0 : 0;
      
      const lowStock = allProducts.filter(p => p.stockQuantity < 10);

      setMetrics({
        totalSales: salesTotal,
        totalOrders: ordersCount,
        averageOrder: avgVal,
        lowStockCount: lowStock.length
      });

      // 2. Set Tables
      setRecentOrders(allOrders.slice(0, 4));
      setLowStockProducts(lowStock);

      // 3. Pixel logs count
      const counts = { PageView: 0, AddToCart: 0, InitiateCheckout: 0, Purchase: 0 };
      pixelLogs.forEach(log => {
        if (counts[log.eventName] !== undefined) {
          counts[log.eventName]++;
        }
      });
      setPixelLogsCount(counts);

      // 4. Calculate Sales by Category
      const catSales = { snacks: 0, "ready-to-eat": 0, specialty: 0 };
      activeOrders.forEach(o => {
        o.items.forEach(item => {
          // Find category of item
          const prod = allProducts.find(p => p.id === item.productId || p.name === item.name);
          if (prod && catSales[prod.category] !== undefined) {
            catSales[prod.category] += item.price * item.quantity;
          }
        });
      });
      setCategorySales(catSales);
    };

    loadDashboardData();
    // Refresh dashboard stats every 5 seconds to keep it dynamic
    const interval = setInterval(loadDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Confirmed": return "bg-blue-100 text-blue-800";
      case "Processing": return "bg-indigo-100 text-indigo-800";
      case "Ready for Dispatch": return "bg-purple-100 text-purple-800";
      case "Dispatched": return "bg-orange-100 text-orange-800";
      case "Delivered": case "Completed": return "bg-green-100 text-green-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-[#1E3A2F]">Administrative Overview</h1>
        <p className="text-xs text-gray-500">Real-time storefront sales data, inventory alerts, and pixel tracking activities.</p>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Sales</span>
            <h3 className="text-xl font-bold text-[#1E3A2F] font-serif">LKR {metrics.totalSales.toLocaleString()}</h3>
          </div>
          <div className="w-10 h-10 bg-[#2E7D32]/5 text-[#2E7D32] rounded-full flex items-center justify-center">
            LKR
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Orders</span>
            <h3 className="text-xl font-bold text-[#1E3A2F] font-serif">{metrics.totalOrders}</h3>
          </div>
          <div className="w-10 h-10 bg-[#1E3A2F]/5 text-[#1E3A2F] rounded-full flex items-center justify-center">
            #
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Avg Order Value</span>
            <h3 className="text-xl font-bold text-[#1E3A2F] font-serif">LKR {Math.round(metrics.averageOrder).toLocaleString()}</h3>
          </div>
          <div className="w-10 h-10 bg-[#C27D38]/5 text-[#C27D38] rounded-full flex items-center justify-center">
            %
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Low Stock Warnings</span>
            <h3 className={`text-xl font-bold font-serif ${metrics.lowStockCount > 0 ? "text-[#D32F2F] animate-pulse" : "text-[#1E3A2F]"}`}>
              {metrics.lowStockCount} Products
            </h3>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${metrics.lowStockCount > 0 ? "bg-[#D32F2F]/5 text-[#D32F2F]" : "bg-gray-50 text-gray-400"}`}>
            !
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales by Category Graph */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#1E3A2F] font-serif">Category Performance</h3>
            <p className="text-[10px] text-gray-400">Relative sales volume per inventory category.</p>
          </div>
          
          <div className="space-y-4 pt-2">
            {[
              { id: "snacks", label: "Artisanal Snacks", val: categorySales.snacks },
              { id: "ready-to-eat", label: "Ready-To-Eat", val: categorySales["ready-to-eat"] },
              { id: "specialty", label: "Specialty Items", val: categorySales.specialty }
            ].map(item => {
              const maxVal = Math.max(categorySales.snacks, categorySales["ready-to-eat"], categorySales.specialty) || 1;
              const percent = Math.min(100, Math.round((item.val / maxVal) * 100));
              return (
                <div key={item.id} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="text-[#1E3A2F]">LKR {item.val.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#C27D38] h-full rounded-full transition-all duration-1000"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pixel Logs Tracking Summary */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#1E3A2F] font-serif">Facebook & TikTok Attribution</h3>
            <p className="text-[10px] text-gray-400">Triggered conversion events counts.</p>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {[
              { label: "Page Views", count: pixelLogsCount.PageView, color: "bg-[#1E3A2F]" },
              { label: "Add To Carts", count: pixelLogsCount.AddToCart, color: "bg-[#C27D38]" },
              { label: "Checkouts Loaded", count: pixelLogsCount.InitiateCheckout, color: "bg-[#E5A93B]" },
              { label: "Purchases completed", count: pixelLogsCount.Purchase, color: "bg-[#2E7D32]" }
            ].map((pix, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${pix.color}`} />
                  <span className="text-gray-600 font-medium">{pix.label}</span>
                </div>
                <strong className="text-[#1E3A2F]">{pix.count}</strong>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-[#1E3A2F] font-serif">Recent Orders</h3>
              <p className="text-[10px] text-gray-400">Newly placed buyer carts.</p>
            </div>
            <Link href="/admin/orders" className="text-xs text-[#C27D38] font-bold hover:underline">
              View All Orders
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] font-bold">
                  <th className="py-2.5">Order</th>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5">Total</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-600">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-400">No orders placed yet.</td>
                  </tr>
                ) : (
                  recentOrders.map(o => (
                    <tr key={o.id}>
                      <td className="py-3 font-semibold text-[#1E3A2F]">{o.orderNumber}</td>
                      <td className="py-3">{o.customer.name}</td>
                      <td className="py-3 font-semibold">LKR {o.totalAmount.toLocaleString()}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-sans ${getStatusClass(o.status)}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link 
                          href={`/admin/orders?id=${o.id}`}
                          className="text-[#C27D38] font-bold hover:underline"
                        >
                          Process
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#1E3A2F] font-serif">Low Stock Alerts</h3>
            <p className="text-[10px] text-gray-400">Items with stock less than 10 units.</p>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                All inventory quantities are healthy.
              </div>
            ) : (
              lowStockProducts.map(p => (
                <div key={p.id} className="flex justify-between items-center p-3 rounded-lg bg-red-50/50 border border-red-100 text-xs">
                  <div>
                    <h4 className="font-semibold text-gray-800 line-clamp-1">{p.name}</h4>
                    <span className="text-[10px] text-gray-400">SKU: {p.sku}</span>
                  </div>
                  <span className={`px-2 py-1 rounded font-bold ${p.stockQuantity === 0 ? "bg-red-200 text-red-800" : "bg-orange-100 text-orange-800"}`}>
                    Qty: {p.stockQuantity}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
