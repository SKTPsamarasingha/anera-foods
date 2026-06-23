"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/db";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    const aggregateCustomers = async () => {
      const allOrders = await db.getOrders();
      const clientMap = {};

      allOrders.forEach(order => {
        const email = order.customer.email.toLowerCase().trim();
        const activeOrder = order.status !== "Cancelled";
        const orderVal = activeOrder ? order.totalAmount : 0;

        if (clientMap[email]) {
          clientMap[email].ordersCount++;
          clientMap[email].totalSpent += orderVal;
          if (new Date(order.createdAt) > new Date(clientMap[email].lastOrderDate)) {
            clientMap[email].lastOrderDate = order.createdAt;
          }
        } else {
          clientMap[email] = {
            name: order.customer.name,
            phone: order.customer.phone,
            email: order.customer.email,
            district: order.customer.district,
            ordersCount: 1,
            totalSpent: orderVal,
            lastOrderDate: order.createdAt
          };
        }
      });

      const list = Object.values(clientMap);
      setCustomers(list);
      setFilteredCustomers(list);
    };

    aggregateCustomers();
  }, []);

  // Filter customers search
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const q = search.toLowerCase().trim();
      setFilteredCustomers(
        customers.filter(c => 
          c.name.toLowerCase().includes(q) || 
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q)
        )
      );
    }
  }, [search, customers]);

  return (
    <div
      className="text-black
 space-y-6 font-sans"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-black">
          Customers 
        </h1>
        <p className="text-xs text-gray-500">
          Aggregated buyer contacts and total lifetime purchase values.
        </p>
      </div>

      {/* Control panel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, or telephone..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#C27D38]"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3 top-2.5"
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] font-bold">
                <th className="py-2.5">Buyer</th>
                <th className="py-2.5">Telephone</th>
                <th className="py-2.5">Region</th>
                <th className="py-2.5 text-center">Orders</th>
                <th className="py-2.5">Lifetime Spend</th>
                <th className="py-2.5 text-right">Last Purchase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-600">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-400">
                    No buyer profiles matched search parameters.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="py-3.5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1E3A2F]/10 text-black flex items-center justify-center font-bold text-xs uppercase">
                        {c.name.substring(0, 2)}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800 block">
                          {c.name}
                        </span>
                        <span className="text-[10px] text-gray-400 block">
                          {c.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <a
                        href={`tel:${c.phone}`}
                        className="text-[#C27D38] font-bold hover:underline"
                      >
                        {c.phone}
                      </a>
                    </td>
                    <td className="py-3.5 text-gray-500">{c.district}</td>
                    <td className="py-3.5 text-center font-semibold text-gray-700">
                      {c.ordersCount}
                    </td>
                    <td className="py-3.5 font-bold text-black">
                      LKR {c.totalSpent.toLocaleString()}
                    </td>
                    <td className="py-3.5 text-right text-gray-400 font-sans">
                      {new Date(c.lastOrderDate).toLocaleDateString()}
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
