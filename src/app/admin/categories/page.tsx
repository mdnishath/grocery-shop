import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import CategoryClient from "./CategoryClient";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CategoryPage() {
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/auth/login");

  let user;
  try {
    user = verifyToken(token);
    if (user.role !== "admin") redirect("/auth/login");
  } catch {
    redirect("/auth/login");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return <CategoryClient categories={categories} />;
}
