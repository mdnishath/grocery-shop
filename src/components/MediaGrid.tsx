"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type MediaItem = {
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
};

export default function MediaGrid() {
  const [images, setImages] = useState<MediaItem[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch("/api/media/list");
      const data = await res.json();
      setImages(data);
    };
    fetchImages();
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
      {images.map((img) => (
        <div
          key={img.url}
          className="relative h-32 border rounded-lg overflow-hidden shadow-sm"
        >
          <Image src={img.url} alt={img.name} fill className="object-cover" />
        </div>
      ))}
    </div>
  );
}
