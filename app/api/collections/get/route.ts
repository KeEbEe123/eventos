import { NextResponse } from "next/server";
import User from "@/models/user";
import { getServerSession } from "next-auth"; // Import getServerSession // Adjust the import path based on your auth config location

export async function GET(req: Request) {
  // Get the session using getServerSession
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user?.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ collections: user.collections });
}
