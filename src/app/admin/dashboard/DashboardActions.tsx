"use client";

import { useRouter } from "next/navigation";

export default function DashboardActions() {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={() => router.push("/admin/products")}
        className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
      >
        Manage Products
      </button>

      <button
        onClick={() => router.push("/admin/categories")}
        className="bg-emerald-600 text-white px-4 py-2 rounded text-sm hover:bg-emerald-700"
      >
        Manage Categories
      </button>

      <button
        onClick={() => router.push("/admin/orders")}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
      >
        Manage Orders
      </button>

      <button
        onClick={() => router.push("/admin/users")}
        className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
      >
        Manage Users
      </button>

      <button
        onClick={() => router.push("/admin/media")}
        className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
      >
        Media Library
      </button>

      <button
        onClick={() => router.push("/admin/settings")}
        className="bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700"
      >
        Site Settings
      </button>

      <button
        onClick={() => router.push("/admin/analytics")}
        className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700"
      >
        Analytics
      </button>
    </div>
  );
}
