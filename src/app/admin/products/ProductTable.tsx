/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { Product } from "@/types/product";

export default function ProductTable({
  products,
  onEdit,
}: {
  products: Product[];
  onEdit: (product: Product) => void;
}) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="overflow-x-auto bg-white border border-green-200 rounded-xl shadow mt-8">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-green-50 border-b border-green-200">
          <tr className="uppercase text-xs text-green-800 tracking-wide">
            <th className="px-6 py-4">#</th>
            <th className="px-6 py-4">Product</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4">Stock</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(products || []).map((p, idx) => (
            <tr
              key={p.id}
              className="border-b border-green-100 hover:bg-green-50 transition-colors"
            >
              <td className="px-6 py-4 font-medium">{idx + 1}</td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-10 h-10 rounded-full object-cover shadow-sm border border-green-100"
                  />
                  <span className="font-medium text-gray-800">{p.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                {p.category?.name ?? (
                  <span className="text-gray-400 italic">Uncategorized</span>
                )}
              </td>
              <td className="px-6 py-4">${p.price.toFixed(2)}</td>
              <td className="px-6 py-4">{p.stock}</td>
              <td className="px-6 py-4 text-right space-x-2">
                <button
                  onClick={() => onEdit(p)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-6 text-center text-gray-500">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
