export default function OrdersPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-indigo-700">🧾 Manage Orders</h1>

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full text-sm text-left text-gray-700 divide-y divide-gray-100">
          <thead className="bg-gray-100 text-gray-800 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium">ORD-100{i + 1}</td>
                <td className="px-4 py-3">Jane Doe</td>
                <td className="px-4 py-3">jane@example.com</td>
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded">
                    Paid
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold">$99.99</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700">
                    View
                  </button>
                  <button className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded hover:bg-gray-200">
                    Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
