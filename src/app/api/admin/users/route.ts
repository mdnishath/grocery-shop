/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust if you keep prisma elsewhere
import bcrypt from "bcryptjs"; // or bcrypt

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const { name, email, password, role } = await req.json();

  if (!name || !email || !password || !role) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user." },
      { status: 500 }
    );
  }
}
