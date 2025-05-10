"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-screen text-gray-800 font-sans">
      <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between">
        <div>
          <div className="p-6 text-2xl font-bold border-b border-gray-700">
            🥬 Grocery Admin
          </div>
          <nav className="mt-6 flex flex-col space-y-1 text-sm px-4">
            <SidebarLink
              href="/admin/dashboard"
              icon={<LayoutDashboard size={16} />}
            >
              Dashboard
            </SidebarLink>
            <SidebarLink href="/admin/products" icon={<Package size={16} />}>
              Products
            </SidebarLink>
            <SidebarLink href="/admin/media" icon={<Package size={16} />}>
              Media
            </SidebarLink>
            <SidebarLink href="/admin/categories" icon={<Package size={16} />}>
              Categories
            </SidebarLink>
            <SidebarLink href="/admin/orders" icon={<ShoppingCart size={16} />}>
              Orders
            </SidebarLink>
            <SidebarLink href="/admin/users" icon={<Users size={16} />}>
              Users
            </SidebarLink>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-sm px-6 py-4 border-t border-gray-700 hover:bg-gray-800 cursor-pointer"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="flex-1 bg-gray-100 p-10">{children}</main>
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-2 px-3 py-2 rounded text-white hover:bg-gray-800 transition-colors"
    >
      <span>{icon}</span>
      <span>{children}</span>
    </Link>
  );
}
