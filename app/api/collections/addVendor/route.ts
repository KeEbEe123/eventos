import { NextResponse } from "next/server";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]"; // Ensure you have this file and export authOptions

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { collectionId, vendorId } = await req.json();
  if (!collectionId || !vendorId)
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const user = await User.findOne({ email: session?.user?.email });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const collection = user.collections.id(collectionId);
  if (!collection)
    return NextResponse.json(
      { error: "Collection not found" },
      { status: 404 }
    );

  if (!collection.vendors.includes(vendorId)) {
    collection.vendors.push(vendorId);
    await user.save();
  }

  return NextResponse.json({ message: "Vendor added to collection" });
}
