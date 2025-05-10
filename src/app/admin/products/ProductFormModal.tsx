"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MediaPicker from "@/components/MediaPicker";

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  initialProduct?: Product;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  mode,
  initialProduct,
}: Props) {
  const router = useRouter();

  const [form, setForm] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    imageUrl: "",
    categoryId: 0,
  });

  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    if (initialProduct) {
      setForm(initialProduct);
    } else {
      setForm({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        imageUrl: "",
        categoryId: 0,
      });
    }
  }, [initialProduct]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["price", "stock", "categoryId"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(
      mode === "add" ? "/api/admin/products" : `/api/admin/products/${form.id}`,
      {
        method: mode === "add" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    if (res.ok) {
      router.refresh();
      onClose();
    } else {
      alert("Failed to save product.");
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          {/* ✅ Blurred Overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto px-4">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="bg-white w-full max-w-2xl rounded-xl p-6 shadow-xl">
                  <Dialog.Title className="text-xl font-semibold text-gray-800 mb-4">
                    {mode === "add" ? "Add New Product" : "Edit Product"}
                  </Dialog.Title>

                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-5"
                  >
                    {/* Form Inputs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          name="name"
                          required
                          value={form.name}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image
                        </label>
                        <div className="flex gap-2">
                          <input
                            name="imageUrl"
                            required
                            value={form.imageUrl}
                            onChange={handleChange}
                            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPicker(true)}
                            className="text-sm px-3 py-2 border rounded bg-gray-100 hover:bg-gray-200"
                          >
                            📁 Pick
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price
                        </label>
                        <input
                          name="price"
                          type="number"
                          step="0.01"
                          required
                          value={form.price}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stock
                        </label>
                        <input
                          name="stock"
                          type="number"
                          required
                          value={form.stock}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          name="categoryId"
                          required
                          value={form.categoryId}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                          <option value={0}>Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        required
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="text-sm px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                      >
                        {mode === "add" ? "Add Product" : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <MediaPicker
        open={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(url) => {
          setForm((prev) => ({ ...prev, imageUrl: url }));
          setShowPicker(false);
        }}
      />
    </>
  );
}
