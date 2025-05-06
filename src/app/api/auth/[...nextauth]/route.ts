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
  const session = await getServerSession(authOptions);

  if (!session || !adminEmails.includes(session?.user?.email as string)) {
    throw new Error("Not an admin");
  }
}
