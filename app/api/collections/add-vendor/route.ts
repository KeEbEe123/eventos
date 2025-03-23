// app/api/collections/add-vendor/route.ts
import { NextResponse } from "next/server";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collectionId, vendorId, serviceType } = await req.json();

  if (!collectionId || !vendorId || !serviceType) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const user = await User.findOne({ email: session.user?.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const collection = user.collections.id(collectionId);
    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    // Check if vendor already exists in the collection
    const vendorExists = collection.vendors.some(
      (v: any) => v.refId.toString() === vendorId
    );
    if (vendorExists) {
      return NextResponse.json(
        { error: "Vendor already in collection" },
        { status: 400 }
      );
    }

    // Add vendor to collection
    collection.vendors.push({
      refId: new mongoose.Types.ObjectId(vendorId),
      serviceType,
    });

    await user.save();

    return NextResponse.json({ message: "Vendor added successfully" });
  } catch (error) {
    console.error("Error adding vendor to collection:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
