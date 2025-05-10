"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MediaPicker from "@/components/MediaPicker";

interface Category {
  id: number;
  name: string;
  imageUrl: string | null;
}

export default function CategoryClient({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();

  const [form, setForm] = useState<{ name: string; imageUrl: string }>({
    name: "",
    imageUrl: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const resetForm = () => {
    setForm({ name: "", imageUrl: "" });
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      resetForm();
      router.refresh();
    }
  };

  const handleUpdate = async (id: number) => {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      resetForm();
      router.refresh();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });
    if (res.ok) router.refresh();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Categories</h1>

      {/* Form */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Category name"
          className="border p-2 rounded w-full"
        />
        <div className="w-full flex items-center gap-2">
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="Image URL"
            className="border p-2 rounded flex-1"
          />
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 cursor-pointer"
          >
            📁 Choose
          </button>
        </div>
        {editingId ? (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => handleUpdate(editingId)}
          >
            Update
          </button>
        ) : (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleCreate}
          >
            Add
          </button>
        )}
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="border rounded p-4 flex flex-col items-center text-center shadow-sm bg-white hover:shadow-md transition"
          >
            {cat.imageUrl ? (
              <Image
                src={cat.imageUrl}
                alt={cat.name}
                width={80}
                height={80}
                className="rounded-full object-cover border mb-2"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 mb-2 text-xs">
                No image
              </div>
            )}
            <h3 className="font-semibold text-sm mb-2">{cat.name}</h3>
            <div className="flex gap-2 mt-auto">
              <button
                className="text-blue-600 text-sm"
                onClick={() => {
                  setForm({ name: cat.name, imageUrl: cat.imageUrl || "" });
                  setEditingId(cat.id);
                }}
              >
                Edit
              </button>
              <button
                className="text-red-600 text-sm"
                onClick={() => handleDelete(cat.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Media Picker */}
      <MediaPicker
        open={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(url) => {
          setForm((prev) => ({ ...prev, imageUrl: url }));
          setShowPicker(false);
        }}
      />
    </div>
  );
}
