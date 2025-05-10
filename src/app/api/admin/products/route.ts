import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// GET: List all products
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
  return NextResponse.json(products);
}

// POST: Create new product
export async function POST(req: Request) {
  const token = (await cookies()).get("token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  let user;
  try {
    user = verifyToken(token);
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { name, description, price, stock, imageUrl, categoryId } =
    await req.json();

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        imageUrl,
        categoryId: typeof categoryId === "number" ? categoryId : null, // ✅ optional
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("Product creation failed:", err);
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}
