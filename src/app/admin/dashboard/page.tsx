/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import DashboardActions from "./DashboardActions";

export default async function DashboardPage() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  let user;
  try {
    user = verifyToken(token);
    if (!user || user.role !== "admin") {
      redirect("/auth/login");
    }
  } catch (err) {
    return redirect("/auth/login");
  }

  const [totalProducts, totalOrders, totalUsers, recentActivities] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.activity.findMany({
        orderBy: { timestamp: "desc" },
        take: 5,
      }),
    ]);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6 text-gray-700">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Stat title="Products" value={totalProducts} />
        <Stat title="Orders" value={totalOrders} />
        <Stat title="Users" value={totalUsers} />
        <Stat title="Activities" value={recentActivities.length} />
      </div>

      {/* Activities */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-medium mb-4 text-gray-700">
          Recent Activity
        </h2>
        <ul className="divide-y divide-gray-100 text-sm">
          {recentActivities.map((a) => (
            <li key={a.id} className="py-2 flex justify-between">
              <span>{a.description}</span>
              <span className="text-gray-500 text-xs">
                {new Date(a.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <DashboardActions />
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-700">{value}</p>
    </div>
  );
}
