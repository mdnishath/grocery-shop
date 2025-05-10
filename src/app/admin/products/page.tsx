import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage() {
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/auth/login");

  let user;
  try {
    user = verifyToken(token);
  } catch {
    redirect("/auth/login");
  }

  if (user.role !== "admin") {
    redirect("/auth/login");
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true }, // ✅ optional
  });

  return <ProductsClient products={products} />;
}
