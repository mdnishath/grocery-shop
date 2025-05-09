/* eslint-disable @typescript-eslint/no-unused-vars */
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const decoded = verifyToken(token);

    // Check if user is admin
    if (decoded.role !== "admin") {
      return new Response(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
      });
    }

    // Fetch users without passwords
    const users = await prisma.user.findMany();

    // Exclude password from user data

    const usersWithoutPassword = users.map(({ password, ...user }) => user);

    return new Response(JSON.stringify({ users: usersWithoutPassword }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
}
