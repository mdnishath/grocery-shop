/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import MediaDetailModal from "./MediaDetailModal";
import { Trash2, UploadCloud, CheckSquare, Square } from "lucide-react";

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

export default function MediaLibrary() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    const res = await fetch("/api/media/list");
    const data = await res.json();
    setImages(data);
    setSelectedItems(new Set()); // reset selections on reload
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const filteredImages = images.filter((img) => {
    const matchSearch =
      img.title.toLowerCase().includes(search.toLowerCase()) ||
      img.alt.toLowerCase().includes(search.toLowerCase());
    const matchDate = date ? img.uploadedAt.startsWith(date) : true;
    return matchSearch && matchDate;
  });

  const handleUpload = async (file: File) => {
    return new Promise<void>((resolve) => {
      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/media/upload");

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = async () => {
        setUploadProgress(0);
        await fetchImages();
        resolve();
      };

      xhr.send(formData);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      if (file.type.startsWith("image/")) {
        await handleUpload(file);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        await handleUpload(file);
      }
    }
  };

  const handleDelete = async (name: string) => {
    await fetch(`/api/media/${name}`, { method: "DELETE" });
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedItems.size} selected items?`)) return;
    await Promise.all(
      Array.from(selectedItems).map((name) =>
        fetch(`/api/media/${name}`, { method: "DELETE" })
      )
    );
    await fetchImages();
  };

  const toggleSelect = (name: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    const all = filteredImages.map((img) => img.name);
    setSelectedItems(new Set(all));
  };

  const deselectAll = () => {
    setSelectedItems(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Upload Drop Area */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
          dragging
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-300 bg-white"
        }`}
      >
        <UploadCloud className="mx-auto h-8 w-8 text-indigo-500 mb-2" />
        <p className="text-sm text-gray-600">
          Drag & drop image(s) here or{" "}
          <span className="underline">click to upload</span>
        </p>
        {uploadProgress > 0 && (
          <div className="mt-4 h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-indigo-600 rounded"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          multiple
          hidden
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <input
          type="text"
          placeholder="🔍 Search by title or alt..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-64 text-sm"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded text-sm"
        />
        {selectedItems.size > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
            >
              🗑 Delete Selected ({selectedItems.size})
            </button>
            <button
              onClick={deselectAll}
              className="text-sm px-3 py-2 rounded border bg-gray-100 hover:bg-gray-200"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredImages.map((img) => (
          <div
            key={img.url}
            onClick={() => setSelected(img)}
            className={`relative h-32 border rounded-lg overflow-hidden group cursor-pointer ${
              selectedItems.has(img.name) ? "ring-2 ring-indigo-500" : ""
            }`}
          >
            <Image src={img.url} alt={img.name} fill className="object-cover" />

            {/* Checkbox */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSelect(img.name);
              }}
              className="absolute top-2 left-2 bg-white p-1 rounded-full shadow"
            >
              {selectedItems.has(img.name) ? (
                <CheckSquare className="w-4 h-4 text-indigo-600" />
              ) : (
                <Square className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {/* Delete single */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(img.name).then(fetchImages);
              }}
              className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-red-100"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <MediaDetailModal
          image={selected}
          onClose={() => setSelected(null)}
          onSave={(updated) => {
            setImages((prev) =>
              prev.map((img) => (img.url === updated.url ? updated : img))
            );
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
