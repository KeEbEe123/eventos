import { NextResponse } from "next/server";
import User from "@/models/user";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  if (!name)
    return NextResponse.json(
      { error: "Collection name required" },
      { status: 400 }
    );

  const user = await User.findOne({ email: session?.user?.email ?? "" });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  user.collections.push({ name, vendors: [] });
  await user.save();

  return NextResponse.json({
    message: "Collection added",
    collections: user.collections,
  });
}
