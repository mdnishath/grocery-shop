import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  if (!name) {
    return NextResponse.json({ error: "Missing file name" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public/uploads", name);
  const metadataPath = path.join(process.cwd(), "media.json");

  // Delete the file if it exists
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Delete metadata
  const raw = fs.existsSync(metadataPath)
    ? fs.readFileSync(metadataPath, "utf-8")
    : "{}";
  const data = JSON.parse(raw);

  delete data[name];

  fs.writeFileSync(metadataPath, JSON.stringify(data, null, 2));

  return NextResponse.json({ success: true });
}
