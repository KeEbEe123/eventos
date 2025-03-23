import { NextResponse } from "next/server";
import User from "@/models/user";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collectionId, vendorId, serviceType } = await req.json();

  if (!collectionId || !vendorId || !serviceType) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email: session.user?.email });

    const collection = user.collections.id(collectionId);
    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    // Check for duplicates based on refId and serviceType
    const alreadyExists = collection.vendors.some(
      (vendor: any) =>
        vendor.refId.toString() === vendorId &&
        vendor.serviceType === serviceType
    );

    if (!alreadyExists) {
      collection.vendors.push({
        refId: vendorId,
        serviceType,
      });
      await user.save();
    }

    return NextResponse.json({ success: true, collection });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
