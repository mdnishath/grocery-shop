/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/admin/products/route.ts
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return new Response(JSON.stringify({ products }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error fetching products" }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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

    const { name, description, price, stock, imageUrl } = await req.json();

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        imageUrl,
      },
    });

    return new Response(JSON.stringify(newProduct), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error adding product" }), {
      status: 500,
    });
  }
}
