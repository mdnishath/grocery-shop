/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return new Response(JSON.stringify({ message: "Invalid credentials" }), {
      status: 401,
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  // Return the user object without the password field
  const { password: _, ...userWithoutPassword } = user; // Destructure to remove the password field

  return new Response(
    JSON.stringify({
      token,
      user: userWithoutPassword, // Return the user without the password
    }),
    { status: 200 }
  );
}
