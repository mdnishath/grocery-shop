import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name}`;
  const uploadDir = path.join(process.cwd(), "public/uploads");
  const uploadPath = path.join(uploadDir, filename);

  // Create upload directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Save file
  await writeFile(uploadPath, buffer);

  // Update metadata
  const metaPath = path.join(process.cwd(), "media.json");
  const existingMeta = fs.existsSync(metaPath)
    ? JSON.parse(await readFile(metaPath, "utf-8"))
    : {};

  existingMeta[filename] = {
    title: file.name,
    alt: "",
    caption: "",
    description: "",
  };

  await writeFile(metaPath, JSON.stringify(existingMeta, null, 2));

  return NextResponse.json({ url: `/uploads/${filename}`, name: filename });
}
