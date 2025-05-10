import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all categories
export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(categories);
}

// POST new category
export async function POST(req: NextRequest) {
  const { name, imageUrl } = await req.json();

  console.log(imageUrl, name);
  if (!name) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }

  try {
    const category = await prisma.category.create({
      data: { name, imageUrl },
    });
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Create failed" }, { status: 500 });
  }
}
