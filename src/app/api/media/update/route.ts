import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, title, alt, caption, description } = body;

  if (!name) {
    return NextResponse.json({ error: "Missing file name" }, { status: 400 });
  }

  const metadataPath = path.join(process.cwd(), "media.json");
  const raw = fs.existsSync(metadataPath)
    ? fs.readFileSync(metadataPath, "utf-8")
    : "{}";
  const data = JSON.parse(raw);

  data[name] = {
    ...(data[name] || {}),
    title,
    alt,
    caption,
    description,
  };

  fs.writeFileSync(metadataPath, JSON.stringify(data, null, 2));

  return NextResponse.json({ success: true });
}
