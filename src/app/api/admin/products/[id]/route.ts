import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// ✅ GET single product by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = Number((await params).id);
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

// ✅ PUT update product (with optional categoryId)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let user;
  try {
    user = verifyToken(token);
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const parsedId = Number((await params).id);
  if (isNaN(parsedId)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const { name, description, price, stock, imageUrl, categoryId } =
    await req.json();

  try {
    const updated = await prisma.product.update({
      where: { id: parsedId },
      data: {
        name,
        description,
        price,
        stock,
        imageUrl,
        categoryId: typeof categoryId === "number" ? categoryId : null, // ✅ Optional
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Update failed:", err);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

// ✅ DELETE product by ID
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let user;
  try {
    user = verifyToken(token);
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const id = Number((await params).id);
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete failed:", err);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
