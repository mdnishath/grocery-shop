"use client";

import { useState } from "react";
import EditUserModal from "./EditUserModal";
import AddUserModal from "./AddUserModal";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

export default function UserTable({ users }: { users: User[] }) {
  const [data, setData] = useState<User[]>(users);
  const [editing, setEditing] = useState<User | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const refresh = async () => {
    const res = await fetch("/api/admin/users");
    const updated = await res.json();
    setData(updated);
  };

  const handleDelete = async (user: User) => {
    const confirmed = confirm(`Delete user "${user.name}"?`);
    if (!confirmed) return;

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "DELETE",
    });

    if (res.ok) refresh();
    else alert("Failed to delete user.");
  };

  return (
    <>
      {/* Header + Add User */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Users</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
        >
          ➕ Add User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full text-sm text-left text-gray-700 divide-y divide-gray-100">
          <thead className="bg-gray-100 text-gray-800 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 capitalize text-indigo-600 font-semibold">
                  {user.role}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => setEditing(user)}
                    className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {editing && (
        <EditUserModal
          user={editing}
          onClose={() => setEditing(null)}
          onSaved={refresh}
        />
      )}

      {showAdd && (
        <AddUserModal onClose={() => setShowAdd(false)} onSaved={refresh} />
      )}
    </>
  );
}
