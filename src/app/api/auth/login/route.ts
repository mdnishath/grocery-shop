import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  const res = NextResponse.json({ user }, { status: 200 });

  // ✅ Set cookie correctly
  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour
    path: "/",
    secure: process.env.NODE_ENV === "production", // only secure in production
  });

  return res;
}
