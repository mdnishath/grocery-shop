"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle, UploadCloud } from "lucide-react";

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

type MediaPickerProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
};

export default function MediaPicker({
  open,
  onClose,
  onSelect,
}: MediaPickerProps) {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    const res = await fetch("/api/media/list");
    const data = await res.json();
    setImages(data);
  };

  useEffect(() => {
    if (open) fetchImages();
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSelected(null);
      setFile(null);
      setPreviewUrl(null);
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  };

  const upload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    await fetch("/api/media/upload", { method: "POST", body: formData });
    await fetchImages();
    setFile(null);
    setPreviewUrl(null);
    setUploading(false);
  };

  if (!open) return null;

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
              <Dialog.Panel className="bg-white w-full max-w-5xl max-h-[90vh] rounded-xl shadow-xl p-6 flex flex-col space-y-6">
                <div className="flex justify-between items-center pb-3">
                  <Dialog.Title className="text-lg font-semibold text-gray-800">
                    📁 Select or Upload Image
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-sm text-gray-500 hover:text-black"
                  >
                    ✖
                  </button>
                </div>

                {/* Upload Area */}
                <div
                  onClick={() => inputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                >
                  <UploadCloud className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
                  <p className="text-sm text-gray-600">
                    Drag & drop or{" "}
                    <span className="underline">click to upload</span>
                  </p>
                  {previewUrl && (
                    <div className="mt-4 w-16 h-16 mx-auto relative border rounded shadow overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                  />
                  {file && (
                    <button
                      onClick={upload}
                      disabled={uploading}
                      className="mt-3 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </button>
                  )}
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-y-auto p-4">
                  {images.map((img) => (
                    <div
                      key={img.url}
                      onClick={() => setSelected(img)}
                      className={`relative h-32 rounded-lg overflow-hidden cursor-pointer transition group ${
                        selected?.url === img.url
                          ? "ring-2 ring-indigo-500"
                          : "hover:ring"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.title}
                        fill
                        className="object-cover"
                      />
                      {selected?.url === img.url && (
                        <div className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
                          <CheckCircle className="w-5 h-5 text-indigo-600" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="pt-4  flex justify-end gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!selected}
                    onClick={() => {
                      if (selected) {
                        onSelect(selected.url);
                        onClose();
                      }
                    }}
                    className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Insert
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
