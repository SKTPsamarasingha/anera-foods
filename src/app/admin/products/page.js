"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/db";

const DEFAULT_FORM = {
  id: "",
  name: "",
  sku: "",
  category: "snacks",
  price: "",
  description: "",
  weight: "",
  stockQuantity: "",
  images: [""],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  const loadProducts = async () => {
    const data = await db.getProducts();
    setProducts(data);
    setFilteredProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products logic
  useEffect(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter);
    }

    setFilteredProducts(result);
  }, [products, search, categoryFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, images: [val] }));
  };

  const handleEdit = (prod) => {
    setForm({
      id: prod.id,
      name: prod.name,
      sku: prod.sku,
      category: prod.category,
      price: prod.price.toString(),
      description: prod.description,
      weight: prod.weight,
      stockQuantity: prod.stockQuantity.toString(),
      images: prod.images || [""],
    });
    setErrors({});
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setForm(DEFAULT_FORM);
    setErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.sku.trim()) newErrors.sku = "SKU code is required";
    if (!form.weight.trim()) newErrors.weight = "Weight indicator is required";

    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "Enter a valid product price";
    }

    const qtyNum = parseInt(form.stockQuantity);
    if (isNaN(qtyNum) || qtyNum < 0) {
      newErrors.stockQuantity = "Enter a valid stock quantity";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const savedProd = {
      id: form.id || undefined,
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category,
      price: parseFloat(form.price),
      description: form.description.trim(),
      weight: form.weight.trim(),
      stockQuantity: parseInt(form.stockQuantity),
      images: form.images[0].trim()
        ? [form.images[0].trim()]
        : [
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80",
          ],
    };

    await db.saveProduct(savedProd);
    await loadProducts();
    setIsFormOpen(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete/archive this product?")) {
      await db.archiveProduct(id);
      await loadProducts();
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#1E3A2F]">
            Product Management
          </h1>
          <p className="text-xs text-gray-500">
            Add, edit, or archive catalog food products.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleAddNew}
            className="btn btn-primary text-white text-xs py-2 px-5 font-semibold"
          >
            Add New Product
          </button>
        )}
      </div>

      {isFormOpen ? (
        // EDIT / CREATE FORM PANEL
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-md max-w-2xl mx-auto animate-fade-in space-y-6">
          <h2 className="text-lg font-bold font-serif text-[#1E3A2F] border-b border-gray-100 pb-3">
            {form.id ? "Edit Product Details" : "Create New Product"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-gray-600">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 border rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#C27D38] ${
                    errors.name ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="e.g. Spiced Deviled Cashews"
                />
                {errors.name && (
                  <span className="text-[10px] text-red-500 block">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-600">
                  SKU Code *
                </label>
                <input
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 border rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#C27D38] ${
                    errors.sku ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="e.g. ANR-CAS-DEV-250"
                />
                {errors.sku && (
                  <span className="text-[10px] text-red-500 block">
                    {errors.sku}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-gray-600">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C27D38] bg-white placeholder-gray-400"
                >
                  <option value="snacks">Artisanal Snacks</option>
                  <option value="ready-to-eat">Ready-To-Eat</option>
                  <option value="specialty">Specialty Items</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-600">
                  Price (LKR) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 border rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#C27D38] ${
                    errors.price ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="e.g. 1850"
                />
                {errors.price && (
                  <span className="text-[10px] text-red-500 block">
                    {errors.price}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-600">Weight *</label>
                <input
                  type="text"
                  name="weight"
                  value={form.weight}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 border rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#C27D38] ${
                    errors.weight ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="e.g. 250g or 750ml"
                />
                {errors.weight && (
                  <span className="text-[10px] text-red-500 block">
                    {errors.weight}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-gray-600">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={form.stockQuantity}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 border rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#C27D38] ${
                    errors.stockQuantity ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="e.g. 45"
                />
                {errors.stockQuantity && (
                  <span className="text-[10px] text-red-500 block">
                    {errors.stockQuantity}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-600">
                  Product Image URL
                </label>
                <input
                  type="text"
                  value={form.images[0]}
                  onChange={handleImageChange}
                  className="w-full p-2.5 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#C27D38]"
                  placeholder="Paste Unsplash or static image link..."
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-600">
                Product Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-2.5 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#C27D38]"
                placeholder="Product attributes and details..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="btn btn-outline py-2 px-5 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary py-2 px-5 text-xs"
              >
                {form.id ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        // PRODUCT LISTING GRID / TABLE
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          {/* Filters row */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#C27D38]"
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

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs text-gray-400 whitespace-nowrap">
                Category:
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="p-2 border border-gray-200 rounded-lg text-xs  bg-black w-full sm:w-auto"
              >
                <option value="all">All Categories</option>
                <option value="snacks">Artisanal Snacks</option>
                <option value="ready-to-eat">Ready-To-Eat</option>
                <option value="specialty">Specialty Items</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] font-bold">
                  <th className="py-2.5">Product</th>
                  <th className="py-2.5">SKU</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5">Price</th>
                  <th className="py-2.5">Stock</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-600">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-400">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="py-3 font-semibold text-[#1E3A2F] flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-50 overflow-hidden relative flex-shrink-0">
                          {p.images && p.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="font-bold flex items-center justify-center h-full text-[#1E3A2F]">
                              {p.name[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 line-clamp-1">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {p.weight}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 font-mono text-[10px]">{p.sku}</td>
                      <td className="py-3 uppercase text-[10px] font-bold text-[#C27D38]">
                        {p.category}
                      </td>
                      <td className="py-3 font-semibold">
                        LKR {p.price.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            p.stockQuantity === 0
                              ? "bg-red-100 text-red-800"
                              : p.stockQuantity < 10
                                ? "bg-orange-100 text-orange-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {p.stockQuantity}
                        </span>
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="text-[#1E3A2F] hover:text-[#C27D38] font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
