import NextAuth, { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/authOption";
import { NextRequest, NextResponse } from "next/server";

const adminEmails = ["iit014496@gmail.com"];

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Corrected isAdminRequest function
export async function isAdminRequest(
  req: NextRequest,
  res: NextResponse
): Promise<void> {
  // Corrected the getServerSession usage
  const session = await getServerSession(req, res, authOptions);

  if (!session || !adminEmails.includes(session?.user?.email as string)) {
    res.status(401); // Set the status code to 401
    res.end(); // End the response
    throw new Error("Not an admin");
  }

  // Continue with your logic if the user is an admin...
}
