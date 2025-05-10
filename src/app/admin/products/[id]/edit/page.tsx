import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import EditProductForm from "./EditProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ── AUTH ──────────────────────────────────────────────────────────────
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/auth/login");

  let user;
  try {
    user = verifyToken(token);
  } catch {
    redirect("/auth/login");
  }
  if (user.role !== "admin") redirect("/auth/login");

  // ── FETCH THE PRODUCT ───────────────────────────────────────────────────
  const id = parseInt((await params).id, 10);
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) redirect("/admin/products");

  // ── RENDER FORM ────────────────────────────────────────────────────────
  return (
    <div>
      <h1 className="text-3xl font-bold text-green-700 mb-6">Edit Product</h1>
      <EditProductForm initial={product} />
    </div>
  );
}
