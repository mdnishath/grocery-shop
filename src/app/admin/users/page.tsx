import UserTable from "@/components/UserTable";

export default async function ManageUsersPage() {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    }/api/admin/users`,
    {
      cache: "no-store",
    }
  );

  const users = await res.json();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-indigo-700">👥 Manage Users</h1>
      <UserTable users={users} />
    </main>
  );
}
