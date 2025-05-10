// app/admin/media/page.tsx

import MediaLibrary from "@/components/MediaLibrary";

export default function MediaPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">
        🖼️ Media Library
      </h1>
      <MediaLibrary />
    </main>
  );
}
