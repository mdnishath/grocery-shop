import jwt from "jsonwebtoken";

// Define the JWT payload structure
interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

// Function to verify the JWT token
export const verifyToken = (token: string): JwtPayload => {
  // Verify the token and check the type
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

  // Check if the decoded value is a JwtPayload type
  if (typeof decoded === "object" && decoded !== null) {
    return decoded as JwtPayload;
  } else {
    throw new Error("Invalid token");
  }
};
