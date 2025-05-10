"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        imageUrl,
      }),
    });
    if (res.ok) {
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setImageUrl("");
      router.refresh();
    } else {
      alert("Failed to add product");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 p-8 rounded-lg shadow-sm mb-10 max-w-4xl"
    >
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Add New Product
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Product Name
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="e.g. Fresh Broccoli"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Image URL</label>
          <input
            required
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="e.g. https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Price ($)</label>
          <input
            required
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="e.g. 3.99"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Stock Quantity
          </label>
          <input
            required
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="e.g. 100"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm text-gray-600 mb-1">Description</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          rows={4}
          placeholder="A short description of the product..."
        />
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2 rounded transition"
        >
          Add Product
        </button>
      </div>
    </form>
  );
}
