import { NextResponse } from "next/server";
import User from "@/models/user";
import { getServerSession } from "next-auth";
// import { authOptions } from "../../auth/[...nextauth]/route";
import connectMongoDB from "@/lib/mongodb"; // Assuming you have a DB connection utility

export async function PATCH(req: Request) {
  try {
    // Connect to database
    await connectMongoDB();

    // Get session
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { location } = await req.json();

    if (!location) {
      return NextResponse.json(
        { error: "Email and location are required" },
        { status: 400 }
      );
    }

    // Update user's location
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { location: location } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Location updated successfully", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating location:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
