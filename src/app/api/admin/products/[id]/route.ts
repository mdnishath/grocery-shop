/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/admin/products/[id]/route.ts
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const decoded = verifyToken(token);
    if (decoded.role !== "admin") {
      return new Response(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
      });
    }

    const productId = Number((await params).id);
    const { name, description, price, stock, imageUrl } = await req.json();

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
        stock,
        imageUrl,
      },
    });

    return new Response(JSON.stringify(updatedProduct), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error updating product" }), {
      status: 500,
    });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const decoded = verifyToken(token);
    if (decoded.role !== "admin") {
      return new Response(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
      });
    }

    const productId = Number((await params).id);
    await prisma.product.delete({
      where: { id: productId },
    });

    return new Response(JSON.stringify({ message: "Product deleted" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error deleting product" }), {
      status: 500,
    });
  }
}
