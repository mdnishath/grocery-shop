import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const host = req.headers.get("host") || "localhost:3000";
  const protocol =
    req.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https");

  const baseUrl = `${protocol}://${host}`;
  const dir = path.join(process.cwd(), "public/uploads");
  const metadataPath = path.join(process.cwd(), "media.json");

  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const raw = fs.existsSync(metadataPath)
    ? fs.readFileSync(metadataPath, "utf-8")
    : "{}";
  const metadata = JSON.parse(raw);

  const images = files.map((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    const ext = path.extname(file);

    return {
      name: file,
      url: `${baseUrl}/uploads/${file}`,
      title: metadata[file]?.title || file,
      alt: metadata[file]?.alt || "",
      caption: metadata[file]?.caption || "",
      description: metadata[file]?.description || "",
      size: stats.size,
      type: ext.replace(".", ""),
      uploadedAt: stats.birthtime.toISOString(),
    };
  });

  return NextResponse.json(images);
}
