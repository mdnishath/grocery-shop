"use client";

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import Image from "next/image";

type MediaItem = {
  name: string;
  url: string;
  title: string;
  alt: string;
  caption: string;
  description: string;
  size: number;
  type: string;
  uploadedAt: string;
};

export default function MediaDetailModal({
  image,
  onClose,
  onSave,
}: {
  image: MediaItem;
  onClose: () => void;
  onSave: (updated: MediaItem) => void;
}) {
  const [form, setForm] = useState(image);
  const [saving, setSaving] = useState(false);

  const handleChange = (key: keyof MediaItem, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/media/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    onSave(form);
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 overflow-y-auto px-4 flex items-center justify-center">
        <Dialog.Panel className="bg-white w-full max-w-3xl rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/2 aspect-square bg-gray-100">
            <Image
              src={form.url}
              alt={form.alt}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 p-6 space-y-4 text-sm max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-lg font-semibold">
                Attachment Details
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-sm text-gray-500 hover:text-black"
              >
                ✖ Close
              </button>
            </div>

            {["title", "alt", "caption", "description"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field}
                </label>
                {field === "description" ? (
                  <textarea
                    value={form[field as keyof MediaItem]}
                    onChange={(e) =>
                      handleChange(field as keyof MediaItem, e.target.value)
                    }
                    className="w-full border rounded px-3 py-2 text-sm"
                    rows={3}
                  />
                ) : (
                  <input
                    value={form[field as keyof MediaItem]}
                    onChange={(e) =>
                      handleChange(field as keyof MediaItem, e.target.value)
                    }
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                )}
              </div>
            ))}

            <div className="text-xs text-gray-500 space-y-1">
              <p>
                <strong>Type:</strong> {form.type}
              </p>
              <p>
                <strong>Size:</strong> {(form.size / 1024).toFixed(1)} KB
              </p>
              <p>
                <strong>Uploaded:</strong>{" "}
                {new Date(form.uploadedAt).toLocaleString()}
              </p>
              <p className="break-all">
                <strong>URL:</strong> {form.url}
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 text-white text-sm px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "💾 Save Metadata"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
